import express from "express";
import {
  getPlatforms,
  createPlatform,
  updatePlatform,
  deletePlatform,
} from "../controllers/platformController.js";
import { protect } from "../middleware/auth.js";
import { enforceRoles, enforceWriteAccess } from "../middleware/rbac.js";

const router = express.Router();

router.use(protect);

router.get("/", enforceRoles("SUPER_ADMIN", "BRANCH_ADMIN", "BRANCH_USER"), getPlatforms);
router.post("/", enforceRoles("SUPER_ADMIN", "BRANCH_ADMIN"), enforceWriteAccess, createPlatform);
router.put("/:id", enforceRoles("SUPER_ADMIN", "BRANCH_ADMIN"), enforceWriteAccess, updatePlatform);
router.delete("/:id", enforceRoles("SUPER_ADMIN", "BRANCH_ADMIN"), enforceWriteAccess, deletePlatform);

export default router;
