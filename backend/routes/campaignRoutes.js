import express from "express";
import {
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getCampaignAudience,
  sendCampaignOffer,
  getPublicVoucher,
  getPublicPlatformOffers,
  validatePlatformOffer,
  getAdminPlatformOffers,
  createAdminPlatformOffer,
  updateAdminPlatformOffer,
  deleteAdminPlatformOffer,
} from "../controllers/campaignController.js";
import { protect } from "../middleware/auth.js";
import { enforceRoles } from "../middleware/rbac.js";

const router = express.Router();

// Public: View voucher by coupon code
router.get("/voucher/:code", getPublicVoucher);

// Public: View active SaaS platform offers & validate coupon at checkout
router.get("/platform-offers", getPublicPlatformOffers);
router.post("/platform-offers/validate", validatePlatformOffer);

// Protected routes (Tenant Admin / Staff)
router.use(protect);

router.route("/").get(getCampaigns).post(createCampaign);
router.route("/:id").put(updateCampaign).delete(deleteCampaign);
router.get("/audience/customers", getCampaignAudience);
router.post("/:campaignId/send", sendCampaignOffer);

// Super Admin: SaaS platform coupon promo management
router.get("/admin/platform-offers", enforceRoles("SUPER_ADMIN"), getAdminPlatformOffers);
router.post("/admin/platform-offers", enforceRoles("SUPER_ADMIN"), createAdminPlatformOffer);
router.put("/admin/platform-offers/:id", enforceRoles("SUPER_ADMIN"), updateAdminPlatformOffer);
router.delete("/admin/platform-offers/:id", enforceRoles("SUPER_ADMIN"), deleteAdminPlatformOffer);

export default router;

