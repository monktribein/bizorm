import { Activity } from "../models/Activity.js";

export const getActivityLogs = async (req, res, next) => {
  try {
    const role = req.user.getNormalizedRole();
    const { branchId, page = 1, limit = 10 } = req.query;

    const query = {};
    if (role === "SUPER_ADMIN") {
      if (branchId) query.branchId = branchId;
    } else {
      if (req.user.branchId) query.branchId = req.user.branchId;
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Activity.countDocuments(query);
    const logs = await Activity.find(query)
      .populate("userId", "uname email fname lname")
      .populate("branchId", "name code")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.max(1, Math.ceil(total / limitNum)),
      logs,
    });
  } catch (error) {
    next(error);
  }
};

export const clearActivityLogs = async (req, res, next) => {
  try {
    await Activity.deleteMany({});
    res.json({ success: true, message: "Activity logs cleared successfully" });
  } catch (error) {
    next(error);
  }
};
