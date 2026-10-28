import { Quota } from "../models/Quota.js";
import { User } from "../models/User.js";

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
