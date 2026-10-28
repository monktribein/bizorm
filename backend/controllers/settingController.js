import { Setting } from "../models/Setting.js";

export const getSettings = async (req, res, next) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({
        siteName: "Bizorm Reviews",
        siteTitle: "Bizorm Reviews - Feedback & Reputation Management",
        siteDesc: "Multi-branch review gating, ratings, and customer feedback management platform.",
        siteKeywords: "reviews, customer feedback, reputation management, star gating",
      });
    }
    res.json({ success: true, settings: setting });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const { siteName, siteTitle, siteDesc, siteKeywords, siteLogo, siteFavIcon, captchaSiteKey, protocol } = req.body;

    let setting = await Setting.findOne();
    if (!setting) {
      setting = new Setting();
    }

    if (siteName !== undefined) setting.siteName = siteName;
    if (siteTitle !== undefined) setting.siteTitle = siteTitle;
    if (siteDesc !== undefined) setting.siteDesc = siteDesc;
    if (siteKeywords !== undefined) setting.siteKeywords = siteKeywords;
    if (siteLogo !== undefined) setting.siteLogo = siteLogo;
    if (siteFavIcon !== undefined) setting.siteFavIcon = siteFavIcon;
    if (captchaSiteKey !== undefined) setting.captchaSiteKey = captchaSiteKey;
    if (protocol !== undefined) setting.protocol = protocol;

    await setting.save();

    res.json({ success: true, settings: setting });
  } catch (error) {
    next(error);
  }
};
