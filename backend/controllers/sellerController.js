import { Product } from "../models/Product.js";
import { ProductFeedback } from "../models/ProductFeedback.js";
import { logger } from "../utils/logger.js";

// Helper to determine compliance profile defaults per channel
const getChannelComplianceDefaults = (channel) => {
  switch (channel) {
    case "AMAZON":
      return {
        channel: "AMAZON",
        neutralReviewPrompt: true,
        allowDirectSupport: true,
        warrantyRegistrationEnabled: true,
        insertPolicyNote: "Amazon Packaging Policy: Neutral review invitation & direct warranty/product support.",
      };
    case "FLIPKART":
      return {
        channel: "FLIPKART",
        neutralReviewPrompt: true,
        allowDirectSupport: true,
        warrantyRegistrationEnabled: true,
        insertPolicyNote: "Flipkart Seller Guidelines: Post-delivery feedback and brand warranty support.",
      };
    case "SHOPIFY_D2C":
      return {
        channel: "SHOPIFY_D2C",
        neutralReviewPrompt: false,
        allowDirectSupport: true,
        warrantyRegistrationEnabled: true,
        insertPolicyNote: "D2C Direct: Full customer support, repeat order perks & VIP community invites.",
      };
    case "SWIGGY_ZOMATO":
      return {
        channel: "SWIGGY_ZOMATO",
        neutralReviewPrompt: false,
        allowDirectSupport: true,
        warrantyRegistrationEnabled: false,
        insertPolicyNote: "Quick Food Delivery: Packaging, freshness, preparation & delivery time feedback.",
      };
    case "MEESHO":
      return {
        channel: "MEESHO",
        neutralReviewPrompt: true,
        allowDirectSupport: true,
        warrantyRegistrationEnabled: true,
        insertPolicyNote: "Meesho Merchant: Defect reporting & return mitigation intelligence.",
      };
    default:
      return {
        channel: "GENERAL",
        neutralReviewPrompt: true,
        allowDirectSupport: true,
        warrantyRegistrationEnabled: true,
        insertPolicyNote: "Standard Marketplace & D2C Compliance Profile.",
      };
  }
};

// Seed default products for demonstration if a seller account has zero products
const ensureSeedProducts = async (userId, brandName = "BizORM Seller") => {
  const existingCount = await Product.countDocuments({ userId });
  if (existingCount > 0) return;

  const seeds = [
    {
      name: "Stainless Steel Water Bottle (1000ml)",
      sku: "WB-1001",
      category: "Home & Kitchen",
      channel: "AMAZON",
      brandName: brandName || "AquaPure Gear",
      qrType: "SKU",
      qrCodeKey: `wb1001_${userId.toString().slice(-4)}`,
      warrantyMonths: 24,
      stats: { totalScans: 142, totalFeedback: 38, avgScore: 4.8, defectsReported: 2 },
      complianceProfile: getChannelComplianceDefaults("AMAZON"),
    },
    {
      name: "UltraBass ANC Wireless Earbuds",
      sku: "EAR-302",
      category: "Electronics",
      channel: "FLIPKART",
      brandName: brandName || "SoundPulse Tech",
      qrType: "SKU",
      qrCodeKey: `ear302_${userId.toString().slice(-4)}`,
      warrantyMonths: 12,
      stats: { totalScans: 98, totalFeedback: 24, avgScore: 4.6, defectsReported: 3 },
      complianceProfile: getChannelComplianceDefaults("FLIPKART"),
    },
    {
      name: "Cold-Pressed Organic Sweet Almond Oil (200ml)",
      sku: "ALM-500",
      category: "Beauty & Wellness",
      channel: "SHOPIFY_D2C",
      brandName: brandName || "NaturaGlow Organics",
      qrType: "BATCH",
      batchNumber: "LOT-2026-04B",
      qrCodeKey: `alm500_${userId.toString().slice(-4)}`,
      warrantyMonths: 6,
      stats: { totalScans: 64, totalFeedback: 19, avgScore: 4.9, defectsReported: 0 },
      complianceProfile: getChannelComplianceDefaults("SHOPIFY_D2C"),
    },
  ];

  for (const s of seeds) {
    const prod = await Product.create({ ...s, userId });
    // Seed 1 sample complaint for demonstration
    if (s.sku === "WB-1001") {
      await ProductFeedback.create({
        productId: prod._id,
        userId,
        sku: prod.sku,
        productName: prod.name,
        rating: 3,
        aspects: { quality: 4, packaging: 2, delivery: 3, valueForMoney: 4 },
        tags: ["Packaging", "Product Defect"],
        isDefect: true,
        defectCategory: "PACKAGING_DEFECT",
        comment: "The outer cardboard box arrived crushed during transit. The cap had a minor dent.",
        customerName: "Rahul Sharma",
        customerEmail: "rahul.s@example.com",
        customerPhone: "9876543210",
        orderId: "OD4098218942",
        channel: "AMAZON",
        status: "INVESTIGATING",
        resolutionNotes: "Replacement lid dispatched to customer under express warranty.",
      });
    }
  }
};

// 1. Get all products for logged-in seller
export const getProducts = async (req, res) => {
  try {
    const brand = req.user?.cmpy || req.user?.fname || "My Seller Brand";
    await ensureSeedProducts(req.user._id, brand);

    const products = await Product.find({ userId: req.user._id, status: "ACTIVE" }).sort({ createdAt: -1 });
    return res.json({ success: true, count: products.length, products });
  } catch (error) {
    logger.error(`Error in getProducts: ${error.message}`);
    return res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
};

// 2. Create product & SKU QR
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      category = "General",
      channel = "AMAZON",
      brandName,
      imageUrl = "",
      qrType = "SKU",
      batchNumber = "",
      warrantyMonths = 12,
      marketplaceProductUrl = "",
    } = req.body;

    if (!name || !sku) {
      return res.status(400).json({ success: false, message: "Product Name and SKU are required" });
    }

    const cleanSku = sku.trim().toUpperCase();
    const existing = await Product.findOne({ userId: req.user._id, sku: cleanSku, status: "ACTIVE" });
    if (existing) {
      return res.status(400).json({ success: false, message: `SKU '${cleanSku}' already exists in your catalogue` });
    }

    const slug = cleanSku.toLowerCase().replace(/[^a-z0-9]/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const qrCodeKey = `pr_${slug}_${randomSuffix}`;

    const product = await Product.create({
      userId: req.user._id,
      name: name.trim(),
      sku: cleanSku,
      category,
      channel,
      brandName: brandName || req.user?.cmpy || "My Brand",
      imageUrl,
      qrType,
      batchNumber,
      warrantyMonths: Number(warrantyMonths) || 12,
      marketplaceProductUrl,
      qrCodeKey,
      complianceProfile: getChannelComplianceDefaults(channel),
    });

    return res.status(201).json({ success: true, product, message: "Product and SKU QR code registered successfully" });
  } catch (error) {
    logger.error(`Error in createProduct: ${error.message}`);
    return res.status(500).json({ success: false, message: error.message || "Failed to create product" });
  }
};

// 3. Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.channel) {
      updates.complianceProfile = getChannelComplianceDefaults(updates.channel);
    }

    const product = await Product.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { $set: updates },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.json({ success: true, product, message: "Product updated successfully" });
  } catch (error) {
    logger.error(`Error in updateProduct: ${error.message}`);
    return res.status(500).json({ success: false, message: "Failed to update product" });
  }
};

// 4. Archive product
export const archiveProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { $set: { status: "ARCHIVED" } },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    return res.json({ success: true, message: "Product archived" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to archive product" });
  }
};

// 5. Aggregated Seller Analytics
export const getSellerAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const products = await Product.find({ userId, status: "ACTIVE" });

    let totalScans = 0;
    let totalFeedback = 0;
    let totalScoreSum = 0;
    let totalDefects = 0;

    products.forEach((p) => {
      totalScans += p.stats?.totalScans || 0;
      totalFeedback += p.stats?.totalFeedback || 0;
      totalScoreSum += (p.stats?.avgScore || 0) * (p.stats?.totalFeedback || 0);
      totalDefects += p.stats?.defectsReported || 0;
    });

    const avgScore = totalFeedback > 0 ? (totalScoreSum / totalFeedback).toFixed(1) : "5.0";
    const defectRate = totalFeedback > 0 ? ((totalDefects / totalFeedback) * 100).toFixed(1) : "0.0";

    // Defect clusters
    const defectCategories = await ProductFeedback.aggregate([
      { $match: { userId, isDefect: true } },
      { $group: { _id: "$defectCategory", count: { $sum: 1 } } },
    ]);

    // Complaints count
    const openComplaintsCount = await ProductFeedback.countDocuments({
      userId,
      isDefect: true,
      status: { $in: ["NEW", "INVESTIGATING"] },
    });

    return res.json({
      success: true,
      analytics: {
        totalProducts: products.length,
        totalScans,
        totalFeedback,
        avgScore: Number(avgScore),
        defectRate: Number(defectRate),
        totalDefects,
        openComplaintsCount,
        defectCategories,
      },
    });
  } catch (error) {
    logger.error(`Error in getSellerAnalytics: ${error.message}`);
    return res.status(500).json({ success: false, message: "Failed to fetch analytics" });
  }
};

// 6. Complaints & Defect Tracking
export const getComplaints = async (req, res) => {
  try {
    const { status, sku } = req.query;
    const query = { userId: req.user._id, isDefect: true };
    if (status && status !== "ALL") query.status = status;
    if (sku && sku !== "ALL") query.sku = sku;

    const complaints = await ProductFeedback.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, count: complaints.length, complaints });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch complaints" });
  }
};

// 7. Update Complaint Status
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionNotes } = req.body;

    const feedback = await ProductFeedback.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      {
        $set: {
          status,
          resolutionNotes,
          ...(status === "RESOLVED" || status === "CLOSED" ? { resolvedAt: new Date() } : {}),
        },
      },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    return res.json({ success: true, feedback, message: "Complaint status updated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update complaint" });
  }
};

// 8. PUBLIC: Get Product Information for QR Scan
export const getPublicProductByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const product = await Product.findOne({ qrCodeKey: code, status: "ACTIVE" }).populate("userId", "cmpy fname lname cmpyLogo");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "This product QR code is inactive, invalid or expired.",
      });
    }

    // Increment scan count atomically
    await Product.findByIdAndUpdate(product._id, { $inc: { "stats.totalScans": 1 } });

    return res.json({
      success: true,
      product: {
        _id: product._id,
        name: product.name,
        sku: product.sku,
        category: product.category,
        channel: product.channel,
        brandName: product.brandName || product.userId?.cmpy || "Verified Seller",
        brandLogo: product.userId?.cmpyLogo || "",
        imageUrl: product.imageUrl,
        qrType: product.qrType,
        batchNumber: product.batchNumber,
        warrantyMonths: product.warrantyMonths,
        marketplaceProductUrl: product.marketplaceProductUrl,
        complianceProfile: product.complianceProfile,
      },
    });
  } catch (error) {
    logger.error(`Error in getPublicProductByCode: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server error resolving product QR" });
  }
};

// 9. PUBLIC: Submit Product Feedback / Experience Review
export const submitPublicFeedback = async (req, res) => {
  try {
    const { code } = req.params;
    const {
      rating,
      aspects = {},
      tags = [],
      isDefect = false,
      defectCategory = "NONE",
      comment = "",
      customerName = "Anonymous Customer",
      customerEmail = "",
      customerPhone = "",
      orderId = "",
    } = req.body;

    const product = await Product.findOne({ qrCodeKey: code, status: "ACTIVE" });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const cleanRating = Math.max(1, Math.min(5, Number(rating) || 5));
    const isDefectCalculated = isDefect || cleanRating <= 3 || defectCategory !== "NONE";

    const feedback = await ProductFeedback.create({
      productId: product._id,
      userId: product.userId,
      sku: product.sku,
      productName: product.name,
      rating: cleanRating,
      aspects: {
        quality: aspects.quality || cleanRating,
        packaging: aspects.packaging || cleanRating,
        delivery: aspects.delivery || cleanRating,
        valueForMoney: aspects.valueForMoney || cleanRating,
      },
      tags: Array.isArray(tags) ? tags : [],
      isDefect: isDefectCalculated,
      defectCategory: isDefectCalculated ? defectCategory || "PRODUCT_DAMAGED" : "NONE",
      comment: (comment || "").trim(),
      customerName: (customerName || "").trim() || "Customer",
      customerEmail: (customerEmail || "").trim(),
      customerPhone: (customerPhone || "").trim(),
      orderId: (orderId || "").trim(),
      batchNumber: product.batchNumber,
      channel: product.channel,
      status: isDefectCalculated ? "NEW" : "CLOSED",
    });

    // Update Product stats
    const currentScans = product.stats?.totalScans || 1;
    const currentFeedback = (product.stats?.totalFeedback || 0) + 1;
    const currentScore = product.stats?.avgScore || 0;
    const newAvg = Number(((currentScore * (currentFeedback - 1) + cleanRating) / currentFeedback).toFixed(1));
    const newDefects = (product.stats?.defectsReported || 0) + (isDefectCalculated ? 1 : 0);

    await Product.findByIdAndUpdate(product._id, {
      $set: {
        "stats.totalFeedback": currentFeedback,
        "stats.avgScore": newAvg,
        "stats.defectsReported": newDefects,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Thank you for sharing your product feedback!",
      isPositive: cleanRating >= 4,
      isDefect: isDefectCalculated,
      feedbackId: feedback._id,
    });
  } catch (error) {
    logger.error(`Error in submitPublicFeedback: ${error.message}`);
    return res.status(500).json({ success: false, message: "Failed to submit feedback" });
  }
};
