import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    ipAddress: {
      type: String,
      default: "",
    },
    actionType: {
      type: String,
      default: "GENERAL",
      index: true,
    },
    msg: {
      type: String,
      required: true,
    },
    actTime: {
      type: String,
      default: () => new Date().toUTCString(),
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Activity = mongoose.model("Activity", activitySchema);
