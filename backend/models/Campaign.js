import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      default: null,
      index: true,
    },
    formKey: {
      type: String,
      default: "",
      index: true,
    },
    businessName: {
      type: String,
      default: "BizORM Partner",
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    offerType: {
      type: String,
      enum: ["PERCENT_OFF", "FLAT_OFF", "FREE_GIFT", "CUSTOM"],
      default: "PERCENT_OFF",
    },
    offerValue: {
      type: String,
      default: "15% OFF",
      trim: true,
    },
    couponCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    targetAudience: {
      type: String,
      enum: ["ALL", "DETRACTORS", "PROMOTERS", "CUSTOM"],
      default: "ALL", // "DETRACTORS" = 1-3 Stars, "PROMOTERS" = 4-5 Stars, "ALL" = All Reviewers
    },
    minRating: {
      type: Number,
      default: 1,
    },
    maxRating: {
      type: Number,
      default: 5,
    },
    terms: {
      type: String,
      default: "Valid on minimum order of ₹299. Show this digital pass or mention code before billing.",
    },
    expiryDate: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
    themeColor: {
      type: String,
      default: "#0052cc",
    },
    templateStyle: {
      type: String,
      enum: ["voucher_ticket", "modern", "luxury", "festive", "minimal"],
      default: "voucher_ticket",
    },
    fontFamily: {
      type: String,
      default: "Outfit",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sentCount: {
      type: Number,
      default: 0,
    },
    sentHistory: [
      {
        customerName: String,
        customerMobile: String,
        star: Number,
        sentAt: { type: Date, default: Date.now },
        channel: { type: String, default: "WhatsApp" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign;

