import mongoose from "mongoose";

const companyDetailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    cmpyName: {
      type: String,
      required: true,
      trim: true,
    },
    cmpyMobile: {
      type: String,
      default: "",
    },
    cmpyEmail: {
      type: String,
      default: "",
    },
    cmpyLogo: {
      type: String,
      default: "",
    },
    businessCategory: {
      type: String,
      default: "general",
    },
    customTags: {
      type: [String],
      default: [],
    },
    customNegativeTags: {
      type: [String],
      default: [],
    },
    reviewPrompt: {
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

export const CompanyDetail = mongoose.model("CompanyDetail", companyDetailSchema);
