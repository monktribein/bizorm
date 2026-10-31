import mongoose from "mongoose";

const quotaSchema = new mongoose.Schema(
  {
    byUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    smsQuota: {
      type: Number,
      default: 0,
    },
    emailQuota: {
      type: Number,
      default: 0,
    },
    whatsappQuota: {
      type: Number,
      default: 0,
    },
    webQuota: {
      type: Number,
      default: 0,
    },
    byFormKey: {
      type: String,
      required: true,
      index: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      default: null,
    },
    amount: {
      type: Number,
      default: 0,
    },
    balance: {
      type: Number,
      default: 0,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      default: null,
      index: true,
    },
    billingCycle: {
      type: String,
      enum: ["Monthly", "Annual"],
      default: "Monthly",
    },
    isCarryForward: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Quota = mongoose.model("Quota", quotaSchema);
export default Quota;
