import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    userIp: {
      type: String,
      default: "",
    },
    deviceId: {
      type: String,
      default: "",
      index: true,
    },
    star: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      default: "",
    },
    review: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    webName: {
      type: String,
      default: "",
    },
    webLink: {
      type: String,
      default: "",
    },
    formKey: {
      type: String,
      required: true,
      index: true,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      default: null,
      index: true,
    },
    staffMember: {
      type: String,
      default: "",
      trim: true,
    },
    surveyCompleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["NEW", "IN_PROGRESS", "RESOLVED", "ESCALATED"],
      default: "NEW",
      index: true,
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
      index: true,
    },
    assignedTo: {
      type: String,
      default: "",
      trim: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    escalationLevel: {
      type: String,
      enum: ["OUTLET", "REGIONAL", "HEAD_OFFICE"],
      default: "OUTLET",
      index: true,
    },
    resolutionNotes: {
      type: String,
      default: "",
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    resolvedBy: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

ratingSchema.index({ formKey: 1, star: 1 });
ratingSchema.index({ formKey: 1, mobile: 1 });
ratingSchema.index({ formKey: 1, webName: 1, star: 1 });

export const Rating = mongoose.model("Rating", ratingSchema);
