import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    uname: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    fname: {
      type: String,
      default: "",
    },
    lname: {
      type: String,
      default: "",
    },
    mobile: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      default: "",
    },
    dob: {
      type: String,
      default: "",
    },
    dutyTiming: {
      type: String,
      default: "09:00 AM - 06:00 PM",
      trim: true,
    },
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "BRANCH_ADMIN", "BRANCH_USER", "sadmin", "admin", "user"],
      default: "BRANCH_USER",
    },
    sadmin: {
      type: Number,
      default: 0, // 1 = Super Admin, 0 = Regular
    },
    admin: {
      type: Number,
      default: 0, // 1 = Company/Branch Admin, 0 = Sub-user
    },
    iscmpy: {
      type: Number,
      default: 0, // 1 = Company associated, 0 = Standalone
    },
    cmpy: {
      type: String,
      default: "",
    },
    cmpyid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    active: {
      type: Number,
      default: 0, // 0 = Unverified, 1 = Active, 2 = Suspended
    },
    websiteForm: {
      type: Number,
      default: 0,
    },
    sub: {
      type: Number,
      default: 0,
    },
    actKey: {
      type: String,
      default: "",
    },
    formKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    frameId: {
      type: String,
      default: "",
    },
    latestActivity: {
      type: String,
      default: () => new Date().toUTCString(),
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      default: null,
      index: true,
    },
    pricingPackageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pricing",
      default: null,
    },
    trialStartDate: {
      type: Number,
      default: null,
    },
    trialEndDate: {
      type: Number,
      default: null,
    },
    trialStatus: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Helper method to normalize user role
userSchema.methods.getNormalizedRole = function () {
  if (this.role === "SUPER_ADMIN" || this.role === "sadmin" || this.sadmin === 1) {
    return "SUPER_ADMIN";
  }
  if (this.role === "BRANCH_ADMIN" || this.role === "admin" || this.admin === 1) {
    return "BRANCH_ADMIN";
  }
  return "BRANCH_USER";
};

export const User = mongoose.model("User", userSchema);
