import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
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
    },
    paymentId: {
      type: String,
      required: true,
      index: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      default: "",
    },
    rrn: {
      type: String,
      default: "",
    },
    entity: {
      type: String,
      default: "",
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      default: "captured",
    },
    captured: {
      type: String,
      default: "1",
    },
    mop: {
      type: String,
      default: "",
    },
    cardId: {
      type: String,
      default: "",
    },
    bank: {
      type: String,
      default: "",
    },
    wallet: {
      type: String,
      default: "",
    },
    vpa: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    mobile: {
      type: String,
      default: "",
    },
    date: {
      type: Number,
      default: () => Date.now(),
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

export const Transaction = mongoose.model("Transaction", transactionSchema);
