import mongoose from "mongoose";

const productFeedbackSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
    },
    productName: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    aspects: {
      quality: { type: Number, default: 5 },
      packaging: { type: Number, default: 5 },
      delivery: { type: Number, default: 5 },
      valueForMoney: { type: Number, default: 5 },
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isDefect: {
      type: Boolean,
      default: false,
      index: true,
    },
    defectCategory: {
      type: String,
      enum: ["NONE", "PRODUCT_DAMAGED", "WRONG_ITEM", "MISSING_PARTS", "QUALITY_ISSUE", "PACKAGING_DEFECT", "DELIVERY_DELAY", "OTHER"],
      default: "NONE",
    },
    comment: {
      type: String,
      default: "",
      trim: true,
    },
    customerName: {
      type: String,
      default: "Anonymous Customer",
      trim: true,
    },
    customerEmail: {
      type: String,
      default: "",
      trim: true,
    },
    customerPhone: {
      type: String,
      default: "",
      trim: true,
    },
    orderId: {
      type: String,
      default: "",
      trim: true,
    },
    batchNumber: {
      type: String,
      default: "",
    },
    channel: {
      type: String,
      default: "AMAZON",
    },
    status: {
      type: String,
      enum: ["NEW", "INVESTIGATING", "REPLACED", "REFUNDED", "RESOLVED", "CLOSED"],
      default: "NEW",
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
  },
  {
    timestamps: true,
  }
);

export const ProductFeedback =
  mongoose.models.ProductFeedback || mongoose.model("ProductFeedback", productFeedbackSchema);
export default ProductFeedback;
