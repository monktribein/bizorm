import express from "express";
import {
  createRazorpayOrder,
  verifyPayment,
  getTransactions,
} from "../controllers/transactionController.js";
import { protect } from "../middleware/auth.js";
import { enforceRoles, enforceWriteAccess } from "../middleware/rbac.js";

const router = express.Router();

router.use(protect);

router.post("/order", enforceWriteAccess, createRazorpayOrder);
router.post("/verify", enforceWriteAccess, verifyPayment);
router.get("/", enforceRoles("SUPER_ADMIN", "BRANCH_ADMIN", "BRANCH_USER"), getTransactions);

export default router;
