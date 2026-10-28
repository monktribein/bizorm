import mongoose from "mongoose";

const pricingSchema = new mongoose.Schema(
  {
    packageName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "Standard",
    },
    price: {
      type: Number,
      required: true,
    },
    billingType: {
      type: String,
      default: "Monthly", // "Monthly" | "Yearly" | "Lifetime"
    },
    featuresList: {
      type: [String],
      default: [],
    },
    displayOrder: {
      type: Number,
      default: 1,
      index: true,
    },
    popularBadge: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
    maxUsers: {
      type: Number,
      default: 10,
    },
    businessType: {
      type: String,
      enum: ["single", "multiple", "marketplace"],
      default: "single",
      index: true,
    },
    reviewLimit: {
      type: Number,
      default: 500,
    },
    productsLimit: {
      type: Number,
      default: 0,
    },
    maxBusinesses: {
      type: Number,
      default: 1,
    },
    extraBizPrice: {
      type: Number,
      default: 0,
    },
    trialDays: {
      type: Number,
      default: 7,
    },
    isCustomQuote: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Pricing = mongoose.model("Pricing", pricingSchema);
