import mongoose from "mongoose";

const whatsAppDispatchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    customerMobile: {
      type: String,
      required: true,
      index: true,
    },
    customerName: {
      type: String,
      default: "",
    },
    channel: {
      type: String,
      default: "WhatsApp",
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      default: null,
    },
    quotaDeducted: {
      type: Boolean,
      default: false,
    },
    sentAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

whatsAppDispatchSchema.index({ userId: 1, customerMobile: 1, sentAt: -1 });

export const WhatsAppDispatch = mongoose.model("WhatsAppDispatch", whatsAppDispatchSchema);
export default WhatsAppDispatch;

