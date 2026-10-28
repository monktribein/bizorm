import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import {
  Star,
  Clock,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Download,
  ThumbsUp,
  AlertTriangle,
  TrendingUp,
  UserCheck,
  Sparkles,
  Calendar,
  MessageSquare,
  Filter,
  ShieldCheck,
  Building2,
  Award,
} from "lucide-react";
import { getCleanBrandName } from "../../utils/brand";

export const StaffDashboard = ({ user, companyDetails, stats, recentReviews = [], loading, onRefresh }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [selectedStarFilter, setSelectedStarFilter] = useState("ALL");

  const fullName = [user?.fname, user?.lname].filter(Boolean).join(" ").trim() || user?.uname || "Team Member";
  const staffTag = user?.uname || fullName;
  const businessName = getCleanBrandName(user, companyDetails);
  const dutyTiming = user?.dutyTiming || "09:00 AM - 06:00 PM";

  // Build the direct staff review URL
  const staffReviewUrl = user?.formKey
    ? `${window.location.origin}/wtr/${user.formKey}?staff=${encodeURIComponent(staffTag)}`
    : "";

  useEffect(() => {
    if (staffReviewUrl) {
      QRCode.toDataURL(staffReviewUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("Error generating QR:", err));
    }
  }, [staffReviewUrl]);

  const handleCopyLink = () => {
    if (!staffReviewUrl) return;
    navigator.clipboard.writeText(staffReviewUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `${staffTag.toLowerCase().replace(/\s+/g, "_")}_counter_qr.png`;
    a.click();
  };

  const total = stats?.total || 0;
  const distribution = stats?.distribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const avgRating = stats?.averageRating ? Number(stats.averageRating).toFixed(1) : "0.0";
  const positiveCount = (distribution[4] || 0) + (distribution[5] || 0);
  const criticalCount = (distribution[1] || 0) + (distribution[2] || 0) + (distribution[3] || 0);
  const positivePercent = total > 0 ? Math.round((positiveCount / total) * 100) : 0;

  // Filter recent reviews for this staff member
  const filteredReviews = recentReviews.filter((r) => {
    if (selectedStarFilter === "ALL") return true;
    return r.star === Number(selectedStarFilter);
  });

  const STAR_TIERS = [
    { stars: 5, label: "5 Star Ratings", count: distribution[5] || 0, color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0", desc: "Delighted & Promoters" },
    { stars: 4, label: "4 Star Ratings", count: distribution[4] || 0, color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", desc: "Satisfied Customers" },
    { stars: 3, label: "3 Star Ratings", count: distribution[3] || 0, color: "#eab308", bg: "#fefce8", border: "#fef08a", desc: "Neutral Feedback" },
    { stars: 2, label: "2 Star Ratings", count: distribution[2] || 0, color: "#f97316", bg: "#fff7ed", border: "#fed7aa", desc: "Needs Attention" },
    { stars: 1, label: "1 Star Ratings", count: distribution[1] || 0, color: "#ef4444", bg: "#fef2f2", border: "#fecaca", desc: "Critical Complaints" },
  ];

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 1. Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          borderRadius: "16px",
          padding: "26px 30px",
          color: "#ffffff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.25)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "900",
              boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)",
              flexShrink: 0,
            }}
          >
            {fullName[0]?.toUpperCase() || "S"}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
              <h1 style={{ fontSize: "22px", fontWeight: "800", margin: 0, color: "#ffffff", letterSpacing: "-0.5px" }}>
                {fullName}
              </h1>
              <span
                style={{
                  background: "rgba(59, 130, 246, 0.2)",
                  color: "#93c5fd",
                  border: "1px solid rgba(147, 197, 253, 0.3)",
                  fontSize: "11px",
                  fontWeight: "700",
                  padding: "2px 8px",
                  borderRadius: "9999px",
                }}
              >
                Staff Performance Hub
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", fontSize: "13px", color: "#cbd5e1" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <Building2 size={14} color="#93c5fd" />
                <strong>{businessName}</strong>
              </span>
              <span>•</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <Clock size={14} color="#f59e0b" />
                Shift Timing: <strong style={{ color: "#fef08a" }}>{dutyTiming}</strong>
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={handleCopyLink}
            className="btn btn-secondary"
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 14px",
              borderRadius: "10px",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            {copiedLink ? <Check size={15} color="#4ade80" /> : <Copy size={15} />}
            <span>{copiedLink ? "Link Copied!" : "Copy Review Link"}</span>
          </button>

          {staffReviewUrl && (
            <a
              href={staffReviewUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "9px 14px",
                borderRadius: "10px",
                fontSize: "13px",
                textDecoration: "none",
              }}
            >
              <ExternalLink size={15} />
              <span>Test Form</span>
            </a>
          )}
        </div>
      </div>

      {/* 2. Key Performance Metric Cards */}
      <div className="grid-4" style={{ gap: "16px" }}>
        {/* Total Reviews */}
        <div
          className="card"
          style={{
            padding: "20px",
            background: "#ffffff",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
              Total Reviews
            </span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={16} color="#0f172a" />
            </div>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "900", color: "#0f172a" }}>
            {total}
          </div>
          <div style={{ fontSize: "12px", color: "#64748b" }}>
            Customer ratings recorded under your shift
          </div>
        </div>

        {/* Average Rating */}
        <div
          className="card"
          style={{
            padding: "20px",
            background: "#ffffff",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
              Average Rating
            </span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span style={{ fontSize: "28px", fontWeight: "900", color: "#0f172a" }}>{avgRating}</span>
            <span style={{ fontSize: "14px", color: "#64748b", fontWeight: "600" }}>/ 5.0</span>
          </div>
          <div style={{ display: "flex", gap: "3px" }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={14}
                fill={s <= Math.round(Number(avgRating)) ? "#f59e0b" : "#e2e8f0"}
                color={s <= Math.round(Number(avgRating)) ? "#f59e0b" : "#cbd5e1"}
              />
            ))}
          </div>
        </div>

        {/* Delighted (4 & 5 Stars) */}
        <div
          className="card"
          style={{
            padding: "20px",
            background: "#ffffff",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#065f46", textTransform: "uppercase" }}>
              Positive (4★ &amp; 5★)
            </span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ThumbsUp size={16} color="#10b981" />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span style={{ fontSize: "28px", fontWeight: "900", color: "#065f46" }}>{positiveCount}</span>
            <span style={{ fontSize: "12px", color: "#10b981", fontWeight: "700" }}>({positivePercent}%)</span>
          </div>
          <div style={{ fontSize: "12px", color: "#065f46" }}>
            Happy customers redirected to Google
          </div>
        </div>

        {/* Critical (1★ to 3★) */}
        <div
          className="card"
          style={{
            padding: "20px",
            background: "#ffffff",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#991b1b", textTransform: "uppercase" }}>
              Critical (1★ - 3★)
            </span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertTriangle size={16} color="#ef4444" />
            </div>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "900", color: "#991b1b" }}>
            {criticalCount}
          </div>
          <div style={{ fontSize: "12px", color: "#991b1b" }}>
            Private internal feedback captured
          </div>
        </div>
      </div>

      {/* 3. Detailed Star Breakdown & Performance Focus (Core requirement) */}
      <div
        className="card"
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          padding: "24px 28px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: 0, display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <Award size={20} color="#f59e0b" />
              <span>Customer Star Distribution &amp; Ratings Breakdown</span>
            </h2>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0" }}>
              Detailed breakdown of how many 1-star, 2-star, 3-star, 4-star, and 5-star reviews were collected by you
            </p>
          </div>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            <button
              onClick={() => setSelectedStarFilter("ALL")}
              style={{
                border: selectedStarFilter === "ALL" ? "1.5px solid #0f172a" : "1px solid #e2e8f0",
                background: selectedStarFilter === "ALL" ? "#0f172a" : "#f8fafc",
                color: selectedStarFilter === "ALL" ? "#ffffff" : "#475569",
                borderRadius: "8px",
                padding: "5px 12px",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              All ({total})
            </button>
            {STAR_TIERS.map((tier) => (
              <button
                key={tier.stars}
                onClick={() => setSelectedStarFilter(String(tier.stars))}
                style={{
                  border: selectedStarFilter === String(tier.stars) ? `1.5px solid ${tier.color}` : "1px solid #e2e8f0",
                  background: selectedStarFilter === String(tier.stars) ? tier.bg : "#f8fafc",
                  color: selectedStarFilter === String(tier.stars) ? tier.color : "#475569",
                  borderRadius: "8px",
                  padding: "5px 10px",
                  fontSize: "12px",
                  fontWeight: selectedStarFilter === String(tier.stars) ? "800" : "600",
                  cursor: "pointer",
                }}
              >
                {tier.stars}★ ({tier.count})
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {STAR_TIERS.map((tier) => {
            const pct = total > 0 ? Math.round((tier.count / total) * 100) : 0;
            return (
              <div
                key={tier.stars}
                style={{
                  display: "grid",
                  gridTemplateColumns: "110px 1fr 90px 140px",
                  alignItems: "center",
                  gap: "16px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: selectedStarFilter === String(tier.stars) ? tier.bg : "#fafafa",
                  border: selectedStarFilter === String(tier.stars) ? `1px solid ${tier.border}` : "1px solid transparent",
                  transition: "all 0.15s ease",
                }}
              >
                {/* Star rating label with icon */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "14px", color: "#0f172a" }}>
                  <Star size={16} fill={tier.color} color={tier.color} />
                  <span>{tier.stars} Stars</span>
                </div>

                {/* Visual Progress Bar */}
                <div style={{ width: "100%", height: "10px", background: "#e2e8f0", borderRadius: "9999px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      background: tier.color,
                      borderRadius: "9999px",
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>

                {/* Count and Percentage */}
                <div style={{ textAlign: "right", fontWeight: "800", fontSize: "14px", color: tier.color }}>
                  {tier.count} <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "500" }}>({pct}%)</span>
                </div>

                {/* Subtext description */}
                <div style={{ fontSize: "12px", color: "#64748b", textAlign: "right" }}>
                  {tier.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom Grid: My Counter Review QR Code + Recent Feedback Attributed */}
      <div className="grid-2" style={{ gap: "20px", alignItems: "stretch" }}>
        {/* Left: Staff Personal Counter QR Card */}
        <div
          className="card"
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "16px",
          }}
        >
          <div style={{ alignSelf: "flex-start", textAlign: "left", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "800", fontSize: "16px", color: "#0f172a" }}>
              <QrCode size={18} color="var(--primary)" />
              <span>My Counter Review QR</span>
            </div>
            <p style={{ fontSize: "12.5px", color: "#64748b", margin: "4px 0 0" }}>
              Place at your reception counter or display on your mobile for customers to scan
            </p>
          </div>

          <div
            style={{
              padding: "16px",
              background: "#ffffff",
              border: "2px solid #e2e8f0",
              borderRadius: "16px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="My Staff QR Code"
                style={{ width: "180px", height: "180px", display: "block" }}
              />
            ) : (
              <div style={{ width: "180px", height: "180px", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
                Generating QR...
              </div>
            )}
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a" }}>
              Assisted by: <span style={{ color: "var(--primary)" }}>{fullName}</span>
            </div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>
              🕒 Shift: {dutyTiming}
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", width: "100%", justifyContent: "center" }}>
            <button
              onClick={handleDownloadQR}
              className="btn btn-outline btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "8px 14px" }}
            >
              <Download size={14} />
              <span>Download QR</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="btn btn-primary btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "8px 14px" }}
            >
              {copiedLink ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedLink ? "Copied" : "Copy Link"}</span>
            </button>
          </div>
        </div>

        {/* Right: Latest Customer Feedback Recorded */}
        <div
          className="card"
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "800", fontSize: "16px", color: "#0f172a" }}>
                <MessageSquare size={18} color="var(--primary)" />
                <span>My Customer Feedback</span>
              </div>
              <p style={{ fontSize: "12.5px", color: "#64748b", margin: "3px 0 0" }}>
                Showing reviews attributed to you ({filteredReviews.length} displayed)
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "360px", overflowY: "auto", paddingRight: "4px" }}>
            {filteredReviews.length === 0 ? (
              <div style={{ textAlign: "center", padding: "36px 16px", color: "#94a3b8" }}>
                <Star size={32} style={{ margin: "0 auto 8px", opacity: 0.3 }} />
                <div style={{ fontWeight: "700", color: "#475569", fontSize: "14px" }}>
                  No reviews {selectedStarFilter !== "ALL" ? `with ${selectedStarFilter} stars` : ""} recorded yet
                </div>
                <div style={{ fontSize: "12px", marginTop: "4px" }}>
                  Customers who scan your QR code will have their reviews displayed here.
                </div>
              </div>
            ) : (
              filteredReviews.map((r) => {
                const isPositive = r.star >= 4;
                return (
                  <div
                    key={r._id}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "10px",
                      background: isPositive ? "#fcfdfd" : "#fffbfb",
                      border: isPositive ? "1px solid #e2e8f0" : "1px solid #fee2e2",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            fill={i < r.star ? (isPositive ? "#f59e0b" : "#ef4444") : "#e2e8f0"}
                            color={i < r.star ? (isPositive ? "#f59e0b" : "#ef4444") : "#cbd5e1"}
                          />
                        ))}
                        <span style={{ fontSize: "12px", fontWeight: "700", marginLeft: "4px", color: isPositive ? "#0f172a" : "#dc2626" }}>
                          {r.star} Star{r.star > 1 ? "s" : ""}
                        </span>
                      </div>
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div style={{ fontSize: "13px", color: "#334155" }}>
                      {r.review ? `"${r.review}"` : <em style={{ color: "#94a3b8" }}>No text comments left</em>}
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                      <span>Customer: <strong>{r.name || "Customer"}</strong></span>
                      <span className={`badge ${isPositive ? "badge-success" : "badge-danger"}`} style={{ fontSize: "10px", padding: "1px 6px" }}>
                        {r.webName || (isPositive ? "Google Redirect" : "Private Intercept")}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
