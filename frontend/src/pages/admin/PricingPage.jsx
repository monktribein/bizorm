import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { BUSINESS_PLANS, FRANCHISE_PLANS, PRICING_DISCLAIMERS } from "../../constants/plans";
import {
  CreditCard,
  Plus,
  Check,
  Trash2,
  Edit2,
  Building2,
  Layers,
  ShoppingBag,
  Package,
  Send,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  Star,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Zap,
  X,
  Award,
  MoreHorizontal,
} from "lucide-react";

export const PricingPage = () => {
  const { user, reloadProfile, isSuperAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(
    tabParam === "multiple" || tabParam === "marketplace" ? tabParam : "single"
  );
  const [annualBilling, setAnnualBilling] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectingPlanId, setSelectingPlanId] = useState(null);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error' | 'info', message: '' }
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Custom Quote State
  const [submittingCustom, setSubmittingCustom] = useState(false);
  const [customForm, setCustomForm] = useState({
    businessName: "",
    name: "",
    email: "",
    phone: "",
    productsCount: "100+",
    monthlyReviews: "10000+",
    message: "",
  });

  // Form State (Admin)
  const [packageName, setPackageName] = useState("");
  const [businessType, setBusinessType] = useState("single");
  const [category, setCategory] = useState("Standard");
  const [price, setPrice] = useState(999);
  const [billingType, setBillingType] = useState("Monthly");
  const [reviewLimit, setReviewLimit] = useState(500);
  const [productsLimit, setProductsLimit] = useState(0);
  const [maxBusinesses, setMaxBusinesses] = useState(1);
  const [extraBizPrice, setExtraBizPrice] = useState(0);
  const [popularBadge, setPopularBadge] = useState(false);
  const [isCustomQuote, setIsCustomQuote] = useState(false);
  const [featuresList, setFeaturesList] = useState([]);
  const [featureInput, setFeatureInput] = useState("");
  const [status, setStatus] = useState("active");

  const currentActivePlanId = user?.pricingPackageId?._id || user?.pricingPackageId;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const loadPackages = async () => {
    setLoading(true);
    try {
      const res = await api.getPricingPackages();
      if (res.success) setPackages(res.packages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleSelectPlan = async (pkg) => {
    if (selectingPlanId) return;
    if (currentActivePlanId && String(currentActivePlanId) === String(pkg._id)) {
      setFeedback({
        type: "info",
        message: `"${pkg.packageName}" is already your active subscription plan.`,
      });
      return;
    }

    setSelectingPlanId(pkg._id);
    setFeedback(null);
    try {
      const res = await api.selectPlan(pkg._id);
      if (res.success) {
        setFeedback({
          type: "success",
          message: `✓ Successfully activated "${pkg.packageName}"! Review limit (${pkg.reviewLimit || 500} reviews) & WhatsApp quotas updated.`,
        });
        if (reloadProfile) await reloadProfile();
        await loadPackages();
      } else {
        setFeedback({
          type: "error",
          message: res.message || "Failed to activate plan",
        });
      }
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.message || "An error occurred while activating plan",
      });
    } finally {
      setSelectingPlanId(null);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setPackageName("");
    setBusinessType(activeTab);
    setCategory("Standard");
    setPrice(activeTab === "multiple" ? 7999 : activeTab === "marketplace" ? 2499 : 299);
    setBillingType("Monthly");
    setReviewLimit(activeTab === "multiple" ? 25000 : 100);
    setProductsLimit(activeTab === "marketplace" ? 5 : 0);
    setMaxBusinesses(activeTab === "multiple" ? 10 : 1);
    setExtraBizPrice(0);
    setPopularBadge(false);
    setIsCustomQuote(false);
    setFeaturesList(
      activeTab === "marketplace"
        ? [
            "5 Products / SKUs Included",
            "1,000 Valid Scans / Monthly Quota",
            "Product-Specific QR Landing Pages",
            "Direct Redirect to Google & Marketplace Reviews",
          ]
        : [
            "Branded QR Feedback Standee (300 DPI)",
            "Multi-Platform Review Integrations (20+)",
            "Real-Time Manager Complaint Desk & Alerts",
          ]
    );
    setStatus("active");
    setShowModal(true);
  };

  const handleOpenEditModal = (pkg) => {
    setEditingId(pkg._id);
    setPackageName(pkg.packageName);
    setBusinessType(pkg.businessType || "single");
    setCategory(pkg.category || "Standard");
    setPrice(pkg.price);
    setBillingType(pkg.billingType || "Monthly");
    setReviewLimit(pkg.reviewLimit || 500);
    setProductsLimit(pkg.productsLimit || 0);
    setMaxBusinesses(pkg.maxBusinesses || (pkg.businessType === "multiple" ? 1 : 1));
    setExtraBizPrice(pkg.extraBizPrice || 0);
    setPopularBadge(Boolean(pkg.popularBadge));
    setIsCustomQuote(Boolean(pkg.isCustomQuote));
    setFeaturesList(pkg.featuresList || []);
    setStatus(pkg.status || "active");
    setShowModal(true);
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeaturesList([...featuresList, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (idx) => {
    setFeaturesList(featuresList.filter((_, i) => i !== idx));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      packageName: packageName.trim(),
      businessType,
      category,
      price: Number(price),
      billingType,
      reviewLimit: Number(reviewLimit),
      productsLimit: Number(productsLimit),
      maxBusinesses: Number(maxBusinesses),
      extraBizPrice: Number(extraBizPrice),
      popularBadge: Boolean(popularBadge),
      isCustomQuote: Boolean(isCustomQuote),
      featuresList,
      status,
    };

    try {
      if (editingId) {
        await api.updatePricingPackage(editingId, payload);
      } else {
        await api.createPricingPackage(payload);
      }
      setShowModal(false);
      loadPackages();
    } catch (err) {
      alert(err.message || "Failed to save package");
    }
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    setSubmittingCustom(true);
    try {
      const res = await api.requestCustomQuote(customForm);
      if (res.success) {
        setShowCustomModal(false);
        setFeedback({
          type: "success",
          message: "✓ Request sent to BizORM Admin! Our team will contact you shortly with a personalized marketplace proposal.",
        });
      } else {
        alert(res.message || "Failed to submit custom inquiry");
      }
    } catch (err) {
      alert(err.message || "Error submitting inquiry");
    } finally {
      setSubmittingCustom(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this pricing package?")) return;
    try {
      await api.deletePricingPackage(id);
      loadPackages();
    } catch (err) {
      alert(err.message);
    }
  };

  // Canonical order mapping
  const singleOrder = { starter: 1, growth: 2, professional: 3, "business pro": 4 };
  const franchiseOrder = { "franchise 10": 1, "franchise 25": 2, "franchise 50": 3, "franchise 100 / corporate": 4 };

  const getPlanDetails = (pkg) => {
    const pkgName = pkg.packageName?.toLowerCase() || "";
    if (pkg.businessType === "single") {
      const matched = BUSINESS_PLANS.find(
        (b) => b.packageName.toLowerCase() === pkgName
      );
      if (matched) {
        return {
          tagline: matched.tagline,
          displayPrice: annualBilling ? Math.round(matched.annualPrice / 12) : matched.monthlyPrice,
          annualTotal: matched.annualPrice,
          scansDisplay: matched.scansDisplay,
          features: matched.features,
          popular: matched.popular,
          locationsDisplay: matched.locationsDisplay,
        };
      }
    } else if (pkg.businessType === "multiple") {
      const matched = FRANCHISE_PLANS.find(
        (f) => f.packageName.toLowerCase() === pkgName
      );
      if (matched) {
        return {
          tagline: matched.tagline,
          displayPrice:
            matched.monthlyPrice === "Custom" || pkg.isCustomQuote
              ? "Custom"
              : annualBilling && typeof matched.annualPrice === "number"
              ? Math.round(matched.annualPrice / 12)
              : matched.monthlyPrice,
          annualTotal: typeof matched.annualPrice === "number" ? matched.annualPrice : null,
          scansDisplay: matched.scansDisplay,
          features: matched.features,
          popular: matched.popular,
          locationsDisplay: matched.locationsDisplay,
        };
      }
    }
    // Marketplace or Fallback
    return {
      tagline: pkg.category,
      displayPrice: pkg.price,
      annualTotal: null,
      scansDisplay: `${Number(pkg.reviewLimit || 500).toLocaleString("en-IN")} Reviews / Month`,
      features: pkg.featuresList || [],
      popular: Boolean(pkg.popularBadge),
      locationsDisplay: pkg.businessType === "marketplace" ? `${pkg.productsLimit || 5} Products` : "1 Branch",
    };
  };

  const rawTabPackages = packages.filter(
    (p) => (p.businessType || "single") === activeTab
  );

  // Filter out any standalone trial tier from the subscription purchase cards
  const filteredPackages = rawTabPackages.filter(
    (p) => p.category !== "Trial" && !p.packageName.toLowerCase().includes("trial")
  );

  if (activeTab === "single") {
    filteredPackages.sort((a, b) => (singleOrder[a.packageName.toLowerCase()] || 99) - (singleOrder[b.packageName.toLowerCase()] || 99));
  } else if (activeTab === "multiple") {
    filteredPackages.sort((a, b) => (franchiseOrder[a.packageName.toLowerCase()] || 99) - (franchiseOrder[b.packageName.toLowerCase()] || 99));
  } else {
    filteredPackages.sort((a, b) => (a.displayOrder || 1) - (b.displayOrder || 1));
  }

  const currentUserPlan = packages.find(
    (p) => currentActivePlanId && String(p._id) === String(currentActivePlanId)
  );

  const activePlan = currentUserPlan || (user?.pricingPackageId && typeof user.pricingPackageId === "object" ? user.pricingPackageId : null);

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", width: "100%" }}>
        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
          <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#0f172a", margin: 0, letterSpacing: "-0.5px" }}>
            {isSuperAdmin ? "SaaS Pricing Plans & Packages" : "Subscription Plans & Upgrade"}
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "6px" }}>
            {isSuperAdmin
              ? "Configure subscription tiers, set monthly review limits, and manage client pricing"
              : "Choose the best plan for your business, unlock higher review quotas, and manage multi-location access"}
          </p>
        </div>

        <div className="pricing-active-plan-wrapper">
          {isSuperAdmin ? (
            <button onClick={handleOpenCreateModal} className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Plus size={16} />
              <span>Create New Plan</span>
            </button>
          ) : (
            activePlan && (
              <div className="pricing-active-plan-card">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: "#dcfce7",
                    border: "1px solid #86efac",
                    color: "#16a34a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <CheckCircle2 size={22} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "11px", fontWeight: "800", color: "#15803d", letterSpacing: "0.6px", textTransform: "uppercase" }}>
                      Active Plan
                    </span>
                    <span
                      style={{
                        fontSize: "10.5px",
                        fontWeight: "700",
                        padding: "2px 8px",
                        borderRadius: "9999px",
                        background: "#ecfdf5",
                        border: "1px solid #a7f3d0",
                        color: "#166534",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#16a34a" }} />
                      Active
                    </span>
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: "900", color: "#0f172a", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <span>{activePlan.packageName}</span>
                    <span
                      style={{
                        fontSize: "11.5px",
                        fontWeight: "700",
                        color: "#0369a1",
                        background: "#f0f9ff",
                        border: "1px solid #bae6fd",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {Number(activePlan.reviewLimit || 100).toLocaleString("en-IN")} Valid Scans/mo
                    </span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Trial Alert Notification Banner */}
      {activePlan && (activePlan.packageName?.toLowerCase().includes("trial") || activePlan.category === "Trial") && (
        <div
          style={{
            padding: "16px 20px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)",
            border: "1.5px solid #bfdbfe",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "#dbeafe",
                color: "#0052cc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Zap size={20} />
            </div>
            <div>
              <div style={{ fontSize: "14.5px", fontWeight: "800", color: "#0f172a" }}>
                You are currently exploring on the Free 7-Day Trial (100 Valid Scans Included)
              </div>
              <div style={{ fontSize: "12.5px", color: "#64748b" }}>
                Choose any plan below to upgrade your monthly scan quota and unlock continuous multi-platform reputation features.
              </div>
            </div>
          </div>
          <span
            style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#166534",
              backgroundColor: "#dcfce7",
              border: "1px solid #86efac",
              padding: "4px 12px",
              borderRadius: "9999px",
            }}
          >
            Trial Active
          </span>
        </div>
      )}

      {/* Feedback Alert */}
      {feedback && (
        <div
          style={{
            padding: "14px 18px",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: feedback.type === "success" ? "#f0fdf4" : feedback.type === "error" ? "#fef2f2" : "#eff6ff",
            border: `1.5px solid ${feedback.type === "success" ? "#86efac" : feedback.type === "error" ? "#fca5a5" : "#93c5fd"}`,
            color: feedback.type === "success" ? "#166534" : feedback.type === "error" ? "#991b1b" : "#1e40af",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {feedback.type === "success" && <CheckCircle2 size={18} color="#16a34a" />}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            style={{ background: "transparent", border: "none", cursor: "pointer", fontWeight: "800", fontSize: "16px", color: "inherit" }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Sleek, Lightweight Navigation & Billing Switcher */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
        {/* Category Tabs (Desktop) */}
        <div
          className="pricing-tabs-desktop"
          style={{
            alignItems: "center",
            background: "#ffffff",
            padding: "3px",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            gap: "2px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            type="button"
            onClick={() => handleTabChange("single")}
            style={{
              padding: "6px 14px",
              borderRadius: "7px",
              border: "none",
              fontWeight: activeTab === "single" ? "700" : "500",
              fontSize: "12.5px",
              cursor: "pointer",
              background: activeTab === "single" ? "#f1f5f9" : "transparent",
              color: activeTab === "single" ? "#0f172a" : "#64748b",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.15s ease",
            }}
          >
            <Building2 size={14} color={activeTab === "single" ? "#0052cc" : "#64748b"} />
            <span>Single Business Plans</span>
            <span
              style={{
                fontSize: "10.5px",
                fontWeight: "600",
                padding: "1px 5px",
                borderRadius: "4px",
                background: activeTab === "single" ? "#e2e8f0" : "#f8fafc",
                color: activeTab === "single" ? "#0f172a" : "#94a3b8",
              }}
            >
              {packages.filter((p) => (p.businessType || "single") === "single" && p.category !== "Trial" && !p.packageName.toLowerCase().includes("trial")).length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("multiple")}
            style={{
              padding: "6px 14px",
              borderRadius: "7px",
              border: "none",
              fontWeight: activeTab === "multiple" ? "700" : "500",
              fontSize: "12.5px",
              cursor: "pointer",
              background: activeTab === "multiple" ? "#f1f5f9" : "transparent",
              color: activeTab === "multiple" ? "#0f172a" : "#64748b",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.15s ease",
            }}
          >
            <Layers size={14} color={activeTab === "multiple" ? "#0052cc" : "#64748b"} />
            <span>Multiple Business Plans</span>
            <span
              style={{
                fontSize: "10.5px",
                fontWeight: "600",
                padding: "1px 5px",
                borderRadius: "4px",
                background: activeTab === "multiple" ? "#e2e8f0" : "#f8fafc",
                color: activeTab === "multiple" ? "#0f172a" : "#94a3b8",
              }}
            >
              {packages.filter((p) => p.businessType === "multiple").length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("marketplace")}
            style={{
              padding: "6px 14px",
              borderRadius: "7px",
              border: "none",
              fontWeight: activeTab === "marketplace" ? "700" : "500",
              fontSize: "12.5px",
              cursor: "pointer",
              background: activeTab === "marketplace" ? "#f1f5f9" : "transparent",
              color: activeTab === "marketplace" ? "#0f172a" : "#64748b",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.15s ease",
            }}
          >
            <ShoppingBag size={14} color={activeTab === "marketplace" ? "#0052cc" : "#64748b"} />
            <span>Marketplace (Products)</span>
            <span
              style={{
                fontSize: "10.5px",
                fontWeight: "600",
                padding: "1px 5px",
                borderRadius: "4px",
                background: activeTab === "marketplace" ? "#e2e8f0" : "#f8fafc",
                color: activeTab === "marketplace" ? "#0f172a" : "#94a3b8",
              }}
            >
              {packages.filter((p) => p.businessType === "marketplace").length}
            </span>
          </button>
        </div>

        {/* Category Tabs (Mobile 3-dots switcher) */}
        <div
          className="pricing-tabs-mobile"
          style={{
            width: "100%",
            maxWidth: "380px",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            position: "relative",
          }}
        >
          {/* Active Category Row Card with 3-Dots Button */}
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              padding: "7px 12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {activeTab === "single" && <Building2 size={16} color="#0052cc" />}
              {activeTab === "multiple" && <Layers size={16} color="#0052cc" />}
              {activeTab === "marketplace" && <ShoppingBag size={16} color="#0052cc" />}
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>
                {activeTab === "single"
                  ? "Single Business Plans"
                  : activeTab === "multiple"
                  ? "Multiple Business Plans"
                  : "Marketplace (Products)"}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  padding: "1px 6px",
                  borderRadius: "5px",
                  background: "#eff6ff",
                  color: "#0052cc",
                }}
              >
                {activeTab === "single"
                  ? packages.filter((p) => (p.businessType || "single") === "single" && p.category !== "Trial" && !p.packageName.toLowerCase().includes("trial")).length
                  : activeTab === "multiple"
                  ? packages.filter((p) => p.businessType === "multiple").length
                  : packages.filter((p) => p.businessType === "marketplace").length}
              </span>
            </div>

            {/* 3-Dots Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle plan categories menu"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "30px",
                height: "30px",
                borderRadius: "7px",
                border: "1px solid #e2e8f0",
                background: mobileMenuOpen ? "#eff6ff" : "#f8fafc",
                color: mobileMenuOpen ? "#0052cc" : "#64748b",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <MoreHorizontal size={17} />
            </button>
          </div>

          {/* 3 Indicator Dots (● ○ ○) for fast direct tap */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
            {[
              { id: "single", label: "Single Business" },
              { id: "multiple", label: "Multiple Business" },
              { id: "marketplace", label: "Marketplace" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  handleTabChange(tab.id);
                  setMobileMenuOpen(false);
                }}
                title={tab.label}
                aria-label={tab.label}
                style={{
                  width: activeTab === tab.id ? "20px" : "7px",
                  height: "7px",
                  borderRadius: "4px",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  background: activeTab === tab.id ? "#0052cc" : "#cbd5e1",
                  transition: "all 0.2s ease",
                }}
              />
            ))}
          </div>

          {/* Mobile Dropdown Popover */}
          {mobileMenuOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                left: 0,
                right: 0,
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)",
                padding: "6px",
                zIndex: 40,
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              {[
                {
                  id: "single",
                  label: "Single Business Plans",
                  icon: Building2,
                  count: packages.filter(
                    (p) =>
                      (p.businessType || "single") === "single" &&
                      p.category !== "Trial" &&
                      !p.packageName.toLowerCase().includes("trial")
                  ).length,
                },
                {
                  id: "multiple",
                  label: "Multiple Business Plans",
                  icon: Layers,
                  count: packages.filter((p) => p.businessType === "multiple").length,
                },
                {
                  id: "marketplace",
                  label: "Marketplace (Products)",
                  icon: ShoppingBag,
                  count: packages.filter((p) => p.businessType === "marketplace").length,
                },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      handleTabChange(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      border: "none",
                      background: isSelected ? "#f0fdf4" : "transparent",
                      color: isSelected ? "#166534" : "#334155",
                      fontWeight: isSelected ? "700" : "500",
                      fontSize: "13px",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Icon size={15} color={isSelected ? "#16a34a" : "#64748b"} />
                      <span>{tab.label}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          padding: "1px 6px",
                          borderRadius: "4px",
                          background: isSelected ? "#dcfce7" : "#f1f5f9",
                          color: isSelected ? "#15803d" : "#64748b",
                        }}
                      >
                        {tab.count}
                      </span>
                      {isSelected && <Check size={14} color="#16a34a" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Lightweight Billing Toggle */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "2px",
            background: "#f8fafc",
            padding: "2px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <button
            type="button"
            onClick={() => setAnnualBilling(false)}
            style={{
              padding: "4px 14px",
              borderRadius: "6px",
              border: "none",
              background: !annualBilling ? "#ffffff" : "transparent",
              color: !annualBilling ? "#0052cc" : "#64748b",
              fontSize: "12px",
              fontWeight: !annualBilling ? "700" : "500",
              cursor: "pointer",
              transition: "all 0.15s ease",
              boxShadow: !annualBilling ? "0 1px 2px rgba(0, 0, 0, 0.05)" : "none",
            }}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setAnnualBilling(true)}
            style={{
              padding: "4px 14px",
              borderRadius: "6px",
              border: "none",
              background: annualBilling ? "#ffffff" : "transparent",
              color: annualBilling ? "#0052cc" : "#64748b",
              fontSize: "12px",
              fontWeight: annualBilling ? "700" : "500",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.15s ease",
              boxShadow: annualBilling ? "0 1px 2px rgba(0, 0, 0, 0.05)" : "none",
            }}
          >
            <span>Annual</span>
            <span
              style={{
                fontSize: "10px",
                background: "#ecfdf5",
                color: "#059669",
                border: "1px solid #a7f3d0",
                padding: "1px 5px",
                borderRadius: "4px",
                fontWeight: "700",
              }}
            >
              Save ~17% (2 Mo. Free)
            </span>
          </button>
        </div>
      </div>

      {/* Package Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "24px", marginTop: "6px", alignItems: "stretch" }}>
        {filteredPackages.map((pkg) => {
          const isCurrentActive = Boolean(currentActivePlanId && String(currentActivePlanId) === String(pkg._id));
          const isSelecting = selectingPlanId === pkg._id;
          const details = getPlanDetails(pkg);

          return (
            <div
              key={pkg._id}
              onClick={() => {
                if (pkg.isCustomQuote) {
                  setCustomForm({
                    businessName: user?.cmpy || "",
                    name: `${user?.fname || ""} ${user?.lname || ""}`.trim() || user?.uname || "",
                    email: user?.email || "",
                    phone: user?.mobile || "",
                    productsCount: "100+",
                    monthlyReviews: "10000+",
                    message: "We need custom review automation for our product catalog.",
                  });
                  setShowCustomModal(true);
                } else {
                  handleSelectPlan(pkg);
                }
              }}
              style={{
                borderRadius: "22px",
                background: "#ffffff",
                border: isCurrentActive
                  ? "2px solid #10b981"
                  : details.popular
                  ? "2px solid #0052cc"
                  : "1px solid #e2e8f0",
                boxShadow: isCurrentActive
                  ? "0 16px 36px -8px rgba(16, 185, 129, 0.18)"
                  : details.popular
                  ? "0 18px 40px -8px rgba(0, 82, 204, 0.16)"
                  : "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "30px 26px 24px",
                position: "relative",
                transition: "all 0.25s ease",
                cursor: isCurrentActive ? "default" : "pointer",
              }}
            >
              {/* Floating Top Badge */}
              {isCurrentActive && (
                <div
                  style={{
                    position: "absolute",
                    top: "-13px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: "800",
                    letterSpacing: "0.5px",
                    padding: "4px 14px",
                    borderRadius: "9999px",
                    boxShadow: "0 4px 12px rgba(5, 150, 105, 0.35)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <CheckCircle2 size={12} /> CURRENT ACTIVE PLAN
                </div>
              )}

              {details.popular && !isCurrentActive && (
                <div
                  style={{
                    position: "absolute",
                    top: "-13px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, #0052cc 0%, #1d4ed8 100%)",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: "800",
                    letterSpacing: "0.5px",
                    padding: "4px 14px",
                    borderRadius: "9999px",
                    boxShadow: "0 4px 12px rgba(0, 82, 204, 0.35)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Sparkles size={12} /> MOST POPULAR
                </div>
              )}

              {/* Card Top Details */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "800",
                      color: details.popular ? "#0052cc" : isCurrentActive ? "#059669" : "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                    }}
                  >
                    {details.popular ? "POPULAR" : pkg.category || "STANDARD"}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      padding: "3px 9px",
                      borderRadius: "6px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      color: "#475569",
                    }}
                  >
                    {details.locationsDisplay}
                  </span>
                </div>

                <h3 style={{ fontSize: "22px", fontWeight: "900", color: "#0f172a", margin: "0 0 6px", letterSpacing: "-0.4px" }}>
                  {pkg.packageName}
                </h3>
                <p style={{ fontSize: "12.5px", color: "#64748b", margin: "0 0 14px 0", minHeight: "36px", lineHeight: "1.4" }}>
                  {details.tagline}
                </p>

                {/* Price Display */}
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", margin: "10px 0 4px" }}>
                  <span style={{ fontSize: "38px", fontWeight: "900", color: "#0f172a", letterSpacing: "-1.5px" }}>
                    {details.displayPrice === "Custom" || pkg.isCustomQuote
                      ? "Custom"
                      : `₹${Number(details.displayPrice).toLocaleString("en-IN")}`}
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>
                    {details.displayPrice === "Custom" || pkg.isCustomQuote ? "" : "/month"}
                  </span>
                </div>

                {annualBilling && details.annualTotal && typeof details.annualTotal === "number" && (
                  <div style={{ fontSize: "11.5px", color: "#0052cc", fontWeight: "700", marginBottom: "12px" }}>
                    Billed annually at ₹{Number(details.annualTotal).toLocaleString("en-IN")}/yr (Save ~17%)
                  </div>
                )}
                {(!annualBilling || !details.annualTotal) && (
                  <div style={{ fontSize: "11.5px", color: "#64748b", fontWeight: "600", marginBottom: "12px" }}>
                    Billed on monthly renewal
                  </div>
                )}

                {/* Quota Highlight Box */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    background: "rgba(0, 82, 204, 0.06)",
                    border: "1px solid rgba(0, 82, 204, 0.15)",
                    marginBottom: "14px",
                  }}
                >
                  <Zap size={15} color="#0052cc" />
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#0052cc" }}>
                    ⚡ {details.scansDisplay}
                  </span>
                </div>

                {/* WhatsApp & SMS Inclusion Pill */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#166534",
                    background: "#f0fdf4",
                    padding: "7px 11px",
                    borderRadius: "8px",
                    marginBottom: "18px",
                    border: "1px solid #bbf7d0",
                  }}
                >
                  <MessageCircle size={14} color="#16a34a" />
                  <span>WhatsApp, SMS &amp; Dynamic QR Included</span>
                </div>

                {/* Feature Bullet List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "22px" }}>
                  {details.features?.map((feat, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13px", color: "#334155" }}>
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          background: "#ecfdf5",
                          color: "#059669",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: "2px",
                        }}
                      >
                        <Check size={11} strokeWidth={3} />
                      </div>
                      <span style={{ lineHeight: "1.4" }}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA & Super Admin Controls */}
              <div style={{ marginTop: "auto", paddingTop: "14px" }}>
                {pkg.isCustomQuote ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCustomForm({
                        businessName: user?.cmpy || "",
                        name: `${user?.fname || ""} ${user?.lname || ""}`.trim() || user?.uname || "",
                        email: user?.email || "",
                        phone: user?.mobile || "",
                        productsCount: "100+",
                        monthlyReviews: "10000+",
                        message: "We need custom review automation for our product catalog.",
                      });
                      setShowCustomModal(true);
                    }}
                    style={{
                      width: "100%",
                      padding: "13px",
                      borderRadius: "12px",
                      border: "none",
                      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                      color: "#ffffff",
                      fontWeight: "800",
                      fontSize: "14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      boxShadow: "0 6px 18px rgba(15, 23, 42, 0.25)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Send size={15} />
                    <span>Talk to BizORM Owner</span>
                    <ArrowRight size={15} />
                  </button>
                ) : isCurrentActive ? (
                  <button
                    type="button"
                    disabled
                    style={{
                      width: "100%",
                      padding: "13px",
                      borderRadius: "12px",
                      border: "1.5px solid #a7f3d0",
                      background: "#ecfdf5",
                      color: "#065f46",
                      fontWeight: "800",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      cursor: "default",
                    }}
                  >
                    <CheckCircle2 size={16} /> Current Active Plan
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPlan(pkg);
                    }}
                    disabled={isSelecting}
                    style={{
                      width: "100%",
                      padding: "13px",
                      borderRadius: "12px",
                      border: "none",
                      background: details.popular
                        ? "linear-gradient(135deg, #0052cc 0%, #1d4ed8 100%)"
                        : "#0f172a",
                      color: "#ffffff",
                      fontWeight: "800",
                      fontSize: "14px",
                      cursor: isSelecting ? "wait" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      boxShadow: details.popular
                        ? "0 6px 18px rgba(0, 82, 204, 0.35)"
                        : "0 4px 14px rgba(15, 23, 42, 0.18)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {isSelecting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Activating...</span>
                      </>
                    ) : (
                      <>
                        <span>Select &amp; Activate Plan</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                )}

                {/* Super Admin Edit / Delete Actions */}
                {isSuperAdmin && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "8px",
                      paddingTop: "12px",
                      marginTop: "12px",
                      borderTop: "1px dashed var(--border)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)" }}>
                      Super Admin:
                    </span>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditModal(pkg);
                        }}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: "11px", padding: "4px 10px" }}
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(pkg._id);
                        }}
                        className="btn btn-danger btn-sm"
                        style={{ fontSize: "11px", padding: "4px 10px" }}
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredPackages.length === 0 && !loading && (
        <div className="card" style={{ textAlign: "center", padding: "48px 20px" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "15px", marginBottom: "14px" }}>
            No {activeTab === "single" ? "Single Business" : "Multiple Business"} packages configured yet.
          </p>
          {isSuperAdmin && (
            <button onClick={handleOpenCreateModal} className="btn btn-primary">
              <Plus size={16} /> Create First Plan
            </button>
          )}
        </div>
      )}

      {/* Trust & Guarantee Section */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "16px", marginTop: "10px" }}>
        <div
          className="card"
          style={{
            padding: "20px 22px",
            display: "flex",
            alignItems: "flex-start",
            gap: "14px",
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "rgba(16, 185, 129, 0.1)",
              color: "#059669",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px" }}>
              Smart Feedback &amp; Resolution
            </h4>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0, lineHeight: "1.5" }}>
              Every plan connects customers with neutral public review links while alerting managers to resolve private issues in real time.
            </p>
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: "20px 22px",
            display: "flex",
            alignItems: "flex-start",
            gap: "14px",
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "rgba(37, 99, 235, 0.1)",
              color: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Zap size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px" }}>
              Instant Zero-Downtime Upgrade
            </h4>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0, lineHeight: "1.5" }}>
              Quotas update instantly without requiring you to replace, reprint, or change any of your printed QR codes.
            </p>
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: "20px 22px",
            display: "flex",
            alignItems: "flex-start",
            gap: "14px",
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "rgba(245, 158, 11, 0.1)",
              color: "#d97706",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Award size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px" }}>
              Omnichannel Ready
            </h4>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0, lineHeight: "1.5" }}>
              Send pre-generated 5-star invite links directly to customers over WhatsApp, SMS, or in-store table standees.
            </p>
          </div>
        </div>
      </div>

      {/* Statutory Pricing Terms & Compliance Disclaimers */}
      <div
        style={{
          marginTop: "8px",
          padding: "20px 24px",
          borderRadius: "16px",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          fontSize: "12.5px",
          color: "#64748b",
          lineHeight: 1.6,
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.02)",
        }}
      >
        <div style={{ fontWeight: "800", color: "#0f172a", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
          <ShieldCheck size={16} color="#0052cc" />
          <span>Statutory Pricing Terms &amp; Compliance Standards:</span>
        </div>
        <ul style={{ margin: "0 0 0 20px", padding: 0 }}>
          <li style={{ marginBottom: "4px" }}>
            <strong>GST Notice:</strong> All listed prices are statutory net fees exclusive of 18% Goods and Services Tax (GST), added upon checkout invoice.
          </li>
          <li style={{ marginBottom: "4px" }}>
            <strong>Annual Billing &amp; 2 Months Free:</strong> Annual plans are billed upfront for 12 months with rounded 17% savings (equivalent to 2 months free). Scan quotas reset on the 1st of every calendar month and do not roll over.
          </li>
          <li style={{ marginBottom: "4px" }}>
            <strong>Valid Scan Quotas:</strong> Scans reflect deduplicated customer QR scans with active feedback interaction within a 30-minute deduplication window.
          </li>
          <li>
            <strong>Neutral Review Routing:</strong> In strict compliance with Google Review policies and FTC regulations, BizORM does not condition, filter, or gate review destinations based on customer star rating.
          </li>
        </ul>
      </div>

      {/* Plan Create / Edit Modal (Portaled) */}
      {showModal &&
        createPortal(
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15, 23, 42, 0.65)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              zIndex: 9999,
              animation: "fadeIn 0.2s ease-out",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowModal(false);
            }}
          >
            <div
              className="card"
              style={{
                maxWidth: "540px",
                width: "100%",
                padding: "0",
                maxHeight: "90vh",
                overflowY: "auto",
                borderRadius: "16px",
                background: "#ffffff",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  padding: "20px 24px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#f8fafc",
                  borderRadius: "16px 16px 0 0",
                }}
              >
                <div>
                  <h2 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                    {editingId ? "Edit Pricing Plan" : "Create New Pricing Plan"}
                  </h2>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "3px 0 0" }}>
                    Configure tier price, review quota, and feature bullet items
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline btn-sm"
                  style={{
                    padding: "6px",
                    borderRadius: "8px",
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title="Close modal"
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ padding: "24px" }}>
                <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div className="grid-2">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>Business Scope</label>
                      <select
                        className="form-select"
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        style={{ padding: "8px 12px", fontSize: "13px" }}
                      >
                        <option value="single">Single Business</option>
                        <option value="multiple">Multiple Business</option>
                        <option value="marketplace">Marketplace (Products)</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>Category Tier</label>
                      <select
                        className="form-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ padding: "8px 12px", fontSize: "13px" }}
                      >
                        <option value="Trial">Trial (7 Days)</option>
                        <option value="Standard">Standard</option>
                        <option value="Popular">Popular</option>
                        <option value="Supreme">Supreme</option>
                        <option value="Enterprise">Enterprise</option>
                        <option value="Custom Quote">Custom Quote</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>Plan Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Starter Review Plan or Marketplace Basic"
                      value={packageName}
                      onChange={(e) => setPackageName(e.target.value)}
                      required
                      style={{ padding: "8px 12px", fontSize: "13px" }}
                    />
                  </div>

                  <div className="grid-2">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>Price (₹ INR) *</label>
                      <input
                        type="number"
                        className="form-input"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        style={{ padding: "8px 12px", fontSize: "13px" }}
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>Billing Cycle</label>
                      <select
                        className="form-select"
                        value={billingType}
                        onChange={(e) => setBillingType(e.target.value)}
                        style={{ padding: "8px 12px", fontSize: "13px" }}
                      >
                        <option value="7 Days">7 Days</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Yearly">Yearly</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>Review Limit Quota *</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="e.g. 500, 1000, 2500"
                        value={reviewLimit}
                        onChange={(e) => setReviewLimit(e.target.value)}
                        required
                        style={{ padding: "8px 12px", fontSize: "13px" }}
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>
                        {businessType === "marketplace"
                          ? "Products / SKU Quota *"
                          : businessType === "multiple"
                          ? "Branches Included *"
                          : "Locations *"}
                      </label>
                      <input
                        type="number"
                        className="form-input"
                        value={businessType === "marketplace" ? productsLimit : maxBusinesses}
                        onChange={(e) => {
                          if (businessType === "marketplace") setProductsLimit(e.target.value);
                          else setMaxBusinesses(e.target.value);
                        }}
                        min={0}
                        required
                        style={{ padding: "8px 12px", fontSize: "13px" }}
                      />
                    </div>
                  </div>

                  {businessType === "multiple" && (
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>
                        Additional Branch Rate (₹/mo per extra biz)
                      </label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="e.g. 499, 599, 699"
                        value={extraBizPrice}
                        onChange={(e) => setExtraBizPrice(e.target.value)}
                        style={{ padding: "8px 12px", fontSize: "13px" }}
                      />
                    </div>
                  )}

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>Feature Bullets</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Google Reviews Integration or 5 Products Included"
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        style={{ padding: "8px 12px", fontSize: "13px" }}
                      />
                      <button type="button" onClick={handleAddFeature} className="btn btn-secondary">
                        Add
                      </button>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                      {featuresList.map((f, i) => (
                        <span key={i} className="badge badge-secondary" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          {f}
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(i)}
                            style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--danger)" }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", margin: "6px 0" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={popularBadge}
                        onChange={(e) => setPopularBadge(e.target.checked)}
                      />
                      <span>Mark as 'Most Popular'</span>
                    </label>

                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={isCustomQuote}
                        onChange={(e) => setIsCustomQuote(e.target.checked)}
                      />
                      <span>Custom Quote Plan (Users submit inquiry)</span>
                    </label>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "10px",
                      marginTop: "10px",
                      paddingTop: "16px",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingId ? "Save Changes" : "Create Plan"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Custom Quote Inquiry Modal (Talk to BizORM Owner) */}
      {showCustomModal &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(15, 23, 42, 0.7)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 99999,
              padding: "16px",
            }}
          >
            <div
              className="card animate-fade-in"
              style={{
                width: "100%",
                maxWidth: "540px",
                padding: "26px",
                position: "relative",
                background: "#ffffff",
                borderRadius: "22px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                border: "1.5px solid #e2e8f0",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <button
                onClick={() => setShowCustomModal(false)}
                style={{
                  position: "absolute",
                  top: "18px",
                  right: "18px",
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                <X size={16} />
              </button>

              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                    color: "#ffffff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "12px",
                    boxShadow: "0 6px 16px rgba(15, 23, 42, 0.2)",
                  }}
                >
                  <ShoppingBag size={26} />
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: "900", color: "#0f172a", margin: "0 0 6px" }}>
                  Talk to BizORM Owner
                </h3>
                <p style={{ fontSize: "13.5px", color: "#64748b", margin: 0 }}>
                  Tell us your product catalog size &amp; review goals. Our leadership will formulate a bespoke package and reach out to you.
                </p>
              </div>

              <form onSubmit={handleCustomSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div className="grid-2">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>Business / Store Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Acme Marketplace"
                      value={customForm.businessName}
                      onChange={(e) => setCustomForm({ ...customForm, businessName: e.target.value })}
                      required
                      style={{ padding: "8px 12px", fontSize: "13px" }}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>Contact Person *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Your Full Name"
                      value={customForm.name}
                      onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                      required
                      style={{ padding: "8px 12px", fontSize: "13px" }}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>Email Address *</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="business@example.com"
                      value={customForm.email}
                      onChange={(e) => setCustomForm({ ...customForm, email: e.target.value })}
                      required
                      style={{ padding: "8px 12px", fontSize: "13px" }}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="+91 9876543210"
                      value={customForm.phone}
                      onChange={(e) => setCustomForm({ ...customForm, phone: e.target.value })}
                      required
                      style={{ padding: "8px 12px", fontSize: "13px" }}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>Number of Products / SKUs</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 150 Products"
                      value={customForm.productsCount}
                      onChange={(e) => setCustomForm({ ...customForm, productsCount: e.target.value })}
                      style={{ padding: "8px 12px", fontSize: "13px" }}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>Expected Monthly Reviews</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 20,000 Reviews"
                      value={customForm.monthlyReviews}
                      onChange={(e) => setCustomForm({ ...customForm, monthlyReviews: e.target.value })}
                      style={{ padding: "8px 12px", fontSize: "13px" }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>Message / Special Requirements</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="Describe your marketplace platform, API needs, or custom review workflow..."
                    value={customForm.message}
                    onChange={(e) => setCustomForm({ ...customForm, message: e.target.value })}
                    style={{ padding: "8px 12px", fontSize: "13px", resize: "vertical" }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    marginTop: "8px",
                    paddingTop: "14px",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setShowCustomModal(false)}
                    className="btn btn-secondary"
                    disabled={submittingCustom}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submittingCustom}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                    }}
                  >
                    {submittingCustom ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>Sending to Admin...</span>
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>Send to BizORM Admin</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
