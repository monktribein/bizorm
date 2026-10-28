import mongoose from "mongoose";

const websiteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    formKey: {
      type: String,
      required: true,
      index: true,
    },
    webName: {
      type: String,
      required: true,
      trim: true,
    },
    webLink: {
      type: String,
      required: true,
      trim: true,
    },
    active: {
      type: Number,
      default: 1, // 1 = Active, 0 = Inactive
    },
    showInReviewForm: {
      type: Boolean,
      default: true,
    },
    subject: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    starRating: {
      type: Number,
      default: 0,
    },
    frameId: {
      type: String,
      default: "",
      index: true,
    },
    icon: {
      type: String,
      default: "globe",
    },
    logo: {
      type: String,
      default: "",
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

export const Website = mongoose.model("Website", websiteSchema);
