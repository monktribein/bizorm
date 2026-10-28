import express from "express";
import { getSettings, updateSettings } from "../controllers/settingController.js";
import { protect } from "../middleware/auth.js";
import { enforceRoles, enforceWriteAccess } from "../middleware/rbac.js";

const router = express.Router();

router.get("/", getSettings);
router.put("/", protect, enforceRoles("SUPER_ADMIN"), enforceWriteAccess, updateSettings);

export default router;
