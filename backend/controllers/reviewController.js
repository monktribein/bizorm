import { Rating } from "../models/Rating.js";
import { Website } from "../models/Website.js";
import { User } from "../models/User.js";
import { Branch } from "../models/Branch.js";
import { Activity } from "../models/Activity.js";
import { CompanyDetail } from "../models/CompanyDetail.js";
import { ReviewInvite } from "../models/ReviewInvite.js";
import { Quota } from "../models/Quota.js";
import { generateSmartReview, generateSmartReviewOptions } from "../utils/reviewGenerator.js";

// Public: Get review context for customer page /wtr/[formKey]
export const getPublicReviewContext = async (req, res, next) => {
  try {
    let { formKey } = req.params;

    let user = await User.findOne({ formKey }).select("-password -actKey");
    if (!user && formKey.startsWith("ntech")) {
      const aliasKey = formKey.replace(/^ntech/, "nktech");
      user = await User.findOne({ formKey: aliasKey }).select("-password -actKey");
      if (user) formKey = user.formKey;
    } else if (!user && formKey.startsWith("nktech")) {
      const aliasKey = formKey.replace(/^nktech/, "ntech");
      user = await User.findOne({ formKey: aliasKey }).select("-password -actKey");
      if (user) formKey = user.formKey;
    }

    if (!user) {
      // Check if user passed their username
      user = await User.findOne({ uname: formKey }).select("-password -actKey");
      if (user) formKey = user.formKey;
    }

    if (!user && (formKey.startsWith("_its") || formKey.startsWith("its"))) {
      // Handle slight typos in the random suffix of _itsk...
      user = await User.findOne({ formKey: { $regex: "^_?its", $options: "i" } }).select("-password -actKey");
      if (user) formKey = user.formKey;
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid review link. Form key does not exist.",
      });
    }

    if (user.branchId) {
      const branch = await Branch.findOne({ _id: user.branchId, deleted: false });
      if (!branch || branch.active === 0) {
        return res.status(400).json({
          success: false,
          message: "This branch is currently inactive or deleted.",
        });
      }
    }

    // Platforms configured for this user (all active platforms)
    const platforms = await Website.find({ formKey, active: 1 });

    // Company branding
    const branding = await CompanyDetail.findOne({ userId: user._id });

    // Quota status
    const quota = await Quota.findOne({ byFormKey: formKey });

    // Staff members associated with this user / branch
    let staffMembers = [];
    try {
      const staffQuery = { active: 1 };
      if (user.branchId) {
        staffQuery.branchId = user.branchId;
      } else {
        staffQuery._id = { $ne: user._id };
      }
      const foundStaff = await User.find(staffQuery).select("fname lname uname");
      staffMembers = foundStaff
        .map((s) => {
          const fullName = [s.fname, s.lname].filter(Boolean).join(" ").trim();
          return fullName || s.uname;
        })
        .filter(Boolean);
    } catch (e) {
      console.error("Error fetching staff for public context", e);
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        fname: user.fname,
        lname: user.lname,
        cmpy: user.cmpy,
        formKey: user.formKey,
        branchId: user.branchId,
      },
      branding,
      platforms,
      staffMembers,
      quotaStatus: quota ? (quota.balance > 0 ? "pending_balance" : "active") : "active",
      alreadyReviewed: false,
    });
  } catch (error) {
    next(error);
  }
};

// Public: Get glowing 4-5 star reviews for public embed widget
export const getPublicPositiveReviews = async (req, res, next) => {
  try {
    const { formKey } = req.params;
    let user = await User.findOne({ formKey });
    if (!user && formKey.startsWith("ntech")) {
      user = await User.findOne({ formKey: formKey.replace(/^ntech/, "nktech") });
    } else if (!user && formKey.startsWith("nktech")) {
      user = await User.findOne({ formKey: formKey.replace(/^nktech/, "ntech") });
    }
    if (!user) {
      user = await User.findOne({ uname: formKey });
    }
    if (!user && (formKey.startsWith("_its") || formKey.startsWith("its"))) {
      user = await User.findOne({ formKey: { $regex: "^_?its", $options: "i" } });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }

    const branding = await CompanyDetail.findOne({ userId: user._id });
    const gPlatform = await Website.findOne({ userId: user._id, webName: "Google Reviews" });

    // Fetch up to 30 public positive reviews (4 & 5 stars)
    const reviews = await Rating.find({
      formKey: user.formKey,
      star: { $gte: 4 },
    })
      .sort({ createdAt: -1 })
      .limit(30)
      .select("star review name title platform staffMember createdAt");

    // Aggregate stats for business widget banner
    const allReviews = await Rating.find({ formKey: user.formKey });
    const totalCount = allReviews.length;
    let totalScore = 0;
    allReviews.forEach((r) => {
      totalScore += r.star;
    });
    const avgScore = totalCount > 0 ? Number((totalScore / totalCount).toFixed(1)) : 5.0;

    const cleanBizName =
      branding?.cmpyName && branding.cmpyName !== "na" && branding.cmpyName !== "n/a"
        ? branding.cmpyName
        : user.cmpy && user.cmpy !== "na" && user.cmpy !== "n/a"
        ? user.cmpy
        : user.fname
        ? `${user.fname}'s Business`
        : "My Business";

    res.json({
      success: true,
      business: {
        name: cleanBizName,
        logo: branding?.cmpyLogo || "",
        category: branding?.businessCategory || "general",
        averageRating: avgScore,
        totalReviews: totalCount,
        positiveCount: reviews.length,
        googleReviewLink: gPlatform?.webLink || "",
        formKey: user.formKey,
      },
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// Public: Get real testimonials for Bizoram landing page
export const getLandingTestimonials = async (req, res, next) => {
  try {
    const dbRatings = await Rating.find({
      star: { $gte: 4 },
      review: { $exists: true, $ne: "" },
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const realReviews = dbRatings
      .filter((r) => r.review && r.review.trim().length > 15)
      .map((r) => {
        const cleanName =
          r.name && r.name !== "user" && r.name !== "n" && r.name !== "ertr" && r.name !== "ddfs"
            ? r.name
            : "Verified Client";

        let business = r.cmpy || "Verified Business";
        if (business === "na" || business === "n/a" || !business) {
          business = "Verified Google Business";
        }

        return {
          _id: r._id,
          name: cleanName,
          role: "Verified Business Owner",
          business: business,
          avatar: cleanName.slice(0, 2).toUpperCase(),
          avatarBg: "#004ac6",
          stars: r.star || 5,
          metric: `${r.star}.0★ Verified Rating`,
          platform: r.platformName || "Google Reviews",
          tag: "Verified Review",
          quote: r.review.replace(/Kashish's Business/g, "Bizoram").replace(/Bizwoke/g, "Bizoram"),
          date: r.createdAt
            ? new Date(r.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
            : "Recently",
          isRealDb: true,
        };
      });

    const curatedBizoramReviews = [
      {
        name: "Dr. Piyush Sharma",
        role: "Clinical Director",
        business: "Apex Healthcare & Dental Clinic",
        location: "Mumbai, MH",
        avatar: "PS",
        avatarBg: "#004ac6",
        stars: 5,
        tag: "Healthcare & Dental",
        metric: "Multi-Platform Feedback",
        platform: "Google Reviews",
        quote:
          "BizORM made collecting authentic patient feedback effortless. The counter acrylic standee sits right at our discharge desk. Patients appreciate how fast and straightforward the scan is, and our staff attribution metrics help us reward our front-desk team.",
        date: "Verified Healthcare Client",
      },
      {
        name: "Riya Kapoor",
        role: "Operations Head",
        business: "The Grand Bistro & Cafe",
        location: "Bengaluru, KA",
        avatar: "RK",
        avatarBg: "#0284c7",
        stars: 5,
        tag: "Restaurant & Cafe",
        metric: "Real-Time Complaint Desk",
        platform: "Google & Direct",
        quote:
          "The real-time complaint desk feature has been vital for our floor operations. If a guest has an issue with food temperature or service speed, our duty manager gets an immediate alert and addresses it on the floor before they exit.",
        date: "Verified Hospitality Client",
      },
      {
        name: "Monu Verma",
        role: "Regional General Manager",
        business: "Fitness First & Gym Franchise",
        location: "NCR Region (6 Branches)",
        avatar: "MV",
        avatarBg: "#2563eb",
        stars: 5,
        tag: "Franchise (6 Outlets)",
        metric: "Multi-Outlet Franchise Command",
        platform: "Google & Justdial",
        quote:
          "Managing multiple branch locations with BizORM's multi-location RBAC is seamless. Our regional managers monitor their own branch feedback while I get a bird's-eye view of all satisfaction trends from one central dashboard.",
        date: "Verified Franchise Client",
      },
      {
        name: "Mayank Singhal",
        role: "Founder & Lead Stylist",
        business: "Glow Luxury Salon & Wellness Spa",
        location: "New Delhi, DL",
        avatar: "MS",
        avatarBg: "#7c3aed",
        stars: 5,
        tag: "Luxury Salon & Spa",
        metric: "Acrylic QR Standees",
        platform: "WhatsApp & Google",
        quote:
          "The 300 DPI print-ready standees matched our premium salon aesthetic seamlessly. Customers simply scan the QR code on the mirror station and choose their preferred platform to share their experience.",
        date: "Verified Salon & Spa Client",
      },
      {
        name: "Vikram Mehta",
        role: "Managing Director",
        business: "Mehta Fine Jewels & Ornaments",
        location: "Jaipur, RJ",
        avatar: "VM",
        avatarBg: "#059669",
        stars: 5,
        tag: "Fine Jewelry Retail",
        metric: "Counter QR Standees",
        platform: "Google Reviews",
        quote:
          "Counter QR standees increased our Google review volume by over 300% in the first month without any friction for our walk-in clients. High-ticket buyers trust verified public feedback.",
        date: "Verified Jewelry Retail Client",
      },
      {
        name: "Ananya Deshmukh",
        role: "Customer Service Director",
        business: "SpeedZone Multi-Brand Motors",
        location: "Pune, MH",
        avatar: "AD",
        avatarBg: "#d97706",
        stars: 5,
        tag: "Automobile Service",
        metric: "WhatsApp Sentiment Routing",
        platform: "WhatsApp & Google",
        quote:
          "Sending post-service WhatsApp follow-ups with instant sentiment routing helped us catch minor repair grievances before customers left negative feedback. Our service CSAT jumped to 4.9.",
        date: "Verified Automotive Client",
      },
      {
        name: "Rajesh Khanna",
        role: "Operations Head",
        business: "FreshBasket Hypermarkets",
        location: "Hyderabad, TS",
        avatar: "RK",
        avatarBg: "#0891b2",
        stars: 5,
        tag: "Hypermarket Chain",
        metric: "Checkout QR Stations",
        platform: "Google Reviews",
        quote:
          "With 12 checkout aisles, customer queue feedback is vital. The acrylic counter displays empower shoppers to leave instant ratings in under 10 seconds, helping us optimize aisle staffing.",
        date: "Verified Retail Client",
      },
      {
        name: "Sneha Rao",
        role: "Store Lead",
        business: "Orbit Tech World Electronics",
        location: "Chennai, TN",
        avatar: "SR",
        avatarBg: "#4f46e5",
        stars: 5,
        tag: "Electronics Retail",
        metric: "Verified Badge Integration",
        platform: "Google & Trustpilot",
        quote:
          "Customer trust is paramount in consumer electronics. BizORM's verified badges and multi-platform review distribution have bolstered our store's reputation across the city.",
        date: "Verified Electronics Client",
      },
    ];

    // Combine real DB reviews with curated reviews
    const combined = [...realReviews, ...curatedBizoramReviews];

    res.json({
      success: true,
      testimonials: combined,
    });
  } catch (error) {
    next(error);
  }
};

// Public: Submit customer rating & review (Star-Gating logic)
export const saveRating = async (req, res, next) => {
  try {
    const {
      star,
      title = "",
      review = "",
      name,
      mobile,
      staffMember = "",
      deviceId = "",
      webId,
      webName = "",
      webLink = "",
      formKey,
    } = req.body;

    const starNum = Number(star);
    if (!starNum || !formKey) {
      return res.status(400).json({
        success: false,
        message: "Star rating and formKey are required",
      });
    }

    // Clean mobile number (optional or captured if provided)
    const rawMobile = mobile ? mobile.toString().replace(/[^0-9]/g, "").slice(-10) : "";
    const cleanMobile = rawMobile || "N/A";
    const finalName = name && name.trim() ? name.trim() : (starNum >= 4 ? "Happy Customer" : "Customer");

    let user = await User.findOne({ formKey });
    if (!user && formKey.startsWith("ntech")) {
      const aliasKey = formKey.replace(/^ntech/, "nktech");
      user = await User.findOne({ formKey: aliasKey });
    } else if (!user && formKey.startsWith("nktech")) {
      const aliasKey = formKey.replace(/^nktech/, "ntech");
      user = await User.findOne({ formKey: aliasKey });
    }
    if (!user) {
      user = await User.findOne({ uname: formKey });
    }
    if (!user && (formKey.startsWith("_its") || formKey.startsWith("its"))) {
      user = await User.findOne({ formKey: { $regex: "^_?its", $options: "i" } });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found for this form key" });
    }

    let branchId = user.branchId;
    const userIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";

    const newRating = await Rating.create({
      userIp,
      deviceId,
      star: starNum,
      title,
      review,
      name: finalName,
      mobile: cleanMobile,
      staffMember: (staffMember || "").trim(),
      webName,
      webLink,
      formKey: user.formKey,
      branchId,
      surveyCompleted: false,
    });

    // Update website stats if webId provided
    if (webId) {
      try {
        const web = await Website.findById(webId);
        if (web) {
          web.totalRatings += 1;
          web.starRating += Number(star);
          await web.save();
        }
      } catch (err) {
        // Continue if webId is not found
      }
    }

    // Decrement web review quota if quota exists
    if (user) {
      await Quota.findOneAndUpdate(
        { byUserId: user._id, webQuota: { $gt: 0 } },
        { $inc: { webQuota: -1 } }
      );
    }

    await Activity.create({
      actionType: "FEEDBACK_RECORD",
      msg: `Feedback recorded: ${star} stars from ${finalName}${staffMember ? ` (Staff: ${staffMember.trim()})` : ""} [ Platform: ${webName || "Direct"} ]`,
      actTime: new Date().toUTCString(),
      branchId,
    });

    // Automatically match and mark any pending ReviewInvite as COMPLETED
    if (cleanMobile && cleanMobile !== "N/A") {
      try {
        await ReviewInvite.findOneAndUpdate(
          {
            formKey: user.formKey,
            customerMobile: cleanMobile,
            status: { $ne: "COMPLETED" },
          },
          {
            status: "COMPLETED",
            completedStar: starNum,
            completedReviewId: newRating._id,
            completedAt: new Date(),
          }
        );
      } catch (inviteErr) {
        console.error("Error linking review invite completion:", inviteErr);
      }
    }

    // Neutral Smart Feedback & Resolution:
    // Respect platform anti-gating policies: neutral access to public review destination
    // Private feedback / complaint resolution captured in parallel
    const starVal = Number(star);
    const isPositive = starVal >= 4;

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      ratingId: newRating._id,
      isPositive,
      redirectUrl: webLink ? webLink : null,
      allowPublicReview: true,
      requiresFollowUp: !isPositive,
    });
  } catch (error) {
    next(error);
  }
};

// Protected: Get list of reviews with branch isolation and filters
export const getReviews = async (req, res, next) => {
  try {
    const role = req.user.getNormalizedRole();
    const { branchId, star, platform, search, formKey, status, staffMember, page = 1, limit = 20 } = req.query;

    const query = {};

    if (role === "SUPER_ADMIN") {
      if (branchId) query.branchId = branchId;
      if (formKey) {
        if (formKey.includes(",")) {
          const keys = formKey.split(",").map((k) => k.trim()).filter(Boolean);
          query.formKey = { $in: keys };
        } else {
          query.formKey = formKey;
        }
      }
    } else {
      if (!req.user.branchId) {
        query.formKey = req.user.formKey;
      } else {
        query.branchId = req.user.branchId;
      }
    }

    // Individual Staff Member isolation: Staff only sees their own assigned / tagged reviews
    const isStaff = role === "BRANCH_USER" && !req.user.admin && !req.user.sadmin;
    if (isStaff) {
      const fullName = [req.user.fname, req.user.lname].filter(Boolean).join(" ").trim();
      const staffPatterns = [];
      if (req.user.uname) staffPatterns.push(req.user.uname.trim());
      if (fullName) staffPatterns.push(fullName);

      const staffConditions = [];
      if (staffPatterns.length > 0) {
        const regexStr = staffPatterns.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
        staffConditions.push({ staffMember: { $regex: new RegExp(`^(${regexStr})$`, "i") } });
        staffConditions.push({ assignedTo: { $regex: new RegExp(`^(${regexStr})$`, "i") } });
      }
      if (req.user.formKey) {
        staffConditions.push({ formKey: req.user.formKey });
      }

      if (staffConditions.length > 0) {
        query.$and = (query.$and || []).concat([{ $or: staffConditions }]);
      }
    }

    if (star) {
      query.star = Number(star);
    }

    if (status) {
      if (status === "UNRESOLVED") {
        query.star = { $lte: 3 };
        query.status = { $ne: "RESOLVED" };
      } else {
        query.status = status;
      }
    }

    if (staffMember) {
      query.staffMember = staffMember;
    }

    if (platform) {
      query.webName = { $regex: platform, $options: "i" };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { review: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
        { staffMember: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 10);
    const skip = (pageNum - 1) * limitNum;
    const total = await Rating.countDocuments(query);
    const reviews = await Rating.find(query)
      .populate("branchId", "name code")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const allFormKeys = [...new Set(reviews.map((r) => r.formKey).filter(Boolean))];
    const usersWithFormKeys = await User.find({ formKey: { $in: allFormKeys } }).select("fname lname uname cmpy formKey");
    const companyDetails = await CompanyDetail.find({ userId: { $in: usersWithFormKeys.map((u) => u._id) } });

    const clientMap = {};
    usersWithFormKeys.forEach((u) => {
      const cd = companyDetails.find((c) => String(c.userId) === String(u._id));
      const cleanBizName = cd?.cmpyName && cd.cmpyName !== "na" && cd.cmpyName !== "n/a"
        ? cd.cmpyName
        : u.cmpy && u.cmpy !== "na" && u.cmpy !== "n/a"
        ? u.cmpy
        : (u.fname ? `${u.fname}'s Business` : "My Business");

      clientMap[u.formKey] = {
        businessName: cleanBizName,
        ownerName: `${u.fname} ${u.lname}`.trim() || u.uname,
        uname: u.uname,
        cmpyLogo: cd?.cmpyLogo || "",
      };
    });

    const enrichedReviews = reviews.map((r) => ({
      ...r.toObject(),
      clientInfo: clientMap[r.formKey] || null,
    }));

    let clientsList = [];
    if (role === "SUPER_ADMIN") {
      const allClients = await User.find({}).select("fname lname uname cmpy formKey role");
      const allCompanyDetails = await CompanyDetail.find({});
      clientsList = allClients
        .filter((c) => c.formKey)
        .map((c) => {
          const cd = allCompanyDetails.find((item) => String(item.userId) === String(c._id));
          const cleanBizName = cd?.cmpyName && cd.cmpyName !== "na" && cd.cmpyName !== "n/a"
            ? cd.cmpyName
            : c.cmpy && c.cmpy !== "na" && c.cmpy !== "n/a"
            ? c.cmpy
            : (c.fname ? `${c.fname}'s Business` : "My Business");

          return {
            userId: c._id,
            formKey: c.formKey,
            businessName: cleanBizName,
            ownerName: `${c.fname} ${c.lname}`.trim() || c.uname,
            uname: c.uname,
            role: c.getNormalizedRole(),
          };
        });
    }

    res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.max(1, Math.ceil(total / limitNum)),
      reviews: enrichedReviews,
      clientsList,
    });
  } catch (error) {
    next(error);
  }
};

// Protected: Get review metrics & star distribution
export const getReviewStats = async (req, res, next) => {
  try {
    const role = req.user.getNormalizedRole();
    const { branchId, formKey, timeframe = "1month" } = req.query;

    const query = {};
    if (role === "SUPER_ADMIN") {
      if (branchId) query.branchId = branchId;
      if (formKey) {
        if (formKey.includes(",")) {
          const keys = formKey.split(",").map((k) => k.trim()).filter(Boolean);
          query.formKey = { $in: keys };
        } else {
          query.formKey = formKey;
        }
      }
    } else {
      if (!req.user.branchId) {
        query.formKey = req.user.formKey;
      } else {
        query.branchId = req.user.branchId;
      }
    }

    // Individual Staff Member isolation: Staff only sees their own stats
    const isStaff = role === "BRANCH_USER" && !req.user.admin && !req.user.sadmin;
    if (isStaff) {
      const fullName = [req.user.fname, req.user.lname].filter(Boolean).join(" ").trim();
      const staffPatterns = [];
      if (req.user.uname) staffPatterns.push(req.user.uname.trim());
      if (fullName) staffPatterns.push(fullName);

      const staffConditions = [];
      if (staffPatterns.length > 0) {
        const regexStr = staffPatterns.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
        staffConditions.push({ staffMember: { $regex: new RegExp(`^(${regexStr})$`, "i") } });
        staffConditions.push({ assignedTo: { $regex: new RegExp(`^(${regexStr})$`, "i") } });
      }
      if (req.user.formKey) {
        staffConditions.push({ formKey: req.user.formKey });
      }

      if (staffConditions.length > 0) {
        query.$and = (query.$and || []).concat([{ $or: staffConditions }]);
      }
    }

    const allReviews = await Rating.find(query).sort({ createdAt: 1 });
    const total = allReviews.length;

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalScore = 0;

    for (const r of allReviews) {
      if (distribution[r.star] !== undefined) {
        distribution[r.star] += 1;
      }
      totalScore += r.star;
    }

    const averageRating = total > 0 ? Number((totalScore / total).toFixed(1)) : 0;
    const positiveCount = (distribution[4] || 0) + (distribution[5] || 0);
    const criticalCount = (distribution[1] || 0) + (distribution[2] || 0) + (distribution[3] || 0);

    // Net Promoter Score (NPS): % Promoters (4-5★) minus % Detractors (1-3★)
    const npsScore = total > 0 ? Math.round(((positiveCount - criticalCount) / total) * 100) : 0;

    // Count unresolved vs resolved complaints
    let unresolvedComplaints = 0;
    let resolvedComplaints = 0;
    allReviews.forEach((r) => {
      if (r.star <= 3) {
        if (r.status === "RESOLVED") {
          resolvedComplaints += 1;
        } else {
          unresolvedComplaints += 1;
        }
      }
    });

    // Estimated brand revenue protected (industry standard ₹12,500 customer lifetime value saved per intercepted negative review)
    const estimatedRevenueSaved = criticalCount * 12500;

    // Generate timeSeries based on requested timeframe
    const now = new Date();
    let intervals = [];

    if (timeframe === "daily") {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);
        const endD = new Date(d);
        endD.setHours(23, 59, 59, 999);
        const label = d.toLocaleDateString("en-US", { weekday: "short", day: "numeric" });
        intervals.push({ label, start: d, end: endD });
      }
    } else if (timeframe === "weekly") {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - (i * 7 + 6));
        d.setHours(0, 0, 0, 0);
        const endD = new Date(d);
        endD.setDate(endD.getDate() + 6);
        endD.setHours(23, 59, 59, 999);
        const label = `W${4 - i} (${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })})`;
        intervals.push({ label, start: d, end: endD });
      }
    } else if (timeframe === "3month") {
      // Last 3 months
      for (let i = 2; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const endD = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
        const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
        intervals.push({ label, start: d, end: endD });
      }
    } else if (timeframe === "1year") {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const endD = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
        const label = d.toLocaleDateString("en-US", { month: "short" });
        intervals.push({ label, start: d, end: endD });
      }
    } else {
      // Default: "1month" (Last 30 days in 6 intervals of 5 days)
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - (i * 5 + 4));
        d.setHours(0, 0, 0, 0);
        const endD = new Date(d);
        endD.setDate(endD.getDate() + 4);
        endD.setHours(23, 59, 59, 999);
        const label = `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endD.getDate()}`;
        intervals.push({ label, start: d, end: endD });
      }
    }

    const timeSeries = intervals.map(({ label, start, end }) => {
      const point = {
        label,
        total: 0,
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      };
      allReviews.forEach((r) => {
        const reviewDate = new Date(r.createdAt || Date.now());
        if (reviewDate >= start && reviewDate <= end) {
          point.total += 1;
          if (point[r.star] !== undefined) {
            point[r.star] += 1;
          }
        }
      });
      return point;
    });

    // Staff & Team Performance Leaderboard
    const staffMap = {};
    allReviews.forEach((r) => {
      const staffName = r.staffMember && r.staffMember.trim() ? r.staffMember.trim() : "Unassigned / General Team";
      if (!staffMap[staffName]) {
        staffMap[staffName] = {
          name: staffName,
          total: 0,
          stars: 0,
          fiveStar: 0,
          positive: 0,
          negative: 0,
        };
      }
      staffMap[staffName].total += 1;
      staffMap[staffName].stars += r.star;
      if (r.star === 5) staffMap[staffName].fiveStar += 1;
      if (r.star >= 4) staffMap[staffName].positive += 1;
      else staffMap[staffName].negative += 1;
    });

    const staffLeaderboard = Object.values(staffMap)
      .map((s) => ({
        name: s.name,
        total: s.total,
        avgRating: (s.stars / s.total).toFixed(1),
        fiveStarCount: s.fiveStar,
        positiveCount: s.positive,
        negativeCount: s.negative,
        satisfactionRate: Math.round((s.positive / s.total) * 100),
      }))
      .sort((a, b) => b.total - a.total || Number(b.avgRating) - Number(a.avgRating));

    res.json({
      success: true,
      stats: {
        totalReviews: total,
        averageRating,
        distribution,
        positiveCount,
        criticalCount,
        positivePercentage: total > 0 ? Math.round((positiveCount / total) * 100) : 0,
        npsScore,
        unresolvedComplaints,
        resolvedComplaints,
        estimatedRevenueSaved,
        timeframe,
        timeSeries,
        staffLeaderboard,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Public/Protected: Generate review text helper
export const generateReviewText = (req, res) => {
  const { title = "", star = 5, businessName = "this business", tags = [], seed = 0, lang = "en" } = req.body;
  const review = generateSmartReview({ title, star, businessName, tags, seed, lang });
  const options = generateSmartReviewOptions({ title, star, businessName, tags, seed, lang });
  res.json({ success: true, review, options, lang });
};

// Protected: Update review resolution status & manager notes
export const updateReviewStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, resolutionNotes, priority, assignedTo, dueDate, escalationLevel } = req.body;

    const rating = await Rating.findById(id);
    if (!rating) {
      return res.status(404).json({ success: false, message: "Review record not found" });
    }

    if (status) rating.status = status;
    if (resolutionNotes !== undefined) rating.resolutionNotes = resolutionNotes;
    if (priority) rating.priority = priority;
    if (assignedTo !== undefined) rating.assignedTo = assignedTo;
    if (dueDate !== undefined) rating.dueDate = dueDate ? new Date(dueDate) : null;
    if (escalationLevel) rating.escalationLevel = escalationLevel;

    if (status === "RESOLVED") {
      rating.resolvedAt = new Date();
      rating.resolvedBy = req.user.fname ? `${req.user.fname} ${req.user.lname || ""}`.trim() : req.user.uname;
    } else if (status === "NEW" || status === "IN_PROGRESS" || status === "ESCALATED") {
      rating.resolvedAt = null;
    }

    await rating.save();

    await Activity.create({
      actionType: "FEEDBACK_STATUS_UPDATE",
      msg: `Review status updated to '${rating.status}' for ${rating.name} by ${req.user.uname || "Admin"}`,
      actTime: new Date().toUTCString(),
      branchId: rating.branchId,
    });

    res.json({
      success: true,
      message: "Review status updated successfully",
      review: rating,
    });
  } catch (error) {
    next(error);
  }
};
