import mongoose from "mongoose";

const reviewInviteSchema = new mongoose.Schema(
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
      required: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerMobile: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    staffMember: {
      type: String,
      default: "",
      trim: true,
    },
    channel: {
      type: String,
      enum: ["WHATSAPP", "SMS", "LINK"],
      default: "WHATSAPP",
    },
    templateId: {
      type: String,
      default: "express",
    },
    status: {
      type: String,
      enum: ["INVITED", "REMINDER_DUE", "REMINDER_SENT", "COMPLETED"],
      default: "INVITED",
      index: true,
    },
    reminderCount: {
      type: Number,
      default: 0,
    },
    lastReminderAt: {
      type: Date,
      default: null,
    },
    completedReviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rating",
      default: null,
    },
    completedStar: {
      type: Number,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const ReviewInvite = mongoose.model("ReviewInvite", reviewInviteSchema);
