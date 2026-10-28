import express from "express";
import { getActivityLogs, clearActivityLogs } from "../controllers/activityController.js";
import { protect } from "../middleware/auth.js";
import { enforceRoles, enforceWriteAccess } from "../middleware/rbac.js";

const router = express.Router();

router.use(protect);

router.get("/", enforceRoles("SUPER_ADMIN", "BRANCH_ADMIN", "BRANCH_USER"), getActivityLogs);
router.delete("/", enforceRoles("SUPER_ADMIN"), enforceWriteAccess, clearActivityLogs);

export default router;
