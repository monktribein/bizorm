import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Quota } from "../models/Quota.js";
import { CompanyDetail } from "../models/CompanyDetail.js";
import { Website } from "../models/Website.js";
import { Activity } from "../models/Activity.js";
import { Pricing } from "../models/Pricing.js";
import PlatformOffer from "../models/PlatformOffer.js";
import { generateToken } from "../utils/jwt.js";
import { sendVerificationEmail } from "../utils/email.js";
import { logger } from "../utils/logger.js";

export const register = async (req, res, next) => {
  try {
    const {
      email,
      password,
      uname,
      fname = "",
      lname = "",
      mobile,
      isCompanyAdmin = true,
      cmpy = "",
      cmpyLogo = "",
      businessCategory = "general",
      googleReviewLink = "",
      platforms = [],
      pricingPackageId,
      couponCode = "",
      appliedCouponCode = "",
    } = req.body;

    if (!email || !password || !uname || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Email, password, username, and mobile are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check duplicate username
    const existingUname = await User.findOne({ uname: uname.toLowerCase().trim() });
    if (existingUname) {
      return res.status(400).json({
        success: false,
        message: "This username is already taken",
      });
    }

    // Check duplicate email
    const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered",
      });
    }

    // Check company duplicate if specified
    if (isCompanyAdmin && cmpy) {
      const existingCmpy = await User.findOne({ cmpy: cmpy.trim() });
      if (existingCmpy) {
        return res.status(400).json({
          success: false,
          message: "This Company already exists",
        });
      }
    }

    // Role assignment
    let role = "BRANCH_USER";
    let sadmin = 0;
    let admin = 0;
    if (uname.toLowerCase() === "sadmin") {
      sadmin = 1;
      role = "SUPER_ADMIN";
    } else if (isCompanyAdmin === true || isCompanyAdmin === "true") {
      admin = 1;
      role = "BRANCH_ADMIN";
    }

    const unameForm = uname.replace(/[\s.,?&]/g, "_").toLowerCase().substring(0, 5);
    const formKey = unameForm + Math.floor(Math.random() * 100000);
    const rawActKey = Math.floor(100000 + Math.random() * 900000).toString();
    const actKeyHash = bcrypt.hashSync(rawActKey, 10);
    const passwordHash = bcrypt.hashSync(password, 10);

    // Pricing package & quotas
    let smsQuota = 0;
    let emailQuota = 5;
    let whatsappQuota = 5;
    let webQuota = 5;
    let amount = 0;
    let trialStartDate = null;
    let trialEndDate = null;
    let trialStatus = null;

    if (pricingPackageId) {
      try {
        const pkg = await Pricing.findById(pricingPackageId);
        if (pkg) {
          amount = pkg.price || 0;
          trialStartDate = Date.now();
          const trialDays = pkg.trialDays || 7;
          trialEndDate = Date.now() + trialDays * 24 * 60 * 60 * 1000; // 7 days trial
          trialStatus = "active";

          const limit = pkg.reviewLimit || 500;
          whatsappQuota = Math.ceil(limit * 0.4); // 40% WhatsApp
          smsQuota = 0;                           // SMS removed per user specification
          emailQuota = Math.ceil(limit * 0.3);    // 30% Email
          webQuota = limit;                       // 100% of Review Quota
        }
      } catch (err) {
        logger.warn(`Could not fetch pricing package: ${err.message}`);
      }
    }

    // Apply platform promotional coupon if provided
    const promoCodeToApply = (appliedCouponCode || couponCode || "").trim().toUpperCase();
    if (promoCodeToApply) {
      try {
        const promoOffer = await PlatformOffer.findOne({
          code: promoCodeToApply,
          isActive: true,
        });
        if (promoOffer) {
          // 1. Rate Discount
          if (promoOffer.discountPercent > 0) {
            const discount = Math.round(amount * (promoOffer.discountPercent / 100));
            amount = Math.max(0, amount - discount);
          } else if (promoOffer.discountFlat > 0) {
            amount = Math.max(0, amount - promoOffer.discountFlat);
          }

          // 2. WhatsApp Quota Booster
          if (promoOffer.extraWspQuota > 0) {
            whatsappQuota += promoOffer.extraWspQuota;
            webQuota += promoOffer.extraWspQuota;
          }

          // Increment times used
          await PlatformOffer.findByIdAndUpdate(promoOffer._id, { $inc: { timesUsed: 1 } });
          logger.info(`Platform promo coupon '${promoOffer.code}' applied to registration for ${email}`);
        }
      } catch (couponErr) {
        logger.warn(`Failed to apply promo coupon ${promoCodeToApply}: ${couponErr.message}`);
      }
    }

    const newUser = await User.create({
      email: email.toLowerCase().trim(),
      uname: uname.toLowerCase().trim(),
      password: passwordHash,
      fname,
      lname,
      mobile,
      role,
      sadmin,
      admin,
      iscmpy: cmpy ? 1 : 0,
      cmpy: cmpy ? cmpy.trim() : (fname ? `${fname}'s Business` : "My Business"),
      active: 1, // Activated on registration
      websiteForm: 1,
      sub: 0,
      actKey: actKeyHash,
      formKey,
      frameId: "",
      latestActivity: new Date().toUTCString(),
      pricingPackageId: pricingPackageId || null,
      trialStartDate,
      trialEndDate,
      trialStatus,
    });

    // Create Quota
    await Quota.create({
      byUserId: newUser._id,
      smsQuota,
      emailQuota,
      whatsappQuota,
      webQuota,
      byFormKey: formKey,
      amount,
      balance: amount,
    });

    // Create Company Details with industry category & logo
    const businessName = cmpy ? cmpy.trim() : (fname ? `${fname}'s Business` : "My Business");
    await CompanyDetail.create({
      userId: newUser._id,
      cmpyName: businessName,
      cmpyMobile: mobile,
      cmpyEmail: email,
      cmpyLogo: cmpyLogo ? cmpyLogo.trim() : "",
      businessCategory: businessCategory || "general",
      branchId: newUser.branchId,
    });

    // Create multiple review platforms configured during registration (or fallback to Google Reviews)
    let platformsToCreate = [];
    if (Array.isArray(platforms) && platforms.length > 0) {
      platformsToCreate = platforms
        .filter((p) => p && p.link && p.link.trim())
        .map((p) => ({
          name: p.name ? p.name.trim() : (p.platform ? p.platform.trim() : "Google Reviews"),
          link: p.link.trim(),
          icon: p.icon || (p.name ? p.name.toLowerCase().replace(/[^a-z0-9]/g, "") : "globe"),
        }));
    }

    if (platformsToCreate.length === 0) {
      const finalGoogleLink = googleReviewLink && googleReviewLink.trim()
        ? googleReviewLink.trim()
        : "https://g.page/r/CewgBPDQRwDXEBM/review";
      platformsToCreate = [
        {
          name: "Google Reviews",
          link: finalGoogleLink,
          icon: "google",
        },
      ];
    }

    // Save all configured platforms so they immediately show in the dashboard & customer review form
    for (const p of platformsToCreate) {
      await Website.create({
        userId: newUser._id,
        formKey: newUser.formKey,
        webName: p.name,
        webLink: p.link,
        icon: p.icon,
        active: 1,
        showInReviewForm: true,
        branchId: newUser.branchId,
      });
    }

    // Log Activity
    await Activity.create({
      userId: newUser._id,
      actionType: "REGISTER",
      msg: `New user registration [ Username: ${uname}, Email: ${email} ]`,
      actTime: new Date().toUTCString(),
    });

    // Send verification email
    await sendVerificationEmail(email, rawActKey);

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email with the verification code.",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        uname: newUser.uname,
        role: newUser.getNormalizedRole(),
        formKey: newUser.formKey,
        active: newUser.active,
        cmpy: newUser.cmpy,
        fname: newUser.fname,
        lname: newUser.lname,
        admin: newUser.admin,
        sadmin: newUser.sadmin,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { uname, pwd } = req.body;

    if (!uname || !pwd) {
      return res.status(400).json({
        success: false,
        message: "Username/Email and password are required",
      });
    }

    const searchStr = uname.toLowerCase().trim();
    const user = await User.findOne({
      $or: [{ uname: searchStr }, { email: searchStr }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        status: "wrong_credentials",
        message: "Wrong username/email or password",
      });
    }

    const isMatch = bcrypt.compareSync(pwd, user.password);
    if (!isMatch) {
      await Activity.create({
        userId: user._id,
        actionType: "LOGIN_FAILED",
        msg: `Failed Login Attempt - Wrong Credentials [ Username: ${user.uname} ]`,
        actTime: new Date().toUTCString(),
      });

      return res.status(401).json({
        success: false,
        status: "wrong_credentials",
        message: "Wrong username/email or password",
      });
    }

    if (user.active === 2) {
      return res.status(403).json({
        success: false,
        status: "deactivated",
        message: "Your account is deactivated. Please contact support.",
      });
    }

    if (user.active === 0) {
      return res.status(200).json({
        success: false,
        status: "unverified",
        formKey: user.formKey,
        message: "Your account is not verified. Please verify your account.",
      });
    }

    // Update latest activity
    user.latestActivity = new Date().toUTCString();
    await user.save();

    await Activity.create({
      userId: user._id,
      actionType: "LOGIN_SUCCESS",
      msg: `Logged In [ Username: ${user.uname} ]`,
      actTime: new Date().toUTCString(),
      branchId: user.branchId,
    });

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        uname: user.uname,
        fname: user.fname,
        lname: user.lname,
        role: user.getNormalizedRole(),
        sadmin: user.sadmin,
        admin: user.admin,
        branchId: user.branchId,
        formKey: user.formKey,
        active: user.active,
        cmpy: user.cmpy,
        dutyTiming: user.dutyTiming || "09:00 AM - 06:00 PM",
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { formKey, sentCode } = req.body;

    if (!formKey || !sentCode) {
      return res.status(400).json({
        success: false,
        message: "formKey and sentCode are required",
      });
    }

    const user = await User.findOne({ formKey });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with provided form key",
      });
    }

    if (user.active === 1) {
      return res.json({
        success: true,
        alreadyActive: true,
        message: "Account is already active",
      });
    }

    const isValid = bcrypt.compareSync(sentCode, user.actKey);
    if (!isValid) {
      await Activity.create({
        userId: user._id,
        actionType: "VERIFY_FAILED",
        msg: `Invalid verification code provided [ Username: ${user.uname} ]`,
        actTime: new Date().toUTCString(),
      });

      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    user.active = 1;
    await user.save();

    await Activity.create({
      userId: user._id,
      actionType: "VERIFY_SUCCESS",
      msg: `Account verified [ Username: ${user.uname} ]`,
      actTime: new Date().toUTCString(),
    });

    const token = generateToken(user);

    res.json({
      success: true,
      message: "Account verified successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        uname: user.uname,
        role: user.getNormalizedRole(),
        active: user.active,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerificationCode = async (req, res, next) => {
  try {
    const { formKey } = req.body;
    const user = await User.findOne({ formKey });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const rawActKey = Math.floor(100000 + Math.random() * 900000).toString();
    user.actKey = bcrypt.hashSync(rawActKey, 10);
    await user.save();

    await sendVerificationEmail(user.email, rawActKey);

    res.json({
      success: true,
      message: "Verification code resent successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("branchId", "name code active deleted")
      .populate("pricingPackageId");
    const quota = await Quota.findOne({ byUserId: user._id });
    const companyDetails = await CompanyDetail.findOne({ userId: user._id });
    const googlePlatform = await Website.findOne({ userId: user._id, webName: "Google Reviews" });

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        role: user.getNormalizedRole(),
      },
      quota,
      companyDetails,
      googleReviewLink: googlePlatform ? googlePlatform.webLink : "",
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (req, res, next) => {
  try {
    const {
      fname,
      lname,
      mobile,
      cmpy,
      cmpyLogo,
      businessCategory,
      customTags,
      customNegativeTags,
      reviewPrompt,
      googleReviewLink,
    } = req.body;
    const user = await User.findById(req.user._id);

    if (fname !== undefined) user.fname = fname.trim();
    if (lname !== undefined) user.lname = lname.trim();
    if (mobile !== undefined) user.mobile = mobile.trim();
    if (cmpy !== undefined) {
      user.cmpy = cmpy.trim();
      user.iscmpy = cmpy.trim() ? 1 : 0;
    }

    await user.save();

    // Update or create CompanyDetail
    let company = await CompanyDetail.findOne({ userId: user._id });
    if (company) {
      if (cmpy !== undefined) company.cmpyName = cmpy.trim();
      if (cmpyLogo !== undefined) company.cmpyLogo = cmpyLogo.trim();
      if (businessCategory !== undefined) company.businessCategory = businessCategory;
      if (customTags !== undefined) company.customTags = Array.isArray(customTags) ? customTags : [];
      if (customNegativeTags !== undefined) company.customNegativeTags = Array.isArray(customNegativeTags) ? customNegativeTags : [];
      if (reviewPrompt !== undefined) company.reviewPrompt = String(reviewPrompt).trim();
      await company.save();
    } else {
      company = await CompanyDetail.create({
        userId: user._id,
        cmpyName: cmpy ? cmpy.trim() : (user.cmpy || "My Business"),
        cmpyLogo: cmpyLogo ? cmpyLogo.trim() : "",
        businessCategory: businessCategory || "general",
        customTags: Array.isArray(customTags) ? customTags : [],
        customNegativeTags: Array.isArray(customNegativeTags) ? customNegativeTags : [],
        reviewPrompt: reviewPrompt ? String(reviewPrompt).trim() : "",
        branchId: user.branchId,
      });
    }

    // Update or create Google Reviews platform link
    if (googleReviewLink !== undefined && googleReviewLink.trim()) {
      let gPlatform = await Website.findOne({ userId: user._id, webName: "Google Reviews" });
      if (gPlatform) {
        gPlatform.webLink = googleReviewLink.trim();
        gPlatform.active = 1;
        await gPlatform.save();
      } else {
        await Website.create({
          userId: user._id,
          formKey: user.formKey,
          webName: "Google Reviews",
          webLink: googleReviewLink.trim(),
          icon: "google",
          active: 1,
          branchId: user.branchId,
        });
      }
    }

    res.json({
      success: true,
      message: "Profile and business details updated successfully",
      user: {
        ...user.toObject(),
        role: user.getNormalizedRole(),
      },
      companyDetails: company,
      googleReviewLink: googleReviewLink ? googleReviewLink.trim() : undefined,
    });
  } catch (error) {
    next(error);
  }
};

