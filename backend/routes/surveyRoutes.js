import express from "express";
import {
  getActiveQuestions,
  getAllQuestions,
  createQuestion,
  updateQuestion,
  reorderQuestions,
  deleteQuestion,
  submitSurvey,
  getSurveyAnalytics,
  seedQuestions,
} from "../controllers/surveyController.js";
import { protect } from "../middleware/auth.js";
import { enforceRoles, enforceWriteAccess } from "../middleware/rbac.js";

const router = express.Router();

// Public
router.get("/active", getActiveQuestions);
router.post("/submit", submitSurvey);

// Protected
router.use(protect);
router.get("/analytics", enforceRoles("SUPER_ADMIN", "BRANCH_ADMIN", "BRANCH_USER"), getSurveyAnalytics);
router.get("/all", enforceRoles("SUPER_ADMIN"), getAllQuestions);
router.post("/", enforceRoles("SUPER_ADMIN"), enforceWriteAccess, createQuestion);
router.put("/reorder", enforceRoles("SUPER_ADMIN"), enforceWriteAccess, reorderQuestions);
router.put("/:id", enforceRoles("SUPER_ADMIN"), enforceWriteAccess, updateQuestion);
router.delete("/:id", enforceRoles("SUPER_ADMIN"), enforceWriteAccess, deleteQuestion);
router.post("/seed", enforceRoles("SUPER_ADMIN"), enforceWriteAccess, seedQuestions);

export default router;
