import { Quota } from "../models/Quota.js";
import { User } from "../models/User.js";
import { Activity } from "../models/Activity.js";

export const getUserQuota = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const targetId = userId || req.user._id;

    const user = await User.findById(targetId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const quota = await Quota.findOne({ byUserId: user._id });
    res.json({ success: true, quota });
  } catch (error) {
    next(error);
  }
};

export const checkQuotaStatus = async (req, res, next) => {
  try {
    const { formKey } = req.params;
    const user = await User.findOne({ formKey });
    if (!user) {
      return res.json({ success: true, status: "not_found" });
    }

    const quota = await Quota.findOne({ byFormKey: formKey });
    if (!quota) {
      return res.json({ success: true, status: "not_found" });
    }

    if (quota.balance && quota.balance > 0) {
      return res.json({ success: true, status: "pending_balance", balance: quota.balance });
    }

    res.json({ success: true, status: "active", quota });
  } catch (error) {
    next(error);
  }
};

export const updateQuota = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { smsQuota, emailQuota, whatsappQuota, webQuota, balance } = req.body;

    const quota = await Quota.findById(id);
    if (!quota) {
      return res.status(404).json({ success: false, message: "Quota record not found" });
    }

    if (smsQuota !== undefined) quota.smsQuota = Number(smsQuota);
    if (emailQuota !== undefined) quota.emailQuota = Number(emailQuota);
    if (whatsappQuota !== undefined) quota.whatsappQuota = Number(whatsappQuota);
    if (webQuota !== undefined) quota.webQuota = Number(webQuota);
    if (balance !== undefined) quota.balance = Number(balance);

    await quota.save();

    res.json({ success: true, quota });
  } catch (error) {
    next(error);
  }
};

export const purchaseAddon = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      whatsappCount = 0,
      scanCount = 0,
      branchCount = 0,
      productCount = 0,
      totalAmount = 0,
    } = req.body;

    const numWhatsapp = Number(whatsappCount) || 0;
    const numScans = Number(scanCount) || 0;
    const numBranches = Number(branchCount) || 0;
    const numProducts = Number(productCount) || 0;

    if (numWhatsapp === 0 && numScans === 0 && numBranches === 0 && numProducts === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one add-on item to purchase",
      });
    }

    if (numWhatsapp > 0 && numWhatsapp % 100 !== 0) {
      return res.status(400).json({
        success: false,
        message: "WhatsApp quota must be in multiples of 100 (e.g. 100, 200, 500, 1000)",
      });
    }

    if (numScans > 0 && numScans % 100 !== 0) {
      return res.status(400).json({
        success: false,
        message: "Scanner quota must be in multiples of 100 (e.g. 100, 500, 1000)",
      });
    }

    if (numBranches < 0 || numProducts < 0) {
      return res.status(400).json({
        success: false,
        message: "Branch and Product add-on counts must be non-negative",
      });
    }

    // Update Quota (whatsapp and web/scans)
    let quota = await Quota.findOne({ byUserId: userId });
    if (!quota) {
      quota = await Quota.create({
        byUserId: userId,
        byFormKey: req.user.formKey,
        whatsappQuota: numWhatsapp,
        webQuota: numScans,
        emailQuota: 0,
        smsQuota: 0,
      });
    } else {
      if (numWhatsapp > 0) quota.whatsappQuota = (quota.whatsappQuota || 0) + numWhatsapp;
      if (numScans > 0) quota.webQuota = (quota.webQuota || 0) + numScans;
      await quota.save();
    }

    // Update User for extra branches and products
    const userUpdates = {};
    if (numBranches > 0) userUpdates.$inc = { ...(userUpdates.$inc || {}), extraBranchesAllowed: numBranches };
    if (numProducts > 0) userUpdates.$inc = { ...(userUpdates.$inc || {}), extraProductsAllowed: numProducts };

    let updatedUser = req.user;
    if (Object.keys(userUpdates).length > 0) {
      updatedUser = await User.findByIdAndUpdate(userId, userUpdates, { new: true });
    }

    // Record Activity
    const summaryParts = [];
    if (numWhatsapp > 0) summaryParts.push(`+${numWhatsapp.toLocaleString()} WhatsApp messages`);
    if (numScans > 0) summaryParts.push(`+${numScans.toLocaleString()} QR Scans`);
    if (numBranches > 0) summaryParts.push(`+${numBranches} Branch Locations`);
    if (numProducts > 0) summaryParts.push(`+${numProducts} Product SKUs`);

    try {
      await Activity.create({
        userId,
        actionType: "ADDON_PURCHASED",
        msg: `Purchased Add-ons: ${summaryParts.join(", ")} (Total: ₹${totalAmount})`,
        actTime: new Date().toUTCString(),
      });
    } catch {}

    res.json({
      success: true,
      message: `Add-ons activated successfully! Added ${summaryParts.join(", ")}.`,
      quota,
      extraBranchesAllowed: updatedUser.extraBranchesAllowed || 0,
      extraProductsAllowed: updatedUser.extraProductsAllowed || 0,
    });
  } catch (error) {
    next(error);
  }
};
