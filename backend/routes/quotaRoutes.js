import express from "express";
import { getUserQuota, checkQuotaStatus, updateQuota } from "../controllers/quotaController.js";
import { protect } from "../middleware/auth.js";
import { enforceRoles, enforceWriteAccess } from "../middleware/rbac.js";

const router = express.Router();

// Public check
router.get("/status/:formKey", checkQuotaStatus);

// Protected
router.use(protect);
router.get("/user/:userId?", getUserQuota);
router.put("/:id", enforceRoles("SUPER_ADMIN"), enforceWriteAccess, updateQuota);

export default router;
