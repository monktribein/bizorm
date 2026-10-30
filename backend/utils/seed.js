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
    // 1. Single Business Plans (Spec Section 7)
    // ---------------------------------------------------------
    {
      packageName: "Free Trial (7 Days)",
      category: "Trial",
      price: 0,
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
        "100 Valid QR Scans Included",
        "Neutral Multi-Platform Destinations",
        "Complaint Resolution Workflow",
        "300 DPI Branded QR Standee Kit",
      ],
      displayOrder: 1,
      popularBadge: false,
      status: "active",
      maxUsers: 5,
      isCustomQuote: false,
    },
    {
      packageName: "Starter",
      category: "Standard",
      price: 299,
      billingType: "Monthly",
      businessType: "single",
      reviewLimit: 100,
      productsLimit: 0,
      maxBusinesses: 1,
      extraBizPrice: 0,
      trialDays: 0,
      featuresList: [
        "100 Valid Scans / Month (Monthly Reset)",
        "1 Business Location Included",
        "Neutral Multi-Platform Review Links",
        "Branded QR Feedback Standee (300 DPI)",
        "Feedback & Response Tracking",
        "Email Notifications for Customer Concerns",
      ],
      displayOrder: 2,
      popularBadge: false,
      status: "active",
      maxUsers: 5,
      isCustomQuote: false,
    },
    {
      packageName: "Growth",
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
        "1,000 Valid Scans / Month (Monthly Reset)",
        "1 Business Location Included",
        "Multi-Platform Review Links (Neutral Routing)",
        "Real-Time Complaint Resolution Engine",
        "Customer Experience & Sentiment Analytics",
        "Priority Email & WhatsApp Support",
      ],
      displayOrder: 3,
      popularBadge: true,
      status: "active",
      maxUsers: 20,
      isCustomQuote: false,
    },
    {
      packageName: "Professional",
      category: "Professional",
      price: 1499,
      billingType: "Monthly",
      businessType: "single",
      reviewLimit: 3000,
      productsLimit: 0,
      maxBusinesses: 1,
      extraBizPrice: 0,
      trialDays: 0,
      featuresList: [
        "3,000 Valid Scans / Month (Monthly Reset)",
        "1 Business Location Included",
        "Staff Attribution & Operational Performance",
        "Complaint Escalation & SLA Tracking",
        "Advanced CSV Reporting & Data Export",
        "Multi-Channel Review Invitations",
      ],
      displayOrder: 4,
      popularBadge: false,
      status: "active",
      maxUsers: 50,
      isCustomQuote: false,
    },
    {
      packageName: "Business Pro",
      category: "Pro",
      price: 2499,
      billingType: "Monthly",
      businessType: "single",
      reviewLimit: 10000,
      productsLimit: 0,
      maxBusinesses: 1,
      extraBizPrice: 0,
      trialDays: 0,
      featuresList: [
        "10,000 Valid Scans / Month (Monthly Reset)",
        "1 Business Location Included",
        "Full Automation Webhook Triggers",
        "Aspect Sentiment Clustering (Coming Soon)",
        "Multi-Staff Permission Management",
        "Dedicated Account Onboarding",
      ],
      displayOrder: 5,
      popularBadge: false,
      status: "active",
      maxUsers: 100,
      isCustomQuote: false,
    },

    // ---------------------------------------------------------
    // 2. Multi-Outlet Franchise Plans (Spec Section 8)
    // ---------------------------------------------------------
    {
      packageName: "Franchise 10",
      category: "Franchise",
      price: 7999,
      billingType: "Monthly",
      businessType: "multiple",
      reviewLimit: 25000,
      productsLimit: 0,
      maxBusinesses: 10,
      extraBizPrice: 0,
      trialDays: 7,
      featuresList: [
        "Coverage for Up to 10 Active Outlets",
        "25,000 Pooled Valid Scans / Month",
        "Corporate Head-Office Command Center",
        "Store Manager Login & Branch Triage",
        "Branch-by-Branch Comparative CSAT",
        "Bulk 300 DPI Printable Standee Assets",
      ],
      displayOrder: 1,
      popularBadge: false,
      status: "active",
      maxUsers: 30,
      isCustomQuote: false,
    },
    {
      packageName: "Franchise 25",
      category: "Popular Expansion",
      price: 16999,
      billingType: "Monthly",
      businessType: "multiple",
      reviewLimit: 75000,
      productsLimit: 0,
      maxBusinesses: 25,
      extraBizPrice: 0,
      trialDays: 0,
      featuresList: [
        "Coverage for Up to 25 Active Outlets",
        "75,000 Pooled Valid Scans / Month",
        "Multi-Tier Territory Governance (Regional & Store)",
        "SLA Escalation Engine & Incident Tracking",
        "Franchise Health Score™ & Outlet Ranking",
        "Priority Corporate Phone & WhatsApp Support",
      ],
      displayOrder: 2,
      popularBadge: true,
      status: "active",
      maxUsers: 75,
      isCustomQuote: false,
    },
    {
      packageName: "Franchise 50",
      category: "Enterprise Scale",
      price: 29999,
      billingType: "Monthly",
      businessType: "multiple",
      reviewLimit: 175000,
      productsLimit: 0,
      maxBusinesses: 50,
      extraBizPrice: 0,
      trialDays: 0,
      featuresList: [
        "Coverage for Up to 50 Active Outlets",
        "175,000 Pooled Valid Scans / Month",
        "Multi-Brand Governance & Audit Logs",
        "Automated Bulk QR Code & Standee Dispatch",
        "Quarterly Executive Business Reviews",
        "Dedicated Customer Success Lead",
      ],
      displayOrder: 3,
      popularBadge: false,
      status: "active",
      maxUsers: 150,
      isCustomQuote: false,
    },
    {
      packageName: "Franchise 100 / Corporate",
      category: "Corporate",
      price: 0,
      billingType: "Monthly",
      businessType: "multiple",
      reviewLimit: 500000,
      productsLimit: 0,
      maxBusinesses: 100,
      extraBizPrice: 0,
      trialDays: 0,
      featuresList: [
        "100+ Outlets with Contractual Scale",
        "500,000+ Pooled Valid Scans Baseline",
        "Custom ERP, POS, and CRM API Integration",
        "Contractual Enterprise SLA & Governance",
        "Dedicated Account Director & Staff Training",
        "Custom Security & Private Hosting Options",
      ],
      displayOrder: 4,
      popularBadge: false,
      status: "active",
      maxUsers: 500,
      isCustomQuote: true,
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
        "Multi-Business Base Plan",
        "Multi-Branch Growth (3 Branches)",
        "Multi-Branch Franchise (5 Branches)",
        "Starter Review Plan",
        "Growth Professional",
        "Professional Supreme",
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
    // Ensure the free trial has price 0 (7-day free trial)
    await Pricing.updateOne(
      { packageName: "Free Trial (7 Days)", businessType: "single" },
      { $set: { price: 0, trialDays: 7, reviewLimit: 100, category: "Trial" } }
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
