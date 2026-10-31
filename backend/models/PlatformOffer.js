import mongoose from "mongoose";

const platformOfferSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    bannerText: {
      type: String,
      default: "",
      trim: true,
    },
    offerType: {
      type: String,
      enum: ["RATE_DISCOUNT", "FREE_BRANCH", "WSP_QUOTA_BOOST", "COMBO"],
      default: "RATE_DISCOUNT",
    },
    discountPercent: {
      type: Number,
      default: 0, // e.g. 20 for 20% off
    },
    discountFlat: {
      type: Number,
      default: 0, // e.g. 500 for ₹500 off
    },
    extraBranches: {
      type: Number,
      default: 0, // e.g. 1 for 1 Free Branch
    },
    extraWspQuota: {
      type: Number,
      default: 0, // e.g. 1000 extra WhatsApp valid scans/messages
    },
    applicableBusinessType: {
      type: String,
      enum: ["ALL", "single", "multiple", "marketplace"],
      default: "ALL",
    },
    showOnWebsite: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiryDate: {
      type: Date,
      default: () => new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
    },
    terms: {
      type: String,
      default: "Valid on all new BizORM subscriptions. Applied at checkout.",
    },
    timesUsed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const PlatformOffer = mongoose.model("PlatformOffer", platformOfferSchema);
export default PlatformOffer;
