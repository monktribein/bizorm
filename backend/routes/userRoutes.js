import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  checkDuplicates,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import { enforceRoles, enforceWriteAccess } from "../middleware/rbac.js";

const router = express.Router();

router.get("/check-duplicate", checkDuplicates);

router.use(protect);

router.get("/", enforceRoles("SUPER_ADMIN", "BRANCH_ADMIN", "BRANCH_USER"), getUsers);
router.post("/", enforceRoles("SUPER_ADMIN", "BRANCH_ADMIN"), enforceWriteAccess, createUser);
router.put("/:id", enforceRoles("SUPER_ADMIN", "BRANCH_ADMIN"), enforceWriteAccess, updateUser);
router.delete("/:id", enforceRoles("SUPER_ADMIN"), enforceWriteAccess, deleteUser);

export default router;
