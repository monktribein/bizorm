import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import {
  Check,
  Store,
  Building2,
  ShoppingBag,
  ShieldAlert,
  Info,
  HelpCircle,
  Ticket,
  Copy,
  CheckCheck,
  Scissors,
  Sparkles,
  Gift,
  Zap,
  MessageCircle,
  QrCode,
  Plus,
  Minus,
  X,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BUSINESS_PLANS, FRANCHISE_PLANS, MARKETPLACE_PLANS, PRICING_DISCLAIMERS } from "../../constants/plans";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export const PricingSection = ({ hideHeader = false }) => {
  const navigate = useNavigate();
  const { user, reloadProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("business"); // "business" | "enterprise" | "marketplace"
  const [annualBilling, setAnnualBilling] = useState(true);
  const [platformOffers, setPlatformOffers] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);

  // Add-ons & Top-up Quota State
  const [showAddonModal, setShowAddonModal] = useState(false);
  const [addonWhatsappCount, setAddonWhatsappCount] = useState(0);
  const [addonScanCount, setAddonScanCount] = useState(0);
  const [addonBranchCount, setAddonBranchCount] = useState(0);
  const [addonProductCount, setAddonProductCount] = useState(0);
  const [addonPurchasing, setAddonPurchasing] = useState(false);
  const [addonFeedback, setAddonFeedback] = useState(null);

  const addonWhatsappPrice = (addonWhatsappCount / 100) * 99;
  const addonScanPrice = (addonScanCount / 100) * 149;
  const addonBranchPrice = addonBranchCount * 499;
  const addonProductPrice = addonProductCount * 199;
  const totalAddonPrice = Math.round(addonWhatsappPrice + addonScanPrice + addonBranchPrice + addonProductPrice);
  const totalAddonUnits = addonWhatsappCount + addonScanCount + addonBranchCount + addonProductCount;

  const handlePurchaseAddons = async (e) => {
    if (e) e.preventDefault();
    if (totalAddonUnits === 0) {
      alert("Please select at least one add-on item to purchase.");
      return;
    }

    if (!user) {
      // If visitor is not logged in, navigate to registration with selected add-on parameters
      setShowAddonModal(false);
      navigate(
        `/register?type=${
          activeTab === "marketplace" ? "marketplace" : activeTab === "enterprise" ? "multiple" : "single"
        }&addonWsp=${addonWhatsappCount}&addonScans=${addonScanCount}&addonBranches=${addonBranchCount}&addonProducts=${addonProductCount}`
      );
      return;
    }

    setAddonPurchasing(true);
    setAddonFeedback(null);
    try {
      const res = await api.purchaseAddon({
        whatsappCount: addonWhatsappCount,
        scanCount: addonScanCount,
        branchCount: addonBranchCount,
        productCount: addonProductCount,
        totalAmount: totalAddonPrice,
      });
      if (res?.success) {
        setAddonFeedback({
          type: "success",
          message: res.message || "Add-ons activated successfully! Your quotas have been updated.",
        });
        if (reloadProfile) await reloadProfile();
        setTimeout(() => {
          setShowAddonModal(false);
          setAddonWhatsappCount(0);
          setAddonScanCount(0);
          setAddonBranchCount(0);
          setAddonProductCount(0);
          setAddonFeedback(null);
        }, 2200);
      } else {
        setAddonFeedback({
          type: "error",
          message: res.message || "Failed to purchase add-ons",
        });
      }
    } catch (err) {
      setAddonFeedback({
        type: "error",
        message: err.message || "An error occurred while purchasing add-ons",
      });
    } finally {
      setAddonPurchasing(false);
    }
  };

  useEffect(() => {
    api.getPublicPlatformOffers()
      .then((res) => {
        if (res?.success && Array.isArray(res.offers)) {
          setPlatformOffers(res.offers);
        }
      })
      .catch((err) => console.error("Error fetching platform offers:", err));
  }, []);

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const currentPlans =
    activeTab === "business"
      ? BUSINESS_PLANS
      : activeTab === "enterprise"
      ? FRANCHISE_PLANS
      : MARKETPLACE_PLANS;

  return (
    <section
      id="pricing"
      style={{
        padding: hideHeader ? "20px 0 64px" : "64px 0 72px",
        backgroundColor: "#ffffff",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        {/* Section Header */}
        {!hideHeader && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 36px" }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                borderRadius: "9999px",
                backgroundColor: "#eff6ff",
                border: "1px solid #bfdbfe",
                color: "#0052cc",
                fontSize: "12px",
                fontWeight: "700",
                marginBottom: "12px",
              }}
            >
              <span>Subscription &amp; Scan Quota Pricing</span>
            </div>
            <h2
              className="font-outfit"
              style={{
                fontSize: "clamp(26px, 3.5vw, 38px)",
                fontWeight: "900",
                color: "#0f172a",
                lineHeight: 1.2,
                margin: "0 0 10px 0",
              }}
            >
              Plans for Every Business Stage
            </h2>
            <p style={{ fontSize: "15.5px", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
              Transparent pricing based on <strong>valid QR scans</strong> and clear location allowances. No hidden per-review fees.
            </p>
          </motion.div>
        )}

        {/* Category & Billing Toggles */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
          {/* Business vs Enterprise Segment Toggle */}
          <div
            style={{
              display: "inline-flex",
              background: "#f1f5f9",
              padding: "4px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              maxWidth: "100%",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTab("business")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 22px",
                borderRadius: "8px",
                border: "none",
                background: activeTab === "business" ? "#ffffff" : "transparent",
                color: activeTab === "business" ? "#0052cc" : "#64748b",
                fontWeight: "700",
                fontSize: "13.5px",
                cursor: "pointer",
                boxShadow: activeTab === "business" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              <Store size={16} />
              <span>Single Business Locations</span>
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTab("enterprise")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 22px",
                borderRadius: "8px",
                border: "none",
                background: activeTab === "enterprise" ? "#ffffff" : "transparent",
                color: activeTab === "enterprise" ? "#0052cc" : "#64748b",
                fontWeight: "700",
                fontSize: "13.5px",
                cursor: "pointer",
                boxShadow: activeTab === "enterprise" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              <Building2 size={16} />
              <span>Multi-Outlet Franchises &amp; Corporate</span>
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTab("marketplace")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 22px",
                borderRadius: "8px",
                border: "none",
                background: activeTab === "marketplace" ? "#ffffff" : "transparent",
                color: activeTab === "marketplace" ? "#0052cc" : "#64748b",
                fontWeight: "700",
                fontSize: "13.5px",
                cursor: "pointer",
                boxShadow: activeTab === "marketplace" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              <ShoppingBag size={16} />
              <span>Marketplace (Products)</span>
            </motion.button>
          </div>

          {/* Monthly / Annual Billing Toggle & Capacity Add-ons Button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#f8fafc",
                padding: "4px 8px",
                borderRadius: "999px",
                border: "1px solid #e2e8f0",
              }}
            >
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => setAnnualBilling(false)}
                style={{
                  padding: "6px 16px",
                  borderRadius: "999px",
                  border: "none",
                  background: !annualBilling ? "#0052cc" : "transparent",
                  color: !annualBilling ? "#ffffff" : "#475569",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                Monthly Billing
              </motion.button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => setAnnualBilling(true)}
                style={{
                  padding: "6px 16px",
                  borderRadius: "999px",
                  border: "none",
                  background: annualBilling ? "#0052cc" : "transparent",
                  color: annualBilling ? "#ffffff" : "#475569",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.15s ease",
                }}
              >
                <span>Annual Billing</span>
                <span
                  style={{
                    fontSize: "10.5px",
                    background: "#10b981",
                    color: "#ffffff",
                    padding: "1px 7px",
                    borderRadius: "999px",
                    fontWeight: "800",
                  }}
                >
                  SAVE 25% (Carryforward Quotas)
                </span>
              </motion.button>
            </div>

            {/* Capacity Add-ons & Top-up Quota Pill Button */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => setShowAddonModal(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "8px 18px",
                borderRadius: "999px",
                border: "1px solid #7dd3fc",
                background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(2, 132, 199, 0.28)",
                transition: "all 0.15s ease",
              }}
            >
              <Zap size={15} />
              <span>Add-ons &amp; Top-up Quota</span>
              <span
                style={{
                  fontSize: "10px",
                  background: "#ffffff",
                  color: "#0369a1",
                  padding: "1px 7px",
                  borderRadius: "999px",
                  fontWeight: "800",
                }}
              >
                TOP-UP
              </span>
            </motion.button>
          </div>
        </div>

        {/* Active Platform Promotional Coupons Banner */}
        {platformOffers && platformOffers.length > 0 && (
          <div style={{ marginBottom: "36px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #0052cc, #6366f1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                  }}
                >
                  <Ticket size={16} />
                </div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: "800",
                      color: "#0f172a",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>Active Platform Promo Coupons</span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        color: "#059669",
                        backgroundColor: "#ecfdf5",
                        border: "1px solid #a7f3d0",
                        padding: "1px 8px",
                        borderRadius: "999px",
                      }}
                    >
                      Limited Time
                    </span>
                  </h3>
                  <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "#64748b" }}>
                    Copy any code below and paste it during checkout or registration for instant bonus value.
                  </p>
                </div>
              </div>

              {copiedCode && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    backgroundColor: "#ecfdf5",
                    border: "1px solid #a7f3d0",
                    color: "#059669",
                    fontSize: "12.5px",
                    fontWeight: "700",
                  }}
                >
                  <CheckCheck size={15} />
                  <span>Coupon {copiedCode} copied! Paste at checkout.</span>
                </div>
              )}
            </div>

            {/* Coupons Ticket Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
                gap: "16px",
              }}
            >
              {platformOffers.map((offer) => {
                const isFreeBranch = offer.offerType === "FREE_BRANCH";
                const isWspQuota = offer.offerType === "WSP_QUOTA_BOOST";
                const isRateDiscount = offer.offerType === "RATE_DISCOUNT";

                const badgeBg = isFreeBranch
                  ? "linear-gradient(135deg, #059669, #10b981)"
                  : isWspQuota
                  ? "linear-gradient(135deg, #2563eb, #4f46e5)"
                  : isRateDiscount
                  ? "linear-gradient(135deg, #d97706, #f59e0b)"
                  : "linear-gradient(135deg, #7c3aed, #9333ea)";

                const stubText = isFreeBranch
                  ? `+${offer.extraBranches || 1} FREE`
                  : isWspQuota
                  ? `+${(offer.extraWspQuota || 1000).toLocaleString()}`
                  : offer.discountPercent
                  ? `${offer.discountPercent}% OFF`
                  : `₹${offer.discountFlat} OFF`;

                const subStubText = isFreeBranch
                  ? "BRANCH"
                  : isWspQuota
                  ? "WSP SCANS"
                  : "DISCOUNT";

                return (
                  <div
                    key={offer._id || offer.code}
                    style={{
                      position: "relative",
                      display: "flex",
                      backgroundColor: "#ffffff",
                      borderRadius: "14px",
                      border: "1px dashed #cbd5e1",
                      boxShadow: "0 3px 12px rgba(15, 23, 42, 0.04)",
                      overflow: "hidden",
                      minHeight: "116px",
                      transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 18px rgba(0, 82, 204, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 3px 12px rgba(15, 23, 42, 0.04)";
                    }}
                  >
                    {/* Top Scallop Notch */}
                    <div
                      style={{
                        position: "absolute",
                        top: "-8px",
                        left: "105px",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: "#ffffff",
                        border: "1px solid #cbd5e1",
                        zIndex: 3,
                      }}
                    />
                    {/* Bottom Scallop Notch */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "-8px",
                        left: "105px",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: "#ffffff",
                        border: "1px solid #cbd5e1",
                        zIndex: 3,
                      }}
                    />

                    {/* Left Coupon Stub */}
                    <div
                      style={{
                        width: "112px",
                        flexShrink: 0,
                        background: badgeBg,
                        color: "#ffffff",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "12px 8px",
                        textAlign: "center",
                        position: "relative",
                        borderRight: "2px dashed rgba(255, 255, 255, 0.4)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "9px",
                          letterSpacing: "0.08em",
                          fontWeight: "800",
                          textTransform: "uppercase",
                          opacity: 0.9,
                        }}
                      >
                        OFFER
                      </span>
                      <span
                        style={{
                          fontSize: "17px",
                          fontWeight: "900",
                          lineHeight: 1.1,
                          margin: "2px 0",
                        }}
                      >
                        {stubText}
                      </span>
                      <span
                        style={{
                          fontSize: "9.5px",
                          fontWeight: "800",
                          letterSpacing: "0.06em",
                          opacity: 0.95,
                        }}
                      >
                        {subStubText}
                      </span>
                    </div>

                    {/* Right Coupon Body */}
                    <div
                      style={{
                        flex: 1,
                        padding: "12px 14px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minWidth: 0,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: "8px",
                          }}
                        >
                          <h4
                            style={{
                              margin: 0,
                              fontSize: "13.5px",
                              fontWeight: "800",
                              color: "#0f172a",
                              lineHeight: 1.25,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={offer.title}
                          >
                            {offer.title}
                          </h4>
                        </div>
                        <p
                          style={{
                            margin: "3px 0 0",
                            fontSize: "11px",
                            color: "#64748b",
                            lineHeight: 1.35,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                          title={offer.bannerText || offer.terms}
                        >
                          {offer.bannerText || offer.terms}
                        </p>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: "8px",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        {/* Coupon Code Pill */}
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "3px 8px",
                            backgroundColor: "#f1f5f9",
                            border: "1px solid #cbd5e1",
                            borderRadius: "6px",
                            fontFamily: "monospace",
                            fontSize: "12px",
                            fontWeight: "800",
                            color: "#0f172a",
                            letterSpacing: "0.05em",
                          }}
                        >
                          <span>{offer.code}</span>
                        </div>

                        {/* Copy Code & Apply Buttons */}
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(offer.code)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "4px 8px",
                              borderRadius: "6px",
                              border: copiedCode === offer.code ? "1px solid #10b981" : "1px solid #cbd5e1",
                              backgroundColor: copiedCode === offer.code ? "#ecfdf5" : "#ffffff",
                              color: copiedCode === offer.code ? "#059669" : "#334155",
                              fontSize: "11px",
                              fontWeight: "700",
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                            }}
                          >
                            {copiedCode === offer.code ? (
                              <>
                                <CheckCheck size={12} />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>

                          <Link
                            to={`/register?coupon=${offer.code}`}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3px",
                              padding: "4px 9px",
                              borderRadius: "6px",
                              backgroundColor: "#0052cc",
                              color: "#ffffff",
                              fontSize: "11px",
                              fontWeight: "700",
                              textDecoration: "none",
                              transition: "all 0.15s ease",
                            }}
                          >
                            <span>Claim</span>
                            <span>→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4 Cards Grid with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${annualBilling ? "annual" : "monthly"}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
              gap: "24px",
              alignItems: "stretch",
            }}
          >
            {currentPlans.map((plan, idx) => {
              const isNumeric = typeof plan.monthlyPrice === "number";
              const headlinePrice = isNumeric
                ? annualBilling
                  ? `₹${plan.annualPrice.toLocaleString("en-IN")}`
                  : `₹${plan.monthlyPrice.toLocaleString("en-IN")}`
                : "Custom";

              const cycle = isNumeric
                ? annualBilling
                  ? " / year"
                  : " / month"
                : "";

              const effectiveMonthly = isNumeric && annualBilling
                ? Math.round(plan.annualPrice / 12)
                : null;

              const targetLink = plan.isCustomQuote
                ? "/contact?type=enterprise"
                : `/register?plan=${plan.id}&billing=${annualBilling ? "annual" : "monthly"}&type=${activeTab === "marketplace" ? "marketplace" : activeTab === "enterprise" ? "multiple" : "single"}`;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.07, ease: "easeOut" }}
                  whileHover={{
                    y: -8,
                    scale: 1.015,
                    boxShadow: plan.popular
                      ? "0 24px 48px -10px rgba(0, 82, 204, 0.22)"
                      : "0 18px 36px -8px rgba(0, 0, 0, 0.08)",
                  }}
                  style={{
                    background: "#ffffff",
                    borderRadius: "20px",
                    padding: "30px 22px",
                    border: plan.popular ? "2px solid #0052cc" : "1px solid #e2e8f0",
                    boxShadow: plan.popular
                      ? "0 12px 30px rgba(0, 82, 204, 0.14)"
                      : "0 4px 14px rgba(0, 0, 0, 0.04)",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  {plan.popular && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-12px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#0052cc",
                        color: "#ffffff",
                        fontSize: "11px",
                        fontWeight: "800",
                        padding: "3px 14px",
                        borderRadius: "999px",
                        letterSpacing: "0.5px",
                      }}
                    >
                      MOST POPULAR
                    </div>
                  )}

                  <div style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>
                    {plan.packageName}
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b", minHeight: "34px", marginBottom: "16px", lineHeight: 1.4 }}>
                    {plan.tagline}
                  </div>

                  <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: isNumeric ? "4px" : "16px" }}>
                    <span style={{ fontSize: "34px", fontWeight: "900", color: "#0f172a", letterSpacing: "-0.5px" }}>
                      {headlinePrice}
                    </span>
                    <span style={{ fontSize: "14px", color: "#64748b", fontWeight: "700" }}>{cycle}</span>
                  </div>

                  {annualBilling && isNumeric && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginBottom: "14px" }}>
                      <div style={{ fontSize: "12px", color: "#0052cc", fontWeight: "700" }}>
                        Effective ₹{effectiveMonthly.toLocaleString("en-IN")}/mo (Save 25% • 3 Mo. Free)
                      </div>
                      <div style={{ fontSize: "11px", color: "#059669", fontWeight: "700" }}>
                        🔄 100% Unused Quota Carryforward (Jan ➔ Feb Rollover)
                      </div>
                    </div>
                  )}
                  {!annualBilling && isNumeric && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginBottom: "14px" }}>
                      <div style={{ fontSize: "11.5px", color: "#64748b", fontWeight: "600" }}>
                        Billed on monthly renewal
                      </div>
                      <div style={{ fontSize: "11px", color: "#dc2626", fontWeight: "600" }}>
                        ⚠️ Monthly reset (Unused scans expire at month-end)
                      </div>
                    </div>
                  )}

                  {/* Quota Highlights Box */}
                  <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "10px 14px", marginBottom: "18px", border: "1px solid #f1f5f9" }}>
                    <div style={{ fontSize: "13px", fontWeight: "800", color: "#0052cc" }}>
                      🔍 {plan.scansDisplay}
                    </div>
                    <div style={{ fontSize: "12px", color: "#475569", marginTop: "3px", fontWeight: "600" }}>
                      📍 {plan.locationsDisplay}
                    </div>
                    {annualBilling && isNumeric && (
                      <div style={{ fontSize: "11px", color: "#059669", marginTop: "4px", fontWeight: "700" }}>
                        🔄 100% Carryforward Quota Active (Jan ➔ Feb)
                      </div>
                    )}
                    {!annualBilling && isNumeric && (
                      <div style={{ fontSize: "11px", color: "#dc2626", marginTop: "4px", fontWeight: "600" }}>
                        ⚠️ Monthly Reset: No Rollover
                      </div>
                    )}
                  </div>

                  {/* Features List */}
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: "0 0 24px 0",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {plan.features.map((f, i) => {
                      let displayFeature = f;
                      if (f.toLowerCase().includes("scan") && !f.toLowerCase().includes("rollover")) {
                        displayFeature = annualBilling
                          ? `${f} (100% Annual Rollover)`
                          : `${f} (Monthly Reset)`;
                      }
                      return (
                        <li
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "8px",
                            fontSize: "12.5px",
                            color: "#334155",
                            lineHeight: 1.45,
                          }}
                        >
                          <Check size={15} color="#059669" style={{ flexShrink: 0, marginTop: "2px" }} />
                          <span>{displayFeature}</span>
                        </li>
                      );
                    })}
                  </ul>

                  <Link
                    to={targetLink}
                    className={plan.popular ? "btn btn-primary" : "btn btn-outline"}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      fontWeight: "700",
                      fontSize: "13.5px",
                      textAlign: "center",
                      textDecoration: "none",
                      transition: "transform 0.15s ease",
                    }}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* On-Demand Capacity Add-ons Showcase */}
        <div style={{ marginTop: "54px", marginBottom: "40px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "14px",
              marginBottom: "22px",
              paddingBottom: "14px",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  fontWeight: "800",
                  color: "#0284c7",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                <Zap size={14} />
                <span>Flexible Scalability</span>
              </div>
              <h3
                className="font-outfit"
                style={{
                  fontSize: "clamp(22px, 2.5vw, 28px)",
                  fontWeight: "800",
                  color: "#0f172a",
                  margin: "4px 0 0",
                }}
              >
                On-Demand Capacity Add-ons &amp; Top-up
              </h3>
              <p style={{ fontSize: "14px", color: "#64748b", margin: "4px 0 0" }}>
                Top up WhatsApp message credits, scan quotas, physical branches, or product SKUs without jumping to a higher subscription tier.
              </p>
            </div>

            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowAddonModal(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "10px 22px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                color: "#ffffff",
                border: "none",
                fontWeight: "700",
                fontSize: "13.5px",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(2, 132, 199, 0.25)",
              }}
            >
              <Zap size={16} />
              <span>Configure Add-on Top-ups</span>
            </motion.button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
              gap: "20px",
            }}
          >
            {/* Card 1: WhatsApp Top-Up */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                padding: "22px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: "#dcfce7",
                    color: "#16a34a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <MessageCircle size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>WhatsApp Top-Up</div>
                  <div style={{ fontSize: "11px", color: "#16a34a", fontWeight: "700" }}>Multiples of 100 msgs</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "8px" }}>
                <span style={{ fontSize: "28px", fontWeight: "900", color: "#0f172a" }}>₹99</span>
                <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>/ 100 messages</span>
              </div>
              <p style={{ fontSize: "12.5px", color: "#64748b", lineHeight: 1.45, margin: "0 0 16px 0", flex: 1 }}>
                Send official WhatsApp review invitations to verified customers. Re-sending within 12 hours to the same customer deducts 0 quota.
              </p>
              <button
                type="button"
                onClick={() => {
                  setAddonWhatsappCount(200);
                  setShowAddonModal(true);
                }}
                className="btn btn-outline"
                style={{
                  width: "100%",
                  padding: "9px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#16a34a",
                  borderColor: "#86efac",
                }}
              >
                + Add WhatsApp Quota
              </button>
            </div>

            {/* Card 2: Valid Scans */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                padding: "22px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: "#e0f2fe",
                    color: "#0284c7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <QrCode size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>Scanner Quota Booster</div>
                  <div style={{ fontSize: "11px", color: "#0284c7", fontWeight: "700" }}>Multiples of 100 scans</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "8px" }}>
                <span style={{ fontSize: "28px", fontWeight: "900", color: "#0f172a" }}>₹149</span>
                <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>/ 100 scans</span>
              </div>
              <p style={{ fontSize: "12.5px", color: "#64748b", lineHeight: 1.45, margin: "0 0 16px 0", flex: 1 }}>
                Power 300 DPI acrylic standees and direct feedback capture without having to upgrade your entire monthly tier.
              </p>
              <button
                type="button"
                onClick={() => {
                  setAddonScanCount(500);
                  setShowAddonModal(true);
                }}
                className="btn btn-outline"
                style={{
                  width: "100%",
                  padding: "9px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#0284c7",
                  borderColor: "#7dd3fc",
                }}
              >
                + Add Scan Quota
              </button>
            </div>

            {/* Card 3: Multi-Branch */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                padding: "22px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: "#f3e8ff",
                    color: "#7c3aed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Building2 size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>Extra Branch Outlets</div>
                  <div style={{ fontSize: "11px", color: "#7c3aed", fontWeight: "700" }}>Flexible (+1, +2, +3...)</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "8px" }}>
                <span style={{ fontSize: "28px", fontWeight: "900", color: "#0f172a" }}>₹499</span>
                <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>/ branch / month</span>
              </div>
              <p style={{ fontSize: "12.5px", color: "#64748b", lineHeight: 1.45, margin: "0 0 16px 0", flex: 1 }}>
                Scale to new physical locations with individual store manager logins, comparative CSAT benchmarks, and store QR standees.
              </p>
              <button
                type="button"
                onClick={() => {
                  setAddonBranchCount(1);
                  setShowAddonModal(true);
                }}
                className="btn btn-outline"
                style={{
                  width: "100%",
                  padding: "9px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#7c3aed",
                  borderColor: "#c4b5fd",
                }}
              >
                + Add Branch Location
              </button>
            </div>

            {/* Card 4: Product SKUs */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                padding: "22px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: "#ffedd5",
                    color: "#ea580c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>Product SKUs (Marketplace)</div>
                  <div style={{ fontSize: "11px", color: "#ea580c", fontWeight: "700" }}>Flexible (+1, +2, +3...)</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "8px" }}>
                <span style={{ fontSize: "28px", fontWeight: "900", color: "#0f172a" }}>₹199</span>
                <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>/ SKU / month</span>
              </div>
              <p style={{ fontSize: "12.5px", color: "#64748b", lineHeight: 1.45, margin: "0 0 16px 0", flex: 1 }}>
                Issue packaging inserts, defect triage, and automated feedback routing for additional Amazon, Flipkart &amp; Shopify lines.
              </p>
              <button
                type="button"
                onClick={() => {
                  setAddonProductCount(1);
                  setShowAddonModal(true);
                }}
                className="btn btn-outline"
                style={{
                  width: "100%",
                  padding: "9px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#ea580c",
                  borderColor: "#fdba74",
                }}
              >
                + Add Product SKU
              </button>
            </div>
          </div>
        </div>

        {/* Mandatory Commercial Disclaimers Required by Specification */}
        <div
          style={{
            marginTop: "36px",
            padding: "20px 24px",
            background: "#f8fafc",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            fontSize: "12.5px",
            color: "#475569",
            lineHeight: 1.6,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "800", color: "#0f172a", marginBottom: "6px" }}>
            <Info size={16} color="#0052cc" />
            <span>Commercial Terms, Quota Allocation &amp; Compliance Disclosure</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            <li>
              <strong>Proposed Values:</strong> Displayed pricing tables represent proposed configuration values pending commercial sign-off.
            </li>
            <li>
              <strong>Taxes &amp; Carrier Fees:</strong> Prices include applicable 18% GST. WhatsApp / SMS communication triggers carrier charges (~₹1/message) under verified opt-in consent.
            </li>
            <li>
              <strong>Annual Quota Carryforward &amp; 25% Savings:</strong> Annual subscriptions reflect a 25% discount (equivalent to 3 months free). Annual plans feature full Quota Carryforward: unused QR scans, reviews, and WhatsApp quotas roll over automatically from month to month (Jan ➔ Feb) throughout your active subscription. Monthly plans reset each month with no carryforward.
            </li>
            <li>
              <strong>Franchise Pooling:</strong> Franchise scan quotas are pooled across active outlets. Outlets may be added, transferred, or reassigned within tier caps.
            </li>
            <li>
              <strong>Enterprise Entitlements:</strong> Dedicated success managers, custom SLA guarantees, POS/ERP APIs, and private hosting require signed commercial delivery agreements.
            </li>
          </ul>
        </div>
      </div>

      {/* Capacity Add-ons & Quota Top-up Modal */}
      {showAddonModal &&
        createPortal(
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15, 23, 42, 0.72)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              zIndex: 9999,
              animation: "fadeIn 0.2s ease-out",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowAddonModal(false);
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "800px",
                maxHeight: "92vh",
                overflowY: "auto",
                borderRadius: "20px",
                background: "#ffffff",
                boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.4)",
                border: "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  padding: "24px 28px 18px",
                  borderBottom: "1px solid #e2e8f0",
                  background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ffffff",
                        boxShadow: "0 4px 10px rgba(2, 132, 199, 0.3)",
                      }}
                    >
                      <Zap size={20} />
                    </div>
                    <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>
                      Capacity Add-ons &amp; Quota Top-up
                    </h2>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "3px 8px",
                        borderRadius: "999px",
                        background: "#dcfce7",
                        color: "#166534",
                        border: "1px solid #86efac",
                      }}
                    >
                      INSTANT TOP-UP
                    </span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: "1.4" }}>
                    Configure extra WhatsApp message credits, scan quotas, physical branches, or product SKUs. Quotas in multiples of 100 and branches/products in flexible increments (+1, +2, +3...).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddonModal(false)}
                  style={{
                    background: "#f1f5f9",
                    border: "none",
                    borderRadius: "50%",
                    width: "34px",
                    height: "34px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#64748b",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#e2e8f0";
                    e.currentTarget.style.color = "#0f172a";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f1f5f9";
                    e.currentTarget.style.color = "#64748b";
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Feedback Banner */}
              {addonFeedback && (
                <div
                  style={{
                    margin: "18px 28px 0",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: addonFeedback.type === "success" ? "#f0fdf4" : "#fef2f2",
                    border: `1px solid ${addonFeedback.type === "success" ? "#86efac" : "#fca5a5"}`,
                    color: addonFeedback.type === "success" ? "#166534" : "#991b1b",
                    fontSize: "13.5px",
                    fontWeight: "600",
                  }}
                >
                  {addonFeedback.type === "success" ? <CheckCircle2 size={18} color="#16a34a" /> : <ShieldAlert size={18} color="#dc2626" />}
                  <span>{addonFeedback.message}</span>
                </div>
              )}

              {/* Form / Options Content */}
              <form onSubmit={handlePurchaseAddons} style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
                  
                  {/* Option 1: WhatsApp Quota Refill (Multiples of 100) */}
                  <div
                    style={{
                      border: addonWhatsappCount > 0 ? "2px solid #22c55e" : "1px solid #e2e8f0",
                      background: addonWhatsappCount > 0 ? "#f0fdf4" : "#ffffff",
                      borderRadius: "14px",
                      padding: "18px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            background: "#dcfce7",
                            color: "#16a34a",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <MessageCircle size={18} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                            WhatsApp Quota Refill
                          </h4>
                          <span style={{ fontSize: "11px", color: "#64748b" }}>Multiples of 100 msgs • ₹99 / 100</span>
                        </div>
                      </div>
                      <span style={{ fontSize: "14px", fontWeight: "800", color: "#16a34a" }}>
                        ₹{addonWhatsappPrice}
                      </span>
                    </div>

                    <p style={{ fontSize: "12px", color: "#475569", margin: "6px 0 12px", lineHeight: "1.35" }}>
                      Deducts 1 quota per customer message. Re-sending within 12 hours to same customer is free (0 quota deducted).
                    </p>

                    {/* Stepper */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                      <button
                        type="button"
                        onClick={() => setAddonWhatsappCount((c) => Math.max(0, c - 100))}
                        className="btn btn-secondary"
                        style={{ width: "36px", height: "36px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}
                        disabled={addonWhatsappCount <= 0}
                      >
                        <Minus size={15} />
                      </button>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={addonWhatsappCount}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setAddonWhatsappCount(Math.max(0, Math.round(val / 100) * 100));
                        }}
                        style={{
                          flex: 1,
                          textAlign: "center",
                          fontWeight: "800",
                          fontSize: "15px",
                          padding: "6px 10px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          color: "#0f172a",
                          background: "#ffffff",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setAddonWhatsappCount((c) => c + 100)}
                        className="btn btn-secondary"
                        style={{ width: "36px", height: "36px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}
                      >
                        <Plus size={15} />
                      </button>
                    </div>

                    {/* Quick Preset Chips */}
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {[0, 100, 200, 500, 1000].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setAddonWhatsappCount(num)}
                          style={{
                            fontSize: "11px",
                            fontWeight: addonWhatsappCount === num ? "700" : "500",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            border: addonWhatsappCount === num ? "1px solid #16a34a" : "1px solid #cbd5e1",
                            background: addonWhatsappCount === num ? "#16a34a" : "#ffffff",
                            color: addonWhatsappCount === num ? "#ffffff" : "#475569",
                            cursor: "pointer",
                          }}
                        >
                          {num === 0 ? "Clear" : `+${num}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Option 2: QR Scanner / Valid Scans Quota (Multiples of 100) */}
                  <div
                    style={{
                      border: addonScanCount > 0 ? "2px solid #0284c7" : "1px solid #e2e8f0",
                      background: addonScanCount > 0 ? "#f0f9ff" : "#ffffff",
                      borderRadius: "14px",
                      padding: "18px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            background: "#e0f2fe",
                            color: "#0284c7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <QrCode size={18} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                            Scanner / Valid Scans Quota
                          </h4>
                          <span style={{ fontSize: "11px", color: "#64748b" }}>Multiples of 100 scans • ₹149 / 100</span>
                        </div>
                      </div>
                      <span style={{ fontSize: "14px", fontWeight: "800", color: "#0284c7" }}>
                        ₹{addonScanPrice}
                      </span>
                    </div>

                    <p style={{ fontSize: "12px", color: "#475569", margin: "6px 0 12px", lineHeight: "1.35" }}>
                      Power acrylic counter standees, receipt codes, and smart sentiment routing across all platforms.
                    </p>

                    {/* Stepper */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                      <button
                        type="button"
                        onClick={() => setAddonScanCount((c) => Math.max(0, c - 100))}
                        className="btn btn-secondary"
                        style={{ width: "36px", height: "36px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}
                        disabled={addonScanCount <= 0}
                      >
                        <Minus size={15} />
                      </button>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={addonScanCount}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setAddonScanCount(Math.max(0, Math.round(val / 100) * 100));
                        }}
                        style={{
                          flex: 1,
                          textAlign: "center",
                          fontWeight: "800",
                          fontSize: "15px",
                          padding: "6px 10px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          color: "#0f172a",
                          background: "#ffffff",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setAddonScanCount((c) => c + 100)}
                        className="btn btn-secondary"
                        style={{ width: "36px", height: "36px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}
                      >
                        <Plus size={15} />
                      </button>
                    </div>

                    {/* Quick Preset Chips */}
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {[0, 100, 500, 1000, 2000].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setAddonScanCount(num)}
                          style={{
                            fontSize: "11px",
                            fontWeight: addonScanCount === num ? "700" : "500",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            border: addonScanCount === num ? "1px solid #0284c7" : "1px solid #cbd5e1",
                            background: addonScanCount === num ? "#0284c7" : "#ffffff",
                            color: addonScanCount === num ? "#ffffff" : "#475569",
                            cursor: "pointer",
                          }}
                        >
                          {num === 0 ? "Clear" : `+${num}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Option 3: Extra Multi-Branch Locations (+ 1, 2, 3...) */}
                  <div
                    style={{
                      border: addonBranchCount > 0 ? "2px solid #7c3aed" : "1px solid #e2e8f0",
                      background: addonBranchCount > 0 ? "#faf5ff" : "#ffffff",
                      borderRadius: "14px",
                      padding: "18px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            background: "#f3e8ff",
                            color: "#7c3aed",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Building2 size={18} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                            Add Multi-Branch Locations
                          </h4>
                          <span style={{ fontSize: "11px", color: "#64748b" }}>Any count (+1, 2, 3...) • ₹499 / branch</span>
                        </div>
                      </div>
                      <span style={{ fontSize: "14px", fontWeight: "800", color: "#7c3aed" }}>
                        ₹{addonBranchPrice}
                      </span>
                    </div>

                    <p style={{ fontSize: "12px", color: "#475569", margin: "6px 0 12px", lineHeight: "1.35" }}>
                      Unlock additional physical branch management, dedicated territory QR stands, and staff access.
                    </p>

                    {/* Stepper */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                      <button
                        type="button"
                        onClick={() => setAddonBranchCount((c) => Math.max(0, c - 1))}
                        className="btn btn-secondary"
                        style={{ width: "36px", height: "36px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}
                        disabled={addonBranchCount <= 0}
                      >
                        <Minus size={15} />
                      </button>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={addonBranchCount}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setAddonBranchCount(Math.max(0, val));
                        }}
                        style={{
                          flex: 1,
                          textAlign: "center",
                          fontWeight: "800",
                          fontSize: "15px",
                          padding: "6px 10px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          color: "#0f172a",
                          background: "#ffffff",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setAddonBranchCount((c) => c + 1)}
                        className="btn btn-secondary"
                        style={{ width: "36px", height: "36px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}
                      >
                        <Plus size={15} />
                      </button>
                    </div>

                    {/* Quick Preset Chips */}
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {[0, 1, 2, 3, 5, 10].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setAddonBranchCount(num)}
                          style={{
                            fontSize: "11px",
                            fontWeight: addonBranchCount === num ? "700" : "500",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            border: addonBranchCount === num ? "1px solid #7c3aed" : "1px solid #cbd5e1",
                            background: addonBranchCount === num ? "#7c3aed" : "#ffffff",
                            color: addonBranchCount === num ? "#ffffff" : "#475569",
                            cursor: "pointer",
                          }}
                        >
                          {num === 0 ? "Clear" : `+${num} ${num === 1 ? "branch" : "branches"}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Option 4: Extra Product SKUs (Marketplace) (+ 1, 2, 3...) */}
                  <div
                    style={{
                      border: addonProductCount > 0 ? "2px solid #ea580c" : "1px solid #e2e8f0",
                      background: addonProductCount > 0 ? "#fff7ed" : "#ffffff",
                      borderRadius: "14px",
                      padding: "18px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            background: "#ffedd5",
                            color: "#ea580c",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ShoppingBag size={18} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                            Add Marketplace Product SKUs
                          </h4>
                          <span style={{ fontSize: "11px", color: "#64748b" }}>Any count (+1, 2, 3...) • ₹199 / SKU</span>
                        </div>
                      </div>
                      <span style={{ fontSize: "14px", fontWeight: "800", color: "#ea580c" }}>
                        ₹{addonProductPrice}
                      </span>
                    </div>

                    <p style={{ fontSize: "12px", color: "#475569", margin: "6px 0 12px", lineHeight: "1.35" }}>
                      Track Amazon, Flipkart &amp; Shopify product packaging inserts, defect clustering, and CSAT scores.
                    </p>

                    {/* Stepper */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                      <button
                        type="button"
                        onClick={() => setAddonProductCount((c) => Math.max(0, c - 1))}
                        className="btn btn-secondary"
                        style={{ width: "36px", height: "36px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}
                        disabled={addonProductCount <= 0}
                      >
                        <Minus size={15} />
                      </button>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={addonProductCount}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setAddonProductCount(Math.max(0, val));
                        }}
                        style={{
                          flex: 1,
                          textAlign: "center",
                          fontWeight: "800",
                          fontSize: "15px",
                          padding: "6px 10px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          color: "#0f172a",
                          background: "#ffffff",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setAddonProductCount((c) => c + 1)}
                        className="btn btn-secondary"
                        style={{ width: "36px", height: "36px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}
                      >
                        <Plus size={15} />
                      </button>
                    </div>

                    {/* Quick Preset Chips */}
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {[0, 1, 3, 5, 10].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setAddonProductCount(num)}
                          style={{
                            fontSize: "11px",
                            fontWeight: addonProductCount === num ? "700" : "500",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            border: addonProductCount === num ? "1px solid #ea580c" : "1px solid #cbd5e1",
                            background: addonProductCount === num ? "#ea580c" : "#ffffff",
                            color: addonProductCount === num ? "#ffffff" : "#475569",
                            cursor: "pointer",
                          }}
                        >
                          {num === 0 ? "Clear" : `+${num} ${num === 1 ? "SKU" : "SKUs"}`}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Summary & Checkout Footer */}
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Total Selected Add-on Investment
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                      <span style={{ fontSize: "26px", fontWeight: "900", color: "#0f172a" }}>
                        ₹{totalAddonPrice.toLocaleString()}
                      </span>
                      <span style={{ fontSize: "12.5px", color: "#64748b", fontWeight: "600" }}>
                        ({totalAddonUnits} units configured)
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={() => setShowAddonModal(false)}
                      className="btn btn-secondary"
                      disabled={addonPurchasing}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={addonPurchasing || totalAddonPrice <= 0}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        background: totalAddonPrice > 0 ? "linear-gradient(135deg, #0284c7, #0369a1)" : "#94a3b8",
                        border: "none",
                        boxShadow: totalAddonPrice > 0 ? "0 4px 14px rgba(2, 132, 199, 0.3)" : "none",
                        padding: "10px 22px",
                        borderRadius: "10px",
                        fontWeight: "700",
                        cursor: totalAddonPrice > 0 ? "pointer" : "not-allowed",
                      }}
                    >
                      {addonPurchasing ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Activating Add-ons...</span>
                        </>
                      ) : (
                        <>
                          <Zap size={16} />
                          <span>{user ? "Instant Top-Up & Activate" : "Proceed with Add-on Units"}</span>
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};

export default PricingSection;
