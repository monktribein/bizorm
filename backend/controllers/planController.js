import { Plan } from "../models/Plan.js";
import { Pricing } from "../models/Pricing.js";
import { User } from "../models/User.js";
import { Quota } from "../models/Quota.js";
import { Activity } from "../models/Activity.js";
import { seedDefaultPlans as seedPlansFn, seedPricingPackages as seedPkgFn } from "../utils/seed.js";

// Plans
export const getPlans = async (req, res, next) => {
  try {
    const plans = await Plan.find({ active: 1 }).sort({ orderBy: 1 });
    res.json({ success: true, plans });
  } catch (error) {
    next(error);
  }
};

export const seedPlans = async (req, res, next) => {
  try {
    await Plan.deleteMany({});
    await seedPlansFn();
    const plans = await Plan.find().sort({ orderBy: 1 });
    res.json({ success: true, message: "Plans seeded", plans });
  } catch (error) {
    next(error);
  }
};

// Pricing Packages
export const getActivePricingPackages = async (req, res, next) => {
  try {
    const obsoleteCount = await Pricing.countDocuments({
      packageName: {
        $in: [
          "Enterprise Supreme",
          "Multi-Business Trial (7 Days)",
          "Multi-Business Starter (2 Biz)",
          "Multi-Business Pro (5 Biz)",
          "Multi-Business Enterprise (10 Biz)",
          "Multi-Business Base Plan",
          "Multi-Branch Growth (3 Branches)",
          "Multi-Branch Franchise (5 Branches)",
          "Starter Review Plan",
          "Growth Professional",
          "Professional Supreme",
        ],
      },
    });
    const starterExists = await Pricing.countDocuments({ packageName: "Starter" });
    const marketplaceCount = await Pricing.countDocuments({ businessType: "marketplace" });
    if (marketplaceCount === 0 || obsoleteCount > 0 || starterExists === 0) {
      await seedPkgFn(true);
    }
    const filter = { status: "active" };
    if (req.query.businessType) {
      filter.businessType = req.query.businessType;
    }
    const packages = await Pricing.find(filter).sort({ displayOrder: 1, price: 1 });
    res.json({ success: true, packages });
  } catch (error) {
    next(error);
  }
};

export const getPricingPackages = async (req, res, next) => {
  try {
    const obsoleteCount = await Pricing.countDocuments({
      packageName: {
        $in: [
          "Enterprise Supreme",
          "Multi-Business Trial (7 Days)",
          "Multi-Business Starter (2 Biz)",
          "Multi-Business Pro (5 Biz)",
          "Multi-Business Enterprise (10 Biz)",
          "Multi-Business Base Plan",
          "Multi-Branch Growth (3 Branches)",
          "Multi-Branch Franchise (5 Branches)",
          "Starter Review Plan",
          "Growth Professional",
          "Professional Supreme",
        ],
      },
    });
    const starterExists = await Pricing.countDocuments({ packageName: "Starter" });
    const marketplaceCount = await Pricing.countDocuments({ businessType: "marketplace" });
    if (marketplaceCount === 0 || obsoleteCount > 0 || starterExists === 0) {
      await seedPkgFn(true);
    }
    const filter = {};
    if (req.query.businessType) {
      filter.businessType = req.query.businessType;
    }
    const packages = await Pricing.find(filter).sort({ displayOrder: 1, price: 1 });
    res.json({ success: true, packages });
  } catch (error) {
    next(error);
  }
};

export const createPricingPackage = async (req, res, next) => {
  try {
    const {
      packageName,
      category = "Standard",
      price,
      billingType = "Monthly",
      featuresList = [],
      displayOrder = 1,
      popularBadge = false,
      status = "active",
      maxUsers = 10,
      businessType = "single",
      reviewLimit = 500,
      productsLimit = 0,
      maxBusinesses = 1,
      extraBizPrice = 0,
      trialDays = 7,
      isCustomQuote = false,
    } = req.body;

    if (!packageName || price === undefined) {
      return res.status(400).json({ success: false, message: "Package name and price are required" });
    }

    const pkg = await Pricing.create({
      packageName: packageName.trim(),
      category,
      price: Number(price),
      billingType,
      featuresList,
      displayOrder: Number(displayOrder),
      popularBadge: Boolean(popularBadge),
      status,
      maxUsers: Number(maxUsers),
      businessType: businessType || "single",
      reviewLimit: Number(reviewLimit) || 500,
      productsLimit: Number(productsLimit) || 0,
      maxBusinesses: Number(maxBusinesses) || 1,
      extraBizPrice: Number(extraBizPrice) || 0,
      trialDays: Number(trialDays) || 7,
      isCustomQuote: Boolean(isCustomQuote),
    });

    res.status(201).json({ success: true, package: pkg });
  } catch (error) {
    next(error);
  }
};

export const updatePricingPackage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      packageName,
      category,
      price,
      billingType,
      featuresList,
      displayOrder,
      popularBadge,
      status,
      maxUsers,
      businessType,
      reviewLimit,
      productsLimit,
      maxBusinesses,
      extraBizPrice,
      trialDays,
      isCustomQuote,
    } = req.body;

    const pkg = await Pricing.findById(id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: "Pricing package not found" });
    }

    if (packageName !== undefined) pkg.packageName = packageName.trim();
    if (category !== undefined) pkg.category = category;
    if (price !== undefined) pkg.price = Number(price);
    if (billingType !== undefined) pkg.billingType = billingType;
    if (featuresList !== undefined) pkg.featuresList = featuresList;
    if (displayOrder !== undefined) pkg.displayOrder = Number(displayOrder);
    if (popularBadge !== undefined) pkg.popularBadge = Boolean(popularBadge);
    if (status !== undefined) pkg.status = status;
    if (maxUsers !== undefined) pkg.maxUsers = Number(maxUsers);
    if (businessType !== undefined) pkg.businessType = businessType;
    if (reviewLimit !== undefined) pkg.reviewLimit = Number(reviewLimit);
    if (productsLimit !== undefined) pkg.productsLimit = Number(productsLimit);
    if (maxBusinesses !== undefined) pkg.maxBusinesses = Number(maxBusinesses);
    if (extraBizPrice !== undefined) pkg.extraBizPrice = Number(extraBizPrice);
    if (trialDays !== undefined) pkg.trialDays = Number(trialDays);
    if (isCustomQuote !== undefined) pkg.isCustomQuote = Boolean(isCustomQuote);

    await pkg.save();

    res.json({ success: true, package: pkg });
  } catch (error) {
    next(error);
  }
};

export const requestCustomQuote = async (req, res, next) => {
  try {
    const { name, email, phone, businessName, productsCount, monthlyReviews, message } = req.body;
    const userId = req.user ? req.user._id : null;

    // Log in Activity feed for Super Admin
    await Activity.create({
      userId: userId || undefined,
      actionType: "CUSTOM_PLAN_REQUEST",
      msg: `Custom Marketplace Plan Request: "${businessName || name || "Client"}" (Contact: ${email || phone || "N/A"}). Needs ~${productsCount || "Custom"} products, ~${monthlyReviews || "Custom"} reviews/mo. Note: ${message || "Interested in custom pricing."}`,
      actTime: new Date().toUTCString(),
    });

    res.json({
      success: true,
      message: "Your custom marketplace plan request has been sent to the BizORM team! We will contact you shortly.",
    });
  } catch (error) {
    next(error);
  }
};

export const deletePricingPackage = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Pricing.findByIdAndDelete(id);
    res.json({ success: true, message: "Pricing package deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const selectUserPlan = async (req, res, next) => {
  try {
    const { packageId } = req.params;
    const pkg = await Pricing.findById(packageId);
    if (!pkg) {
      return res.status(404).json({ success: false, message: "Pricing package not found" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.pricingPackageId = pkg._id;
    const trialDays = pkg.trialDays || (pkg.price === 0 ? 7 : 0);
    if (trialDays > 0) {
      user.trialStartDate = Date.now();
      user.trialEndDate = Date.now() + trialDays * 24 * 60 * 60 * 1000;
      user.trialStatus = "active";
    } else {
      user.trialStatus = "active";
    }
    await user.save();

    // Allocate review quotas based on plan review limit
    let quota = await Quota.findOne({ byUserId: user._id });
    const limit = pkg.reviewLimit || 500;
    const whatsappQuota = Math.ceil(limit * 0.4);
    const smsQuota = Math.ceil(limit * 0.3);
    const emailQuota = Math.ceil(limit * 0.3);
    const webQuota = limit;

    if (quota) {
      quota.whatsappQuota = whatsappQuota;
      quota.smsQuota = smsQuota;
      quota.emailQuota = emailQuota;
      quota.webQuota = webQuota;
      quota.amount = pkg.price;
      quota.balance = pkg.price;
      await quota.save();
    } else {
      quota = await Quota.create({
        byUserId: user._id,
        byFormKey: user.formKey,
        whatsappQuota,
        smsQuota,
        emailQuota,
        webQuota,
        amount: pkg.price,
        balance: pkg.price,
      });
    }

    // Log Activity
    await Activity.create({
      userId: user._id,
      actionType: "PLAN_SELECTED",
      msg: `Selected Subscription Plan [ Plan: ${pkg.packageName}, Price: ₹${pkg.price}, Reviews: ${limit} ]`,
      actTime: new Date().toUTCString(),
    });

    res.json({
      success: true,
      message: `${pkg.packageName} selected and activated successfully!`,
      plan: pkg,
      quota,
      user: {
        id: user._id,
        pricingPackageId: user.pricingPackageId,
      },
    });
  } catch (error) {
    next(error);
  }
};
