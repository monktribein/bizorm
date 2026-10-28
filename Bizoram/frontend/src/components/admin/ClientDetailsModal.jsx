import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  X,
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  Star,
  ExternalLink,
  Copy,
  Check,
  CreditCard,
  ThumbsUp,
  AlertTriangle,
  FileText,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";

export const ClientDetailsModal = ({ client, onClose }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  if (!client) return null;

  const reviewPortalUrl = `${window.location.origin}/wtr/${client.formKey}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reviewPortalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewReviews = () => {
    onClose();
    navigate(`/report?client=${client.formKey}`);
  };

  const stats = client.stats || { totalReviews: 0, avgRating: 0, positiveReviews: 0, criticalReviews: 0 };
  const cd = client.companyDetails;
  const logo = cd?.cmpyLogo || client.cmpyLogo || "";
  const initial = (client.businessName?.[0] || client.fname?.[0] || "B").toUpperCase();
  const pkg = client.pricingPackageId;

  return createPortal(
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
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: "680px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: 0,
          borderRadius: "20px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
          border: "1px solid var(--border)",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #fdfbf7 0%, #f6f0e6 50%, #ede2d3 100%)",
            borderBottom: "1.5px solid #ded3c3",
            padding: "24px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: "#ffffff",
                border: "2px solid #dcd1c2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "900",
                fontSize: "22px",
                color: "#6b4722",
                boxShadow: "0 4px 12px rgba(107, 71, 34, 0.12)",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {logo ? (
                <img src={logo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              ) : (
                initial
              )}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#241912", margin: 0 }}>
                  {client.businessName}
                </h2>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    padding: "3px 9px",
                    borderRadius: "9999px",
                    background: "#e8dcce",
                    color: "#6b4722",
                    border: "1px solid #d6c4b0",
                  }}
                >
                  {cd?.businessCategory || "General"}
                </span>
                <span className={`badge ${client.active === 1 ? "badge-success" : "badge-secondary"}`} style={{ fontSize: "10px" }}>
                  {client.active === 1 ? "Active Client" : "Unverified"}
                </span>
              </div>
              <div style={{ fontSize: "13px", color: "#74614e" }}>
                Owned by: <strong>{client.fname} {client.lname}</strong> (@{client.uname})
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "#ffffff",
              border: "1px solid #dcd1c2",
              borderRadius: "50%",
              width: "34px",
              height: "34px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#6b4722",
              transition: "all 0.2s ease",
            }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body Content */}
        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Quick Stats Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px" }}>
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "12px", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>
                Total Reviews
              </div>
              <div style={{ fontSize: "22px", fontWeight: "800", color: "var(--secondary)", marginTop: "4px" }}>
                {stats.totalReviews}
              </div>
            </div>

            <div style={{ background: "#fefce8", padding: "14px", borderRadius: "12px", border: "1px solid #fef08a" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#854d0e", textTransform: "uppercase" }}>
                Average Rating
              </div>
              <div style={{ fontSize: "22px", fontWeight: "800", color: "#a16207", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                <Star size={18} fill="#ca8a04" color="#ca8a04" />
                <span>{stats.avgRating || "0.0"}</span>
              </div>
            </div>

            <div style={{ background: "#f0fdf4", padding: "14px", borderRadius: "12px", border: "1px solid #bbf7d0" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#166534", textTransform: "uppercase" }}>
                Positive (4-5★)
              </div>
              <div style={{ fontSize: "22px", fontWeight: "800", color: "#15803d", marginTop: "4px" }}>
                {stats.positiveReviews}
              </div>
            </div>

            <div style={{ background: "#fef2f2", padding: "14px", borderRadius: "12px", border: "1px solid #fecaca" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#991b1b", textTransform: "uppercase" }}>
                Gated (1-3★)
              </div>
              <div style={{ fontSize: "22px", fontWeight: "800", color: "#b91c1c", marginTop: "4px" }}>
                {stats.criticalReviews}
              </div>
            </div>
          </div>

          {/* Client Contact & Account Info */}
          <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "14px", padding: "18px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", marginBottom: "14px" }}>
              Client Contact &amp; Details
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", fontSize: "13px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Mail size={16} color="var(--primary)" />
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>Email Address</div>
                  <div style={{ fontWeight: "600", color: "var(--secondary)" }}>{client.email}</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Phone size={16} color="var(--success)" />
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>Mobile Number</div>
                  <div style={{ fontWeight: "600", color: "var(--secondary)" }}>{client.mobile}</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Calendar size={16} color="var(--text-muted)" />
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>Registered On</div>
                  <div style={{ fontWeight: "600", color: "var(--secondary)" }}>
                    {new Date(client.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Layers size={16} color="var(--accent)" />
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>Form Key &amp; Scope</div>
                  <div style={{ fontWeight: "600", color: "var(--secondary)" }}>
                    <code>{client.formKey}</code> ({client.branchId?.name || "Global"})
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription & Quota Card */}
          <div style={{ background: "#f8fafc", border: "1px solid var(--border)", borderRadius: "14px", padding: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CreditCard size={18} color="var(--primary)" />
                <h3 style={{ fontSize: "14px", fontWeight: "800", color: "var(--secondary)", margin: 0 }}>
                  Subscription &amp; Quota
                </h3>
              </div>
              <span className="badge badge-primary" style={{ fontWeight: "700" }}>
                {pkg?.packageName || (client.trialStatus === "active" ? "Free Trial (7 Days)" : "Standard Plan")}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginTop: "10px" }}>
              <span style={{ color: "var(--text-muted)" }}>Monthly Review Quota:</span>
              <span style={{ fontWeight: "700", color: "var(--secondary)" }}>
                {pkg?.reviewLimit || 100} Reviews
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginTop: "6px" }}>
              <span style={{ color: "var(--text-muted)" }}>Pricing Tier:</span>
              <span style={{ fontWeight: "700", color: "var(--success)" }}>
                ₹{pkg?.price ?? 0} / {pkg?.billingType || "Monthly"}
              </span>
            </div>
          </div>

          {/* Live Review Portal Link */}
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "14px", padding: "18px" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#166534", marginBottom: "8px", textTransform: "uppercase" }}>
              Live Review Landing Page
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "13px", color: "#15803d", fontWeight: "600", wordBreak: "break-all" }}>
                {reviewPortalUrl}
              </span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="btn btn-outline btn-sm"
                  style={{ background: "#ffffff", borderColor: "#86efac", color: "#166534" }}
                >
                  {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                  <span>{copied ? "Copied!" : "Copy URL"}</span>
                </button>

                <a
                  href={reviewPortalUrl}
                  className="btn btn-primary btn-sm"
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span>Open Page</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Connected Review Platforms List */}
          {client.platforms && client.platforms.length > 0 && (
            <div>
              <h3 style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px" }}>
                Connected Platforms ({client.platforms.length})
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {client.platforms.map((p) => (
                  <div
                    key={p._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      background: "#f8fafc",
                      border: "1px solid var(--border)",
                      fontSize: "12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" }}>
                      <Globe size={14} color="var(--primary)" />
                      <span>{p.webName}</span>
                    </div>
                    <a
                      href={p.webLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "var(--primary)", textDecoration: "none", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    >
                      {p.webLink}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div
          style={{
            padding: "16px 28px",
            borderTop: "1px solid var(--border)",
            background: "#f8fafc",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Close
          </button>

          <button
            type="button"
            onClick={handleViewReviews}
            className="btn btn-primary"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <FileText size={16} />
            <span>Filter &amp; View All Reviews For This Client ({stats.totalReviews})</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
