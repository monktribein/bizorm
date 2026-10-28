import express from "express";
import {
  logReviewInvite,
  getReviewInvites,
  recordFollowUp,
  deleteInvite,
} from "../controllers/inviteController.js";
import { protect } from "../middleware/auth.js";
import { enforceRoles } from "../middleware/rbac.js";

const router = express.Router();

router.use(protect);

router.post("/", enforceRoles("SUPER_ADMIN", "BRANCH_ADMIN", "BRANCH_USER"), logReviewInvite);
router.get("/", enforceRoles("SUPER_ADMIN", "BRANCH_ADMIN", "BRANCH_USER"), getReviewInvites);
router.post("/:id/follow-up", enforceRoles("SUPER_ADMIN", "BRANCH_ADMIN", "BRANCH_USER"), recordFollowUp);
router.delete("/:id", enforceRoles("SUPER_ADMIN", "BRANCH_ADMIN"), deleteInvite);

export default router;
