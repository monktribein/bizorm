import express from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  archiveProduct,
  getSellerAnalytics,
  getComplaints,
  updateComplaintStatus,
  getPublicProductByCode,
  submitPublicFeedback,
} from "../controllers/sellerController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public QR Scan & Product Feedback Endpoints
router.get("/public/product/:code", getPublicProductByCode);
router.post("/public/feedback/:code", submitPublicFeedback);

// Protected Seller Workspace Endpoints
router.use(protect);

router.route("/products").get(getProducts).post(createProduct);
router.route("/products/:id").put(updateProduct).delete(archiveProduct);

router.get("/analytics", getSellerAnalytics);
router.get("/complaints", getComplaints);
router.patch("/complaints/:id", updateComplaintStatus);

export default router;
