import { Branch } from "../models/Branch.js";
import { User } from "../models/User.js";
import { Rating } from "../models/Rating.js";
import { Quota } from "../models/Quota.js";
import { Pricing } from "../models/Pricing.js";

export const getBranches = async (req, res, next) => {
  try {
    const role = req.user.getNormalizedRole();

    if (role === "SUPER_ADMIN") {
      const branches = await Branch.find({ deleted: false }).sort({ createdAt: -1 });
      return res.json({ success: true, branches });
    } else {
      const query = { deleted: false };
      if (req.user.branchId) {
        query._id = req.user.branchId;
      } else if (req.user.cmpy && req.user.cmpy !== "na") {
        query.cmpyName = req.user.cmpy;
      }
      const branches = await Branch.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, branches });
    }
  } catch (error) {
    next(error);
  }
};

export const getBranchById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = req.user.getNormalizedRole();

    if (role !== "SUPER_ADMIN" && req.user.branchId?.toString() !== id) {
      return res.status(403).json({ success: false, message: "Cross-branch access denied" });
    }

    const branch = await Branch.findOne({ _id: id, deleted: false });
    if (!branch) {
      return res.status(404).json({ success: false, message: "Branch not found" });
    }

    res.json({ success: true, branch });
  } catch (error) {
    next(error);
  }
};

export const createBranch = async (req, res, next) => {
  try {
    const { name, code, active = 1, cmpyName = "", pricingPackageId = null } = req.body;

    if (!name || !code) {
      return res.status(400).json({ success: false, message: "Branch name and code are required" });
    }

    const role = req.user.getNormalizedRole();
    if (role !== "SUPER_ADMIN") {
      const user = await User.findById(req.user._id);
      let allowedBusinesses = 1;
      let planName = "Single Business Plan";

      if (user?.pricingPackageId) {
        const pkg = await Pricing.findById(user.pricingPackageId);
        if (pkg) {
          allowedBusinesses = (pkg.maxBusinesses || (pkg.businessType === "multiple" ? 2 : 1)) + (user.extraBranchesAllowed || 0);
          planName = pkg.packageName;
        }
      }

      const companyFilter = user?.cmpy && user.cmpy !== "na" ? { cmpyName: user.cmpy, deleted: false } : { deleted: false };
      const currentBranchCount = await Branch.countDocuments(companyFilter);

      if (currentBranchCount >= allowedBusinesses) {
        return res.status(403).json({
          success: false,
          message: `Your active subscription "${planName}" allows up to ${allowedBusinesses} location(s). Please upgrade to a Multiple Business plan to create more branches.`,
        });
      }
    }

    const existing = await Branch.findOne({ code: code.trim() });
    if (existing && !existing.deleted) {
      return res.status(400).json({ success: false, message: "A branch with this code already exists" });
    }

    if (existing && existing.deleted) {
      existing.name = name.trim();
      existing.active = active;
      existing.cmpyName = cmpyName;
      existing.pricingPackageId = pricingPackageId;
      existing.deleted = false;
      await existing.save();
      return res.status(201).json({ success: true, message: "Branch restored", branch: existing });
    }

    const newBranch = await Branch.create({
      name: name.trim(),
      code: code.trim(),
      active,
      cmpyName,
      pricingPackageId,
    });

    res.status(201).json({ success: true, message: "Branch created successfully", branch: newBranch });
  } catch (error) {
    next(error);
  }
};

export const updateBranch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, code, active, cmpyName, pricingPackageId } = req.body;

    const branch = await Branch.findOne({ _id: id, deleted: false });
    if (!branch) {
      return res.status(404).json({ success: false, message: "Branch not found" });
    }

    if (code && code.trim() !== branch.code) {
      const existing = await Branch.findOne({ code: code.trim(), deleted: false });
      if (existing) {
        return res.status(400).json({ success: false, message: "A branch with this code already exists" });
      }
      branch.code = code.trim();
    }

    if (name !== undefined) branch.name = name.trim();
    if (active !== undefined) branch.active = active;
    if (cmpyName !== undefined) branch.cmpyName = cmpyName;
    if (pricingPackageId !== undefined) branch.pricingPackageId = pricingPackageId;

    await branch.save();

    res.json({ success: true, message: "Branch updated successfully", branch });
  } catch (error) {
    next(error);
  }
};

export const deleteBranch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const branch = await Branch.findOne({ _id: id, deleted: false });
    if (!branch) {
      return res.status(404).json({ success: false, message: "Branch not found" });
    }

    branch.deleted = true;
    branch.active = 0;
    await branch.save();

    res.json({ success: true, message: "Branch soft-deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Branch Summary Bar with performance aggregates
export const getBranchDashboardSummary = async (req, res, next) => {
  try {
    const allBranches = await Branch.find({ deleted: false });
    const summary = [];

    for (const b of allBranches) {
      const usersCount = await User.countDocuments({ branchId: b._id });
      const reviews = await Rating.find({ branchId: b._id });
      const totalReviews = reviews.length;
      const averageRating =
        totalReviews > 0
          ? Number((reviews.reduce((sum, r) => sum + r.star, 0) / totalReviews).toFixed(1))
          : 0;

      summary.push({
        branchId: b._id,
        name: b.name,
        code: b.code,
        active: b.active === 1,
        usersCount,
        totalReviews,
        averageRating,
      });
    }

    res.json({ success: true, summary });
  } catch (error) {
    next(error);
  }
};
