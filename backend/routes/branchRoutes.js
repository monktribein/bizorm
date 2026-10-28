import express from "express";
import {
  getBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
  getBranchDashboardSummary,
} from "../controllers/branchController.js";
import { protect } from "../middleware/auth.js";
import { enforceRoles, enforceWriteAccess } from "../middleware/rbac.js";

const router = express.Router();

router.use(protect);

router.get("/summary", enforceRoles("SUPER_ADMIN", "BRANCH_ADMIN"), getBranchDashboardSummary);
router.get("/", enforceRoles("SUPER_ADMIN", "BRANCH_ADMIN", "BRANCH_USER"), getBranches);
router.get("/:id", enforceRoles("SUPER_ADMIN", "BRANCH_ADMIN", "BRANCH_USER"), getBranchById);
router.post("/", enforceRoles("SUPER_ADMIN", "BRANCH_ADMIN"), enforceWriteAccess, createBranch);
router.put("/:id", enforceRoles("SUPER_ADMIN", "BRANCH_ADMIN"), enforceWriteAccess, updateBranch);
router.delete("/:id", enforceRoles("SUPER_ADMIN", "BRANCH_ADMIN"), enforceWriteAccess, deleteBranch);

export default router;
