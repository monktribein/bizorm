import { Website } from "../models/Website.js";
import { Quota } from "../models/Quota.js";
import { Activity } from "../models/Activity.js";

export const getPlatforms = async (req, res, next) => {
  try {
    const role = req.user.getNormalizedRole();
    const query = {};

    if (role === "SUPER_ADMIN") {
      const { branchId, formKey } = req.query;
      if (branchId) query.branchId = branchId;
      if (formKey) query.formKey = formKey;
    } else {
      query.formKey = req.user.formKey;
    }

    const platforms = await Website.find(query).sort({ createdAt: -1 });
    res.json({ success: true, platforms });
  } catch (error) {
    next(error);
  }
};

export const createPlatform = async (req, res, next) => {
  try {
    const { webName, webLink, icon = "globe", subject = "", description = "", logo = "", showInReviewForm = true } = req.body;

    if (!webName || !webLink) {
      return res.status(400).json({ success: false, message: "Platform name and link are required" });
    }

    // Check quota
    const quota = await Quota.findOne({ byUserId: req.user._id });
    if (quota && quota.webQuota <= 0) {
      return res.status(403).json({
        success: false,
        message: "Platform quota exceeded. Please upgrade your plan to connect more review sites.",
      });
    }

    const frameId = "frame_" + Math.floor(Math.random() * 1000000);

    let formattedLink = webLink.trim();
    if (!/^https?:\/\//i.test(formattedLink)) {
      formattedLink = `https://${formattedLink}`;
    }

    const platform = await Website.create({
      userId: req.user._id,
      formKey: req.user.formKey,
      webName: webName.trim(),
      webLink: formattedLink,
      icon,
      subject,
      description,
      logo,
      active: 1,
      showInReviewForm: showInReviewForm !== false,
      totalRatings: 0,
      starRating: 0,
      frameId,
      branchId: req.user.branchId || null,
    });

    if (quota && quota.webQuota > 0) {
      quota.webQuota -= 1;
      await quota.save();
    }

    await Activity.create({
      userId: req.user._id,
      actionType: "PLATFORM_CREATE",
      msg: `Created platform ${webName} [ URL: ${webLink} ]`,
      actTime: new Date().toUTCString(),
      branchId: req.user.branchId,
    });

    res.status(201).json({ success: true, message: "Platform added successfully", platform });
  } catch (error) {
    next(error);
  }
};

export const updatePlatform = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { active, showInReviewForm, subject, description, icon, logo, webName, webLink } = req.body;

    const platform = await Website.findById(id);
    if (!platform) {
      return res.status(404).json({ success: false, message: "Platform not found" });
    }

    const role = req.user.getNormalizedRole();
    if (role !== "SUPER_ADMIN" && platform.formKey !== req.user.formKey) {
      return res.status(403).json({ success: false, message: "Not authorized to update this platform" });
    }

    if (active !== undefined) platform.active = active;
    if (showInReviewForm !== undefined) platform.showInReviewForm = Boolean(showInReviewForm);
    if (subject !== undefined) platform.subject = subject;
    if (description !== undefined) platform.description = description;
    if (icon !== undefined) platform.icon = icon;
    if (logo !== undefined) platform.logo = logo;
    if (webName !== undefined) platform.webName = webName.trim();
    if (webLink !== undefined) {
      let formattedLink = webLink.trim();
      if (formattedLink && !/^https?:\/\//i.test(formattedLink)) {
        formattedLink = `https://${formattedLink}`;
      }
      platform.webLink = formattedLink;
    }

    await platform.save();

    res.json({ success: true, message: "Platform updated successfully", platform });
  } catch (error) {
    next(error);
  }
};

export const deletePlatform = async (req, res, next) => {
  try {
    const { id } = req.params;

    const platform = await Website.findById(id);
    if (!platform) {
      return res.status(404).json({ success: false, message: "Platform not found" });
    }

    const role = req.user.getNormalizedRole();
    if (role !== "SUPER_ADMIN" && platform.formKey !== req.user.formKey) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this platform" });
    }

    await Website.findByIdAndDelete(id);

    // Re-credit quota
    const quota = await Quota.findOne({ byUserId: platform.userId });
    if (quota) {
      quota.webQuota += 1;
      await quota.save();
    }

    await Activity.create({
      userId: req.user._id,
      actionType: "PLATFORM_DELETE",
      msg: `Deleted platform ${platform.webName}`,
      actTime: new Date().toUTCString(),
      branchId: platform.branchId,
    });

    res.json({ success: true, message: "Platform deleted and quota recredited" });
  } catch (error) {
    next(error);
  }
};
