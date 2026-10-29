import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    channel: {
      type: String,
      enum: ["AMAZON", "FLIPKART", "SHOPIFY_D2C", "SWIGGY_ZOMATO", "MEESHO", "MANUFACTURER", "GENERAL"],
      default: "AMAZON",
    },
    brandName: {
      type: String,
      default: "",
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    qrType: {
      type: String,
      enum: ["BRAND", "SKU", "BATCH", "UNIT"],
      default: "SKU",
    },
    qrCodeKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    batchNumber: {
      type: String,
      default: "",
    },
    marketplaceProductUrl: {
      type: String,
      default: "",
    },
    warrantyMonths: {
      type: Number,
      default: 12,
    },
    complianceProfile: {
      channel: {
        type: String,
        default: "AMAZON",
      },
      neutralReviewPrompt: {
        type: Boolean,
        default: true,
      },
      allowDirectSupport: {
        type: Boolean,
        default: true,
      },
      warrantyRegistrationEnabled: {
        type: Boolean,
        default: true,
      },
      insertPolicyNote: {
        type: String,
        default: "FTC & Marketplace Policy Compliant: Neutral feedback invitation & direct product support.",
      },
    },
    stats: {
      totalScans: { type: Number, default: 0 },
      totalFeedback: { type: Number, default: 0 },
      avgScore: { type: Number, default: 0 },
      defectsReported: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ["ACTIVE", "ARCHIVED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ userId: 1, sku: 1 });

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
