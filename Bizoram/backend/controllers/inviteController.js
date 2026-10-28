import { ReviewInvite } from "../models/ReviewInvite.js";
import { Rating } from "../models/Rating.js";
import { Quota } from "../models/Quota.js";
import { Activity } from "../models/Activity.js";

// Protected: Log or create a review invite (Dispatched via WhatsApp, SMS, or Link)
export const logReviewInvite = async (req, res, next) => {
  try {
    const {
      customerName,
      customerMobile,
      staffMember = "",
      channel = "WHATSAPP",
      templateId = "express",
    } = req.body;

    if (!customerName || !customerMobile) {
      return res.status(400).json({
        success: false,
        message: "Customer Name and Mobile Number are required",
      });
    }

    const cleanMobile = customerMobile.replace(/[^0-9]/g, "").slice(-10);
    if (cleanMobile.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid 10-digit mobile number",
      });
    }

    const formKey = req.user.formKey;
    const userId = req.user._id;
    const branchId = req.user.branchId || null;

    // Check if customer already submitted a review earlier
    const existingReview = await Rating.findOne({
      formKey,
      mobile: cleanMobile,
    }).sort({ createdAt: -1 });

    const isAlreadyCompleted = !!existingReview;

    // Upsert or create invite record
    let invite = await ReviewInvite.findOne({
      formKey,
      customerMobile: cleanMobile,
    });

    if (invite) {
      invite.customerName = customerName.trim();
      invite.staffMember = (staffMember || "").trim();
      invite.channel = channel;
      invite.templateId = templateId;
      if (isAlreadyCompleted) {
        invite.status = "COMPLETED";
        invite.completedStar = existingReview.star;
        invite.completedReviewId = existingReview._id;
        invite.completedAt = existingReview.createdAt;
      }
      await invite.save();
    } else {
      invite = await ReviewInvite.create({
        userId,
        branchId,
        formKey,
        customerName: customerName.trim(),
        customerMobile: cleanMobile,
        staffMember: (staffMember || "").trim(),
        channel,
        templateId,
        status: isAlreadyCompleted ? "COMPLETED" : "INVITED",
        completedStar: isAlreadyCompleted ? existingReview.star : null,
        completedReviewId: isAlreadyCompleted ? existingReview._id : null,
        completedAt: isAlreadyCompleted ? existingReview.createdAt : null,
      });
    }

    // Decrement WhatsApp / SMS quota if available
    try {
      const quotaField = channel === "SMS" ? "smsQuota" : "whatsappQuota";
      await Quota.findOneAndUpdate(
        { byUserId: userId, [quotaField]: { $gt: 0 } },
        { $inc: { [quotaField]: -1 } }
      );
    } catch {}

    // Activity log
    await Activity.create({
      userId,
      branchId,
      actionType: "INVITE_SENT",
      msg: `Review invite dispatched to ${customerName.trim()} (+91 ${cleanMobile}) via ${channel}${
        staffMember ? ` [Staff: ${staffMember.trim()}]` : ""
      }`,
      actTime: new Date().toUTCString(),
    });

    res.status(201).json({
      success: true,
      message: "Review invitation logged successfully",
      invite,
    });
  } catch (error) {
    next(error);
  }
};

// Protected: Get review invites with status filters and booster summary
export const getReviewInvites = async (req, res, next) => {
  try {
    const role = req.user.getNormalizedRole();
    const { status, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (role === "SUPER_ADMIN") {
      // Super admin can see all or filter by query
      if (req.query.formKey) query.formKey = req.query.formKey;
    } else if (req.user.branchId) {
      query.branchId = req.user.branchId;
    } else {
      query.formKey = req.user.formKey;
    }

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { customerName: { $regex: s, $options: "i" } },
        { customerMobile: { $regex: s, $options: "i" } },
        { staffMember: { $regex: s, $options: "i" } },
      ];
    }

    const now = Date.now();
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    // Handle virtual/computed status filtering
    if (status) {
      if (status === "DUE") {
        query.status = { $in: ["INVITED", "REMINDER_SENT"] };
        query.createdAt = { $lte: new Date(now - TWENTY_FOUR_HOURS) };
      } else {
        query.status = status;
      }
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [invites, total] = await Promise.all([
      ReviewInvite.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limitNum),
      ReviewInvite.countDocuments(query),
    ]);

    // Calculate Booster Queue summary metrics
    const statsQuery = { ...query };
    delete statsQuery.status;
    delete statsQuery.createdAt;

    const allBusinessInvites = await ReviewInvite.find(statsQuery);
    const totalInvites = allBusinessInvites.length;
    let completedCount = 0;
    let pendingCount = 0;
    let dueReminderCount = 0;

    allBusinessInvites.forEach((inv) => {
      if (inv.status === "COMPLETED") {
        completedCount += 1;
      } else {
        pendingCount += 1;
        const ageMs = now - new Date(inv.createdAt).getTime();
        if (ageMs > TWENTY_FOUR_HOURS) {
          dueReminderCount += 1;
        }
      }
    });

    const conversionRate = totalInvites > 0 ? Math.round((completedCount / totalInvites) * 100) : 0;

    // Enrich invites with isReminderDue flag
    const enrichedInvites = invites.map((inv) => {
      const obj = inv.toObject();
      const ageMs = now - new Date(inv.createdAt).getTime();
      obj.isReminderDue = inv.status !== "COMPLETED" && ageMs > TWENTY_FOUR_HOURS;
      return obj;
    });

    res.json({
      success: true,
      invites: enrichedInvites,
      total,
      page: pageNum,
      totalPages: Math.max(1, Math.ceil(total / limitNum)),
      stats: {
        totalInvites,
        completedCount,
        pendingCount,
        dueReminderCount,
        conversionRate,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Protected: Record a follow-up reminder sent to customer
export const recordFollowUp = async (req, res, next) => {
  try {
    const { id } = req.params;
    const invite = await ReviewInvite.findById(id);

    if (!invite) {
      return res.status(404).json({ success: false, message: "Invite not found" });
    }

    invite.reminderCount = (invite.reminderCount || 0) + 1;
    invite.lastReminderAt = new Date();
    if (invite.status !== "COMPLETED") {
      invite.status = "REMINDER_SENT";
    }
    await invite.save();

    await Activity.create({
      userId: req.user._id,
      branchId: req.user.branchId || null,
      actionType: "FOLLOW_UP_SENT",
      msg: `Follow-up review reminder #${invite.reminderCount} sent to ${invite.customerName} (+91 ${invite.customerMobile})`,
      actTime: new Date().toUTCString(),
    });

    res.json({
      success: true,
      message: "Follow-up reminder recorded successfully",
      invite,
    });
  } catch (error) {
    next(error);
  }
};

// Protected: Delete an invite record
export const deleteInvite = async (req, res, next) => {
  try {
    const { id } = req.params;
    await ReviewInvite.findByIdAndDelete(id);
    res.json({
      success: true,
      message: "Invite record deleted",
    });
  } catch (error) {
    next(error);
  }
};
