import express from "express";
import {
  getPlans,
  seedPlans,
  getActivePricingPackages,
  getPricingPackages,
  createPricingPackage,
  updatePricingPackage,
  deletePricingPackage,
  selectUserPlan,
  requestCustomQuote,
} from "../controllers/planController.js";
import { protect } from "../middleware/auth.js";
import { enforceRoles, enforceWriteAccess } from "../middleware/rbac.js";

const router = express.Router();

// Public
router.get("/pricing/active", getActivePricingPackages);
router.post("/pricing/custom-quote", requestCustomQuote);

// Protected
router.use(protect);
router.get("/", enforceRoles("SUPER_ADMIN", "BRANCH_ADMIN", "BRANCH_USER"), getPlans);
router.post("/seed", enforceRoles("SUPER_ADMIN"), enforceWriteAccess, seedPlans);

router.get("/pricing", enforceRoles("SUPER_ADMIN", "BRANCH_ADMIN", "BRANCH_USER"), getPricingPackages);
router.post("/pricing", enforceRoles("SUPER_ADMIN"), enforceWriteAccess, createPricingPackage);
router.put("/pricing/:id", enforceRoles("SUPER_ADMIN"), enforceWriteAccess, updatePricingPackage);
router.delete("/pricing/:id", enforceRoles("SUPER_ADMIN"), enforceWriteAccess, deletePricingPackage);
router.post("/pricing/select/:packageId", enforceRoles("SUPER_ADMIN", "BRANCH_ADMIN", "BRANCH_USER"), selectUserPlan);
router.post("/select/:packageId", enforceRoles("SUPER_ADMIN", "BRANCH_ADMIN", "BRANCH_USER"), selectUserPlan);

export default router;
