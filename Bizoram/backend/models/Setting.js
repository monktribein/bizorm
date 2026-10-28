import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: "Bizorm Reviews",
    },
    siteTitle: {
      type: String,
      default: "Bizorm Reviews - Feedback & Reputation Management",
    },
    siteDesc: {
      type: String,
      default: "Multi-branch review gating, ratings, and customer feedback management platform.",
    },
    siteKeywords: {
      type: String,
      default: "reviews, customer feedback, reputation management, star gating",
    },
    siteLogo: {
      type: String,
      default: "",
    },
    siteFavIcon: {
      type: String,
      default: "",
    },
    captchaSiteKey: {
      type: String,
      default: "",
    },
    protocol: {
      type: String,
      default: "smtp",
    },
  },
  {
    timestamps: true,
  }
);

export const Setting = mongoose.model("Setting", settingSchema);
