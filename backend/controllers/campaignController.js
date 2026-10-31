import { Campaign } from "../models/Campaign.js";
import { Rating } from "../models/Rating.js";
import { User } from "../models/User.js";
import { Branch } from "../models/Branch.js";
import { PlatformOffer } from "../models/PlatformOffer.js";
import { Quota } from "../models/Quota.js";
import { WhatsAppDispatch } from "../models/WhatsAppDispatch.js";

// Helper: Seed platform offers if none exist
const ensureDefaultPlatformOffers = async () => {
  const count = await PlatformOffer.countDocuments();
  if (count === 0) {
    await PlatformOffer.create([
      {
        title: "Free Additional Branch Upgrade",
        code: "EXTRAFREE",
        bannerText: "🎉 Special Promo: Use code EXTRAFREE to get +1 Free Branch Location added to your subscription plan!",
        offerType: "FREE_BRANCH",
        extraBranches: 1,
        discountPercent: 10,
        showOnWebsite: true,
        isActive: true,
      },
      {
        title: "20% Flat Rate Reduction",
        code: "BIZ20",
        bannerText: "⚡ Limited Time Deal: Get 20% OFF on all subscription plans using code BIZ20 at checkout!",
        offerType: "RATE_DISCOUNT",
        discountPercent: 20,
        showOnWebsite: true,
        isActive: true,
      },
      {
        title: "WhatsApp Quota Booster (+1000 Scans)",
        code: "BOOSTWSP",
        bannerText: "💬 Free Quota Boost: Use code BOOSTWSP for +1,000 extra WhatsApp & Valid Scan quota free!",
        offerType: "WSP_QUOTA_BOOST",
        extraWspQuota: 1000,
        discountPercent: 15,
        showOnWebsite: true,
        isActive: true,
      },
    ]);
  }
};

// Helper: Seed initial default campaigns if a business has none
const ensureDefaultCampaigns = async (user) => {
  const count = await Campaign.countDocuments({
    $or: [{ userId: user._id }, { formKey: user.formKey || "__none__" }],
  });

  if (count === 0) {
    const businessName = user.cmpy || user.name || "BizORM Partner";
    await Campaign.create([
      {
        userId: user._id,
        branchId: user.branchId || null,
        formKey: user.formKey || "",
        businessName,
        title: "Customer Appreciation VIP Pass",
        description: "Thank you for sharing your 5-star experience with us! Enjoy an exclusive reward on your next visit.",
        offerType: "PERCENT_OFF",
        offerValue: "15% OFF",
        couponCode: "VIP15",
        targetAudience: "PROMOTERS",
        minRating: 4,
        maxRating: 5,
        terms: "Valid on orders above ₹300. Show this digital pass or mention code VIP15 before billing.",
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        themeColor: "#059669",
        templateStyle: "luxury",
        fontFamily: "Outfit",
        isActive: true,
      },
      {
        userId: user._id,
        branchId: user.branchId || null,
        formKey: user.formKey || "",
        businessName,
        title: "Service Recovery & Care Offer",
        description: "We are truly sorry your recent visit was not 100% perfect. Please allow our team to make it right for you.",
        offerType: "FREE_GIFT",
        offerValue: "Complimentary Starter / Dessert",
        couponCode: "CARE2026",
        targetAudience: "DETRACTORS",
        minRating: 1,
        maxRating: 3,
        terms: "Valid on your next dine-in or order. Present code CARE2026 to the duty manager.",
        expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        themeColor: "#e11d48",
        templateStyle: "voucher_ticket",
        fontFamily: "Outfit",
        isActive: true,
      },
      {
        userId: user._id,
        branchId: user.branchId || null,
        formKey: user.formKey || "",
        businessName,
        title: "Festive Flat ₹200 Privilege Voucher",
        description: "Celebration coupon for our patrons. Enjoy ₹200 off your entire invoice.",
        offerType: "FLAT_OFF",
        offerValue: "Flat ₹200 OFF",
        couponCode: "FESTIVE200",
        targetAudience: "ALL",
        minRating: 1,
        maxRating: 5,
        terms: "Valid on orders above ₹500 across all outlets.",
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        themeColor: "#0052cc",
        templateStyle: "modern",
        fontFamily: "Outfit",
        isActive: true,
      },
    ]);
  }
};

// 1. Get all campaigns
export const getCampaigns = async (req, res, next) => {
  try {
    await ensureDefaultCampaigns(req.user);

    const query = {
      $or: [{ userId: req.user._id }],
    };
    if (req.user.branchId) {
      query.$or.push({ branchId: req.user.branchId });
    }
    if (req.user.formKey) {
      query.$or.push({ formKey: req.user.formKey });
    }

    const campaigns = await Campaign.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      campaigns,
    });
  } catch (error) {
    next(error);
  }
};

// 2. Create campaign
export const createCampaign = async (req, res, next) => {
  try {
    const {
      title,
      description,
      offerType = "PERCENT_OFF",
      offerValue,
      couponCode,
      targetAudience = "ALL",
      minRating = 1,
      maxRating = 5,
      terms,
      expiryDate,
      themeColor = "#0052cc",
      templateStyle = "voucher_ticket",
      fontFamily = "Outfit",
      businessName,
    } = req.body;

    if (!title || !couponCode) {
      return res.status(400).json({ success: false, message: "Title and Coupon Code are required" });
    }

    // Check duplicate code for this business
    const existing = await Campaign.findOne({
      userId: req.user._id,
      couponCode: couponCode.trim().toUpperCase(),
    });
    if (existing) {
      return res.status(400).json({ success: false, message: `Coupon code '${couponCode.toUpperCase()}' already exists for your business.` });
    }

    let resolvedAudience = targetAudience;
    let rMin = minRating;
    let rMax = maxRating;

    if (targetAudience === "DETRACTORS") {
      rMin = 1;
      rMax = 3;
    } else if (targetAudience === "PROMOTERS") {
      rMin = 4;
      rMax = 5;
    }

    const campaign = await Campaign.create({
      userId: req.user._id,
      branchId: req.user.branchId || null,
      formKey: req.user.formKey || "",
      businessName: businessName || req.user.cmpy || req.user.name || "BizORM Partner",
      title: title.trim(),
      description: (description || "").trim(),
      offerType,
      offerValue: (offerValue || "Special Offer").trim(),
      couponCode: couponCode.trim().toUpperCase(),
      targetAudience: resolvedAudience,
      minRating: rMin,
      maxRating: rMax,
      terms: (terms || "Valid on minimum order. Show digital pass at checkout.").trim(),
      expiryDate: expiryDate ? new Date(expiryDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      themeColor,
      templateStyle,
      fontFamily,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Campaign created successfully",
      campaign,
    });
  } catch (error) {
    next(error);
  }
};

// 3. Update campaign
export const updateCampaign = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findOne({
      _id: id,
      $or: [{ userId: req.user._id }, { formKey: req.user.formKey || "__none__" }],
    });

    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    const updatable = [
      "title",
      "description",
      "offerType",
      "offerValue",
      "couponCode",
      "targetAudience",
      "minRating",
      "maxRating",
      "terms",
      "expiryDate",
      "themeColor",
      "templateStyle",
      "fontFamily",
      "isActive",
      "businessName",
    ];

    updatable.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "couponCode") {
          campaign[field] = String(req.body[field]).trim().toUpperCase();
        } else {
          campaign[field] = req.body[field];
        }
      }
    });

    if (req.body.targetAudience === "DETRACTORS") {
      campaign.minRating = 1;
      campaign.maxRating = 3;
    } else if (req.body.targetAudience === "PROMOTERS") {
      campaign.minRating = 4;
      campaign.maxRating = 5;
    }

    await campaign.save();

    res.json({
      success: true,
      message: "Campaign updated successfully",
      campaign,
    });
  } catch (error) {
    next(error);
  }
};

// 4. Delete campaign
export const deleteCampaign = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findOneAndDelete({
      _id: id,
      $or: [{ userId: req.user._id }, { formKey: req.user.formKey || "__none__" }],
    });

    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    res.json({
      success: true,
      message: "Campaign deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// 5. Get customer audience (Customers who gave 1-3 stars, 4-5 stars, etc.)
export const getCampaignAudience = async (req, res, next) => {
  try {
    const query = {};

    if (req.user.role === "SUPER_ADMIN") {
      // Super admin can see all or scoped
    } else if (req.user.branchId) {
      query.branchId = req.user.branchId;
    } else if (req.user.formKey) {
      query.formKey = req.user.formKey;
    }

    const ratings = await Rating.find(query)
      .sort({ createdAt: -1 })
      .limit(300)
      .lean();

    let detractorsCount = 0;
    let promotersCount = 0;
    let neutralCount = 0;

    const customers = ratings.map((r) => {
      const star = r.star || 5;
      let segment = "ALL";
      if (star <= 3) {
        detractorsCount++;
        segment = "DETRACTOR"; // 1-3 Stars
      } else {
        promotersCount++;
        segment = "PROMOTER"; // 4-5 Stars
      }

      return {
        _id: r._id,
        name: r.name || "Customer",
        mobile: r.mobile || "",
        star: r.star || 5,
        review: r.review || "",
        title: r.title || "",
        createdAt: r.createdAt,
        segment,
        platform: r.webName || r.platformName || "Direct Review",
        status: r.status || "NEW",
      };
    });

    res.json({
      success: true,
      totalCustomers: customers.length,
      detractorsCount,
      promotersCount,
      customers,
    });
  } catch (error) {
    next(error);
  }
};

// 6. Record coupon dispatch & generate WhatsApp link with 12-hour deduplication quota check
export const sendCampaignOffer = async (req, res, next) => {
  try {
    const { campaignId } = req.params;
    const { customerName, customerMobile, star, channel = "WhatsApp" } = req.body;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    const cleanPhone = (customerMobile || "").replace(/[^0-9]/g, "").slice(-10);

    // 12-hour deduplication window (12 * 60 * 60 * 1000 ms)
    const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;
    const twelveHoursAgo = new Date(Date.now() - TWELVE_HOURS_MS);

    // Look for previous WhatsApp message to this customer by this user within the last 12 hours
    const recentDispatch = cleanPhone
      ? await WhatsAppDispatch.findOne({
          userId: req.user._id,
          customerMobile: cleanPhone,
          sentAt: { $gte: twelveHoursAgo },
        }).sort({ sentAt: -1 })
      : null;

    let quotaDeducted = false;
    let remainingWspQuota = 0;

    if (recentDispatch) {
      // Sent within 12 hours -> Free re-dispatch, do not decrement quota again
      const currentQuota = await Quota.findOne({ byUserId: req.user._id });
      remainingWspQuota = currentQuota?.whatsappQuota ?? 0;
    } else {
      // Must deduct 1 quota. Check if available.
      const currentQuota = await Quota.findOne({ byUserId: req.user._id });
      if (!currentQuota || (currentQuota.whatsappQuota ?? 0) <= 0) {
        return res.status(403).json({
          success: false,
          quotaExhausted: true,
          message: "WhatsApp quota exhausted (0 remaining). Please top up your WhatsApp quota from Subscription & Add-ons to send messages.",
        });
      }

      const updatedQuota = await Quota.findOneAndUpdate(
        { byUserId: req.user._id, whatsappQuota: { $gt: 0 } },
        { $inc: { whatsappQuota: -1 } },
        { new: true }
      );
      quotaDeducted = true;
      remainingWspQuota = updatedQuota?.whatsappQuota ?? 0;
    }

    // Record dispatch in WhatsAppDispatch log
    if (cleanPhone) {
      await WhatsAppDispatch.create({
        userId: req.user._id,
        customerMobile: cleanPhone,
        customerName: customerName || "Customer",
        channel: "WhatsApp",
        campaignId: campaign._id,
        quotaDeducted,
        sentAt: new Date(),
      });
    }

    campaign.sentCount = (campaign.sentCount || 0) + 1;
    campaign.sentHistory.push({
      customerName: customerName || "Customer",
      customerMobile: customerMobile || "",
      star: star || 5,
      sentAt: new Date(),
      channel,
      quotaDeducted,
    });
    await campaign.save();

    // Construct greeting and WhatsApp direct link
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    const isDetractor = (star && star <= 3) || campaign.targetAudience === "DETRACTORS";
    const greeting = isDetractor
      ? `Dear ${customerName || "Customer"}, thank you for visiting ${campaign.businessName}. We value your candid feedback and want to ensure you have a wonderful next experience.`
      : `Hi ${customerName || "Customer"}, thank you for your wonderful ${star || 5}-star review for ${campaign.businessName}! We have a special reward for you.`;

    const messageText = `${greeting}\n\n🎉 *Exclusive Offer:* ${campaign.offerValue} (${campaign.title})\n🎟️ *Coupon Code:* ${campaign.couponCode}\n⏳ *Valid Till:* ${new Date(campaign.expiryDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}\n\nShow this code or tap your digital voucher pass to redeem:\n${req.protocol}://${req.get("host")}/voucher/${campaign.couponCode}\n\nTerms: ${campaign.terms}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(messageText)}`;

    res.json({
      success: true,
      message: quotaDeducted
        ? "1 WhatsApp quota used. 12-hour session window started for this customer."
        : "Message generated within 12-hour session window (0 quota deducted).",
      quotaDeducted,
      remainingWspQuota,
      whatsappUrl,
      messageText,
      sentCount: campaign.sentCount,
    });
  } catch (error) {
    next(error);
  }
};

// 7. Public Voucher View endpoint (Accessible by customers)
export const getPublicVoucher = async (req, res, next) => {
  try {
    const { code } = req.params;
    if (!code) {
      return res.status(400).json({ success: false, message: "Coupon code is required" });
    }

    const campaign = await Campaign.findOne({
      couponCode: code.trim().toUpperCase(),
      isActive: true,
    }).lean();

    if (!campaign) {
      return res.status(404).json({ success: false, message: "Voucher or Coupon not found or expired" });
    }

    res.json({
      success: true,
      voucher: {
        title: campaign.title,
        description: campaign.description,
        businessName: campaign.businessName,
        offerType: campaign.offerType,
        offerValue: campaign.offerValue,
        couponCode: campaign.couponCode,
        terms: campaign.terms,
        expiryDate: campaign.expiryDate,
        themeColor: campaign.themeColor,
        templateStyle: campaign.templateStyle,
        fontFamily: campaign.fontFamily,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 8. Public: Get active SaaS platform promo coupons to show on website
export const getPublicPlatformOffers = async (req, res, next) => {
  try {
    await ensureDefaultPlatformOffers();
    const offers = await PlatformOffer.find({
      showOnWebsite: true,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      offers,
    });
  } catch (error) {
    next(error);
  }
};

// 9. Public / Checkout: Validate a platform promo coupon
export const validatePlatformOffer = async (req, res, next) => {
  try {
    const { code, price = 0, businessType = "single" } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: "Coupon code is required" });
    }

    await ensureDefaultPlatformOffers();
    const offer = await PlatformOffer.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
    });

    if (!offer) {
      return res.status(404).json({ success: false, message: "Invalid or inactive promo coupon code" });
    }

    if (offer.expiryDate && new Date(offer.expiryDate) < new Date()) {
      return res.status(400).json({ success: false, message: "This coupon code has expired" });
    }

    const numPrice = Number(price) || 0;
    let discountAmount = 0;

    if (offer.discountPercent > 0) {
      discountAmount = Math.round((numPrice * offer.discountPercent) / 100);
    } else if (offer.discountFlat > 0) {
      discountAmount = Math.min(numPrice, offer.discountFlat);
    }

    const finalPrice = Math.max(0, numPrice - discountAmount);

    res.json({
      success: true,
      message: `Coupon '${offer.code}' applied successfully!`,
      offer: {
        code: offer.code,
        title: offer.title,
        offerType: offer.offerType,
        discountPercent: offer.discountPercent,
        discountFlat: offer.discountFlat,
        discountAmount,
        originalPrice: numPrice,
        finalPrice,
        extraBranches: offer.extraBranches || 0,
        extraWspQuota: offer.extraWspQuota || 0,
        terms: offer.terms,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 10. Admin: List all platform promo coupons
export const getAdminPlatformOffers = async (req, res, next) => {
  try {
    await ensureDefaultPlatformOffers();
    const offers = await PlatformOffer.find().sort({ createdAt: -1 });
    res.json({ success: true, offers });
  } catch (error) {
    next(error);
  }
};

// 11. Admin: Create a SaaS promo coupon
export const createAdminPlatformOffer = async (req, res, next) => {
  try {
    const {
      title,
      code,
      bannerText,
      offerType = "RATE_DISCOUNT",
      discountPercent = 0,
      discountFlat = 0,
      extraBranches = 0,
      extraWspQuota = 0,
      applicableBusinessType = "ALL",
      showOnWebsite = true,
      expiryDate,
      terms,
    } = req.body;

    if (!title || !code) {
      return res.status(400).json({ success: false, message: "Title and Promo Code are required" });
    }

    const existing = await PlatformOffer.findOne({ code: code.trim().toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: `Promo code '${code.toUpperCase()}' already exists` });
    }

    const offer = await PlatformOffer.create({
      title: title.trim(),
      code: code.trim().toUpperCase(),
      bannerText: (bannerText || "").trim(),
      offerType,
      discountPercent: Number(discountPercent) || 0,
      discountFlat: Number(discountFlat) || 0,
      extraBranches: Number(extraBranches) || 0,
      extraWspQuota: Number(extraWspQuota) || 0,
      applicableBusinessType,
      showOnWebsite: Boolean(showOnWebsite),
      expiryDate: expiryDate ? new Date(expiryDate) : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      terms: (terms || "Valid on all subscriptions.").trim(),
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Platform promo coupon created successfully",
      offer,
    });
  } catch (error) {
    next(error);
  }
};

// 12. Admin: Update SaaS promo coupon
export const updateAdminPlatformOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const offer = await PlatformOffer.findById(id);
    if (!offer) {
      return res.status(404).json({ success: false, message: "Promo coupon not found" });
    }

    const fields = [
      "title",
      "code",
      "bannerText",
      "offerType",
      "discountPercent",
      "discountFlat",
      "extraBranches",
      "extraWspQuota",
      "applicableBusinessType",
      "showOnWebsite",
      "isActive",
      "expiryDate",
      "terms",
    ];

    fields.forEach((f) => {
      if (req.body[f] !== undefined) {
        if (f === "code") offer[f] = String(req.body[f]).trim().toUpperCase();
        else offer[f] = req.body[f];
      }
    });

    await offer.save();

    res.json({
      success: true,
      message: "Platform promo coupon updated successfully",
      offer,
    });
  } catch (error) {
    next(error);
  }
};

// 13. Admin: Delete SaaS promo coupon
export const deleteAdminPlatformOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    await PlatformOffer.findByIdAndDelete(id);
    res.json({ success: true, message: "Platform promo coupon deleted" });
  } catch (error) {
    next(error);
  }
};

