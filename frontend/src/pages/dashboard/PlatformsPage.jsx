import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import QRCode from "qrcode";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { getCleanBrandName } from "../../utils/brand";
import {
  Globe,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Layers,
  Sparkles,
  X,
  Loader2,
  QrCode,
  Download,
  Copy,
  Check,
  MessageCircle,
  Send,
  Star,
  Search,
  Filter,
  Users,
  Phone,
} from "lucide-react";

const PRESET_PLATFORMS = [
  {
    id: "Google Reviews",
    name: "Google Reviews",
    icon: "google",
    color: "#4285F4",
    bg: "#eff6ff",
    border: "#bfdbfe",
    badge: "G",
    placeholder: "https://g.page/r/your-google-place-id/review",
    hint: "Official Google Business / Google Maps direct review link (Recommended)",
  },
  {
    id: "Justdial",
    name: "Justdial",
    icon: "justdial",
    color: "#ea580c",
    bg: "#fff7ed",
    border: "#fed7aa",
    badge: "JD",
    placeholder: "https://www.justdial.com/city/your-business-name",
    hint: "Justdial local business rating & review profile URL",
  },
  {
    id: "Glassdoor",
    name: "Glassdoor",
    icon: "glassdoor",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    badge: "GD",
    placeholder: "https://www.glassdoor.co.in/Reviews/your-company-reviews",
    hint: "Glassdoor employer & company workplace review link",
  },
  {
    id: "Facebook",
    name: "Facebook Reviews",
    icon: "facebook",
    color: "#1877f2",
    bg: "#eff6ff",
    border: "#bfdbfe",
    badge: "FB",
    placeholder: "https://www.facebook.com/your-page-handle/reviews",
    hint: "Facebook official business page recommendations & rating URL",
  },
  {
    id: "AmbitionBox",
    name: "AmbitionBox",
    icon: "ambitionbox",
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    badge: "AB",
    placeholder: "https://www.ambitionbox.com/reviews/your-company-reviews",
    hint: "AmbitionBox workplace, interview & company reviews",
  },
  {
    id: "Animationbox",
    name: "Animationbox",
    icon: "animationbox",
    color: "#ec4899",
    bg: "#fdf2f8",
    border: "#fbcfe8",
    badge: "AN",
    placeholder: "https://www.animationbox.com/your-profile",
    hint: "Animationbox profile & portfolio review link",
  },
  {
    id: "TripAdvisor",
    name: "TripAdvisor",
    icon: "tripadvisor",
    color: "#0d9488",
    bg: "#f0fdfa",
    border: "#99f6e4",
    badge: "TA",
    placeholder: "https://www.tripadvisor.com/UserReviewEdit-...",
    hint: "TripAdvisor hotel, clinic, restaurant or travel review page",
  },
  {
    id: "Trustpilot",
    name: "Trustpilot",
    icon: "trustpilot",
    color: "#059669",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    badge: "TP",
    placeholder: "https://www.trustpilot.com/review/yourdomain.com",
    hint: "Trustpilot public verified customer reviews profile",
  },
  {
    id: "Zomato",
    name: "Zomato",
    icon: "zomato",
    color: "#e11d48",
    bg: "#fff1f2",
    border: "#fecdd3",
    badge: "Z",
    placeholder: "https://www.zomato.com/city/restaurant-name",
    hint: "Zomato restaurant dining & delivery review link",
  },
  {
    id: "Practo",
    name: "Practo",
    icon: "practo",
    color: "#0284c7",
    bg: "#f0f9ff",
    border: "#bae6fd",
    badge: "PR",
    placeholder: "https://www.practo.com/clinic-or-doctor/reviews",
    hint: "Practo healthcare, clinic & doctor patient feedback page",
  },
  {
    id: "Other",
    name: "Other (Custom Platform)",
    icon: "globe",
    color: "#475569",
    bg: "#f8fafc",
    border: "#e2e8f0",
    badge: "PL",
    placeholder: "https://...",
    hint: "Custom review website URL (Yelp, Clutch, Apna, App Store, etc.)",
  },
];

const getPlatformBadge = (name = "") => {
  const lower = name.toLowerCase().trim();
  const matched = PRESET_PLATFORMS.find(
    (p) => p.id !== "Other" && (p.name.toLowerCase() === lower || lower.includes(p.id.toLowerCase()))
  );
  if (matched) return matched;

  return {
    badge: name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "PL",
    color: "#475569",
    bg: "#f8fafc",
    border: "#e2e8f0",
    name,
  };
};

export const PlatformsPage = () => {
  const { user, companyDetails } = useAuth();
  const cleanBrandName = getCleanBrandName(user, companyDetails);

  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form inputs
  const [selectedPreset, setSelectedPreset] = useState("Google Reviews");
  const [webName, setWebName] = useState("Google Reviews");
  const [webLink, setWebLink] = useState("https://g.page/r/CewgBPDQRwDXEBM/review");
  const [icon, setIcon] = useState("google");
  const [error, setError] = useState(null);

  const [saving, setSaving] = useState(false);

  // Dedicated QR scanner modal for specific platform
  const [qrModalPlatform, setQrModalPlatform] = useState(null);
  const [platformQrUrl, setPlatformQrUrl] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedLinkPlatformId, setCopiedLinkPlatformId] = useState(null);

  // WhatsApp Customer Review Share Modal State
  const [whatsAppModalPlatform, setWhatsAppModalPlatform] = useState(null);
  const [ratedCustomers, setRatedCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState("group_positive"); // "group_positive" | "group_critical" | "group_all" | customer._id
  const [ratingSegment, setRatingSegment] = useState("positive"); // "positive" (4-5) | "critical" (1-3) | "all"
  const [customerSearch, setCustomerSearch] = useState("");
  const [customMobile, setCustomMobile] = useState("");
  const [customName, setCustomName] = useState("");
  const [copiedModalLink, setCopiedModalLink] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [batchQueue, setBatchQueue] = useState([]);
  const [batchCurrentIdx, setBatchCurrentIdx] = useState(0);

  const handleOpenWhatsAppShare = async (platform) => {
    setWhatsAppModalPlatform(platform);
    setLoadingCustomers(true);
    setSelectedRecipient("group_positive");
    setRatingSegment("positive");
    setCustomerSearch("");
    setCustomMobile("");
    setCustomName("");
    setBatchQueue([]);
    setBatchCurrentIdx(0);

    const platformName = platform?.webName || "Glassdoor";
    const link = platform?.webLink || "";
    setCustomMessage(
      `Hello {name}! Thank you for your recent rating with ${cleanBrandName}. We'd love it if you could also share your positive review on our official ${platformName} page: ${link} 🙏`
    );

    try {
      const res = await api.getReviews({ limit: 200 });
      if (res.success && Array.isArray(res.reviews)) {
        setRatedCustomers(res.reviews);
      }
    } catch (err) {
      console.error("Failed to load rated customers:", err);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleRecipientChange = (val) => {
    setSelectedRecipient(val);
    setBatchQueue([]);
    setBatchCurrentIdx(0);
    const platformName = whatsAppModalPlatform?.webName || "Glassdoor";
    const link = whatsAppModalPlatform?.webLink || "";

    if (val === "group_positive") {
      setRatingSegment("positive");
      setCustomMessage(
        `Hello {name}! Thank you for your recent positive rating with ${cleanBrandName}. We'd love it if you could also share your positive review on our official ${platformName} page: ${link} 🙏`
      );
    } else if (val === "group_critical") {
      setRatingSegment("critical");
      setCustomMessage(
        `Hello {name}, thank you for your recent feedback for ${cleanBrandName}. We take your experience seriously and would love to resolve any concerns. You can also view or update your review on our ${platformName} page: ${link}`
      );
    } else if (val === "group_all") {
      setRatingSegment("all");
      setCustomMessage(
        `Hello {name}! Thank you for your review with ${cleanBrandName}. We'd love it if you could also post your review on our official ${platformName} page: ${link} 🙏`
      );
    } else {
      // Specific individual customer selected from dropdown
      const cust = ratedCustomers.find((c) => c._id === val || (c._id && c._id.toString() === val.toString()));
      if (cust) {
        if (cust.mobile && cust.mobile !== "N/A") {
          setCustomMobile(cust.mobile);
        }
        if (cust.name) {
          setCustomName(cust.name);
        }
        const isHigh = (cust.star || 0) >= 4;
        setRatingSegment(isHigh ? "positive" : "critical");
        const custName = cust.name || "Customer";
        if (isHigh) {
          setCustomMessage(
            `Hello ${custName}! Thank you for your recent ${cust.star}★ rating with ${cleanBrandName}. We'd truly appreciate it if you could also share your positive review on our official ${platformName} page: ${link} 🙏`
          );
        } else {
          setCustomMessage(
            `Hello ${custName}, thank you for your recent feedback for ${cleanBrandName}. We take your experience seriously and would love to resolve any concerns. You can also view or update your review on our ${platformName} page: ${link}`
          );
        }
      }
    }
  };

  const handleRatingSegmentChange = (seg) => {
    setRatingSegment(seg);
    setSelectedRecipient(seg === "positive" ? "group_positive" : seg === "critical" ? "group_critical" : "group_all");
    setBatchQueue([]);
    setBatchCurrentIdx(0);
    const platformName = whatsAppModalPlatform?.webName || "Glassdoor";
    const link = whatsAppModalPlatform?.webLink || "";
    if (seg === "critical") {
      setCustomMessage(
        `Hello {name}, thank you for your recent feedback for ${cleanBrandName}. We take your experience seriously and would love to resolve any concerns. You can also view or update your review on our ${platformName} page: ${link}`
      );
    } else if (seg === "positive") {
      setCustomMessage(
        `Hello {name}! Thank you for your recent positive rating with ${cleanBrandName}. We'd love it if you could also share your positive review on our official ${platformName} page: ${link} 🙏`
      );
    } else {
      setCustomMessage(
        `Hello {name}! Thank you for your review with ${cleanBrandName}. We'd love it if you could also post your review on our official ${platformName} page: ${link} 🙏`
      );
    }
  };

  const handleSendWhatsAppToCustomer = (customer) => {
    const custName = customer?.name || "Customer";
    const rawMobile = customer?.mobile || "";
    const cleanPhone = rawMobile.replace(/\D/g, "");
    if (!cleanPhone) {
      alert(`No phone number was captured for ${custName}. You can enter their number in the manual input below.`);
      setCustomName(custName);
      return;
    }
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const messageToSend = customMessage
      .replace(/{name}/gi, custName)
      .replace(/{customer}/gi, custName);

    const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(messageToSend)}`;
    window.open(waUrl, "_blank");
  };

  const handleStartBatchSend = (custList) => {
    const valid = custList.filter((c) => (c.mobile || "").replace(/\D/g, "").length >= 10);
    if (valid.length === 0) {
      alert("None of the selected customers have a valid 10-digit mobile number saved. Please enter their phone number below.");
      return;
    }
    setBatchQueue(valid);
    setBatchCurrentIdx(0);
    handleSendWhatsAppToCustomer(valid[0]);
  };

  const handleSendNextBatchCustomer = () => {
    const nextIdx = batchCurrentIdx + 1;
    if (nextIdx < batchQueue.length) {
      setBatchCurrentIdx(nextIdx);
      handleSendWhatsAppToCustomer(batchQueue[nextIdx]);
    }
  };

  const handleSendManualWhatsApp = () => {
    const cleanPhone = customMobile.replace(/\D/g, "");
    if (cleanPhone) {
      const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
      const custName = customName.trim() || "Customer";
      const messageToSend = customMessage
        .replace(/{name}/gi, custName)
        .replace(/{customer}/gi, custName);

      const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(messageToSend)}`;
      window.open(waUrl, "_blank");
      return;
    }

    // Fallback: If customMobile is empty, check if an individual customer was selected
    const singleCust = ratedCustomers.find(
      (c) => c._id === selectedRecipient || (c._id && c._id.toString() === selectedRecipient?.toString())
    );
    if (singleCust) {
      handleSendWhatsAppToCustomer(singleCust);
      return;
    }

    // Fallback: If a group was selected, start batch send to that group
    let groupCusts = ratedCustomers;
    if (selectedRecipient === "group_positive" || ratingSegment === "positive") {
      groupCusts = ratedCustomers.filter((c) => (c.star || 0) >= 4);
    } else if (selectedRecipient === "group_critical" || ratingSegment === "critical") {
      groupCusts = ratedCustomers.filter((c) => (c.star || 0) <= 3);
    }

    const validCusts = groupCusts.filter((c) => (c.mobile || "").replace(/\D/g, "").length >= 10);
    if (validCusts.length > 0) {
      handleStartBatchSend(validCusts);
      return;
    }

    alert("Please enter a valid customer phone number or click 'Send on WhatsApp' next to any customer above.");
  };

  useEffect(() => {
    if (qrModalPlatform?.webLink) {
      QRCode.toDataURL(qrModalPlatform.webLink, { width: 600, margin: 2, errorCorrectionLevel: "H" })
        .then(setPlatformQrUrl)
        .catch(console.error);
    } else {
      setPlatformQrUrl("");
    }
  }, [qrModalPlatform]);

  const loadPlatforms = async () => {
    setLoading(true);
    try {
      const res = await api.getPlatforms();
      if (res.success) setPlatforms(res.platforms);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlatforms();
  }, []);

  const handlePresetSelect = (presetId) => {
    setSelectedPreset(presetId);
    const found = PRESET_PLATFORMS.find((p) => p.id === presetId);
    if (!found) return;

    if (presetId === "Other") {
      setWebName("");
      setIcon("globe");
    } else {
      setWebName(found.name);
      setIcon(found.icon);
      // Auto-populate placeholder if link is empty or belongs to another preset
      const isPlaceholderLink = PRESET_PLATFORMS.some((p) => p.placeholder === webLink);
      if (!webLink || isPlaceholderLink) {
        setWebLink(found.placeholder);
      }
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setSelectedPreset("Google Reviews");
    setWebName("Google Reviews");
    setWebLink("");
    setIcon("google");
    setError(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingId(p._id);
    const matched = PRESET_PLATFORMS.find(
      (item) => item.id !== "Other" && item.name.toLowerCase() === p.webName.toLowerCase()
    );
    if (matched) {
      setSelectedPreset(matched.id);
    } else {
      setSelectedPreset("Other");
    }
    setWebName(p.webName);
    setWebLink(p.webLink);
    setIcon(p.icon || "globe");
    setError(null);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);

    const finalName = webName.trim();
    if (!finalName) {
      setError("Please provide a platform name");
      return;
    }

    let finalLink = webLink.trim();
    if (!finalLink) {
      setError("Please provide a destination URL");
      return;
    }

    // Auto prepend https:// if missing
    if (!/^https?:\/\//i.test(finalLink)) {
      finalLink = `https://${finalLink}`;
    }

    setSaving(true);
    try {
      if (editingId) {
        await api.updatePlatform(editingId, { webName: finalName, webLink: finalLink, icon });
      } else {
        await api.createPlatform({ webName: finalName, webLink: finalLink, icon });
      }
      setShowModal(false);
      setEditingId(null);
      await loadPlatforms();
    } catch (err) {
      console.error("Save platform error:", err);
      let errorMsg = err.message || "Failed to save platform";
      if (errorMsg.includes("Failed to fetch") || errorMsg.includes("NetworkError")) {
        errorMsg = "Backend server connection failed. Please ensure the backend server is running.";
      }
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this platform?")) return;
    try {
      await api.deletePlatform(id);
      loadPlatforms();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggle = async (platform) => {
    try {
      await api.updatePlatform(platform._id, { active: platform.active === 1 ? 0 : 1 });
      loadPlatforms();
    } catch (err) {
      alert(err.message);
    }
  };

  const currentPresetInfo = PRESET_PLATFORMS.find((p) => p.id === selectedPreset);

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--secondary)" }}>
            Review Platforms
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Connect review destinations where positive customers (4–5 stars) will be guided to post reviews
          </p>
        </div>

        <button onClick={handleOpenAddModal} className="btn btn-primary">
          <Plus size={16} />
          <span>Add Platform</span>
        </button>
      </div>

      {/* Platforms Grid - Responsive, No Overflow */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
        gap: "20px",
        width: "100%",
      }}>
        {platforms.map((p) => {
          const badgeInfo = getPlatformBadge(p.webName);
          return (
            <div
              key={p._id}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                borderRadius: "16px",
                minWidth: 0,
                overflow: "hidden",
                border: "1px solid var(--border)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: p.active === 1 ? badgeInfo.bg : "#f1f5f9",
                    color: p.active === 1 ? badgeInfo.color : "var(--text-muted)",
                    border: `1.5px solid ${p.active === 1 ? badgeInfo.border : "#e2e8f0"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "800",
                    fontSize: "14px",
                    flexShrink: 0
                  }}>
                    {badgeInfo.badge}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "800", color: "var(--secondary)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.webName}
                    </h3>
                    <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "3px" }}>
                      <span className={`badge ${p.active === 1 ? "badge-success" : "badge-secondary"}`} style={{ fontSize: "10px" }}>
                        {p.active === 1 ? "Active" : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                  <button
                    onClick={() => handleOpenEditModal(p)}
                    className="btn btn-outline btn-sm"
                    title="Edit Platform"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="btn btn-danger btn-sm"
                    title="Delete Platform"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Destination Link with copy & open action */}
              <div style={{
                background: "#f8fafc",
                padding: "8px 12px",
                borderRadius: "10px",
                fontSize: "12px",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "8px",
                border: "1px solid var(--border)",
                minWidth: 0,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0, overflow: "hidden" }}>
                  <span style={{ fontWeight: "700", color: "#64748b", flexShrink: 0 }}>Link:</span>
                  <a
                    href={p.webLink}
                    target="_blank"
                    rel="noreferrer"
                    title={p.webLink}
                    style={{ color: "var(--primary)", textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    {p.webLink}
                  </a>
                </div>
                <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(p.webLink);
                      setCopiedLinkPlatformId(p._id);
                      setTimeout(() => setCopiedLinkPlatformId(null), 2000);
                    }}
                    className="btn btn-outline btn-sm"
                    style={{ padding: "3px 7px", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "3px" }}
                    title="Copy Platform Review URL"
                  >
                    {copiedLinkPlatformId === p._id ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                    <span>{copiedLinkPlatformId === p._id ? "Copied" : "Copy"}</span>
                  </button>
                  <a
                    href={p.webLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline btn-sm"
                    style={{ padding: "3px 6px", display: "inline-flex", alignItems: "center" }}
                    title="Open Live Review Link"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px", borderTop: "1px solid var(--border)", flexWrap: "wrap", gap: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                  Captured: <strong>{p.totalRatings || 0} reviews</strong>
                </span>

                <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "nowrap" }}>
                  {/* WhatsApp Share Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenWhatsAppShare(p)}
                    className="btn btn-sm"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "5px 8px",
                      background: "#25D366",
                      color: "#ffffff",
                      border: "none",
                      fontWeight: "700",
                      fontSize: "11.5px",
                      borderRadius: "8px",
                      boxShadow: "0 2px 6px rgba(37, 211, 102, 0.25)",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                    title={`Share ${p.webName} link on WhatsApp to rated customers`}
                  >
                    <MessageCircle size={13} />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={() => setQrModalPlatform(p)}
                    className="btn btn-outline btn-sm"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "5px 8px",
                      fontSize: "11.5px",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                    title="View Dedicated QR Code / Scanner"
                  >
                    <QrCode size={13} />
                    <span>Scanner QR</span>
                  </button>

                  <button
                    onClick={() => handleToggle(p)}
                    className={`btn btn-sm ${p.active === 1 ? "btn-secondary" : "btn-primary"}`}
                    style={{
                      fontSize: "11.5px",
                      padding: "5px 9px",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {p.active === 1 ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {platforms.length === 0 && !loading && (
        <div className="card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <Globe size={48} style={{ color: "var(--text-subtle)", margin: "0 auto 12px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "700" }}>No Review Platforms Connected</h3>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", maxWidth: "420px", margin: "6px auto 20px" }}>
            Add Google Reviews, Justdial, Glassdoor, Facebook, or custom review sites so satisfied customers are redirected to review you online.
          </p>
          <button onClick={handleOpenAddModal} className="btn btn-primary">
            <Plus size={16} /> Add Your First Platform
          </button>
        </div>
      )}

      {/* Add / Edit Modal Portaled */}
      {showModal && typeof document !== "undefined" && createPortal(
        <div
          onClick={() => !saving && setShowModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 99999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="card animate-fade-in"
            style={{
              maxWidth: "500px",
              width: "100%",
              padding: "28px",
              borderRadius: "20px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "1px solid rgba(226, 232, 240, 0.9)",
              background: "#ffffff",
              position: "relative",
            }}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: "800", color: "var(--secondary)", margin: 0 }}>
                  {editingId ? "Edit Review Platform" : "Connect Review Platform"}
                </h2>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
                  Customers giving 4–5 stars will be guided directly to this destination.
                </p>
              </div>
              <button
                type="button"
                onClick={() => !saving && setShowModal(false)}
                style={{
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
                  transition: "all 0.15s ease",
                }}
              >
                <X size={16} />
              </button>
            </div>

            {error && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#dc2626",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  lineHeight: "1.4",
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave}>
              {/* Dropdown Selector */}
              <div className="form-group" style={{ marginBottom: "12px" }}>
                <label className="form-label" style={{ fontWeight: "700", fontSize: "13px" }}>
                  Select Platform
                </label>
                <select
                  className="form-select"
                  value={selectedPreset}
                  onChange={(e) => handlePresetSelect(e.target.value)}
                  style={{ fontWeight: "600", padding: "10px 14px", borderRadius: "10px" }}
                >
                  {PRESET_PLATFORMS.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Select Chips */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "18px" }}>
                {["Google Reviews", "Justdial", "Glassdoor", "Facebook", "AmbitionBox", "Animationbox", "Other"].map((pId) => {
                  const isSelected = selectedPreset === pId;
                  const item = PRESET_PLATFORMS.find((p) => p.id === pId);
                  return (
                    <button
                      key={pId}
                      type="button"
                      onClick={() => handlePresetSelect(pId)}
                      style={{
                        fontSize: "11px",
                        fontWeight: isSelected ? "700" : "500",
                        padding: "5px 11px",
                        borderRadius: "9999px",
                        border: isSelected ? `1.5px solid ${item?.color || "var(--primary)"}` : "1px solid #e2e8f0",
                        background: isSelected ? (item?.bg || "#eff6ff") : "#f8fafc",
                        color: isSelected ? (item?.color || "var(--primary)") : "#64748b",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {pId === "Other" ? "✍️ + Custom" : pId}
                    </button>
                  );
                })}
              </div>

              {/* If "Other" or custom is selected, show custom name input */}
              {selectedPreset === "Other" && (
                <div className="form-group" style={{ marginBottom: "16px" }}>
                  <label className="form-label" style={{ fontWeight: "700", display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span>Custom Platform Name</span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Type your platform name</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Animationbox, Clutch, Yelp, Apna, Swiggy..."
                    value={webName}
                    onChange={(e) => setWebName(e.target.value)}
                    required
                    autoFocus
                    style={{ padding: "10px 14px", borderRadius: "10px" }}
                  />
                </div>
              )}

              {/* Destination URL */}
              <div className="form-group" style={{ marginBottom: "20px" }}>
                <label className="form-label" style={{ fontWeight: "700", fontSize: "13px" }}>
                  Destination URL
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={currentPresetInfo?.placeholder || "https://..."}
                  value={webLink}
                  onChange={(e) => setWebLink(e.target.value)}
                  required
                  style={{ padding: "10px 14px", borderRadius: "10px" }}
                />
                <span style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px", display: "block", lineHeight: "1.4" }}>
                  {currentPresetInfo?.hint || "Direct link where positive customers will be redirected to submit their feedback."}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px", paddingTop: "14px", borderTop: "1px solid #f1f5f9" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                  className="btn btn-secondary"
                  style={{ borderRadius: "10px", padding: "10px 18px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary"
                  style={{ borderRadius: "10px", padding: "10px 22px", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  <span>{saving ? "Connecting..." : editingId ? "Save Changes" : "Connect Platform"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Platform Dedicated QR Scanner Modal Portaled */}
      {qrModalPlatform && typeof document !== "undefined" && createPortal(
        <div
          onClick={() => setQrModalPlatform(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 99999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="card animate-fade-in"
            style={{
              maxWidth: "460px",
              width: "100%",
              padding: "26px",
              borderRadius: "20px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "1px solid rgba(226, 232, 240, 0.9)",
              background: "#ffffff",
              textAlign: "center",
              position: "relative",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
              <div style={{ textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "8px",
                    background: getPlatformBadge(qrModalPlatform.webName).bg,
                    color: getPlatformBadge(qrModalPlatform.webName).color,
                    border: `1px solid ${getPlatformBadge(qrModalPlatform.webName).border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "800",
                    fontSize: "12px",
                  }}>
                    {getPlatformBadge(qrModalPlatform.webName).badge}
                  </div>
                  <h2 style={{ fontSize: "19px", fontWeight: "800", color: "var(--secondary)", margin: 0 }}>
                    {qrModalPlatform.webName} Scanner
                  </h2>
                </div>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
                  Direct review QR code for this platform
                </p>
              </div>
              <button
                type="button"
                onClick={() => setQrModalPlatform(null)}
                style={{
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
            </div>

            {/* QR Code Canvas / Image */}
            <div style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "16px",
              border: "1.5px solid #e2e8f0",
              boxShadow: "0 8px 24px -4px rgba(0, 0, 0, 0.08)",
              display: "inline-block",
              margin: "10px auto",
            }}>
              {platformQrUrl ? (
                <img
                  src={platformQrUrl}
                  alt={`${qrModalPlatform.webName} QR Code`}
                  style={{ width: "220px", height: "220px", display: "block", borderRadius: "8px" }}
                />
              ) : (
                <div style={{ width: "220px", height: "220px", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
                  <Loader2 className="animate-spin" size={24} />
                </div>
              )}
            </div>

            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "16px" }}>
              Scan with any mobile camera to open your {qrModalPlatform.webName} review page.
            </p>

            {/* Link Preview Bar */}
            <div style={{
              background: "#f8fafc",
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              fontSize: "12px",
              color: "var(--text-muted)",
              textAlign: "left",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
            }}>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, color: "var(--primary)", fontWeight: "600" }}>
                {qrModalPlatform.webLink}
              </span>
              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(qrModalPlatform.webLink);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="btn btn-outline btn-sm"
                  style={{ padding: "4px 8px", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}
                >
                  {copiedLink ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                  <span>{copiedLink ? "Copied" : "Copy"}</span>
                </button>
                <a
                  href={qrModalPlatform.webLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ padding: "4px 8px", fontSize: "11px" }}
                  title="Open Link"
                >
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                type="button"
                onClick={() => {
                  if (!platformQrUrl) return;
                  const link = document.createElement("a");
                  link.download = `${qrModalPlatform.webName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-scanner-qr.png`;
                  link.href = platformQrUrl;
                  link.click();
                }}
                className="btn btn-primary"
                style={{ borderRadius: "10px", padding: "10px 20px", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Download size={15} />
                <span>Download Scanner QR</span>
              </button>
              <button
                type="button"
                onClick={() => setQrModalPlatform(null)}
                className="btn btn-secondary"
                style={{ borderRadius: "10px", padding: "10px 18px" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* WhatsApp Customer Review Share Modal Portaled */}
      {whatsAppModalPlatform && typeof document !== "undefined" && createPortal(
        <div
          onClick={() => setWhatsAppModalPlatform(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 99999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="card animate-fade-in"
            style={{
              maxWidth: "680px",
              width: "100%",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              borderRadius: "20px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "1px solid rgba(226, 232, 240, 0.9)",
              background: "#ffffff",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: "20px 24px",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: "#25D366",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(37, 211, 102, 0.25)",
                }}>
                  <MessageCircle size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                    Share {whatsAppModalPlatform.webName} Link on WhatsApp
                  </h2>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                    Select rated customers from Reviews &amp; Reports to request reviews
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setWhatsAppModalPlatform(null)}
                style={{
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
            </div>

            {/* Scrollable Content */}
            <div style={{ padding: "20px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* Platform Link Bar */}
              <div style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                flexWrap: "wrap",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0, overflow: "hidden" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#64748b", flexShrink: 0 }}>
                    Review Link:
                  </span>
                  <a
                    href={whatsAppModalPlatform.webLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: "12px", color: "var(--primary)", fontWeight: "600", textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    title={whatsAppModalPlatform.webLink}
                  >
                    {whatsAppModalPlatform.webLink}
                  </a>
                </div>
                <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(whatsAppModalPlatform.webLink);
                      setCopiedModalLink(true);
                      setTimeout(() => setCopiedModalLink(false), 2000);
                    }}
                    className="btn btn-outline btn-sm"
                    style={{ padding: "3px 8px", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    {copiedModalLink ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                    <span>{copiedModalLink ? "Copied" : "Copy Link"}</span>
                  </button>
                  <a
                    href={whatsAppModalPlatform.webLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline btn-sm"
                    style={{ padding: "3px 6px" }}
                    title="Test Live Destination URL"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* Recipient Dropdown Selector: Exactly per user request "show bhi hone chaie dropdowwn me kisko bhena ahi according to therii review nd then all" */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label htmlFor="recipient-select" style={{ fontSize: "12px", fontWeight: "700", color: "#1e293b", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>👥 Kisko Bhejna Hai / Select Recipient:</span>
                  </label>
                  <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>
                    {ratedCustomers.length} Total Customers from Reviews &amp; Reports
                  </span>
                </div>

                <div style={{ position: "relative" }}>
                  <select
                    id="recipient-select"
                    value={selectedRecipient}
                    onChange={(e) => handleRecipientChange(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "1.5px solid #0284c7",
                      background: "#ffffff",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#0f172a",
                      cursor: "pointer",
                      boxShadow: "0 1px 3px rgba(2, 132, 199, 0.12)",
                      outline: "none",
                    }}
                  >
                    <optgroup label="── 📊 BY REVIEW RATING SEGMENTS (ALL) ──">
                      <option value="group_positive">
                        🌟 All 4 &amp; 5 Star Reviewers ({ratedCustomers.filter((c) => (c.star || 0) >= 4).length} customers)
                      </option>
                      <option value="group_critical">
                        ⚠️ All 1, 2 &amp; 3 Star Reviewers ({ratedCustomers.filter((c) => (c.star || 0) <= 3).length} customers)
                      </option>
                      <option value="group_all">
                        📋 All Rated Customers ({ratedCustomers.length} customers)
                      </option>
                    </optgroup>

                    {/* When on critical segment, show critical customers first so user does not need to scroll past 14 positive raters */}
                    {ratingSegment === "critical" && ratedCustomers.filter((c) => (c.star || 0) <= 3).length > 0 && (
                      <optgroup label="── ⚠️ 1, 2 & 3 STAR CUSTOMERS (NEEDS ATTENTION) ──">
                        {ratedCustomers
                          .filter((c) => (c.star || 0) <= 3)
                          .map((c, idx) => (
                            <option key={c._id || `crit-${idx}`} value={c._id}>
                              ⚠️ {c.name || "Customer"} ({c.star}★ • 📱 {c.mobile || "No number"})
                            </option>
                          ))}
                      </optgroup>
                    )}

                    {ratedCustomers.filter((c) => (c.star || 0) >= 4).length > 0 && (
                      <optgroup label="── 🌟 4 & 5 STAR CUSTOMERS (POSITIVE) ──">
                        {ratedCustomers
                          .filter((c) => (c.star || 0) >= 4)
                          .map((c, idx) => (
                            <option key={c._id || `pos-${idx}`} value={c._id}>
                              🌟 {c.name || "Customer"} ({c.star}★ • 📱 {c.mobile || "No number"})
                            </option>
                          ))}
                      </optgroup>
                    )}

                    {ratingSegment !== "critical" && ratedCustomers.filter((c) => (c.star || 0) <= 3).length > 0 && (
                      <optgroup label="── ⚠️ 1, 2 & 3 STAR CUSTOMERS (NEEDS ATTENTION) ──">
                        {ratedCustomers
                          .filter((c) => (c.star || 0) <= 3)
                          .map((c, idx) => (
                            <option key={c._id || `crit-${idx}`} value={c._id}>
                              ⚠️ {c.name || "Customer"} ({c.star}★ • 📱 {c.mobile || "No number"})
                            </option>
                          ))}
                      </optgroup>
                    )}
                  </select>
                </div>

                {/* Quick Segment Filter Pill Tabs */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "2px" }}>
                  <button
                    type="button"
                    onClick={() => handleRatingSegmentChange("positive")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: ratingSegment === "positive" && selectedRecipient.startsWith("group_") ? "800" : "600",
                      background: ratingSegment === "positive" && selectedRecipient.startsWith("group_") ? "#ecfdf5" : "#ffffff",
                      color: ratingSegment === "positive" && selectedRecipient.startsWith("group_") ? "#065f46" : "#475569",
                      border: ratingSegment === "positive" && selectedRecipient.startsWith("group_") ? "1.5px solid #10b981" : "1.5px solid #e2e8f0",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span>🌟 4 &amp; 5 Star Raters</span>
                    <span style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      padding: "1px 6px",
                      borderRadius: "9999px",
                      background: ratingSegment === "positive" && selectedRecipient.startsWith("group_") ? "#10b981" : "#f1f5f9",
                      color: ratingSegment === "positive" && selectedRecipient.startsWith("group_") ? "#ffffff" : "#64748b",
                    }}>
                      {ratedCustomers.filter((c) => (c.star || 0) >= 4).length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRatingSegmentChange("critical")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: ratingSegment === "critical" && selectedRecipient.startsWith("group_") ? "800" : "600",
                      background: ratingSegment === "critical" && selectedRecipient.startsWith("group_") ? "#fef2f2" : "#ffffff",
                      color: ratingSegment === "critical" && selectedRecipient.startsWith("group_") ? "#991b1b" : "#475569",
                      border: ratingSegment === "critical" && selectedRecipient.startsWith("group_") ? "1.5px solid #ef4444" : "1.5px solid #e2e8f0",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span>⚠️ 1, 2 &amp; 3 Star Raters</span>
                    <span style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      padding: "1px 6px",
                      borderRadius: "9999px",
                      background: ratingSegment === "critical" && selectedRecipient.startsWith("group_") ? "#ef4444" : "#f1f5f9",
                      color: ratingSegment === "critical" && selectedRecipient.startsWith("group_") ? "#ffffff" : "#64748b",
                    }}>
                      {ratedCustomers.filter((c) => (c.star || 0) <= 3).length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRatingSegmentChange("all")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: ratingSegment === "all" && selectedRecipient.startsWith("group_") ? "800" : "600",
                      background: ratingSegment === "all" && selectedRecipient.startsWith("group_") ? "#f1f5f9" : "#ffffff",
                      color: ratingSegment === "all" && selectedRecipient.startsWith("group_") ? "#0f172a" : "#475569",
                      border: ratingSegment === "all" && selectedRecipient.startsWith("group_") ? "1.5px solid #0f172a" : "1.5px solid #e2e8f0",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span>📋 All Raters</span>
                    <span style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      padding: "1px 6px",
                      borderRadius: "9999px",
                      background: ratingSegment === "all" && selectedRecipient.startsWith("group_") ? "#0f172a" : "#f1f5f9",
                      color: ratingSegment === "all" ? "#ffffff" : "#64748b",
                    }}>
                      {ratedCustomers.length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Featured Single Recipient Banner (When a specific customer is selected from dropdown or list) */}
              {(() => {
                const singleSelectedCustomer = !selectedRecipient.startsWith("group_")
                  ? ratedCustomers.find((c) => c._id === selectedRecipient)
                  : null;

                if (!singleSelectedCustomer) return null;

                const isHigh = (singleSelectedCustomer.star || 0) >= 4;

                return (
                  <div style={{
                    background: isHigh ? "#ecfdf5" : "#fef2f2",
                    border: `1.5px solid ${isHigh ? "#a7f3d0" : "#fecaca"}`,
                    borderRadius: "12px",
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    flexWrap: "wrap",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                      <div style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: isHigh ? "#10b981" : "#ef4444",
                        color: "#ffffff",
                        fontWeight: "800",
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        {(singleSelectedCustomer.name?.[0] || "C").toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <strong style={{ fontSize: "14px", color: "#0f172a" }}>{singleSelectedCustomer.name}</strong>
                          <span style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            padding: "2px 8px",
                            borderRadius: "9999px",
                            background: isHigh ? "#dcfce7" : "#fee2e2",
                            color: isHigh ? "#15803d" : "#b91c1c",
                          }}>
                            {singleSelectedCustomer.star}★ {isHigh ? "Positive Rater" : "Critical Feedback"}
                          </span>
                        </div>
                        <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                          📱 <strong>{singleSelectedCustomer.mobile || "No phone number"}</strong>
                          {singleSelectedCustomer.review ? ` • "${singleSelectedCustomer.review.slice(0, 45)}..."` : ""}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => handleSendWhatsAppToCustomer(singleSelectedCustomer)}
                        className="btn btn-sm"
                        style={{
                          background: "#25D366",
                          color: "#ffffff",
                          border: "none",
                          fontWeight: "700",
                          fontSize: "12px",
                          padding: "7px 14px",
                          borderRadius: "8px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          cursor: "pointer",
                          boxShadow: "0 2px 6px rgba(37, 211, 102, 0.25)",
                        }}
                      >
                        <MessageCircle size={14} />
                        <span>Send WhatsApp to {singleSelectedCustomer.name?.split(" ")[0] || "Customer"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRatingSegmentChange(isHigh ? "positive" : "critical")}
                        className="btn btn-sm btn-outline"
                        style={{ fontSize: "11px", padding: "6px 10px" }}
                        title="View full rating list"
                      >
                        View Full List
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Featured Group Recipient Banner (When a rating group like 1-3 stars or 4-5 stars is selected) */}
              {(() => {
                if (!selectedRecipient.startsWith("group_")) return null;

                let groupList = ratedCustomers;
                let groupTitle = "All Rated Customers";
                let isCrit = false;

                if (selectedRecipient === "group_critical" || ratingSegment === "critical") {
                  groupList = ratedCustomers.filter((c) => (c.star || 0) <= 3);
                  groupTitle = "1, 2 & 3 Star Reviewers";
                  isCrit = true;
                } else if (selectedRecipient === "group_positive" || ratingSegment === "positive") {
                  groupList = ratedCustomers.filter((c) => (c.star || 0) >= 4);
                  groupTitle = "4 & 5 Star Reviewers";
                }

                const validPhonesCount = groupList.filter((c) => (c.mobile || "").replace(/\D/g, "").length >= 10).length;

                return (
                  <div style={{
                    background: isCrit ? "#fff1f2" : "#f0fdf4",
                    border: `1.5px solid ${isCrit ? "#fca5a5" : "#86efac"}`,
                    borderRadius: "12px",
                    padding: "14px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "16px" }}>{isCrit ? "⚠️" : "🌟"}</span>
                          <strong style={{ fontSize: "14px", color: isCrit ? "#991b1b" : "#166534" }}>
                            {groupList.length} Customer{groupList.length === 1 ? "" : "s"} Selected ({groupTitle})
                          </strong>
                        </div>
                        <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                          {validPhonesCount > 0
                            ? `📱 ${validPhonesCount} customer${validPhonesCount === 1 ? "" : "s"} ready to receive link directly on WhatsApp:`
                            : "⚠️ No valid phone numbers captured for these customers"}
                        </div>
                      </div>

                      {validPhonesCount > 0 && (
                        <button
                          type="button"
                          onClick={() => handleStartBatchSend(groupList)}
                          className="btn btn-sm"
                          style={{
                            background: "#25D366",
                            color: "#ffffff",
                            border: "none",
                            fontWeight: "800",
                            fontSize: "13px",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            cursor: "pointer",
                            boxShadow: "0 2px 8px rgba(37, 211, 102, 0.3)",
                          }}
                        >
                          <MessageCircle size={15} />
                          <span>Send WhatsApp to All {groupList.length} Customers</span>
                        </button>
                      )}
                    </div>

                    {/* Batch Progress Tracker Banner */}
                    {batchQueue.length > 0 && (
                      <div style={{
                        background: "#ffffff",
                        border: "1.5px solid #25D366",
                        borderRadius: "10px",
                        padding: "10px 14px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}>
                        <div>
                          <div style={{ fontSize: "12px", fontWeight: "700", color: "#166534" }}>
                            ✅ Opened WhatsApp for {batchCurrentIdx + 1} of {batchQueue.length}: {batchQueue[batchCurrentIdx]?.name}
                          </div>
                          {batchCurrentIdx + 1 < batchQueue.length && (
                            <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                              Next in queue: <strong>{batchQueue[batchCurrentIdx + 1]?.name}</strong> (📱 {batchQueue[batchCurrentIdx + 1]?.mobile})
                            </div>
                          )}
                        </div>

                        <div style={{ display: "flex", gap: "6px" }}>
                          {batchCurrentIdx + 1 < batchQueue.length ? (
                            <button
                              type="button"
                              onClick={handleSendNextBatchCustomer}
                              className="btn btn-sm"
                              style={{
                                background: "#25D366",
                                color: "#ffffff",
                                border: "none",
                                fontWeight: "700",
                                fontSize: "12px",
                                padding: "6px 14px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                boxShadow: "0 2px 6px rgba(37, 211, 102, 0.25)",
                              }}
                            >
                              👉 Send to Next: {batchQueue[batchCurrentIdx + 1]?.name}
                            </button>
                          ) : (
                            <span style={{ fontSize: "12px", fontWeight: "800", color: "#166534" }}>
                              🎉 All {batchQueue.length} customers dispatched!
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => { setBatchQueue([]); setBatchCurrentIdx(0); }}
                            className="btn btn-sm btn-outline"
                            style={{ fontSize: "11px", padding: "4px 8px" }}
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Directly display customers in this group so user can click send immediately */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {groupList.map((cust, idx) => (
                        <div key={cust._id || idx} style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background: "#ffffff",
                          border: `1px solid ${isCrit ? "#fecaca" : "#bbf7d0"}`,
                          borderRadius: "8px",
                          padding: "8px 12px",
                          gap: "10px",
                          flexWrap: "wrap",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                            <span style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "50%",
                              background: isCrit ? "#fee2e2" : "#dcfce7",
                              color: isCrit ? "#dc2626" : "#16a34a",
                              fontSize: "11px",
                              fontWeight: "800",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}>
                              {idx + 1}
                            </span>
                            <strong style={{ fontSize: "13px", color: "#0f172a" }}>
                              {cust.name}
                            </strong>
                            <span style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              background: isCrit ? "#fee2e2" : "#dcfce7",
                              color: isCrit ? "#b91c1c" : "#15803d",
                              padding: "1px 5px",
                              borderRadius: "4px",
                            }}>
                              {cust.star}★
                            </span>
                            <span style={{ fontSize: "12px", color: "#64748b" }}>
                              📱 <strong>{cust.mobile || "No number"}</strong>
                              {cust.review ? ` • "${cust.review.slice(0, 30)}..."` : ""}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSendWhatsAppToCustomer(cust)}
                            className="btn btn-sm"
                            style={{
                              background: "#25D366",
                              color: "#ffffff",
                              border: "none",
                              fontWeight: "700",
                              fontSize: "11px",
                              padding: "5px 12px",
                              borderRadius: "6px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              cursor: "pointer",
                              boxShadow: "0 1px 4px rgba(37, 211, 102, 0.2)",
                            }}
                          >
                            <MessageCircle size={13} />
                            <span>Send WhatsApp</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Message Template Editor */}
              <div style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "12px 14px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", textTransform: "uppercase" }}>
                    WhatsApp Message Preview / Template:
                  </label>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    <code>{"{name}"}</code> automatically replaced with customer's name
                  </span>
                </div>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "13px",
                    fontFamily: "inherit",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Search Bar for Rated Customers */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ position: "relative" }}>
                  <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    placeholder="Search any rated customer by name, mobile, or review (e.g. Mayank)..."
                    style={{
                      width: "100%",
                      padding: "9px 36px 9px 36px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "13px",
                      boxSizing: "border-box",
                    }}
                  />
                  {customerSearch && (
                    <button
                      type="button"
                      onClick={() => setCustomerSearch("")}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#94a3b8",
                        padding: "2px",
                      }}
                      title="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {customerSearch.trim() && (
                  <div style={{ fontSize: "11px", color: "#0284c7", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
                    <span>🔍 Searching across all rated customers for "{customerSearch.trim()}"</span>
                  </div>
                )}
              </div>

              {/* Customers List */}
              <div style={{
                maxHeight: "260px",
                overflowY: "auto",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                background: "#ffffff",
              }}>
                {loadingCustomers ? (
                  <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>
                    <Loader2 size={24} className="animate-spin" style={{ margin: "0 auto 8px" }} />
                    <p style={{ margin: 0, fontSize: "13px" }}>Loading rated customers from Reviews &amp; Reports...</p>
                  </div>
                ) : (() => {
                  const q = customerSearch.toLowerCase().trim();
                  let filtered = ratedCustomers;

                  if (q) {
                    // Global search across all reviews so searching e.g. "mayank" ALWAYS finds Mayank
                    filtered = ratedCustomers.filter((item) => {
                      const matchName = (item.name || "").toLowerCase().includes(q);
                      const matchPhone = (item.mobile || "").includes(q);
                      const matchReview = (item.review || "").toLowerCase().includes(q);
                      const matchStaff = (item.staffMember || "").toLowerCase().includes(q);
                      return matchName || matchPhone || matchReview || matchStaff;
                    });
                  } else if (ratingSegment === "positive") {
                    filtered = ratedCustomers.filter((item) => (item.star || 0) >= 4);
                  } else if (ratingSegment === "critical") {
                    filtered = ratedCustomers.filter((item) => (item.star || 0) <= 3);
                  }

                  if (filtered.length === 0) {
                    return (
                      <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>
                        <Users size={28} style={{ color: "#94a3b8", margin: "0 auto 8px" }} />
                        <p style={{ fontSize: "13px", fontWeight: "700", margin: "0 0 4px" }}>
                          No matching rated customers found
                        </p>
                        <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                          {customerSearch ? "Try a different search term or clear the search." : "Try switching rating segments above."}
                        </p>
                        {customerSearch && (
                          <button
                            type="button"
                            onClick={() => setCustomerSearch("")}
                            className="btn btn-sm btn-outline"
                            style={{ marginTop: "10px", fontSize: "12px" }}
                          >
                            Clear Search
                          </button>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {filtered.map((cust, idx) => {
                        const isHigh = (cust.star || 0) >= 4;
                        const isCurrentlySelected = selectedRecipient === cust._id;

                        return (
                          <div
                            key={cust._id || idx}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "10px 14px",
                              borderBottom: idx === filtered.length - 1 ? "none" : "1px solid #f1f5f9",
                              gap: "10px",
                              flexWrap: "wrap",
                              background: isCurrentlySelected ? "#f0f9ff" : "transparent",
                              transition: "background 0.15s ease",
                            }}
                          >
                            <div
                              onClick={() => handleRecipientChange(cust._id)}
                              style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, cursor: "pointer", flex: "1 1 auto" }}
                              title="Click to select this customer in the dropdown"
                            >
                              <div style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                background: isHigh ? "#ecfdf5" : "#fef2f2",
                                color: isHigh ? "#059669" : "#dc2626",
                                border: `1px solid ${isHigh ? "#a7f3d0" : "#fecaca"}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "800",
                                fontSize: "12px",
                                flexShrink: 0,
                              }}>
                                {(cust.name?.[0] || "C").toUpperCase()}
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>
                                    {cust.name}
                                  </span>
                                  <span style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "2px",
                                    padding: "1px 6px",
                                    borderRadius: "4px",
                                    fontSize: "11px",
                                    fontWeight: "800",
                                    background: isHigh ? "#ecfdf5" : "#fef2f2",
                                    color: isHigh ? "#047857" : "#b91c1c",
                                    border: `1px solid ${isHigh ? "#a7f3d0" : "#fecaca"}`,
                                  }}>
                                    <Star size={10} fill={isHigh ? "#047857" : "#b91c1c"} />
                                    {cust.star}★
                                  </span>
                                  {isCurrentlySelected && (
                                    <span style={{ fontSize: "10px", fontWeight: "700", color: "#0284c7", background: "#e0f2fe", padding: "1px 6px", borderRadius: "4px" }}>
                                      Selected
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontSize: "12px", color: "#64748b" }}>
                                  📱 {cust.mobile || "No number"}
                                  {cust.review ? ` • "${cust.review.slice(0, 35)}..."` : ""}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                              <button
                                type="button"
                                onClick={() => handleRecipientChange(cust._id)}
                                className="btn btn-sm btn-outline"
                                style={{
                                  padding: "5px 9px",
                                  fontSize: "11px",
                                  borderColor: isCurrentlySelected ? "#0284c7" : "#cbd5e1",
                                  color: isCurrentlySelected ? "#0284c7" : "#475569",
                                  fontWeight: "600",
                                }}
                              >
                                {isCurrentlySelected ? "Selected" : "Select"}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSendWhatsAppToCustomer(cust)}
                                className="btn btn-sm"
                                style={{
                                  background: "#25D366",
                                  color: "#ffffff",
                                  border: "none",
                                  fontWeight: "700",
                                  fontSize: "12px",
                                  padding: "6px 12px",
                                  borderRadius: "8px",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  cursor: "pointer",
                                  flexShrink: 0,
                                  boxShadow: "0 2px 6px rgba(37, 211, 102, 0.2)",
                                }}
                              >
                                <MessageCircle size={14} />
                                <span>Send on WhatsApp</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Direct Manual WhatsApp Dispatch Bar */}
              <div style={{
                background: "#f8fafc",
                borderRadius: "12px",
                padding: "12px 14px",
                border: "1px solid #e2e8f0",
              }}>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#475569", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                  ✍️ Or Send to Any New / Custom Mobile Number (Not in reviews above):
                </span>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Customer Name (Optional)"
                    style={{
                      flex: "1 1 140px",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "12px",
                    }}
                  />
                  <input
                    type="text"
                    value={customMobile}
                    onChange={(e) => setCustomMobile(e.target.value)}
                    placeholder="Mobile Number (e.g. 9876543210)"
                    style={{
                      flex: "1 1 180px",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "12px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleSendManualWhatsApp}
                    className="btn btn-sm"
                    style={{
                      background: "#25D366",
                      color: "#ffffff",
                      border: "none",
                      fontWeight: "700",
                      fontSize: "12px",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <Send size={13} />
                    <span>{customMobile.trim() ? "Send to This Number" : "Send Link to Selected"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: "14px 24px",
              borderTop: "1px solid #f1f5f9",
              display: "flex",
              justifyContent: "flex-end",
              background: "#ffffff",
            }}>
              <button
                type="button"
                onClick={() => setWhatsAppModalPlatform(null)}
                className="btn btn-secondary"
                style={{ borderRadius: "10px", padding: "8px 18px", fontSize: "13px" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
