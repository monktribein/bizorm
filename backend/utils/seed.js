import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Plan } from "../models/Plan.js";
import { Pricing } from "../models/Pricing.js";
import { SurveyQuestion } from "../models/SurveyQuestion.js";
import { Setting } from "../models/Setting.js";
import { Quota } from "../models/Quota.js";
import { Website } from "../models/Website.js";
import { logger } from "./logger.js";

export const seedSuperAdmin = async () => {
  const seedSingle = async (email, uname) => {
    let existing = await User.findOne({ email });
    const passwordHash = bcrypt.hashSync("123456", 10);

    const GOOGLE_REVIEW_LINK = "https://g.page/r/CewgBPDQRwDXEBM/review";

    if (existing) {
      existing.role = "SUPER_ADMIN";
      existing.sadmin = 1;
      existing.active = 1;
      existing.uname = uname;
      existing.password = passwordHash;
      await existing.save();

      const existingWeb = await Website.findOne({ userId: existing._id, webName: "Google Reviews" });
      if (existingWeb) {
        existingWeb.webLink = GOOGLE_REVIEW_LINK;
        existingWeb.active = 1;
        await existingWeb.save();
      } else {
        await Website.create({
          userId: existing._id,
          formKey: existing.formKey,
          webName: "Google Reviews",
          webLink: GOOGLE_REVIEW_LINK,
          icon: "google",
          active: 1,
          totalRatings: 0,
          starRating: 0,
          frameId: existing.frameId || "",
        });
      }

      logger.info(`Super Admin updated: ${email} (${uname})`);
      return existing._id;
    }

    const formKey = uname + Math.floor(Math.random() * 100000);
    const actKeyHash = bcrypt.hashSync("verified", 10);

    const user = await User.create({
      role: "SUPER_ADMIN",
      sadmin: 1,
      admin: 0,
      iscmpy: 0,
      uname,
      fname: uname.toUpperCase(),
      lname: "Admin",
      email,
      mobile: "9999999999",
      active: 1,
      websiteForm: 1,
      sub: 1,
      actKey: actKeyHash,
      formKey,
      frameId: "",
      password: passwordHash,
      latestActivity: new Date().toUTCString(),
    });

    await Quota.create({
      byUserId: user._id,
      smsQuota: 10000,
      emailQuota: 10000,
      whatsappQuota: 10000,
      webQuota: 100,
      byFormKey: formKey,
      balance: 0,
    });

    await Website.create({
      userId: user._id,
      formKey,
      webName: "Google Reviews",
      webLink: GOOGLE_REVIEW_LINK,
      icon: "google",
      active: 1,
      totalRatings: 0,
      starRating: 0,
      frameId: "",
    });

    logger.info(`Super Admin created: ${email} (${uname})`);
    return user._id;
  };

  await seedSingle("nktech@gmail.com", "nktech");
};

export const seedDefaultPlans = async () => {
  const count = await Plan.countDocuments();
  if (count === 0) {
    const defaultPlans = [
      {
        name: "Essential",
        amount: "955",
        per: "+ GST Per Year",
        smsQuota: 0,
        emailQuota: 5,
        whatsappQuota: 5,
        webQuota: 5,
        orderBy: 1,
        active: 1,
      },
      {
        name: "Premium Plan",
        amount: "5550",
        per: "+ GST Per Year",
        smsQuota: 10,
        emailQuota: 10,
        whatsappQuota: 10,
        webQuota: 10,
        orderBy: 2,
        active: 1,
      },
      {
        name: "Premium Plus",
        amount: "9550",
        per: "+ GST Per Year",
        smsQuota: 20,
        emailQuota: 20,
        whatsappQuota: 20,
        webQuota: 20,
        orderBy: 3,
        active: 1,
      },
    ];
    await Plan.insertMany(defaultPlans);
    logger.info("Default plans seeded successfully");
  }
};

export const seedPricingPackages = async (forceUpdate = false) => {
  const packages = [
    // ---------------------------------------------------------
    // 1. Single Business Plans
    // ---------------------------------------------------------
    {
      packageName: "Free Trial (7 Days)",
      category: "Trial",
      price: 118,
      billingType: "7 Days",
      businessType: "single",
      reviewLimit: 100,
      productsLimit: 0,
      maxBusinesses: 1,
      extraBizPrice: 0,
      trialDays: 7,
      featuresList: [
        "7 Days Full Access Free Trial",
        "1 Business / Location",
        "100 Review Invites Included",
        "Google Reviews Direct Integration",
        "Private Feedback Filter (1-3 stars)",
        "WhatsApp, SMS & QR Code Sharing",
      ],
      displayOrder: 1,
      popularBadge: false,
      status: "active",
      maxUsers: 5,
      isCustomQuote: false,
    },
    {
      packageName: "Starter Review Plan",
      category: "Standard",
      price: 599,
      billingType: "Monthly",
      businessType: "single",
      reviewLimit: 500,
      productsLimit: 0,
      maxBusinesses: 1,
      extraBizPrice: 0,
      trialDays: 0,
      featuresList: [
        "500 Reviews / Monthly Quota",
        "1 Business / Location",
        "WhatsApp, SMS & QR Invites Included",
        "Google Reviews Direct Redirect (4-5 stars)",
        "Private Star-Gating & Feedback (1-3 stars)",
        "Real-Time Analytics & Report Export",
      ],
      displayOrder: 2,
      popularBadge: false,
      status: "active",
      maxUsers: 10,
      isCustomQuote: false,
    },
    {
      packageName: "Growth Professional",
      category: "Popular",
      price: 999,
      billingType: "Monthly",
      businessType: "single",
      reviewLimit: 1000,
      productsLimit: 0,
      maxBusinesses: 1,
      extraBizPrice: 0,
      trialDays: 0,
      featuresList: [
        "1,000 Reviews / Monthly Quota",
        "1 Business / Location",
        "WhatsApp, SMS & Dynamic QR Invites",
        "Smart AI Review Text Assistant",
        "Instant Clipboard Auto-Copy to Google",
        "Detailed Review Sentiment Insights",
      ],
      displayOrder: 3,
      popularBadge: true,
      status: "active",
      maxUsers: 25,
      isCustomQuote: false,
    },
    {
      packageName: "Professional Supreme",
      category: "Supreme",
      price: 2999,
      billingType: "Monthly",
      businessType: "single",
      reviewLimit: 2500,
      productsLimit: 0,
      maxBusinesses: 1,
      extraBizPrice: 599,
      trialDays: 0,
      featuresList: [
        "2,500 Reviews / Monthly Quota",
        "1 Business Location Included",
        "Add-on Branch Option: +₹599/mo (+500 Reviews)",
        "High-Volume WhatsApp & SMS Invites",
        "Automated Review Campaigns",
        "Priority 24/7 Dedicated Support",
        "Full Audit Logs & Data Export",
      ],
      displayOrder: 4,
      popularBadge: false,
      status: "active",
      maxUsers: 100,
      isCustomQuote: false,
    },

    // ---------------------------------------------------------
    // 2. Multiple Business Plans
    // ---------------------------------------------------------
    {
      packageName: "Multi-Business Base Plan",
      category: "Base Required",
      price: 2999,
      billingType: "Monthly",
      businessType: "multiple",
      reviewLimit: 1000,
      productsLimit: 0,
      maxBusinesses: 1,
      extraBizPrice: 599,
      trialDays: 7,
      featuresList: [
        "7 Days Evaluation Access Included",
        "1 Base Business Branch Included",
        "Required Base Plan to Unlock Multi-Branch Support",
        "Add-on Branches Available at ₹599/mo each",
        "Centralized Multi-Location Analytics",
        "Separate Google Review links for each branch",
      ],
      displayOrder: 1,
      popularBadge: false,
      status: "active",
      maxUsers: 20,
      isCustomQuote: false,
    },
    {
      packageName: "Multi-Branch Growth (3 Branches)",
      category: "Popular Expansion",
      price: 1797,
      billingType: "Monthly",
      businessType: "multiple",
      reviewLimit: 1500,
      productsLimit: 0,
      maxBusinesses: 4, // 1 base + 3 add-on
      extraBizPrice: 599,
      trialDays: 0,
      featuresList: [
        "+3 Add-on Business Branches Included",
        "+1,500 Review Quota (500 Reviews per branch)",
        "Calculated at ₹599/branch add-on",
        "Multi-Branch Performance & Rating Comparison",
        "WhatsApp, SMS & Dynamic QR Support for all branches",
        "Multi-Manager & Staff Permission Control",
      ],
      displayOrder: 2,
      popularBadge: true,
      status: "active",
      maxUsers: 50,
      isCustomQuote: false,
    },
    {
      packageName: "Multi-Branch Franchise (5 Branches)",
      category: "Franchise",
      price: 2995,
      billingType: "Monthly",
      businessType: "multiple",
      reviewLimit: 2500,
      productsLimit: 0,
      maxBusinesses: 6, // 1 base + 5 add-on
      extraBizPrice: 599,
      trialDays: 0,
      featuresList: [
        "+5 Add-on Business Branches Included",
        "+2,500 Review Quota (500 Reviews per branch)",
        "Calculated at ₹599/branch add-on",
        "Franchise-Scale Review Automation",
        "Complete Tenant Isolation & Custom Branding",
        "Priority 24/7 VIP Phone & WhatsApp Support",
      ],
      displayOrder: 3,
      popularBadge: false,
      status: "active",
      maxUsers: 150,
      isCustomQuote: false,
    },

    // ---------------------------------------------------------
    // 3. Marketplace Plans (Products Review Quota)
    // ---------------------------------------------------------
    {
      packageName: "Marketplace Basic",
      category: "Standard",
      price: 2999,
      billingType: "Monthly",
      businessType: "marketplace",
      reviewLimit: 500,
      productsLimit: 5,
      maxBusinesses: 1,
      extraBizPrice: 0,
      trialDays: 0,
      featuresList: [
        "5 Products / SKUs Included",
        "500 Product Reviews / Monthly Quota",
        "Product-Specific Review Landing Pages",
        "Direct Redirect to Google & Marketplace Reviews",
        "Private 1-3 Star Feedback Interception",
        "Dynamic Product QR Codes for Packaging",
      ],
      displayOrder: 1,
      popularBadge: false,
      status: "active",
      maxUsers: 15,
      isCustomQuote: false,
    },
    {
      packageName: "Marketplace Growth",
      category: "Popular",
      price: 5999,
      billingType: "Monthly",
      businessType: "marketplace",
      reviewLimit: 2500,
      productsLimit: 25,
      maxBusinesses: 1,
      extraBizPrice: 0,
      trialDays: 0,
      featuresList: [
        "25 Products / SKUs Included",
        "2,500 Product Reviews / Monthly Quota",
        "Individual Product Rating & Sentiment Breakdown",
        "Smart AI Review Generation for Product Buyers",
        "Automated WhatsApp & SMS Review Invitations",
        "Product Catalog & SKU Performance Insights",
      ],
      displayOrder: 2,
      popularBadge: true,
      status: "active",
      maxUsers: 50,
      isCustomQuote: false,
    },
    {
      packageName: "Marketplace Scale",
      category: "Scale",
      price: 11999,
      billingType: "Monthly",
      businessType: "marketplace",
      reviewLimit: 10000,
      productsLimit: 100,
      maxBusinesses: 1,
      extraBizPrice: 0,
      trialDays: 0,
      featuresList: [
        "100 Products / SKUs Included",
        "10,000 Product Reviews / Monthly Quota",
        "High-Volume eCommerce & Marketplace Integrations",
        "Post-Purchase Automated WhatsApp Sequences",
        "Deep Category Sentiment Analysis & Benchmarking",
        "Dedicated Account Manager & Priority Tech Support",
      ],
      displayOrder: 3,
      popularBadge: false,
      status: "active",
      maxUsers: 200,
      isCustomQuote: false,
    },
    {
      packageName: "Marketplace Custom Enterprise",
      category: "Custom Quote",
      price: 0,
      billingType: "Custom",
      businessType: "marketplace",
      reviewLimit: 50000,
      productsLimit: 500,
      maxBusinesses: 1,
      extraBizPrice: 0,
      trialDays: 0,
      featuresList: [
        "Custom Number of Products (100+)",
        "Custom Monthly Review Quota (10k+)",
        "BizORM Owner Personalized Recommendation",
        "Custom Webhook & ERP / eCommerce Integrations",
        "Dedicated SLA & 24/7 Direct Engineering Hotline",
      ],
      displayOrder: 4,
      popularBadge: false,
      status: "active",
      maxUsers: 500,
      isCustomQuote: true,
    },
  ];

  // Remove deprecated / obsolete packages
  await Pricing.deleteMany({
    packageName: {
      $in: [
        "Enterprise Supreme",
        "Multi-Business Trial (7 Days)",
        "Multi-Business Starter (2 Biz)",
        "Multi-Business Pro (5 Biz)",
        "Multi-Business Enterprise (10 Biz)",
      ],
    },
  });

  const existingCount = await Pricing.countDocuments();
  const marketplaceCount = await Pricing.countDocuments({ businessType: "marketplace" });

  if (existingCount === 0 || marketplaceCount === 0 || forceUpdate) {
    for (const pkg of packages) {
      await Pricing.findOneAndUpdate(
        { packageName: pkg.packageName, businessType: pkg.businessType },
        { $set: pkg },
        { upsert: true, new: true }
      );
    }
    // Also update the single business trial price to 118 if it was 0
    await Pricing.updateOne(
      { packageName: "Free Trial (7 Days)", businessType: "single" },
      { $set: { price: 118 } }
    );
    // Also update Starter Review Plan to 599 if it was 999
    await Pricing.updateOne(
      { packageName: "Starter Review Plan", businessType: "single" },
      { $set: { price: 599 } }
    );
    // Also update Growth Professional to 999 if it was 1499
    await Pricing.updateOne(
      { packageName: "Growth Professional", businessType: "single" },
      { $set: { price: 999 } }
    );
    logger.info("Pricing packages synced successfully (Single, Multiple & Marketplace)");
  }
};

export const seedSurveyQuestions = async () => {
  const count = await SurveyQuestion.countDocuments();
  if (count === 0) {
    const defaultQuestions = [
      "Did our food satisfy your taste buds?",
      "Did you enjoy the beverages?",
      "Did we take your order on time?",
      "Did we serve you on time?",
      "Were our staff members friendly?",
      "Do you like our ambience?",
      "Do you like our menu selections/variety?",
      "We care - did it show?",
    ];
    const docs = defaultQuestions.map((q, idx) => ({
      questionText: q,
      orderBy: idx + 1,
      active: 1,
    }));
    await SurveyQuestion.insertMany(docs);
    logger.info("Survey questions seeded successfully");
  }
};

export const seedSettings = async () => {
  const count = await Setting.countDocuments();
  if (count === 0) {
    await Setting.create({
      siteName: "Bizorm Reviews",
      siteTitle: "Bizorm Reviews - Feedback & Reputation Management",
      siteDesc: "Multi-branch review gating, ratings, and customer feedback management platform.",
      siteKeywords: "reviews, customer feedback, reputation management, star gating",
      captchaSiteKey: "",
      protocol: "smtp",
    });
    logger.info("Default settings initialized");
  }
};

export const runAllSeeds = async () => {
  await seedSuperAdmin();
  await seedDefaultPlans();
  await seedPricingPackages();
  await seedSurveyQuestions();
  await seedSettings();
};
