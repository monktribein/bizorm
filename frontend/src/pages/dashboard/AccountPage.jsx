import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BUSINESS_CATEGORIES } from "../../constants/categories";
import { getCleanBrandName } from "../../utils/brand";
import { EditBusinessModal } from "../../components/common/EditBusinessModal";
import {
  User,
  Building,
  Mail,
  Phone,
  Shield,
  Edit2,
  Globe,
  ExternalLink,
  MessageCircle,
  Tag,
  ThumbsUp,
  AlertTriangle,
  Sparkles,
  MessageSquare,
  Zap,
} from "lucide-react";

export const AccountPage = () => {
  const { user, quota, companyDetails, googleReviewLink } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalTab, setModalTab] = useState("general");

  const currentLogo = companyDetails?.cmpyLogo || "";
  const currentCategory = companyDetails?.businessCategory || "general";
  const cleanBrandName = getCleanBrandName(user, companyDetails);

  const matchedCat =
    BUSINESS_CATEGORIES.find((c) => c.id === currentCategory) || BUSINESS_CATEGORIES[0];

  const reviewUrl = user?.formKey
    ? `${window.location.origin}/wtr/${user.formKey}`
    : `${window.location.origin}/wtr/demo`;

  const activePositiveTags =
    Array.isArray(companyDetails?.customTags) && companyDetails.customTags.length > 0
      ? companyDetails.customTags
      : matchedCat.tags;

  const activeNegativeTags =
    Array.isArray(companyDetails?.customNegativeTags) && companyDetails.customNegativeTags.length > 0
      ? companyDetails.customNegativeTags
      : (matchedCat.negativeTags || []);

  const openModal = (tab = "general") => {
    setModalTab(tab);
    setShowEditModal(true);
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--secondary)" }}>
            My Account &amp; Business Profile
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Manage your business branding, company logo, industry category, and customer review prompts
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => openModal("tags")} className="btn btn-outline" style={{ fontWeight: "700" }}>
            <Tag size={16} />
            <span>Customize Review Tags</span>
          </button>
          <button onClick={() => openModal("general")} className="btn btn-primary" style={{ fontWeight: "700" }}>
            <Edit2 size={16} />
            <span>Change Business Details</span>
          </button>
        </div>
      </div>

      {/* Quotas Grid (Clean 3-Pillar Quotas: Web Scans, Email, and WhatsApp - SMS removed) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "16px" }}>
        <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ padding: "12px", borderRadius: "var(--radius-md)", background: "var(--primary-light)", color: "var(--primary)" }}>
              <Globe size={20} />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Web Platforms Quota</div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>{quota?.webQuota ?? 0} remaining</div>
            </div>
          </div>
          <Link
            to="/subscription?tab=single&addon=scans"
            style={{
              fontSize: "11.5px",
              fontWeight: "700",
              color: "#0052cc",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
              padding: "4px 8px",
              borderRadius: "6px",
              background: "#eff6ff",
            }}
          >
            <span>+ Add Scans →</span>
          </Link>
        </div>

        <div className="card" style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ padding: "12px", borderRadius: "var(--radius-md)", background: "var(--success-light)", color: "var(--success)" }}>
            <Mail size={20} />
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Email Campaign Quota</div>
            <div style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>{quota?.emailQuota ?? 0} emails</div>
          </div>
        </div>

        <div
          className="card"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "14px",
            flexWrap: "wrap",
            border: (quota?.whatsappQuota ?? 0) < 50 ? "1px solid #fde68a" : "1px solid var(--border)",
            backgroundColor: (quota?.whatsappQuota ?? 0) < 50 ? "#fffbeb" : "#ffffff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ padding: "12px", borderRadius: "var(--radius-md)", background: "#ede9fe", color: "#7c3aed" }}>
              <MessageCircle size={20} />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>WhatsApp Quota</div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>
                {quota?.whatsappQuota ?? 0} messages
              </div>
            </div>
          </div>

          {/* Fill / Top-up Quota Button redirecting to Image 2 Plans */}
          <Link
            to="/subscription?tab=single&addon=wsp"
            className="btn btn-primary btn-sm"
            style={{
              padding: "7px 14px",
              fontSize: "12px",
              fontWeight: "700",
              borderRadius: "8px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              textDecoration: "none",
              background: "linear-gradient(135deg, #16a34a, #059669)",
              color: "#ffffff",
              boxShadow: "0 2px 10px rgba(22, 163, 74, 0.25)",
            }}
          >
            <Zap size={14} />
            <span>Refill / Fill Quota</span>
          </Link>
        </div>
      </div>

      <div className="grid-2">
        {/* Profile Card */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
              <User size={18} color="var(--primary)" /> Profile Information
            </h3>
            <button
              type="button"
              onClick={() => openModal("general")}
              className="btn btn-secondary btn-sm"
              style={{ padding: "5px 12px", fontSize: "12px", fontWeight: "600" }}
            >
              <Edit2 size={13} />
              <span>Edit Profile</span>
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px", borderBottom: "1px solid var(--border)" }}>
              <span style={{ color: "var(--text-muted)" }}>Full Name:</span>
              <span style={{ fontWeight: "600" }}>{user?.fname} {user?.lname}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px", borderBottom: "1px solid var(--border)" }}>
              <span style={{ color: "var(--text-muted)" }}>Username:</span>
              <span style={{ fontWeight: "600" }}>{user?.uname}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px", borderBottom: "1px solid var(--border)" }}>
              <span style={{ color: "var(--text-muted)" }}>Email:</span>
              <span style={{ fontWeight: "600" }}>{user?.email}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px", borderBottom: "1px solid var(--border)" }}>
              <span style={{ color: "var(--text-muted)" }}>Mobile:</span>
              <span style={{ fontWeight: "600" }}>{user?.mobile}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Role:</span>
              <span className="badge badge-primary">{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Company & Review Identifiers */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
              <Building size={18} color="var(--primary)" /> Business &amp; Brand Configuration
            </h3>
            <button
              type="button"
              onClick={() => openModal("general")}
              className="btn btn-primary btn-sm"
              style={{ padding: "5px 14px", fontSize: "12px", fontWeight: "700" }}
            >
              <Edit2 size={13} />
              <span>Change Details</span>
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
            {/* Logo display */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "10px", borderBottom: "1px solid var(--border)" }}>
              <span style={{ color: "var(--text-muted)" }}>Brand Logo:</span>
              <div style={{
                padding: "6px 12px",
                background: "#f8fafc",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                {currentLogo ? (
                  <img
                    src={currentLogo}
                    alt="Brand Logo"
                    style={{ height: "32px", width: "auto", objectFit: "contain" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>No logo configured</span>
                )}
                {currentLogo && (
                  <span style={{ fontSize: "11px", color: "var(--success)", fontWeight: "700" }}>Active</span>
                )}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px", borderBottom: "1px solid var(--border)" }}>
              <span style={{ color: "var(--text-muted)" }}>Brand Name:</span>
              <span style={{ fontWeight: "800", color: "var(--primary)", fontSize: "15px" }}>
                {cleanBrandName}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px", borderBottom: "1px solid var(--border)" }}>
              <span style={{ color: "var(--text-muted)" }}>Assigned Branch:</span>
              <span style={{ fontWeight: "600" }}>{user?.branchId?.name || "Global / Master"}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px", borderBottom: "1px solid var(--border)" }}>
              <span style={{ color: "var(--text-muted)" }}>Form Key (Review Code):</span>
              <span style={{ fontFamily: "monospace", fontWeight: "700", color: "var(--primary)" }}>
                {user?.formKey}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "10px", borderBottom: "1px solid var(--border)" }}>
              <span style={{ color: "var(--text-muted)" }}>Customer Review URL:</span>
              <span style={{ fontSize: "12.5px", fontFamily: "monospace", color: "#64748b", fontWeight: "600" }}>
                {reviewUrl}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "var(--text-muted)" }}>Google Reviews Link:</span>
              {googleReviewLink ? (
                <a
                  href={googleReviewLink}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "var(--primary)",
                    maxWidth: "220px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    textDecoration: "none"
                  }}
                  title={googleReviewLink}
                >
                  {googleReviewLink}
                </a>
              ) : (
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>None configured</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE 8: Dedicated Smart Category & Review Tag Studio Card */}
      <div
        className="card"
        style={{
          padding: "24px",
          background: "#ffffff",
          border: "1.5px solid #e2e8f0",
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
              }}
            >
              <Tag size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "800", color: "var(--secondary)", margin: 0 }}>
                Industry Category &amp; Review Prompts Studio
              </h2>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                AI-tailored review tags and feedback prompts matching your business sector
              </p>
            </div>
          </div>

          <button
            onClick={() => openModal("tags")}
            className="btn btn-primary btn-sm"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: "700" }}
          >
            <Edit2 size={13} />
            <span>Customize Tags &amp; Prompts</span>
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "18px" }}>
          {/* Active Sector & Custom Prompt Preview */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div
              style={{
                padding: "16px",
                borderRadius: "12px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Configured Sector
              </div>
              <div style={{ fontSize: "16px", fontWeight: "800", color: "var(--secondary)", marginTop: "4px" }}>
                {matchedCat.name}
              </div>
              <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0 0" }}>
                {matchedCat.description}
              </p>
            </div>

            <div
              style={{
                padding: "16px",
                borderRadius: "12px",
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "800", color: "#1d4ed8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                <MessageSquare size={13} />
                <span>Customer Review Page Headline</span>
              </div>
              <div style={{ fontSize: "15px", fontWeight: "700", color: "#1e3a8a", marginTop: "4px" }}>
                {companyDetails?.reviewPrompt || `Rate your experience with ${cleanBrandName}`}
              </div>
              <span style={{ fontSize: "11px", color: "#60a5fa", marginTop: "2px", display: "block" }}>
                Displayed as the top question on customer mobile screens
              </span>
            </div>
          </div>

          {/* Positive & Negative Tags Showcase */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Positive Tags */}
            <div
              style={{
                padding: "16px",
                borderRadius: "12px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "800", color: "#166534" }}>
                  <ThumbsUp size={14} color="#16a34a" />
                  <span>Public 4-5★ Review Highlights</span>
                </div>
                <span style={{ fontSize: "11px", color: "#15803d", fontWeight: "700" }}>
                  {activePositiveTags.length} tags
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {activePositiveTags.map((t, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      padding: "3px 9px",
                      borderRadius: "9999px",
                      background: "#ffffff",
                      border: "1px solid #86efac",
                      color: "#166534",
                    }}
                  >
                    ✓ {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Negative Tags */}
            <div
              style={{
                padding: "16px",
                borderRadius: "12px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "800", color: "#991b1b" }}>
                  <AlertTriangle size={14} color="#ef4444" />
                  <span>Private 1-3★ Shield Concern Tags</span>
                </div>
                <span style={{ fontSize: "11px", color: "#b91c1c", fontWeight: "700" }}>
                  {activeNegativeTags.length} tags
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {activeNegativeTags.map((t, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      padding: "3px 9px",
                      borderRadius: "9999px",
                      background: "#ffffff",
                      border: "1px solid #fca5a5",
                      color: "#991b1b",
                    }}
                  >
                    • {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Business & Brand Details Modal */}
      <EditBusinessModal
        isOpen={showEditModal}
        initialTab={modalTab}
        onClose={() => setShowEditModal(false)}
      />
    </div>
  );
};
