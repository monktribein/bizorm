import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Quota } from "../models/Quota.js";
import { Activity } from "../models/Activity.js";
import { Branch } from "../models/Branch.js";
import { CompanyDetail } from "../models/CompanyDetail.js";
import { Rating } from "../models/Rating.js";
import { Website } from "../models/Website.js";
import { Pricing } from "../models/Pricing.js";

export const getUsers = async (req, res, next) => {
  try {
    const role = req.user.getNormalizedRole();
    const { branchId, search } = req.query;

    const query = {};

    if (role === "SUPER_ADMIN") {
      if (branchId) query.branchId = branchId;
    } else {
      // Find branches belonging to caller's company / scope
      const companyBranches = await Branch.find({
        $or: [
          ...(req.user.cmpy && req.user.cmpy !== "na" ? [{ cmpyName: req.user.cmpy }] : []),
          ...(req.user.branchId ? [{ _id: req.user.branchId }] : []),
        ],
        deleted: false,
      }).select("_id");
      const branchIds = companyBranches.map((b) => b._id);

      const conditions = [];
      if (req.user.cmpy && req.user.cmpy !== "na") {
        conditions.push({ cmpy: req.user.cmpy });
      }
      conditions.push({ cmpyid: req.user._id });
      if (req.user.branchId) {
        conditions.push({ branchId: req.user.branchId });
      }
      if (branchIds.length > 0) {
        conditions.push({ branchId: { $in: branchIds } });
      }

      if (branchId) {
        query.branchId = branchId;
      }
      query.$or = conditions;
      query.sadmin = { $ne: 1 };
    }

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      const searchFields = [
        { uname: searchRegex },
        { email: searchRegex },
        { fname: searchRegex },
        { lname: searchRegex },
      ];
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchFields }];
        delete query.$or;
      } else {
        query.$or = searchFields;
      }
    }

    const users = await User.find(query)
      .populate("branchId", "name code")
      .populate("pricingPackageId", "packageName category price billingType reviewLimit")
      .select("-password")
      .sort({ createdAt: -1 });

    let enrichedUsers = users.map((u) => ({
      ...u.toObject(),
      role: u.getNormalizedRole(),
    }));

    if (role === "SUPER_ADMIN") {
      const userIds = users.map((u) => u._id);
      const formKeys = users.map((u) => u.formKey).filter(Boolean);

      const [allCompanyDetails, allQuotas, allWebsites, allRatings] = await Promise.all([
        CompanyDetail.find({ userId: { $in: userIds } }),
        Quota.find({ byUserId: { $in: userIds } }),
        Website.find({ userId: { $in: userIds } }),
        Rating.find({ formKey: { $in: formKeys } }).select("formKey star createdAt"),
      ]);

      enrichedUsers = enrichedUsers.map((u) => {
        const cd = allCompanyDetails.find((c) => String(c.userId) === String(u._id));
        const q = allQuotas.find((quota) => String(quota.byUserId) === String(u._id));
        const webs = allWebsites.filter((w) => String(w.userId) === String(u._id));
        const userRatings = allRatings.filter((r) => r.formKey === u.formKey);

        const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        userRatings.forEach((r) => {
          if (starCounts[r.star] !== undefined) starCounts[r.star]++;
        });

        const totalReviews = userRatings.length;
        const avgRating = totalReviews > 0
          ? Number((userRatings.reduce((sum, r) => sum + (r.star || 0), 0) / totalReviews).toFixed(1))
          : 0;
        const positiveReviews = userRatings.filter((r) => Number(r.star) >= 4).length;
        const criticalReviews = userRatings.filter((r) => Number(r.star) <= 3).length;

        const cleanBizName = cd?.cmpyName && cd.cmpyName !== "na" && cd.cmpyName !== "n/a"
          ? cd.cmpyName
          : u.cmpy && u.cmpy !== "na" && u.cmpy !== "n/a"
          ? u.cmpy
          : (u.fname ? `${u.fname}'s Business` : "My Business");

        return {
          ...u,
          dutyTiming: u.dutyTiming || "09:00 AM - 06:00 PM",
          businessName: cleanBizName,
          companyDetails: cd || null,
          quota: q || null,
          platforms: webs || [],
          stats: {
            totalReviews,
            avgRating,
            starCounts,
            positiveReviews,
            criticalReviews,
          },
        };
      });
    } else {
      // Branch Admin / Team View: Fetch ratings associated with this business/branch
      const ratingQuery = {};
      if (req.user.branchId) {
        ratingQuery.branchId = req.user.branchId;
      } else {
        ratingQuery.formKey = req.user.formKey;
      }
      const branchRatings = await Rating.find(ratingQuery).select("formKey star staffMember createdAt");

      enrichedUsers = enrichedUsers.map((u) => {
        const staffFullName = [u.fname, u.lname].filter(Boolean).join(" ").trim().toLowerCase();
        const uname = (u.uname || "").toLowerCase();

        const userRatings = branchRatings.filter((r) => {
          const s = (r.staffMember || "").trim().toLowerCase();
          return s === uname || (staffFullName && s === staffFullName) || r.formKey === u.formKey;
        });

        const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let sum = 0;
        userRatings.forEach((r) => {
          if (starCounts[r.star] !== undefined) starCounts[r.star]++;
          sum += r.star || 0;
        });

        const totalReviews = userRatings.length;
        const avgRating = totalReviews > 0 ? Number((sum / totalReviews).toFixed(1)) : 0;
        const positiveReviews = (starCounts[4] || 0) + (starCounts[5] || 0);
        const criticalReviews = (starCounts[1] || 0) + (starCounts[2] || 0) + (starCounts[3] || 0);

        return {
          ...u,
          dutyTiming: u.dutyTiming || "09:00 AM - 06:00 PM",
          stats: {
            totalReviews,
            avgRating,
            starCounts,
            positiveReviews,
            criticalReviews,
          },
        };
      });
    }

    res.json({
      success: true,
      users: enrichedUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const callerRole = req.user.getNormalizedRole();
    const {
      fname = "",
      lname = "",
      uname,
      email,
      mobile,
      pwd,
      role = "BRANCH_USER",
      branchId,
      dutyTiming = "09:00 AM - 06:00 PM",
      smsQuota = 0,
      emailQuota = 5,
      whatsappQuota = 5,
      webQuota = 5,
    } = req.body;

    if (!uname || !email || !mobile || !pwd) {
      return res.status(400).json({
        success: false,
        message: "Username, email, mobile, and password are required",
      });
    }

    const existing = await User.findOne({
      $or: [{ uname: uname.toLowerCase().trim() }, { email: email.toLowerCase().trim() }],
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Username or email is already taken",
      });
    }

    let targetBranchId = req.user.branchId || null;
    if (branchId) {
      if (callerRole === "SUPER_ADMIN") {
        targetBranchId = branchId;
      } else {
        const validBranch = await Branch.findOne({
          _id: branchId,
          $or: [
            ...(req.user.cmpy && req.user.cmpy !== "na" ? [{ cmpyName: req.user.cmpy }] : []),
            ...(req.user.branchId ? [{ _id: req.user.branchId }] : []),
          ],
          deleted: false,
        });
        if (validBranch) {
          targetBranchId = validBranch._id;
        }
      }
    }

    // Auto-assign to default branch if caller only has one branch and none was explicitly selected
    if (!targetBranchId && callerRole !== "SUPER_ADMIN") {
      const defaultBranch = await Branch.findOne({
        cmpyName: req.user.cmpy,
        deleted: false,
      });
      if (defaultBranch) {
        targetBranchId = defaultBranch._id;
      }
    }

    let assignedRole = role;
    if (callerRole !== "SUPER_ADMIN") {
      assignedRole = "BRANCH_USER"; // Only super admin can make admins
    }

    const unameForm = uname.replace(/[\s.,?&]/g, "_").toLowerCase().substring(0, 5);
    const formKey = unameForm + Math.floor(Math.random() * 100000);
    const passwordHash = bcrypt.hashSync(pwd, 10);
    const actKeyHash = bcrypt.hashSync("verified", 10);

    const newUser = await User.create({
      fname,
      lname,
      uname: uname.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      mobile,
      password: passwordHash,
      role: assignedRole,
      dutyTiming: (dutyTiming || "09:00 AM - 06:00 PM").trim(),
      sadmin: assignedRole === "SUPER_ADMIN" ? 1 : 0,
      admin: assignedRole === "BRANCH_ADMIN" ? 1 : 0,
      cmpy: req.user.cmpy || "",
      cmpyid: req.user._id,
      iscmpy: req.user.cmpy ? 1 : 0,
      branchId: targetBranchId || null,
      active: 1, // Created by admin = active directly
      websiteForm: 1,
      sub: 1,
      actKey: actKeyHash,
      formKey,
      frameId: "",
      latestActivity: new Date().toUTCString(),
    });

    await Quota.create({
      byUserId: newUser._id,
      smsQuota,
      emailQuota,
      whatsappQuota,
      webQuota,
      byFormKey: formKey,
      branchId: targetBranchId || null,
      balance: 0,
    });

    await Activity.create({
      userId: req.user._id,
      actionType: "USER_CREATE",
      msg: `Created user [ Username: ${uname}, Role: ${assignedRole}, Shift: ${dutyTiming} ]`,
      actTime: new Date().toUTCString(),
      branchId: targetBranchId,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser._id,
        uname: newUser.uname,
        email: newUser.email,
        role: newUser.getNormalizedRole(),
        dutyTiming: newUser.dutyTiming,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fname, lname, mobile, role, active, branchId, pwd, dutyTiming } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const callerRole = req.user.getNormalizedRole();
    if (callerRole !== "SUPER_ADMIN") {
      const isOwned =
        String(user.cmpyid) === String(req.user._id) ||
        (user.cmpy && req.user.cmpy && user.cmpy === req.user.cmpy) ||
        (req.user.branchId && String(user.branchId) === String(req.user.branchId));
      if (!isOwned) {
        return res.status(403).json({ success: false, message: "Permission denied for this user" });
      }
    }

    if (fname !== undefined) user.fname = fname;
    if (lname !== undefined) user.lname = lname;
    if (mobile !== undefined) user.mobile = mobile;
    if (active !== undefined) user.active = active;
    if (dutyTiming !== undefined) user.dutyTiming = dutyTiming.trim();

    if (callerRole === "SUPER_ADMIN") {
      if (branchId !== undefined) user.branchId = branchId || null;
      if (role !== undefined) {
        user.role = role;
        user.sadmin = role === "SUPER_ADMIN" ? 1 : 0;
        user.admin = role === "BRANCH_ADMIN" ? 1 : 0;
      }
    } else if (branchId !== undefined) {
      const validBranch = await Branch.findOne({
        _id: branchId,
        $or: [
          ...(req.user.cmpy && req.user.cmpy !== "na" ? [{ cmpyName: req.user.cmpy }] : []),
          ...(req.user.branchId ? [{ _id: req.user.branchId }] : []),
        ],
        deleted: false,
      });
      if (validBranch) {
        user.branchId = validBranch._id;
      }
    }

    if (pwd && pwd.length >= 6) {
      user.password = bcrypt.hashSync(pwd, 10);
    }

    await user.save();

    res.json({
      success: true,
      message: "User updated successfully",
      user: {
        ...user.toObject(),
        role: user.getNormalizedRole(),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.sadmin === 1) {
      return res.status(400).json({ success: false, message: "Cannot delete primary Super Admin" });
    }

    if (String(user._id) === String(req.user._id)) {
      return res.status(400).json({ success: false, message: "Cannot delete your own admin account" });
    }

    const callerRole = req.user.getNormalizedRole();
    if (callerRole !== "SUPER_ADMIN") {
      const isOwned =
        String(user.cmpyid) === String(req.user._id) ||
        (user.cmpy && req.user.cmpy && user.cmpy === req.user.cmpy) ||
        (req.user.branchId && String(user.branchId) === String(req.user.branchId));
      if (!isOwned) {
        return res.status(403).json({ success: false, message: "Permission denied for this user" });
      }
    }

    await User.findByIdAndDelete(id);
    await Quota.deleteMany({ byUserId: id });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const checkDuplicates = async (req, res, next) => {
  try {
    const { uname, cmpy } = req.query;
    let unameExists = false;
    let cmpyExists = false;

    if (uname) {
      const u = await User.findOne({ uname: uname.toLowerCase().trim() });
      unameExists = !!u;
    }

    if (cmpy) {
      const c = await User.findOne({ cmpy: cmpy.trim() });
      cmpyExists = !!c;
    }

    res.json({
      success: true,
      unameExists,
      cmpyExists,
    });
  } catch (error) {
    next(error);
  }
};
