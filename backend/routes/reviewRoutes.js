import express from "express";
import {
  saveRating,
  getReviews,
  getReviewStats,
  generateReviewText,
  getPublicReviewContext,
  getPublicPositiveReviews,
  getLandingTestimonials,
  updateReviewStatus,
} from "../controllers/reviewController.js";
import { protect, optionalAuth } from "../middleware/auth.js";
import { enforceRoles } from "../middleware/rbac.js";

const router = express.Router();

// Public routes for customer review page & embed widgets
router.get("/landing-testimonials", getLandingTestimonials);
router.get("/context/:formKey", getPublicReviewContext);
router.get("/public/:formKey", getPublicPositiveReviews);
router.post("/rating", saveRating);
router.post("/rate", saveRating);
router.post("/generate-text", generateReviewText);

// Protected routes for dashboard
router.use(protect);
router.get("/", enforceRoles("SUPER_ADMIN", "BRANCH_ADMIN", "BRANCH_USER"), getReviews);
router.get("/stats", enforceRoles("SUPER_ADMIN", "BRANCH_ADMIN", "BRANCH_USER"), getReviewStats);
router.put("/:id/status", enforceRoles("SUPER_ADMIN", "BRANCH_ADMIN", "BRANCH_USER"), updateReviewStatus);

export default router;
