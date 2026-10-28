import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: String,
      required: true,
    },
    per: {
      type: String,
      default: "+ GST Per Year",
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
    orderBy: {
      type: Number,
      default: 1,
    },
    active: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export const Plan = mongoose.model("Plan", planSchema);
