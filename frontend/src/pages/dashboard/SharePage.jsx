import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import QRCode from "qrcode";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import {
  Copy,
  Check,
  ExternalLink,
  Code,
  MessageCircle,
  Send,
  Globe,
  Layers,
  ArrowRight,
  QrCode,
  Download,
  Sparkles,
  User,
  Phone,
  UserCheck,
  Star,
  Smartphone,
  RefreshCw,
  Palette,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Printer,
  MoreVertical,
  ChevronDown,
} from "lucide-react";
import { ReviewStandee } from "../../components/dashboard/ReviewStandee";
import { ReviewBoosterQueue } from "../../components/dashboard/ReviewBoosterQueue";
import { getCleanBrandName } from "../../utils/brand";

export const SharePage = () => {
  const { user, companyDetails, isStaffOnly, quota, reloadProfile } = useAuth();
  const myStaffName = [user?.fname, user?.lname].filter(Boolean).join(" ").trim() || user?.uname || "";
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [platforms, setPlatforms] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [inviteLoggedCounter, setInviteLoggedCounter] = useState(0);

  // Active Tool View Tab (Default: "standees" or remembered from localStorage)
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("bizwoke_share_tab") || "standees";
  });
  const [toolMenuOpen, setToolMenuOpen] = useState(false);
  const toolMenuRef = useRef(null);

  // Close 3-dots dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolMenuRef.current && !toolMenuRef.current.contains(e.target)) {
        setToolMenuOpen(false);
      }
    };
    if (toolMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toolMenuOpen]);

  const SHARE_TOOLS = [
    { id: "standees", label: "Tabletop Standees & Print", icon: <Printer size={16} />, badge: "Print Ready" },
    { id: "whatsapp", label: "WhatsApp Dispatcher & Queue", icon: <MessageCircle size={16} />, badge: "1-Click & Auto" },
    { id: "qr", label: "Branded QR Studio", icon: <QrCode size={16} />, badge: "Vector SVG" },
    { id: "embeds", label: "Website Widgets & Embeds", icon: <Globe size={16} />, badge: "Carousel & Badge" },
    { id: "all", label: "All Tools (Expanded)", icon: <Layers size={16} />, badge: "Full View" },
  ];

  const currentTool = SHARE_TOOLS.find((t) => t.id === activeTab) || SHARE_TOOLS[0];

  // Direct Customer Invite Dispatcher State
  const [custName, setCustName] = useState("");
  const [custMobile, setCustMobile] = useState("");
  const [custStaff, setCustStaff] = useState(isStaffOnly ? myStaffName : "");
  const [selectedTemplate, setSelectedTemplate] = useState("express");

  // Custom Standalone QR Studio State
  const [qrColor, setQrColor] = useState("#0f172a");
  const [qrStaff, setQrStaff] = useState(isStaffOnly ? myStaffName : "");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [qrSvg, setQrSvg] = useState("");
  const [generatingQr, setGeneratingQr] = useState(false);
  const qrCanvasRef = useRef(null);

  // Social Proof Embed Studio State
  const [embedType, setEmbedType] = useState("carousel"); // "carousel" | "grid" | "badge"
  const [embedTheme, setEmbedTheme] = useState("light"); // "light" | "dark"

  const cleanBrandName = getCleanBrandName(user, companyDetails);

  const handleDispatch = async (channel = "WHATSAPP") => {
    if (channel === "WHATSAPP" && (quota?.whatsappQuota ?? 0) <= 0) {
      alert("⚠️ Your WhatsApp quota is exhausted (0 remaining). Please refill your quota from Subscription & Add-ons to send messages.");
      return;
    }
    if (custName.trim() && custMobile.trim()) {
      try {
        await api.logReviewInvite({
          customerName: custName.trim(),
          customerMobile: custMobile.trim(),
          staffMember: custStaff.trim(),
          channel,
          templateId: selectedTemplate,
        });
        setInviteLoggedCounter((prev) => prev + 1);
        if (reloadProfile) reloadProfile();
      } catch (err) {
        if (err?.message?.includes("quota exhausted") || err?.quotaExhausted) {
          alert("⚠️ WhatsApp quota exhausted. Please top up your quota from Subscription & Add-ons.");
        }
        console.error("Failed to log review invite:", err);
      }
    }
  };

  // Load connected platforms & staff members
  useEffect(() => {
    api
      .getPlatforms()
      .then((res) => {
        if (res.success) setPlatforms(res.platforms || []);
      })
      .catch(console.error);

    if (user?.formKey) {
      api
        .getPublicContext(user.formKey)
        .then((res) => {
          if (res?.staffMembers && Array.isArray(res.staffMembers)) {
            setStaffList(res.staffMembers);
          }
        })
        .catch(() => {});
    }
  }, [user?.formKey]);

  // Fallback staff list if none configured yet
  const availableStaff =
    staffList.length > 0
      ? staffList
      : ["Rahul", "Priya", "Amit", "Front Desk", "Customer Service"];

  // Base Review URL
  const baseReviewUrl = user?.formKey
    ? `${window.location.origin}/wtr/${user.formKey}`
    : `${window.location.origin}/wtr/demo`;

  // Function to build dynamic personalized link
  const buildPersonalizedUrl = (nameVal, mobileVal, staffVal) => {
    const params = new URLSearchParams();
    if (nameVal && nameVal.trim()) params.set("name", nameVal.trim());
    if (mobileVal && mobileVal.trim()) {
      const cleanMob = mobileVal.replace(/[^0-9]/g, "").slice(-10);
      if (cleanMob) params.set("mobile", cleanMob);
    }
    if (staffVal && staffVal.trim()) params.set("staff", staffVal.trim());
    params.set("star", "5"); // Pre-populate 5 stars for high conversion
    const qs = params.toString();
    return qs ? `${baseReviewUrl}?${qs}` : baseReviewUrl;
  };

  const currentPersonalizedUrl = buildPersonalizedUrl(custName, custMobile, custStaff);

  // Invite Templates Catalog
  const templates = {
    express: {
      id: "express",
      title: "⚡ Quick & Express",
      badge: "Highest Conversion",
      text: (name, brand, staff, link) =>
        `Hi ${name || "there"}! Thank you for choosing ${brand}. We would truly appreciate your quick 30-second review to help us serve you even better: ${link}`,
    },
    staff: {
      id: "staff",
      title: "🌟 Staff Recognition",
      badge: "Team Motivation",
      text: (name, brand, staff, link) =>
        `Hi ${name || "there"}! Thank you for visiting ${brand}. ${
          staff ? `${staff} and our entire team were` : "Our team was"
        } thrilled to serve you today! Could you take a moment to rate your experience? ${link}`,
    },
    hinglish: {
      id: "hinglish",
      title: "🇮🇳 Friendly Hinglish",
      badge: "Local Connection",
      text: (name, brand, staff, link) =>
        `Namaste ${name || "ji"}! ${brand} visit karne ke liye aapka bahut-bahut shukriya. Kripya apna chota sa feedback yahan share karein (sirf 30 seconds): ${link}`,
    },
    vip: {
      id: "vip",
      title: "💎 VIP & Appreciation",
      badge: "Executive Tone",
      text: (name, brand, staff, link) =>
        `Dear ${name || "Valued Customer"}, thank you for placing your trust in ${brand}. Your satisfaction is our utmost priority. Please share your valuable thoughts with us: ${link}`,
    },
  };

  const currentMessageText = templates[selectedTemplate].text(
    custName,
    cleanBrandName,
    custStaff,
    currentPersonalizedUrl
  );

  // Clean 10-digit mobile
  const cleanMobileDigits = custMobile.replace(/[^0-9]/g, "").slice(-10);
  const waTarget = cleanMobileDigits.length === 10 ? `91${cleanMobileDigits}` : "";

  const waUrl = waTarget
    ? `https://wa.me/${waTarget}?text=${encodeURIComponent(currentMessageText)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(currentMessageText)}`;

  const smsUrl =
    cleanMobileDigits.length === 10
      ? `sms:${cleanMobileDigits}?body=${encodeURIComponent(currentMessageText)}`
      : `sms:?body=${encodeURIComponent(currentMessageText)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentPersonalizedUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(currentMessageText);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2000);
  };

  // Generate Custom Standalone QR Code
  useEffect(() => {
    const generateCustomQR = async () => {
      try {
        setGeneratingQr(true);
        const targetUrl = buildPersonalizedUrl("", "", qrStaff);

        // 1. Generate high-res Data URL PNG (1000px)
        const dataUrl = await QRCode.toDataURL(targetUrl, {
          width: 1000,
          margin: 2,
          color: {
            dark: qrColor,
            light: "#ffffff",
          },
          errorCorrectionLevel: "H",
        });
        setQrDataUrl(dataUrl);

        // 2. Generate SVG Vector
        const svgString = await QRCode.toString(targetUrl, {
          type: "svg",
          margin: 2,
          color: {
            dark: qrColor,
            light: "#ffffff",
          },
          errorCorrectionLevel: "H",
        });
        setQrSvg(svgString);

        // 3. Render directly to preview canvas
        if (qrCanvasRef.current) {
          await QRCode.toCanvas(qrCanvasRef.current, targetUrl, {
            width: 220,
            margin: 2,
            color: {
              dark: qrColor,
              light: "#ffffff",
            },
            errorCorrectionLevel: "H",
          });
        }
      } catch (err) {
        console.error("QR Generation error:", err);
      } finally {
        setGeneratingQr(false);
      }
    };

    generateCustomQR();
  }, [user?.formKey, qrColor, qrStaff, activeTab]);

  const downloadQrPng = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    const safeBrand = cleanBrandName.replace(/[^a-zA-Z0-9]/g, "_");
    link.download = `${safeBrand}_QR_${qrStaff ? qrStaff + "_" : ""}${qrColor.replace("#", "")}.png`;
    link.click();
  };

  const downloadQrSvg = () => {
    if (!qrSvg) return;
    const blob = new Blob([qrSvg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const safeBrand = cleanBrandName.replace(/[^a-zA-Z0-9]/g, "_");
    link.download = `${safeBrand}_QR_Vector_${qrStaff ? qrStaff + "_" : ""}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getWidgetUrl = () => {
    const origin = window.location.origin;
    const key = user?.formKey || "demo";
    if (embedType === "badge") {
      return `${origin}/embed/badge/${key}?theme=${embedTheme}`;
    }
    return `${origin}/embed/reviews/${key}?layout=${embedType}&theme=${embedTheme}`;
  };

  const getWidgetIframeSnippet = () => {
    const url = getWidgetUrl();
    if (embedType === "badge") {
      return `<iframe src="${url}" width="260" height="75" frameborder="0" style="border:none;position:fixed;bottom:20px;right:20px;z-index:99999;" allowtransparency="true"></iframe>`;
    }
    const height = embedType === "grid" ? "480" : "320";
    return `<iframe src="${url}" width="100%" height="${height}" frameborder="0" style="border:none;border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,0.06);" allowtransparency="true"></iframe>`;
  };

  const widgetSnippet = getWidgetIframeSnippet();

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(widgetSnippet);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  const colorPresets = [
    { name: "Obsidian Black", hex: "#0f172a" },
    { name: "Bizwoke Blue", hex: "#2563eb" },
    { name: "Emerald Green", hex: "#059669" },
    { name: "Royal Purple", hex: "#7c3aed" },
    { name: "Crimson Red", hex: "#dc2626" },
  ];

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Header */}
      <div className="no-print">
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--secondary)", margin: 0 }}>
          Share &amp; Collect Customer Reviews
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
          Send 1-click personalized WhatsApp invitations, generate branded QR codes, or print counter standees.
        </p>

        {/* Connected Platforms Bar */}
        <div
          style={{
            marginTop: "14px",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            padding: "8px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "nowrap",
            gap: "10px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            minWidth: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0, flex: 1, overflow: "hidden" }}>
            <span
              style={{
                fontSize: "12.5px",
                fontWeight: "700",
                color: "#334155",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <Layers size={15} color="var(--primary)" style={{ flexShrink: 0 }} />
              <span>Standee Scanner Routes To:</span>
            </span>
            <div style={{ display: "flex", gap: "6px", alignItems: "center", minWidth: 0, overflow: "hidden" }}>
              {platforms
                .filter((p) => p.active === 1)
                .map((p) => {
                  const isGoogle = p.webName?.toLowerCase().includes("google");
                  const isGlassdoor = p.webName?.toLowerCase().includes("glassdoor");
                  return (
                    <span
                      key={p._id}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "3px 9px",
                        borderRadius: "9999px",
                        background: isGoogle ? "#eff6ff" : isGlassdoor ? "#f0fdf4" : "#f8fafc",
                        border: `1px solid ${
                          isGoogle ? "#bfdbfe" : isGlassdoor ? "#bbf7d0" : "#e2e8f0"
                        }`,
                        color: isGoogle ? "#1d4ed8" : isGlassdoor ? "#15803d" : "#475569",
                        fontSize: "11.5px",
                        fontWeight: "700",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      <span>{isGoogle ? "★ Google" : isGlassdoor ? "★ Glassdoor" : `★ ${p.webName}`}</span>
                    </span>
                  );
                })}
              {platforms.length === 0 && (
                <span style={{ fontSize: "11.5px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                  No platforms connected yet.
                </span>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
            <Link
              to="/platform"
              className="btn btn-primary btn-sm"
              style={{
                padding: "6px 11px",
                fontSize: "11.5px",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                whiteSpace: "nowrap",
                flexShrink: 0,
                borderRadius: "8px",
              }}
            >
              <span>Manage Platforms</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Tool View Switcher with 3-Dots Menu */}
      <div
        className="no-print"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 14px",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "14px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
          position: "relative",
          gap: "10px",
          flexWrap: "nowrap",
        }}
      >
        {/* Left: Active Tool Indicator / Quick Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0, flex: 1 }}>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap", flexShrink: 0 }}>
            Active Tool:
          </span>
          <button
            type="button"
            onClick={() => setToolMenuOpen(!toolMenuOpen)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "6px 12px",
              background: "#f8fafc",
              border: "1.5px solid #cbd5e1",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "all 0.15s ease",
              minWidth: 0,
              maxWidth: "100%",
            }}
            title="Click or use the 3-dots button to switch tools"
          >
            <span style={{ color: "var(--primary)", display: "flex", alignItems: "center", flexShrink: 0 }}>
              {currentTool.icon}
            </span>
            <span style={{ fontSize: "12.5px", fontWeight: "700", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {currentTool.label}
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: "700",
                padding: "2px 7px",
                borderRadius: "9999px",
                background: "var(--primary-light)",
                color: "var(--primary)",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {currentTool.badge}
            </span>
            <ChevronDown size={14} color="#64748b" style={{ flexShrink: 0 }} />
          </button>
        </div>

        {/* Right: 3-Dots Action Button & Dropdown Menu */}
        <div style={{ position: "relative", flexShrink: 0 }} ref={toolMenuRef}>
          <button
            type="button"
            onClick={() => setToolMenuOpen(!toolMenuOpen)}
            className="btn btn-outline"
            style={{
              width: "36px",
              height: "36px",
              padding: 0,
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderColor: toolMenuOpen ? "var(--primary)" : "#cbd5e1",
              background: toolMenuOpen ? "var(--primary-light)" : "#ffffff",
              color: toolMenuOpen ? "var(--primary)" : "#334155",
              cursor: "pointer",
              flexShrink: 0,
            }}
            title="More Options / Switch Tool (3 Dots)"
            aria-label="More Options / Switch Tool"
          >
            <MoreVertical size={18} />
          </button>

          {/* 3-Dots Floating Dropdown Menu */}
          {toolMenuOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 8px)",
                width: "290px",
                background: "#ffffff",
                borderRadius: "14px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 12px 32px rgba(15, 23, 42, 0.14)",
                padding: "8px",
                zIndex: 1000,
                animation: "fadeIn 0.15s ease",
              }}
            >
              <div
                style={{
                  padding: "6px 10px 8px",
                  borderBottom: "1px solid #f1f5f9",
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Select Tool / View</span>
                <span style={{ fontSize: "10px", color: "#64748b" }}>{SHARE_TOOLS.length} Available</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginTop: "4px" }}>
                {SHARE_TOOLS.map((tool) => {
                  const isSelected = activeTab === tool.id;
                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(tool.id);
                        localStorage.setItem("bizwoke_share_tab", tool.id);
                        setToolMenuOpen(false);
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "9px 12px",
                        borderRadius: "8px",
                        border: "none",
                        background: isSelected ? "#eff6ff" : "transparent",
                        color: isSelected ? "var(--primary)" : "#334155",
                        cursor: "pointer",
                        textAlign: "left",
                        fontSize: "13px",
                        fontWeight: isSelected ? "700" : "500",
                        transition: "background 0.12s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.background = "#f8fafc";
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ color: isSelected ? "var(--primary)" : "#64748b", display: "flex" }}>
                          {tool.icon}
                        </span>
                        <div>
                          <div style={{ lineHeight: 1.2 }}>{tool.label}</div>
                          <span style={{ fontSize: "10px", color: "#94a3b8" }}>{tool.badge}</span>
                        </div>
                      </div>
                      {isSelected && <Check size={16} color="var(--primary)" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Featured Printable Counter Standee & High-Res Flyer */}
      {(activeTab === "all" || activeTab === "standees") && (
        <ReviewStandee user={user} companyDetails={companyDetails} />
      )}

      {/* FEATURE 7 & 10: WhatsApp Dispatcher & Follow-up Queue */}
      {(activeTab === "all" || activeTab === "whatsapp") && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* FEATURE 7 HERO: 1-Click Personalized WhatsApp & SMS Dispatcher */}
          <div
            className="card no-print"
        style={{
          padding: "24px",
          background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
          border: "1.5px solid #86efac",
          boxShadow: "0 10px 25px -5px rgba(22, 163, 74, 0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "#16a34a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)",
              }}
            >
              <MessageCircle size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#14532d", margin: 0 }}>
                1-Click Customer Review Dispatcher
              </h2>
              <p style={{ fontSize: "13px", color: "#166534", margin: "2px 0 0 0" }}>
                Generate personalized WhatsApp invitations with prefilled customer name &amp; staff attribution
              </p>
            </div>
          </div>
          <span
            style={{
              padding: "4px 10px",
              background: "#dcfce7",
              color: "#15803d",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: "700",
              border: "1px solid #86efac",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Sparkles size={13} />
            3.5x Faster Review Completion
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "20px", marginTop: "12px" }}>
          {/* Dispatch Inputs Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Customer Name & Mobile Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "5px" }}>
                  Customer Name
                </label>
                <div style={{ position: "relative" }}>
                  <User size={15} style={{ position: "absolute", left: "10px", top: "11px", color: "#9ca3af" }} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Rohit Sharma"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    style={{ paddingLeft: "32px", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "5px" }}>
                  WhatsApp / Mobile Number
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "10px", top: "8px", fontSize: "12px", fontWeight: "700", color: "#6b7280" }}>
                    +91
                  </span>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="9876543210"
                    maxLength={10}
                    inputMode="numeric"
                    value={custMobile}
                    onChange={(e) => setCustMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    style={{ paddingLeft: "42px", fontSize: "13px" }}
                  />
                </div>
              </div>
            </div>

            {/* Staff Attribution Selector */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "5px" }}>
                Staff Member Attributed (Optional)
              </label>
              <div style={{ position: "relative" }}>
                <UserCheck size={15} style={{ position: "absolute", left: "10px", top: "11px", color: "#9ca3af" }} />
                <select
                  className="form-select"
                  value={custStaff}
                  onChange={(e) => setCustStaff(e.target.value)}
                  style={{ paddingLeft: "32px", fontSize: "13px" }}
                >
                  <option value="">-- No specific staff (General Team) --</option>
                  {availableStaff.map((s, idx) => (
                    <option key={idx} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <p style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>
                💡 Attributing staff credits this review to their individual leaderboard score.
              </p>
            </div>

            {/* Message Tone & Template Selector */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>
                Message Tone / Template
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {Object.values(templates).map((tmpl) => {
                  const isSelected = selectedTemplate === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => setSelectedTemplate(tmpl.id)}
                      style={{
                        padding: "10px 12px",
                        textAlign: "left",
                        borderRadius: "10px",
                        border: isSelected ? "2px solid #16a34a" : "1.5px solid #e2e8f0",
                        background: isSelected ? "#f0fdf4" : "#ffffff",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ fontSize: "13px", fontWeight: "700", color: isSelected ? "#15803d" : "#334155" }}>
                        {tmpl.title}
                      </div>
                      <div style={{ fontSize: "10px", color: isSelected ? "#16a34a" : "#94a3b8", fontWeight: "600", marginTop: "2px" }}>
                        {tmpl.badge}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dispatch Action Buttons */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "8px" }}>
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleDispatch("WHATSAPP")}
                style={{
                  flex: 1,
                  minWidth: "160px",
                  background: "#16a34a",
                  color: "#ffffff",
                  padding: "12px 18px",
                  borderRadius: "10px",
                  fontWeight: "700",
                  fontSize: "13px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(22, 163, 74, 0.3)",
                  transition: "transform 0.15s ease",
                }}
              >
                <MessageCircle size={17} />
                <span>Send WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  handleCopyMessage();
                  handleDispatch("LINK");
                }}
                className="btn btn-outline"
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "600",
                  background: "#ffffff",
                }}
              >
                {copiedMsg ? <Check size={16} color="#16a34a" /> : <Copy size={16} />}
                <span>{copiedMsg ? "Copied Message!" : "Copy Text"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleCopyLink();
                  handleDispatch("LINK");
                }}
                className="btn btn-outline"
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "600",
                  background: "#ffffff",
                }}
              >
                {copiedLink ? <Check size={16} color="#16a34a" /> : <Share2 size={16} />}
                <span>{copiedLink ? "Copied Link!" : "Copy Link"}</span>
              </button>
            </div>
          </div>

          {/* WhatsApp Simulation Phone Mockup Column */}
          <div
            style={{
              background: "#075e54",
              borderRadius: "18px",
              padding: "14px",
              boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
              maxWidth: "380px",
              margin: "0 auto",
              width: "100%",
            }}
          >
            {/* WhatsApp Chat Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                borderBottom: "1px solid rgba(255,255,255,0.15)",
                paddingBottom: "10px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "#25d366",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "800",
                  fontSize: "14px",
                }}
              >
                {(custName || "C").charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "14px", fontWeight: "700", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {custName || "Customer Name"}
                </div>
                <div style={{ fontSize: "11px", color: "#a7f3d0" }}>
                  {custMobile ? `+91 ${custMobile}` : "online · WhatsApp"}
                </div>
              </div>
            </div>

            {/* Chat Body Simulation */}
            <div
              style={{
                background: "#ece5dd",
                borderRadius: "12px",
                padding: "14px",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                color: "#111827",
                minHeight: "220px",
                backgroundImage: "radial-gradient(#d1d5db 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            >
              {/* Message Bubble */}
              <div
                style={{
                  background: "#e7fed8",
                  padding: "10px 12px",
                  borderRadius: "10px 10px 2px 10px",
                  alignSelf: "flex-end",
                  maxWidth: "92%",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  fontSize: "12px",
                  lineHeight: 1.5,
                  position: "relative",
                }}
              >
                <p style={{ margin: "0 0 6px 0", color: "#1f2937" }}>
                  {currentMessageText}
                </p>

                {/* Rich Link Card Snippet */}
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    padding: "8px 10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "6px",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "6px",
                      background: "#2563eb",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Star size={16} fill="#facc15" color="#facc15" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "11px", fontWeight: "700", color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      Rate {cleanBrandName}
                    </div>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>
                      Prefilled 5★ · Verified Customer
                    </div>
                  </div>
                </div>

                {/* Timestamp & double tick */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "3px", marginTop: "4px" }}>
                  <span style={{ fontSize: "10px", color: "#6b7280" }}>Just now</span>
                  <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "800" }}>✓✓</span>
                </div>
              </div>
            </div>

            {/* Bottom status badge */}
            <div style={{ textAlign: "center", marginTop: "8px", fontSize: "11px", color: "#d1fae5" }}>
              ⚡ Customer clicks link → Name &amp; Phone auto-fill on rating form!
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE 10: Review Booster & Automated Follow-up Queue */}
      <ReviewBoosterQueue
        brandName={cleanBrandName}
        formKey={user?.formKey}
        onInviteLoggedTrigger={inviteLoggedCounter}
      />
        </div>
      )}

      {/* FEATURE 7 B: Standalone Custom QR Studio & Brand Styler */}
      {(activeTab === "all" || activeTab === "qr") && (
        <div
          className="card no-print"
        style={{
          padding: "24px",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "#0f172a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
              }}
            >
              <QrCode size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "800", color: "var(--secondary)", margin: 0 }}>
                High-Resolution QR Code Studio
              </h2>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                Generate standalone branded QR codes for bill folders, table stickers, receipts, or staff ID badges
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={downloadQrPng}
              disabled={generatingQr || !qrDataUrl}
              className="btn btn-primary btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Download size={14} />
              <span>Download PNG (1000px)</span>
            </button>
            <button
              onClick={downloadQrSvg}
              disabled={generatingQr || !qrSvg}
              className="btn btn-outline btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Download size={14} />
              <span>Vector SVG</span>
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "24px", alignItems: "center" }}>
          {/* Controls Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Color Palette Selector */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#374151", margin: 0 }}>
                  QR Code Theme Color
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: qrColor,
                      display: "inline-block",
                      border: "1px solid rgba(0,0,0,0.1)",
                    }}
                  />
                  <span style={{ fontSize: "12px", fontWeight: "700", color: qrColor }}>
                    {colorPresets.find((c) => c.hex === qrColor)?.name || "Custom"}
                  </span>
                </div>
              </div>

              <select
                className="form-select"
                value={qrColor}
                onChange={(e) => setQrColor(e.target.value)}
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {colorPresets.map((c) => (
                  <option key={c.hex} value={c.hex}>
                    ● {c.name} ({c.hex})
                  </option>
                ))}
              </select>
            </div>

            {/* Staff Attribution for Individual QR Badges */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "5px" }}>
                Staff Member QR Badge (Optional)
              </label>
              <select
                className="form-select"
                value={qrStaff}
                onChange={(e) => setQrStaff(e.target.value)}
                style={{ fontSize: "13px" }}
              >
                <option value="">-- General QR Code (All Staff) --</option>
                {availableStaff.map((s, idx) => (
                  <option key={idx} value={s}>
                    Personal QR for {s}
                  </option>
                ))}
              </select>
              <p style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>
                🎯 Print personal stickers for staff aprons or desks. Scans will credit that staff member automatically!
              </p>
            </div>

            {/* Target URL Display */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "5px" }}>
                QR Target URL
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#f8fafc",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                  color: "#64748b",
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                }}
              >
                {buildPersonalizedUrl("", "", qrStaff)}
              </div>
            </div>
          </div>

          {/* QR Visual Display Preview Box */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              background: "#f8fafc",
              border: "1px dashed #cbd5e1",
              borderRadius: "14px",
            }}
          >
            <div
              style={{
                background: "#ffffff",
                padding: "16px",
                borderRadius: "12px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`${cleanBrandName} QR Code`}
                  style={{
                    width: "220px",
                    height: "220px",
                    borderRadius: "8px",
                    display: "block",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <canvas ref={qrCanvasRef} style={{ borderRadius: "8px", width: "220px", height: "220px" }} />
              )}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "12px", fontWeight: "800", color: "#1e293b" }}>
                  {cleanBrandName}
                </div>
                <div style={{ fontSize: "11px", color: qrColor, fontWeight: "700" }}>
                  {qrStaff ? `Staff Badge: ${qrStaff}` : "Scan To Review Us"}
                </div>
              </div>
            </div>
            <span style={{ fontSize: "11px", color: "#94a3b8", marginTop: "10px" }}>
              High-resolution 1000x1000px · Vector SVG scalable without quality loss
            </span>
          </div>
        </div>
      </div>
      )}

      {/* FEATURE 9: Additional Digital Distribution Channels & Embeds */}
      {(activeTab === "all" || activeTab === "embeds") && (
        <div className="no-print" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "800", color: "var(--secondary)", marginTop: "8px" }}>
          Digital Sharing &amp; Web Integration
        </h2>

        {/* Direct Link & Quick-Share Card (Full-width, zero wasted space) */}
        <div
          className="card"
          style={{
            padding: "20px 24px",
            background: "#ffffff",
            border: "1.5px solid #e2e8f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: "800", margin: 0, color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>Direct Customer Review URL</span>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#16a34a", background: "#dcfce7", padding: "2px 8px", borderRadius: "9999px" }}>
                  Live &amp; Public
                </span>
              </h3>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
                Share this generic review link on social media bios, email signatures, or billing receipts:
              </p>
            </div>

            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "11px", color: "#475569", background: "#f1f5f9", padding: "4px 10px", borderRadius: "6px", fontWeight: "600" }}>
                📱 Social Bios
              </span>
              <span style={{ fontSize: "11px", color: "#475569", background: "#f1f5f9", padding: "4px 10px", borderRadius: "6px", fontWeight: "600" }}>
                🧾 Invoices &amp; Bills
              </span>
              <span style={{ fontSize: "11px", color: "#475569", background: "#f1f5f9", padding: "4px 10px", borderRadius: "6px", fontWeight: "600" }}>
                💬 WhatsApp Auto-reply
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "#f8fafc",
              padding: "8px 12px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0 }}>
              <Globe size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
              <input
                type="text"
                readOnly
                value={baseReviewUrl}
                style={{
                  flex: 1,
                  minWidth: 0,
                  background: "transparent",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--primary)",
                  outline: "none",
                  textOverflow: "ellipsis",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(baseReviewUrl);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="btn btn-primary btn-sm"
                style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "7px 14px", fontSize: "12px", fontWeight: "700" }}
              >
                {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
              </button>

              <a
                href={baseReviewUrl}
                className="btn btn-outline btn-sm"
                style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "7px 12px", fontSize: "12px", textDecoration: "none" }}
              >
                <span>Test Link</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>

        {/* FEATURE 9: Social Proof Website Embed Studio (Full width with optimal preview) */}
        <div
          className="card"
          style={{
            padding: "24px",
            background: "#ffffff",
            border: "1.5px solid #e2e8f0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
            {/* Studio Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Code size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                    Social Proof Website Embed Studio
                  </h3>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                    Showcase verified 4★ &amp; 5★ customer reviews live on your website
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <a
                  href={getWidgetUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12px" }}
                >
                  <span>Test Widget in New Tab</span>
                  <ExternalLink size={12} />
                </a>
                <button
                  onClick={handleCopyEmbed}
                  className="btn btn-primary btn-sm"
                  style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "700" }}
                >
                  {copiedEmbed ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedEmbed ? "Copied Snippet!" : "Copy Embed HTML"}</span>
                </button>
              </div>
            </div>

            {/* Customization Controls Bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
                background: "#f8fafc",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
              }}
            >
              {/* Format Switcher */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>Widget Layout:</span>
                {[
                  { id: "carousel", label: "🌟 Testimonial Carousel (Slider)" },
                  { id: "grid", label: "📊 Review Wall (Grid)" },
                  { id: "badge", label: "🛡️ Corner Rating Badge" },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setEmbedType(fmt.id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "700",
                      border: embedType === fmt.id ? "2px solid #2563eb" : "1px solid #cbd5e1",
                      background: embedType === fmt.id ? "#eff6ff" : "#ffffff",
                      color: embedType === fmt.id ? "#1d4ed8" : "#334155",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>

              {/* Theme Switcher */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>Theme:</span>
                <button
                  type="button"
                  onClick={() => setEmbedTheme("light")}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: "700",
                    border: embedTheme === "light" ? "2px solid #2563eb" : "1px solid #cbd5e1",
                    background: embedTheme === "light" ? "#eff6ff" : "#ffffff",
                    color: embedTheme === "light" ? "#1d4ed8" : "#475569",
                    cursor: "pointer",
                  }}
                >
                  ☀️ Light
                </button>
                <button
                  type="button"
                  onClick={() => setEmbedTheme("dark")}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: "700",
                    border: embedTheme === "dark" ? "2px solid #0f172a" : "1px solid #cbd5e1",
                    background: embedTheme === "dark" ? "#0f172a" : "#ffffff",
                    color: embedTheme === "dark" ? "#ffffff" : "#475569",
                    cursor: "pointer",
                  }}
                >
                  🌙 Dark
                </button>
              </div>
            </div>

            {/* Live Interactive Iframe Preview */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Live Interactive Widget Preview
                </span>
                <span style={{ fontSize: "11px", color: "#10b981", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Sparkles size={12} />
                  Connected to Real Customer Ratings
                </span>
              </div>
              <div
                style={{
                  background: embedTheme === "dark" ? "#020617" : "#f1f5f9",
                  padding: "16px",
                  borderRadius: "14px",
                  border: "1px dashed #cbd5e1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: embedType === "badge" ? "100px" : embedType === "grid" ? "430px" : "290px",
                }}
              >
                <iframe
                  key={`${embedType}-${embedTheme}`}
                  src={getWidgetUrl()}
                  title="Widget Preview"
                  style={{
                    width: "100%",
                    maxWidth: embedType === "badge" ? "320px" : "100%",
                    height: embedType === "badge" ? "75px" : embedType === "grid" ? "410px" : "270px",
                    border: "none",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                    background: "transparent",
                  }}
                />
              </div>
            </div>

            {/* Ready-to-Embed HTML Snippet Box */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>
                  HTML Iframe Code (Paste anywhere on your WordPress, Shopify, Wix, or Custom Website):
                </span>
                <button
                  type="button"
                  onClick={handleCopyEmbed}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--primary)",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {copiedEmbed ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
                  <span>{copiedEmbed ? "Copied!" : "Copy Code"}</span>
                </button>
              </div>
              <pre
                style={{
                  background: "#0f172a",
                  color: "#38bdf8",
                  padding: "14px",
                  borderRadius: "10px",
                  fontSize: "12px",
                  overflowX: "auto",
                  fontFamily: "monospace",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {widgetSnippet}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
