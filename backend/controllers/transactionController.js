import Razorpay from "razorpay";
import crypto from "crypto";
import { Transaction } from "../models/Transaction.js";
import { Quota } from "../models/Quota.js";
import { Activity } from "../models/Activity.js";

const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    return null;
  }
  return new Razorpay({ key_id, key_secret });
};

export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount, currency = "INR", receipt = "rcpt_" + Date.now() } = req.body;

    const rzp = getRazorpayInstance();
    if (!rzp) {
      // Mock order for testing if Razorpay keys are not provided
      return res.json({
        success: true,
        mock: true,
        order: {
          id: "order_mock_" + Date.now(),
          amount: Math.round(Number(amount) * 100),
          currency,
          receipt,
        },
      });
    }

    const order = await rzp.orders.create({
      amount: Math.round(Number(amount) * 100), // paise
      currency,
      receipt,
    });

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      planId,
    } = req.body;

    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (key_secret && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac("sha256", key_secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: "Invalid payment signature" });
      }
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      formKey: req.user.formKey,
      paymentId: razorpay_payment_id || "mock_pay_" + Date.now(),
      orderId: razorpay_order_id || "mock_ord_" + Date.now(),
      amount: Number(amount),
      currency: "INR",
      status: "captured",
      email: req.user.email,
      mobile: req.user.mobile,
      branchId: req.user.branchId || null,
    });

    // Update quota balance
    const quota = await Quota.findOne({ byUserId: req.user._id });
    if (quota) {
      quota.balance = 0;
      if (planId) quota.planId = planId;
      await quota.save();
    }

    await Activity.create({
      userId: req.user._id,
      actionType: "PAYMENT_SUCCESS",
      msg: `Payment captured: ₹${amount} [ Txn: ${transaction.paymentId} ]`,
      actTime: new Date().toUTCString(),
      branchId: req.user.branchId,
    });

    res.json({ success: true, message: "Payment verified successfully", transaction });
  } catch (error) {
    next(error);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const role = req.user.getNormalizedRole();
    const { branchId } = req.query;

    const query = {};
    if (role === "SUPER_ADMIN") {
      if (branchId) query.branchId = branchId;
    } else {
      if (req.user.branchId) query.branchId = req.user.branchId;
      else query.userId = req.user._id;
    }

    const transactions = await Transaction.find(query)
      .populate("userId", "uname email fname lname")
      .populate("branchId", "name code")
      .sort({ createdAt: -1 });

    res.json({ success: true, transactions });
  } catch (error) {
    next(error);
  }
};
