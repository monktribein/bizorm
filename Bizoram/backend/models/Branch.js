import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    active: {
      type: Number,
      default: 1, // 1 = Active, 0 = Inactive
    },
    cmpyName: {
      type: String,
      default: "",
    },
    deleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    pricingPackageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pricing",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Branch = mongoose.model("Branch", branchSchema);
