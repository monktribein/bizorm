import React, { useState, useEffect } from "react";
import {
  Gift,
  Ticket,
  Users,
  Star,
  Sparkles,
  Send,
  Plus,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Edit2,
  Search,
  Filter,
  Palette,
  Type,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Percent,
  Clock,
  Share2,
  RefreshCw,
  Phone,
  MessageSquare,
  ChevronRight,
  Eye,
  Scissors,
  Tag,
  Sliders,
  ShieldCheck,
  Award,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const PRESET_COLORS = [
  { label: "Royal Blue", hex: "#0052cc" },
  { label: "Emerald Green", hex: "#059669" },
  { label: "Crimson Red", hex: "#dc2626" },
  { label: "Royal Purple", hex: "#7c3aed" },
  { label: "Amber Gold", hex: "#d97706" },
  { label: "Cyan Teal", hex: "#0891b2" },
  { label: "Midnight Dark", hex: "#0f172a" },
  { label: "Rose Pink", hex: "#e11d48" },
];

const TEMPLATE_STYLES = [
  { id: "voucher_ticket", label: "Classic Perforated Coupon", desc: "Authentic ticket stub with side punch holes, scissors & barcode" },
  { id: "modern", label: "Modern Gradient Card", desc: "Sleek vibrant digital wallet voucher" },
  { id: "luxury", label: "Luxury VIP Gold", desc: "High-roller dark slate with gold/emerald accents" },
  { id: "festive", label: "Festive Celebration", desc: "Warm party & festival celebration voucher" },
  { id: "minimal", label: "Minimalist Bordered", desc: "Clean typography with crisp dashed stamp" },
];

const FONTS = [
  { id: "Outfit", label: "Outfit (Modern Bold)" },
  { id: "'Plus Jakarta Sans', sans-serif", label: "Jakarta (Corporate Clean)" },
  { id: "'Playfair Display', serif", label: "Playfair (Luxury Serif)" },
  { id: "Inter, sans-serif", label: "Inter (Neutral Standard)" },
  { id: "monospace", label: "Mono (Ticket Terminal)" },
];

export const CampaignsPage = () => {
  const { user, quota, reloadProfile } = useAuth();

  // Tab State: "audience" (Reviewers) | "studio" (Create/Edit Voucher) | "campaigns" (Saved Campaigns)
  const [activeTab, setActiveTab] = useState("audience");

  // Data State
  const [campaigns, setCampaigns] = useState([]);
  const [audience, setAudience] = useState({
    totalCustomers: 0,
    detractorsCount: 0,
    promotersCount: 0,
    customers: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters for Customer Audience tab
  const [starFilter, setStarFilter] = useState("ALL"); // "ALL" | "DETRACTORS" (1-3★) | "PROMOTERS" (4-5★)
  const [searchQuery, setSearchQuery] = useState("");

  // Voucher Studio Form State
  const [editingCampaignId, setEditingCampaignId] = useState(null);
  const [formTitle, setFormTitle] = useState("Customer Appreciation Privilege Pass");
  const [formDescription, setFormDescription] = useState("Thank you for sharing your feedback with us! Enjoy an exclusive discount on your next visit.");
  const [formOfferType, setFormOfferType] = useState("PERCENT_OFF");
  const [formOfferValue, setFormOfferValue] = useState("15% OFF");
  const [formCouponCode, setFormCouponCode] = useState("SAVE15");
  const [formTargetAudience, setFormTargetAudience] = useState("ALL");
  const [formTerms, setFormTerms] = useState("Valid on minimum billing of ₹299. Show pass or code to cashier.");
  const [formExpiryDate, setFormExpiryDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [formThemeColor, setFormThemeColor] = useState("#0052cc");
  const [formTemplateStyle, setFormTemplateStyle] = useState("voucher_ticket");
  const [formFontFamily, setFormFontFamily] = useState("Outfit");
  const [formBusinessName, setFormBusinessName] = useState(user?.cmpy || user?.name || "BizORM Partner");
  const [savingCampaign, setSavingCampaign] = useState(false);

  // Send Offer Modal State
  const [sendModalCustomer, setSendModalCustomer] = useState(null);
  const [modalMode, setModalMode] = useState("saved"); // "saved" | "custom"
  const [selectedCampaignToSend, setSelectedCampaignToSend] = useState(null);

  // Quick Custom Coupon in Modal state
  const [customOfferTitle, setCustomOfferTitle] = useState("Exclusive Customer Offer");
  const [customOfferValue, setCustomOfferValue] = useState("10% OFF");
  const [customCouponCode, setCustomCouponCode] = useState("SPECIAL10");
  const [customColor, setCustomColor] = useState("#0052cc");
  const [customNote, setCustomNote] = useState("");

  const [sendingOffer, setSendingOffer] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState(null);

  // Fetch initial data
  const loadData = async () => {
    try {
      setLoading(true);
      const [campRes, audRes] = await Promise.all([
        api.getCampaigns().catch(() => ({ success: false, campaigns: [] })),
        api.getCampaignAudience().catch(() => ({ success: false, customers: [] })),
      ]);

      if (campRes.success) {
        setCampaigns(campRes.campaigns || []);
        if (campRes.campaigns?.length > 0 && !selectedCampaignToSend) {
          setSelectedCampaignToSend(campRes.campaigns[0]._id);
        }
      }

      if (audRes.success) {
        setAudience({
          totalCustomers: audRes.totalCustomers || audRes.customers?.length || 0,
          detractorsCount: audRes.detractorsCount || 0,
          promotersCount: audRes.promotersCount || 0,
          customers: audRes.customers || [],
        });
      }
    } catch (err) {
      console.error("Error loading campaigns data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (message, type = "success") => {
    setFeedbackToast({ message, type });
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  // Switch to edit existing campaign in Studio
  const handleEditCampaign = (camp) => {
    setEditingCampaignId(camp._id);
    setFormTitle(camp.title || "");
    setFormDescription(camp.description || "");
    setFormOfferType(camp.offerType || "PERCENT_OFF");
    setFormOfferValue(camp.offerValue || "");
    setFormCouponCode(camp.couponCode || "");
    setFormTargetAudience(camp.targetAudience || "ALL");
    setFormTerms(camp.terms || "");
    if (camp.expiryDate) {
      setFormExpiryDate(new Date(camp.expiryDate).toISOString().split("T")[0]);
    }
    setFormThemeColor(camp.themeColor || "#0052cc");
    setFormTemplateStyle(camp.templateStyle || "voucher_ticket");
    setFormFontFamily(camp.fontFamily || "Outfit");
    setFormBusinessName(camp.businessName || user?.cmpy || "BizORM Partner");
    setActiveTab("studio");
  };

  // Reset studio form for new creation
  const handleResetStudio = () => {
    setEditingCampaignId(null);
    setFormTitle("Special Privilege Coupon Pass");
    setFormDescription("Enjoy an exclusive offer on your next visit with this digital pass.");
    setFormOfferType("PERCENT_OFF");
    setFormOfferValue("10% OFF");
    setFormCouponCode(`OFFER${Math.floor(100 + Math.random() * 900)}`);
    setFormTargetAudience("ALL");
    setFormTerms("Valid on minimum billing of ₹299. Show pass or code to cashier.");
    setFormExpiryDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
    setFormThemeColor("#0052cc");
    setFormTemplateStyle("voucher_ticket");
    setFormFontFamily("Outfit");
    setFormBusinessName(user?.cmpy || user?.name || "BizORM Partner");
    setActiveTab("studio");
  };

  // Save campaign from studio
  const handleSaveCampaign = async (e) => {
    e.preventDefault();
    if (!formTitle || !formCouponCode) {
      showToast("Please enter a Title and Coupon Code", "error");
      return;
    }

    try {
      setSavingCampaign(true);
      const payload = {
        title: formTitle,
        description: formDescription,
        offerType: formOfferType,
        offerValue: formOfferValue,
        couponCode: formCouponCode.toUpperCase().trim(),
        targetAudience: formTargetAudience,
        terms: formTerms,
        expiryDate: formExpiryDate,
        themeColor: formThemeColor,
        templateStyle: formTemplateStyle,
        fontFamily: formFontFamily,
        businessName: formBusinessName,
      };

      let res;
      if (editingCampaignId) {
        res = await api.updateCampaign(editingCampaignId, payload);
      } else {
        res = await api.createCampaign(payload);
      }

      if (res.success) {
        showToast(editingCampaignId ? "Campaign updated successfully!" : "New campaign launched successfully!");
        setEditingCampaignId(null);
        await loadData();
        setActiveTab("campaigns");
      }
    } catch (err) {
      showToast(err.message || "Failed to save campaign", "error");
    } finally {
      setSavingCampaign(false);
    }
  };

  // Delete campaign
  const handleDeleteCampaign = async (id) => {
    if (!window.confirm("Are you sure you want to remove this campaign?")) return;
    try {
      const res = await api.deleteCampaign(id);
      if (res.success) {
        showToast("Campaign deleted successfully");
        setCampaigns((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      showToast(err.message || "Failed to delete campaign", "error");
    }
  };

  // Trigger Send Offer to Customer
  const handleSendToCustomer = async (channel = "WhatsApp") => {
    if (!sendModalCustomer) return;

    try {
      setSendingOffer(true);

      let targetCampId = selectedCampaignToSend;

      // If user chose on-the-fly custom offer in modal, create it first
      if (modalMode === "custom") {
        const createRes = await api.createCampaign({
          title: customOfferTitle || `Custom Offer for ${sendModalCustomer.name}`,
          description: customNote || "Exclusive custom offer for your valued patronage.",
          offerValue: customOfferValue || "10% OFF",
          couponCode: customCouponCode.toUpperCase().trim(),
          targetAudience: (sendModalCustomer.star <= 3) ? "DETRACTORS" : "PROMOTERS",
          themeColor: customColor,
          templateStyle: "voucher_ticket",
          businessName: user?.cmpy || user?.name || "BizORM Partner",
        });

        if (createRes.success && createRes.campaign) {
          targetCampId = createRes.campaign._id;
        } else {
          throw new Error("Failed to create custom coupon offer");
        }
      }

      if (!targetCampId) {
        showToast("Please select a campaign coupon to send", "error");
        setSendingOffer(false);
        return;
      }

      const res = await api.sendCampaignOffer(targetCampId, {
        customerName: sendModalCustomer.name,
        customerMobile: sendModalCustomer.mobile,
        star: sendModalCustomer.star,
        channel,
      });

      if (res.success) {
        showToast(
          res.quotaDeducted
            ? `Offer dispatched for ${sendModalCustomer.name}! 1 WhatsApp quota used (${res.remainingWspQuota} remaining).`
            : `Offer dispatched for ${sendModalCustomer.name}! (12-hour customer session window active - 0 quota used).`
        );
        if (res.whatsappUrl) {
          window.open(res.whatsappUrl, "_blank", "noopener,noreferrer");
        }
        setSendModalCustomer(null);
        await loadData();
        if (reloadProfile) reloadProfile();
      }
    } catch (err) {
      if (err?.message?.includes("quota exhausted") || err?.quotaExhausted) {
        showToast("⚠️ WhatsApp quota exhausted (0 remaining). Please refill quota from Subscription & Add-ons.", "error");
      } else {
        showToast(err.message || "Failed to dispatch offer", "error");
      }
    } finally {
      setSendingOffer(false);
    }
  };

  // Filtered customer audience
  const filteredCustomers = audience.customers.filter((c) => {
    const matchesStar =
      starFilter === "ALL"
        ? true
        : starFilter === "DETRACTORS"
        ? (c.star || 5) <= 3
        : (c.star || 5) >= 4;

    const matchesSearch =
      !searchQuery ||
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.mobile?.includes(searchQuery) ||
      c.review?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStar && matchesSearch;
  });

  // Authentic Physical Coupon Voucher Ticket Component
  const renderPhysicalCoupon = (data) => {
    const themeColor = data.themeColor || "#0052cc";
    const isTicket = data.templateStyle === "voucher_ticket";
    const isLuxury = data.templateStyle === "luxury";
    const isFestive = data.templateStyle === "festive";

    return (
      <div
        className="authentic-coupon-wrapper"
        style={{
          fontFamily: data.fontFamily || "Outfit",
          position: "relative",
          display: "flex",
          borderRadius: "18px",
          background: isLuxury
            ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
            : isFestive
            ? `linear-gradient(135deg, ${themeColor} 0%, #ff6b6b 100%)`
            : "#ffffff",
          color: isLuxury || isFestive ? "#ffffff" : "#0f172a",
          border: isLuxury ? "1.5px solid #334155" : `2px dashed ${themeColor}`,
          boxShadow: "0 12px 32px -8px rgba(0,0,0,0.12)",
          overflow: "hidden",
          minHeight: "180px",
          transition: "all 0.25s ease",
        }}
      >
        {/* Left Coupon Ticket Stub (The Discount Value) */}
        <div
          style={{
            width: "35%",
            minWidth: "125px",
            background: isLuxury ? "#090d16" : themeColor,
            color: "#ffffff",
            padding: "20px 14px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            textAlign: "center",
            position: "relative",
            borderRight: "2px dashed rgba(255,255,255,0.4)",
          }}
        >
          {/* Top Notch Hole */}
          <div
            style={{
              position: "absolute",
              top: "-10px",
              right: "-10px",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: "#f8fafc",
              zIndex: 3,
            }}
          />
          {/* Bottom Notch Hole */}
          <div
            style={{
              position: "absolute",
              bottom: "-10px",
              right: "-10px",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: "#f8fafc",
              zIndex: 3,
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10.5px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.9 }}>
            <Scissors size={12} />
            <span>DISCOUNT PASS</span>
          </div>

          <div style={{ margin: "10px 0" }}>
            <div style={{ fontSize: "clamp(22px, 3.2vw, 30px)", fontWeight: "900", lineHeight: 1.1, letterSpacing: "-0.5px" }}>
              {data.offerValue || "15% OFF"}
            </div>
            <div style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", marginTop: "4px", opacity: 0.85 }}>
              Special Voucher
            </div>
          </div>

          <div
            style={{
              fontSize: "9px",
              fontWeight: "800",
              background: "rgba(255,255,255,0.2)",
              padding: "3px 8px",
              borderRadius: "999px",
              letterSpacing: "0.5px",
            }}
          >
            {data.targetAudience === "DETRACTORS" ? "RECOVERY" : data.targetAudience === "PROMOTERS" ? "VIP REWARD" : "VALID ALL"}
          </div>
        </div>

        {/* Right Main Body of Coupon */}
        <div
          style={{
            flex: 1,
            padding: "18px 22px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minWidth: 0,
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span style={{ fontSize: "12px", fontWeight: "800", color: isLuxury || isFestive ? "rgba(255,255,255,0.85)" : "#0052cc", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {data.businessName || "BizORM Verified Store"}
              </span>
              <span style={{ fontSize: "10px", color: isLuxury || isFestive ? "rgba(255,255,255,0.65)" : "#64748b" }}>
                ⏳ Valid: {data.expiryDate ? new Date(data.expiryDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "30 Days"}
              </span>
            </div>

            <div style={{ fontSize: "16px", fontWeight: "800", color: isLuxury || isFestive ? "#ffffff" : "#0f172a", lineHeight: 1.25, margin: "2px 0 6px" }}>
              {data.title || "Special Customer Offer"}
            </div>

            <div style={{ fontSize: "11.5px", color: isLuxury || isFestive ? "rgba(255,255,255,0.75)" : "#475569", lineHeight: 1.4, margin: "0 0 10px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
              {data.description || "Present this coupon to enjoy your exclusive discount at billing."}
            </div>
          </div>

          {/* Dotted Coupon Code Box & Barcode */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", marginTop: "auto" }}>
            <div
              style={{
                background: isLuxury ? "rgba(255,255,255,0.06)" : "#f1f5f9",
                border: `1.5px dashed ${themeColor}`,
                padding: "6px 12px",
                borderRadius: "8px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Tag size={13} color={themeColor} />
              <span style={{ fontSize: "15px", fontWeight: "900", letterSpacing: "1.5px", color: themeColor }}>
                {data.couponCode || "COUPON"}
              </span>
            </div>

            {/* Simulated Barcode */}
            <div style={{ display: "flex", gap: "2px", height: "24px", alignItems: "center" }}>
              {[2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 4, 1, 2, 3].map((w, idx) => (
                <div key={idx} style={{ width: `${w}px`, height: "100%", background: isLuxury || isFestive ? "#ffffff" : "#0f172a", opacity: 0.8 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="campaigns-page-container" style={{ padding: "24px 28px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Toast Notification */}
      <AnimatePresence>
        {feedbackToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: "fixed",
              top: "24px",
              right: "24px",
              zIndex: 9999,
              padding: "12px 20px",
              borderRadius: "10px",
              backgroundColor: feedbackToast.type === "error" ? "#ef4444" : "#10b981",
              color: "#ffffff",
              fontWeight: "700",
              boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {feedbackToast.type === "error" ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{feedbackToast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#0052cc", fontSize: "12px", fontWeight: "800", textTransform: "uppercase" }}>
            <Sparkles size={14} />
            <span>Customer Retention &amp; Recovery Engine</span>
          </div>
          <h1
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(24px, 3vw, 30px)",
              fontWeight: "800",
              color: "#0f172a",
              margin: "4px 0 6px",
            }}
          >
            Campaigns, Offers &amp; Coupon Passes
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Distribute customized coupon discounts (10% off, free gifts, flat vouchers) to specific customers who rated 1–3 stars or 4–5 stars.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => {
              setRefreshing(true);
              loadData();
            }}
            disabled={refreshing}
            style={{
              padding: "9px 15px",
              borderRadius: "9px",
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              fontSize: "13px",
              fontWeight: "700",
              color: "#475569",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <RefreshCw size={14} className={refreshing ? "spin" : ""} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleResetStudio}
            style={{
              padding: "9px 18px",
              borderRadius: "9px",
              border: "none",
              background: "#0052cc",
              fontSize: "13px",
              fontWeight: "700",
              color: "#ffffff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 4px 14px rgba(0, 82, 204, 0.22)",
            }}
          >
            <Plus size={16} />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <div style={{ background: "#ffffff", padding: "18px 20px", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "700", textTransform: "uppercase" }}>Total Review Patrons</div>
          <div style={{ fontSize: "28px", fontWeight: "900", color: "#0f172a", marginTop: "4px" }}>
            {audience.totalCustomers}
          </div>
          <div style={{ fontSize: "12px", color: "#059669", marginTop: "4px", fontWeight: "600" }}>Verified Customer Database</div>
        </div>

        <div style={{ background: "#ffffff", padding: "18px 20px", borderRadius: "14px", border: "1px solid #fee2e2", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "12px", color: "#e11d48", fontWeight: "700", textTransform: "uppercase" }}>1–3★ Detractors (Needs Recovery)</div>
          <div style={{ fontSize: "28px", fontWeight: "900", color: "#e11d48", marginTop: "4px" }}>
            {audience.detractorsCount}
          </div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>Target with Apology / Recovery Vouchers</div>
        </div>

        <div style={{ background: "#ffffff", padding: "18px 20px", borderRadius: "14px", border: "1px solid #dcfce7", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "12px", color: "#059669", fontWeight: "700", textTransform: "uppercase" }}>4–5★ Promoters (Loyalty VIP)</div>
          <div style={{ fontSize: "28px", fontWeight: "900", color: "#059669", marginTop: "4px" }}>
            {audience.promotersCount}
          </div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>Reward with Exclusive VIP Offers</div>
        </div>

        <div style={{ background: "#ffffff", padding: "18px 20px", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "12px", color: "#0052cc", fontWeight: "700", textTransform: "uppercase" }}>Active Campaigns</div>
          <div style={{ fontSize: "28px", fontWeight: "900", color: "#0052cc", marginTop: "4px" }}>
            {campaigns.filter((c) => c.isActive).length}
          </div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
            {campaigns.reduce((acc, c) => acc + (c.sentCount || 0), 0)} Total Offers Dispatched
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #e2e8f0",
          gap: "24px",
          marginBottom: "24px",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("audience")}
          style={{
            padding: "10px 4px",
            background: "transparent",
            border: "none",
            borderBottom: activeTab === "audience" ? "3px solid #0052cc" : "3px solid transparent",
            color: activeTab === "audience" ? "#0052cc" : "#64748b",
            fontWeight: "800",
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Users size={16} />
          <span>Customer Audience ({audience.totalCustomers})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("studio")}
          style={{
            padding: "10px 4px",
            background: "transparent",
            border: "none",
            borderBottom: activeTab === "studio" ? "3px solid #0052cc" : "3px solid transparent",
            color: activeTab === "studio" ? "#0052cc" : "#64748b",
            fontWeight: "800",
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Palette size={16} />
          <span>Voucher Studio &amp; Customizer</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("campaigns")}
          style={{
            padding: "10px 4px",
            background: "transparent",
            border: "none",
            borderBottom: activeTab === "campaigns" ? "3px solid #0052cc" : "3px solid transparent",
            color: activeTab === "campaigns" ? "#0052cc" : "#64748b",
            fontWeight: "800",
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Ticket size={16} />
          <span>Saved Campaigns ({campaigns.length})</span>
        </button>
      </div>

      {/* TAB 1: CUSTOMER AUDIENCE */}
      {activeTab === "audience" && (
        <div>
          {/* Controls Bar: Star filters & Search */}
          <div
            style={{
              background: "#ffffff",
              padding: "16px 20px",
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "14px",
              marginBottom: "20px",
            }}
          >
            {/* Star Rating Segment Filters */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setStarFilter("ALL")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontSize: "12.5px",
                  fontWeight: "700",
                  cursor: "pointer",
                  border: starFilter === "ALL" ? "1.5px solid #0052cc" : "1px solid #cbd5e1",
                  background: starFilter === "ALL" ? "#eff6ff" : "#ffffff",
                  color: starFilter === "ALL" ? "#0052cc" : "#64748b",
                }}
              >
                All Reviewers ({audience.totalCustomers})
              </button>
              <button
                type="button"
                onClick={() => setStarFilter("DETRACTORS")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontSize: "12.5px",
                  fontWeight: "700",
                  cursor: "pointer",
                  border: starFilter === "DETRACTORS" ? "1.5px solid #e11d48" : "1px solid #cbd5e1",
                  background: starFilter === "DETRACTORS" ? "#fff1f2" : "#ffffff",
                  color: starFilter === "DETRACTORS" ? "#e11d48" : "#64748b",
                }}
              >
                ⚠️ 1–3 Stars Recovery ({audience.detractorsCount})
              </button>
              <button
                type="button"
                onClick={() => setStarFilter("PROMOTERS")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontSize: "12.5px",
                  fontWeight: "700",
                  cursor: "pointer",
                  border: starFilter === "PROMOTERS" ? "1.5px solid #059669" : "1px solid #cbd5e1",
                  background: starFilter === "PROMOTERS" ? "#f0fdf4" : "#ffffff",
                  color: starFilter === "PROMOTERS" ? "#059669" : "#64748b",
                }}
              >
                🌟 4–5 Stars VIP ({audience.promotersCount})
              </button>
            </div>

            {/* Search Input */}
            <div style={{ position: "relative", minWidth: "260px" }}>
              <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                type="text"
                placeholder="Search by customer name, phone, review..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px 8px 34px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Customer Audience Table - Fixed layout to prevent text overlap */}
          <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", overflowX: "auto" }}>
            {filteredCustomers.length === 0 ? (
              <div style={{ padding: "48px 24px", textAlign: "center", color: "#64748b" }}>
                <Users size={36} color="#94a3b8" style={{ marginBottom: "12px" }} />
                <div style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>No customers found in this segment</div>
                <p style={{ fontSize: "13px", margin: "4px 0 0" }}>When customers submit ratings via your review QR, they will appear here automatically.</p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px", minWidth: "850px" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569", fontWeight: "700", fontSize: "12px", textTransform: "uppercase" }}>
                    <th style={{ padding: "12px 18px", width: "240px" }}>Customer</th>
                    <th style={{ padding: "12px 16px", width: "150px" }}>Contact</th>
                    <th style={{ padding: "12px 16px", width: "110px" }}>Rating Given</th>
                    <th style={{ padding: "12px 18px" }}>Review Snippet</th>
                    <th style={{ padding: "12px 16px", width: "95px" }}>Date</th>
                    <th style={{ padding: "12px 18px", width: "140px", textAlign: "right" }}>Offer Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((c) => {
                    const isLowRating = (c.star || 5) <= 3;
                    return (
                      <tr key={c._id} style={{ borderBottom: "1px solid #f1f5f9" }} className="hover-table-row">
                        <td style={{ padding: "14px 18px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                background: isLowRating ? "#fee2e2" : "#dcfce7",
                                color: isLowRating ? "#dc2626" : "#059669",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "800",
                                fontSize: "13px",
                                flexShrink: 0,
                              }}
                            >
                              {c.name ? c.name.slice(0, 2).toUpperCase() : "CU"}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: "700", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {c.name}
                              </div>
                              <div style={{ fontSize: "11px", color: isLowRating ? "#e11d48" : "#059669", fontWeight: "600", whiteSpace: "nowrap" }}>
                                {isLowRating ? "1-3★ Recovery Needed" : "4-5★ Loyalty VIP"}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: "14px 16px", color: "#475569", fontWeight: "600", whiteSpace: "nowrap" }}>
                          {c.mobile ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <Phone size={13} color="#64748b" />
                              <span>{c.mobile}</span>
                            </div>
                          ) : (
                            <span style={{ color: "#94a3b8" }}>No phone</span>
                          )}
                        </td>

                        <td style={{ padding: "14px 16px" }}>
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "4px 9px",
                              borderRadius: "6px",
                              background: isLowRating ? "#fef2f2" : "#f0fdf4",
                              border: isLowRating ? "1px solid #fecaca" : "1px solid #bbf7d0",
                              color: isLowRating ? "#dc2626" : "#15803d",
                              fontWeight: "800",
                              fontSize: "12px",
                            }}
                          >
                            <span>{c.star}.0</span>
                            <Star size={12} fill="currentColor" />
                          </div>
                        </td>

                        <td style={{ padding: "14px 18px", maxWidth: "300px" }}>
                          <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#334155" }}>
                            {c.review ? `"${c.review}"` : <span style={{ color: "#94a3b8", fontStyle: "italic" }}>No written review</span>}
                          </div>
                        </td>

                        <td style={{ padding: "14px 16px", color: "#64748b", fontSize: "12px", whiteSpace: "nowrap" }}>
                          {c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "Recent"}
                        </td>

                        <td style={{ padding: "14px 18px", textAlign: "right" }}>
                          <button
                            type="button"
                            onClick={() => {
                              setSendModalCustomer(c);
                              setModalMode("saved");
                              setCustomOfferTitle(isLowRating ? "Apology Care Voucher" : "VIP Customer Reward");
                              setCustomOfferValue(isLowRating ? "20% OFF or Free Starter" : "15% OFF");
                              setCustomCouponCode(isLowRating ? `CARE${Math.floor(100 + Math.random() * 900)}` : `VIP${Math.floor(100 + Math.random() * 900)}`);
                              setCustomColor(isLowRating ? "#e11d48" : "#059669");

                              // Pick appropriate campaign
                              const matchingCamp = campaigns.find((camp) =>
                                isLowRating ? camp.targetAudience === "DETRACTORS" : camp.targetAudience === "PROMOTERS"
                              );
                              if (matchingCamp) setSelectedCampaignToSend(matchingCamp._id);
                            }}
                            style={{
                              padding: "6px 14px",
                              borderRadius: "8px",
                              border: "none",
                              background: isLowRating ? "#e11d48" : "#0052cc",
                              color: "#ffffff",
                              fontSize: "12px",
                              fontWeight: "700",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <Gift size={13} />
                            <span>Send Offer</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: VOUCHER STUDIO & CUSTOMIZER */}
      {activeTab === "studio" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
            gap: "28px",
            alignItems: "flex-start",
          }}
        >
          {/* Controls Form */}
          <form
            onSubmit={handleSaveCampaign}
            style={{
              background: "#ffffff",
              padding: "26px",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                {editingCampaignId ? "Edit Campaign Offer" : "Voucher Customizer Studio"}
              </h2>
              {editingCampaignId && (
                <button
                  type="button"
                  onClick={handleResetStudio}
                  style={{ fontSize: "12px", color: "#0052cc", background: "none", border: "none", fontWeight: "700", cursor: "pointer" }}
                >
                  Create New Instead
                </button>
              )}
            </div>

            {/* Offer Type & Value */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                  Offer Type
                </label>
                <select
                  value={formOfferType}
                  onChange={(e) => {
                    setFormOfferType(e.target.value);
                    if (e.target.value === "PERCENT_OFF" && !formOfferValue.includes("%")) setFormOfferValue("15% OFF");
                    if (e.target.value === "FLAT_OFF" && !formOfferValue.includes("₹")) setFormOfferValue("Flat ₹200 OFF");
                    if (e.target.value === "FREE_GIFT") setFormOfferValue("Complimentary Starter / Dessert");
                  }}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                >
                  <option value="PERCENT_OFF">Percentage Discount (% OFF)</option>
                  <option value="FLAT_OFF">Flat Cash Off (₹ OFF)</option>
                  <option value="FREE_GIFT">Free Gift / Complimentary Item</option>
                  <option value="CUSTOM">Custom Privilege Offer</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                  Offer Highlight Headline *
                </label>
                <input
                  type="text"
                  value={formOfferValue}
                  onChange={(e) => setFormOfferValue(e.target.value)}
                  placeholder="e.g. 15% OFF or Free Drink"
                  required
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", fontWeight: "700" }}
                />
              </div>
            </div>

            {/* Title & Coupon Code */}
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "12px", marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                  Campaign Title *
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. VIP Customer Reward Pass"
                  required
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                  Coupon Code *
                </label>
                <input
                  type="text"
                  value={formCouponCode}
                  onChange={(e) => setFormCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. WELCOME15"
                  required
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px dashed #0052cc", fontSize: "13px", fontWeight: "800", letterSpacing: "1px", color: "#0052cc" }}
                />
              </div>
            </div>

            {/* Target Audience Segment */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                Target Reviewer Audience
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                {[
                  { id: "ALL", label: "All Reviewers", desc: "1 to 5 Stars" },
                  { id: "DETRACTORS", label: "1–3 Stars Only", desc: "Service Recovery" },
                  { id: "PROMOTERS", label: "4–5 Stars Only", desc: "Loyalty VIPs" },
                ].map((aud) => (
                  <button
                    key={aud.id}
                    type="button"
                    onClick={() => setFormTargetAudience(aud.id)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "8px",
                      textAlign: "left",
                      cursor: "pointer",
                      border: formTargetAudience === aud.id ? "2px solid #0052cc" : "1px solid #cbd5e1",
                      background: formTargetAudience === aud.id ? "#eff6ff" : "#ffffff",
                    }}
                  >
                    <div style={{ fontSize: "12px", fontWeight: "700", color: formTargetAudience === aud.id ? "#0052cc" : "#0f172a" }}>
                      {aud.label}
                    </div>
                    <div style={{ fontSize: "10.5px", color: "#64748b" }}>{aud.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Template Style Selector */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                Voucher Template Style
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "8px" }}>
                {TEMPLATE_STYLES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setFormTemplateStyle(t.id)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "8px",
                      border: formTemplateStyle === t.id ? "2px solid #0052cc" : "1px solid #cbd5e1",
                      background: formTemplateStyle === t.id ? "#eff6ff" : "#ffffff",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ fontSize: "12px", fontWeight: "700", color: formTemplateStyle === t.id ? "#0052cc" : "#0f172a" }}>
                      {t.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Theme Palette */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                Color Theme
              </label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setFormThemeColor(c.hex)}
                    title={c.label}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      backgroundColor: c.hex,
                      border: formThemeColor === c.hex ? "3px solid #0f172a" : "1px solid #e2e8f0",
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    }}
                  />
                ))}
                <input
                  type="color"
                  value={formThemeColor}
                  onChange={(e) => setFormThemeColor(e.target.value)}
                  style={{ width: "32px", height: "32px", border: "none", cursor: "pointer", background: "none" }}
                  title="Custom Color"
                />
              </div>
            </div>

            {/* Font Family Selector */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                Font Style
              </label>
              <select
                value={formFontFamily}
                onChange={(e) => setFormFontFamily(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
              >
                {FONTS.map((f) => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
            </div>

            {/* Expiry Date & Merchant Name */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={formExpiryDate}
                  onChange={(e) => setFormExpiryDate(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                  Merchant Brand Name
                </label>
                <input
                  type="text"
                  value={formBusinessName}
                  onChange={(e) => setFormBusinessName(e.target.value)}
                  placeholder="e.g. Acme Dining"
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                Terms &amp; Conditions
              </label>
              <textarea
                value={formTerms}
                onChange={(e) => setFormTerms(e.target.value)}
                rows={2}
                style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "12px", resize: "vertical" }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={savingCampaign}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: "10px",
                border: "none",
                background: "#0052cc",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "700",
                cursor: savingCampaign ? "not-allowed" : "pointer",
                boxShadow: "0 4px 14px rgba(0, 82, 204, 0.25)",
              }}
            >
              {savingCampaign ? "Saving..." : editingCampaignId ? "Save Changes" : "Save & Launch Campaign"}
            </button>
          </form>

          {/* Live Authentic Coupon Preview Column */}
          <div>
            <div style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: "800", color: "#475569", textTransform: "uppercase" }}>
                🎟️ Authentic Physical Coupon Ticket Look
              </span>
              <span style={{ fontSize: "11px", color: "#10b981", fontWeight: "700" }}>✓ Dual-Stub Perforated Pass</span>
            </div>

            {renderPhysicalCoupon({
              title: formTitle,
              description: formDescription,
              offerValue: formOfferValue,
              couponCode: formCouponCode,
              targetAudience: formTargetAudience,
              terms: formTerms,
              expiryDate: formExpiryDate,
              themeColor: formThemeColor,
              templateStyle: formTemplateStyle,
              fontFamily: formFontFamily,
              businessName: formBusinessName,
            })}

            <div style={{ marginTop: "18px", padding: "16px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0", fontSize: "12px", color: "#64748b" }}>
              <div style={{ fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>💡 How Customers Experience This:</div>
              Customers receive a direct link opening their digital ticket stub at <code>/voucher/{formCouponCode}</code>. It features real notch punch holes, dashed tear lines, barcode, and tap-to-copy button.
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SAVED CAMPAIGNS */}
      {activeTab === "campaigns" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
            gap: "20px",
          }}
        >
          {campaigns.map((camp) => (
            <div key={camp._id} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {renderPhysicalCoupon(camp)}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px", fontSize: "12px" }}>
                <span style={{ color: "#64748b" }}>Dispatched: <strong>{camp.sentCount || 0} times</strong></span>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <a
                    href={`/voucher/${camp.couponCode}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#0052cc", fontWeight: "700", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    <span>View Pass</span>
                    <ExternalLink size={12} />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleEditCampaign(camp)}
                    style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", color: "#475569", fontWeight: "600" }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCampaign(camp._id)}
                    style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", color: "#ef4444", fontWeight: "600" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SEND OFFER MODAL (Fixed overflow, clean layout + on-the-fly customizer) */}
      <AnimatePresence>
        {sendModalCustomer && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(15, 23, 42, 0.65)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10000,
              padding: "20px",
            }}
            onClick={() => setSendModalCustomer(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "18px",
                maxWidth: "540px",
                width: "100%",
                padding: "26px",
                boxShadow: "0 24px 48px rgba(0,0,0,0.22)",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                    Send Offer to {sendModalCustomer.name}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "3px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>
                      Rated {sendModalCustomer.star}.0★ · Phone: {sendModalCustomer.mobile || "N/A"}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "1px 7px",
                        borderRadius: "999px",
                        backgroundColor: (quota?.whatsappQuota ?? 0) > 0 ? "#f0fdf4" : "#fef2f2",
                        color: (quota?.whatsappQuota ?? 0) > 0 ? "#166534" : "#dc2626",
                        border: (quota?.whatsappQuota ?? 0) > 0 ? "1px solid #bbf7d0" : "1px solid #fecaca",
                      }}
                    >
                      💬 WhatsApp Quota: {quota?.whatsappQuota ?? 0}
                    </span>
                    <a
                      href="/subscription?tab=single&addon=wsp"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        color: "#0052cc",
                        textDecoration: "underline",
                      }}
                    >
                      + Refill
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSendModalCustomer(null)}
                  style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#94a3b8" }}
                >
                  ✕
                </button>
              </div>

              {/* Mode Toggle: Saved Campaign vs Quick Custom Offer */}
              <div style={{ display: "flex", background: "#f1f5f9", padding: "3px", borderRadius: "8px", marginBottom: "16px" }}>
                <button
                  type="button"
                  onClick={() => setModalMode("saved")}
                  style={{
                    flex: 1,
                    padding: "7px",
                    borderRadius: "6px",
                    border: "none",
                    fontWeight: "700",
                    fontSize: "12.5px",
                    cursor: "pointer",
                    background: modalMode === "saved" ? "#ffffff" : "transparent",
                    color: modalMode === "saved" ? "#0052cc" : "#64748b",
                    boxShadow: modalMode === "saved" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  🎟️ Choose Saved Campaign
                </button>
                <button
                  type="button"
                  onClick={() => setModalMode("custom")}
                  style={{
                    flex: 1,
                    padding: "7px",
                    borderRadius: "6px",
                    border: "none",
                    fontWeight: "700",
                    fontSize: "12.5px",
                    cursor: "pointer",
                    background: modalMode === "custom" ? "#ffffff" : "transparent",
                    color: modalMode === "custom" ? "#0052cc" : "#64748b",
                    boxShadow: modalMode === "custom" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  ⚡ Customize Quick Offer
                </button>
              </div>

              {/* MODE 1: CHOOSE SAVED CAMPAIGN */}
              {modalMode === "saved" && (
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                    Select Campaign Coupon:
                  </label>
                  <select
                    value={selectedCampaignToSend || ""}
                    onChange={(e) => setSelectedCampaignToSend(e.target.value)}
                    style={{
                      width: "100%",
                      maxWidth: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "13px",
                      fontWeight: "600",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {campaigns.map((camp) => (
                      <option key={camp._id} value={camp._id}>
                        {camp.title} · [{camp.offerValue}] (Code: {camp.couponCode})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* MODE 2: ON-THE-FLY CUSTOM COUPON */}
              {modalMode === "custom" && (
                <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "16px" }}>
                  <div style={{ fontSize: "12px", fontWeight: "800", color: "#0052cc", textTransform: "uppercase", marginBottom: "10px" }}>
                    Create Custom Coupon For This Customer:
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "10px", marginBottom: "10px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
                        Offer Discount / Gift
                      </label>
                      <input
                        type="text"
                        value={customOfferValue}
                        onChange={(e) => setCustomOfferValue(e.target.value)}
                        placeholder="e.g. 10% Discount or Free Coffee"
                        style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12.5px", fontWeight: "700" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
                        Coupon Code
                      </label>
                      <input
                        type="text"
                        value={customCouponCode}
                        onChange={(e) => setCustomCouponCode(e.target.value.toUpperCase())}
                        placeholder="e.g. SPECIAL10"
                        style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1.5px dashed #0052cc", fontSize: "12.5px", fontWeight: "800", color: "#0052cc" }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "10px" }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
                      Campaign Headline
                    </label>
                    <input
                      type="text"
                      value={customOfferTitle}
                      onChange={(e) => setCustomOfferTitle(e.target.value)}
                      placeholder="e.g. Apology Recovery Pass"
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12.5px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
                      Coupon Card Color
                    </label>
                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      {["#0052cc", "#059669", "#dc2626", "#7c3aed", "#d97706", "#0f172a"].map((hex) => (
                        <button
                          key={hex}
                          type="button"
                          onClick={() => setCustomColor(hex)}
                          style={{
                            width: "22px",
                            height: "22px",
                            borderRadius: "50%",
                            background: hex,
                            border: customColor === hex ? "2px solid #0f172a" : "none",
                            cursor: "pointer",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Message Preview Box - Properly wrapped without line overflow */}
              <div
                style={{
                  background: "#f8fafc",
                  padding: "14px",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  marginBottom: "20px",
                  fontSize: "12px",
                  color: "#334155",
                  wordBreak: "break-word",
                  lineHeight: 1.5,
                }}
              >
                <div style={{ fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>WhatsApp Message Preview:</div>
                <div style={{ fontStyle: "italic", color: "#475569" }}>
                  {(sendModalCustomer.star <= 3)
                    ? `Dear ${sendModalCustomer.name}, we value your candid feedback. Here is an exclusive ${modalMode === "custom" ? customOfferValue : "recovery"} pass for your next visit! Code: ${modalMode === "custom" ? customCouponCode : "VIPPASS"}`
                    : `Hi ${sendModalCustomer.name}, thank you for your ${sendModalCustomer.star}★ rating! Here is an exclusive ${modalMode === "custom" ? customOfferValue : "VIP"} reward pass: ${modalMode === "custom" ? customCouponCode : "VIP15"}`}
                </div>
              </div>

              {/* 12-Hour Session Window & Quota Info */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  marginBottom: "14px",
                  fontSize: "11.5px",
                  color: "#475569",
                }}
              >
                <span>
                  ⚡ Uses <strong>1 WhatsApp Quota</strong>. Re-sends to this customer within <strong>12 hours</strong> are free.
                </span>
                <span style={{ fontWeight: "700", color: "#0052cc" }}>
                  {quota?.whatsappQuota ?? 0} Left
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => handleSendToCustomer("WhatsApp")}
                  disabled={sendingOffer}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "9px",
                    border: "none",
                    background: "#25d366",
                    color: "#ffffff",
                    fontSize: "13.5px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <Send size={15} />
                  <span>Send via WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const code = modalMode === "custom" ? customCouponCode : (campaigns.find((c) => c._id === selectedCampaignToSend)?.couponCode || "OFFER");
                    navigator.clipboard.writeText(`${window.location.origin}/voucher/${code}`);
                    showToast("Voucher pass link copied!");
                  }}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "9px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#0f172a",
                    fontSize: "13.5px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Copy Link
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CampaignsPage;
