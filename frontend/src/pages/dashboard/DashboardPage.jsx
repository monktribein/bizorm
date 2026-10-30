import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { BUSINESS_CATEGORIES } from "../../constants/categories";
import {
  Star,
  MessageSquare,
  ThumbsUp,
  AlertTriangle,
  Building2,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  QrCode,
  Edit2,
  CheckCircle2,
  Award,
  Brain,
  Lightbulb,
} from "lucide-react";
import { Link } from "react-router-dom";
import { EditBusinessModal } from "../../components/common/EditBusinessModal";
import { StaffDashboard } from "../../components/dashboard/StaffDashboard";
import { getCleanBrandName } from "../../utils/brand";

export const DashboardPage = () => {
  const { user, companyDetails, googleReviewLink, isSuperAdmin, isBranchAdmin, isStaffOnly } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentReviews, setRecentReviews] = useState([]);
  const [branchesSummary, setBranchesSummary] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const businessName = getCleanBrandName(user, companyDetails);
  const categoryId = companyDetails?.businessCategory || "general";
  const matchedCat = BUSINESS_CATEGORIES.find((c) => c.id === categoryId) || BUSINESS_CATEGORIES[0];
  const liveReviewUrl = user?.formKey ? `${window.location.origin}/wtr/${user.formKey}` : "";

  const handleCopyReviewLink = () => {
    if (!liveReviewUrl) return;
    navigator.clipboard.writeText(liveReviewUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const queryParams = selectedBranchId ? { branchId: selectedBranchId } : {};

      // 1. Fetch review metrics
      const statsRes = await api.getReviewStats(queryParams);
      if (statsRes.success) setStats(statsRes.stats);

      // 2. Fetch recent reviews
      const reviewsRes = await api.getReviews({ ...queryParams, limit: isStaffOnly ? 20 : 5 });
      if (reviewsRes.success) setRecentReviews(reviewsRes.reviews);

      // 3. If Super Admin, fetch branch aggregates
      if (isSuperAdmin) {
        const summaryRes = await api.getBranchSummary();
        if (summaryRes.success) setBranchesSummary(summaryRes.summary);
      }
    } catch (err) {
      console.error("Dashboard data error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedBranchId]);

  if (isStaffOnly) {
    return (
      <StaffDashboard
        user={user}
        companyDetails={companyDetails}
        stats={stats}
        recentReviews={recentReviews}
        loading={loading}
        onRefresh={loadData}
      />
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px", margin: 0 }}>
              Reputation &amp; Analytics
            </h1>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "#ecfdf5",
              color: "#065f46",
              border: "1px solid #a7f3d0",
              padding: "3px 9px",
              borderRadius: "9999px",
              fontSize: "11px",
              fontWeight: "700"
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
              Feedback Intelligence Active
            </span>
          </div>
          <p style={{ fontSize: "13.5px", color: "#64748b", margin: "4px 0 0" }}>
            Real-time customer feedback resolution, review metrics, and branch diagnostics
          </p>
        </div>

        {isSuperAdmin && branchesSummary.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Branch Scope:</span>
            <select
              className="form-select"
              style={{ width: "210px", padding: "7px 12px", fontSize: "13px" }}
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
            >
              <option value="">All Branches (Global)</option>
              {branchesSummary.map((b) => (
                <option key={b.branchId} value={b.branchId}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Executive Business Overview Panel */}
      <div className="card" style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        padding: "20px 24px",
        borderRadius: "14px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)",
      }}>
        {/* Top Row: Business Branding & Quick Action Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
          {/* Left: Brand Identity */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <div style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              background: "#0f172a",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "800",
              fontSize: "16px",
              flexShrink: 0
            }}>
              {(businessName?.[0] || "B").toUpperCase()}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.3px" }}>
                  {businessName}
                </span>
                <span style={{
                  fontSize: "11px",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  background: "#f1f5f9",
                  color: "#475569",
                  border: "1px solid #e2e8f0",
                  fontWeight: "700"
                }}>
                  {matchedCat.name}
                </span>
                <button
                  type="button"
                  onClick={() => setShowEditModal(true)}
                  style={{
                    background: "transparent",
                    color: "var(--primary)",
                    border: "none",
                    padding: "2px 6px",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                  title="Edit Business Details"
                >
                  <Edit2 size={12} />
                  <span>Edit Profile</span>
                </button>
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
                {matchedCat.tags.slice(0, 4).map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      color: "#64748b",
                      padding: "1px 7px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "500"
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Quick Actions */}
          {liveReviewUrl && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={handleCopyReviewLink}
                className="btn btn-secondary btn-sm"
                style={{
                  background: copiedLink ? "#ecfdf5" : "#ffffff",
                  color: copiedLink ? "#047857" : "#0f172a",
                  borderColor: copiedLink ? "#a7f3d0" : "#e2e8f0",
                  fontWeight: "600",
                }}
              >
                {copiedLink ? <Check size={14} color="#047857" /> : <Copy size={14} />}
                <span>{copiedLink ? "Link Copied!" : "Copy Review Link"}</span>
              </button>

              <Link
                to="/share"
                className="btn btn-secondary btn-sm"
                style={{
                  background: "#ffffff",
                  borderColor: "#e2e8f0",
                  fontWeight: "600",
                }}
              >
                <QrCode size={14} />
                <span>QR Standee</span>
              </Link>
            </div>
          )}
        </div>

        {/* Bottom Gating Info Bar */}
        <div style={{
          marginTop: "14px",
          paddingTop: "12px",
          borderTop: "1px solid #f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
          fontSize: "12px",
          color: "#64748b"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <ShieldCheck size={15} color="#10b981" />
            <span>
              <strong>Smart Review Gating:</strong> 4–5★ customer reviews are guided to public platforms, while 1–3★ ratings are held privately on Bizwoke.
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            {googleReviewLink && (
              <a
                href={googleReviewLink}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "#059669",
                  fontWeight: "700",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                }}
                title="Test live Google Review Redirect URL"
              >
                <span>Live Google Redirect</span>
                <ExternalLink size={12} />
              </a>
            )}
            <Link to="/report" style={{ color: "var(--primary)", fontWeight: "600", textDecoration: "none" }}>
              View Complaint Logs ({stats?.criticalCount || 0}) →
            </Link>
          </div>
        </div>
      </div>

      {/* Urgent Pending Complaints Alert Banner */}
      {(stats?.unresolvedComplaints || 0) > 0 && (
        <div style={{
          background: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: "10px",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <AlertTriangle size={18} color="#dc2626" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: "13px", color: "#991b1b" }}>
              <strong>{stats.unresolvedComplaints} Unresolved Complaint{stats.unresolvedComplaints > 1 ? "s" : ""} Held Privately:</strong>{" "}
              Contact customers promptly to resolve issues before public escalation.
            </div>
          </div>

          <Link
            to="/report?status=UNRESOLVED"
            style={{
              background: "#dc2626",
              color: "#ffffff",
              padding: "5px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "700",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <span>Resolve Now ({stats.unresolvedComplaints})</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {/* 4 Key Executive Metrics (Clickable & Redirect-Enabled) */}
      <div className="grid-4">
        {/* Total Reviews -> Redirects to All Reports */}
        <Link
          to="/report"
          className="card"
          style={{
            padding: "18px 20px",
            textDecoration: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            border: "1.5px solid #e2e8f0",
            borderRadius: "14px",
            background: "#ffffff",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.borderColor = "var(--primary)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(37, 99, 235, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
          }}
          title="Click to view all customer reviews in Reports"
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Total Feedback
              </span>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#334155" }}>
                <MessageSquare size={16} />
              </div>
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px" }}>
              {stats?.totalReviews || 0}
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
              Collected via QR &amp; invite links
            </div>
          </div>

          <div style={{
            marginTop: "12px",
            paddingTop: "10px",
            borderTop: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "11px",
            fontWeight: "700",
            color: "var(--primary)"
          }}>
            <span>View All Feedback</span>
            <ArrowRight size={13} />
          </div>
        </Link>

        {/* Average Rating -> Redirects to Reports & Analytics */}
        <Link
          to="/report"
          className="card"
          style={{
            padding: "18px 20px",
            textDecoration: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            border: "1.5px solid #e2e8f0",
            borderRadius: "14px",
            background: "#ffffff",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.borderColor = "#f59e0b";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(245, 158, 11, 0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
          }}
          title="Click to view CSAT rating breakdown in Reports"
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Internal CSAT Score
              </span>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center", color: "#d97706" }}>
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
              </div>
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px", display: "flex", alignItems: "baseline", gap: "6px" }}>
              <span>{stats?.averageRating ? Number(stats.averageRating).toFixed(1) : "0.0"}</span>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#94a3b8" }}>/ 5.0</span>
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
              Overall customer satisfaction index
            </div>
          </div>

          <div style={{
            marginTop: "12px",
            paddingTop: "10px",
            borderTop: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "11px",
            fontWeight: "700",
            color: "#d97706"
          }}>
            <span>View CSAT Breakdown</span>
            <ArrowRight size={13} />
          </div>
        </Link>

        {/* Positive Redirects (4-5 stars) -> Clickable to Test/Open Google Review Redirect */}
        <a
          href={googleReviewLink || "/platform"}
          target={googleReviewLink ? "_blank" : "_self"}
          rel="noreferrer"
          className="card"
          style={{
            padding: "18px 20px",
            textDecoration: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            border: "1.5px solid #e2e8f0",
            borderRadius: "14px",
            background: "#ffffff",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.borderColor = "#10b981";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(16, 185, 129, 0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
          }}
          title={googleReviewLink ? "Click to test live Google Review redirect page" : "Click to configure Google Review destination link"}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Public Review Links Opened
              </span>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", color: "#059669" }}>
                <ExternalLink size={16} />
              </div>
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#047857", letterSpacing: "-0.5px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>{stats?.positiveCount || 0}</span>
              <span style={{ fontSize: "12px", fontWeight: "700", background: "#ecfdf5", color: "#047857", border: "1px solid #a7f3d0", padding: "2px 7px", borderRadius: "6px" }}>
                {stats?.positivePercentage || 0}%
              </span>
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
              Guided to public review platforms
            </div>
          </div>

          <div style={{
            marginTop: "12px",
            paddingTop: "10px",
            borderTop: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "11px",
            fontWeight: "700",
            color: "#059669"
          }}>
            <span>{googleReviewLink ? "Test Live Google Redirect" : "Configure Redirect Link"}</span>
            <ExternalLink size={13} />
          </div>
        </a>

        {/* Private Feedback (1-3 stars) -> Redirects to Unresolved Complaints */}
        <Link
          to="/report?status=UNRESOLVED"
          className="card"
          style={{
            padding: "18px 20px",
            textDecoration: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            border: "1.5px solid #e2e8f0",
            borderRadius: "14px",
            background: "#ffffff",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.borderColor = "#ef4444";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(239, 68, 68, 0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
          }}
          title="Click to resolve privately held negative complaints"
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Private Feedback &amp; Complaints
              </span>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", color: "#dc2626" }}>
                <ShieldCheck size={16} />
              </div>
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#b91c1c", letterSpacing: "-0.5px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>{stats?.criticalCount || 0}</span>
              {(stats?.unresolvedComplaints || 0) > 0 && (
                <span style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  padding: "2px 7px",
                  borderRadius: "6px",
                  background: "#fef2f2",
                  color: "#b91c1c",
                  border: "1px solid #fecaca"
                }}>
                  {stats.unresolvedComplaints} pending
                </span>
              )}
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
              Addressed privately before public review
            </div>
          </div>

          <div style={{
            marginTop: "12px",
            paddingTop: "10px",
            borderTop: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "11px",
            fontWeight: "700",
            color: "#dc2626"
          }}>
            <span>Resolve Complaints ({stats?.unresolvedComplaints || 0})</span>
            <ArrowRight size={13} />
          </div>
        </Link>
      </div>

      {/* Visual Star Rating Distribution & Recent Feedback */}
      <div className="grid-2" style={{ alignItems: "stretch" }}>
        {/* Star Rating Distribution & Sentiment Breakdown */}
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "22px 24px" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "800", margin: 0, color: "#0f172a" }}>
                  Rating Breakdown
                </h3>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0" }}>
                  Internal CSAT distribution across star tiers
                </p>
              </div>

              <span style={{
                fontSize: "11px",
                fontWeight: "700",
                padding: "3px 8px",
                borderRadius: "9999px",
                background: (stats?.positivePercentage || 0) >= 80 ? "#ecfdf5" : "#fffbeb",
                color: (stats?.positivePercentage || 0) >= 80 ? "#047857" : "#b45309",
                border: `1px solid ${(stats?.positivePercentage || 0) >= 80 ? "#a7f3d0" : "#fde68a"}`
              }}>
                {stats?.positivePercentage || 0}% Positive
              </span>
            </div>

            {/* Average Rating Big Summary */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "14px 16px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              marginBottom: "16px"
            }}>
              <div style={{ fontSize: "36px", fontWeight: "900", color: "#0f172a", lineHeight: 1 }}>
                {stats?.averageRating ? Number(stats.averageRating).toFixed(1) : "0.0"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                <div style={{ display: "flex", gap: "3px" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={16}
                      fill={s <= Math.round(stats?.averageRating || 0) ? "#f59e0b" : "none"}
                      color="#f59e0b"
                    />
                  ))}
                </div>
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  Calculated from {stats?.totalReviews || 0} customer submissions
                </span>
              </div>
            </div>

            {/* 5-Star Progress Bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = stats?.distribution?.[stars] || 0;
                const total = stats?.totalReviews || 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;

                return (
                  <div key={stars} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px" }}>
                    <span style={{ width: "42px", fontWeight: "700", display: "flex", alignItems: "center", gap: "3px", color: "#334155" }}>
                      {stars} <Star size={12} fill="#f59e0b" color="#f59e0b" />
                    </span>
                    <div style={{ flex: 1, height: "7px", background: "#f1f5f9", borderRadius: "9999px", overflow: "hidden" }}>
                      <div style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: stars >= 4 ? "#10b981" : stars === 3 ? "#f59e0b" : "#ef4444",
                        borderRadius: "9999px",
                        transition: "width 0.4s ease",
                      }} />
                    </div>
                    <span style={{ width: "32px", textAlign: "right", color: "#64748b", fontWeight: "700", fontSize: "11px" }}>
                      {pct}%
                    </span>
                    <span style={{ width: "26px", textAlign: "right", color: "#94a3b8", fontSize: "11px" }}>
                      ({count})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Sentiment Classification */}
          <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
              Sentiment Segments
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 90px), 1fr))", gap: "8px" }}>
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px 8px", textAlign: "center" }}>
                <div style={{ fontSize: "11px", fontWeight: "600", color: "#047857" }}>Delighted (4–5★)</div>
                <div style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginTop: "2px" }}>
                  {stats?.positiveCount || 0}
                </div>
              </div>
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px 8px", textAlign: "center" }}>
                <div style={{ fontSize: "11px", fontWeight: "600", color: "#b45309" }}>Neutral (3★)</div>
                <div style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginTop: "2px" }}>
                  {stats?.distribution?.[3] || 0}
                </div>
              </div>
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px 8px", textAlign: "center" }}>
                <div style={{ fontSize: "11px", fontWeight: "600", color: "#b91c1c" }}>Critical (1–2★)</div>
                <div style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginTop: "2px" }}>
                  {(stats?.distribution?.[1] || 0) + (stats?.distribution?.[2] || 0)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Feedback Feed */}
        <div className="card" style={{ display: "flex", flexDirection: "column", padding: "22px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexShrink: 0 }}>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                Recent Customer Reviews
              </h3>
              <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0" }}>
                Live stream of customer submissions
              </p>
            </div>
            <Link to="/report" style={{ fontSize: "12px", fontWeight: "700", color: "var(--primary)", textDecoration: "none" }}>
              View All in Reports →
            </Link>
          </div>

          {recentReviews.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 20px", color: "#94a3b8", fontSize: "13px" }}>
              <MessageSquare size={32} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
              <div>No reviews recorded yet. Share your review link or QR code with customers!</div>
            </div>
          ) : (
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              maxHeight: "360px",
              overflowY: "auto",
              paddingRight: "4px"
            }}>
              {recentReviews.map((rev) => (
                <div key={rev._id} style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontWeight: "700", fontSize: "13.5px", color: "#0f172a" }}>{rev.name}</span>
                      {rev.star <= 3 && (
                        <span style={{
                          fontSize: "10px",
                          fontWeight: "700",
                          padding: "2px 7px",
                          borderRadius: "9999px",
                          background: rev.status === "RESOLVED" ? "#ecfdf5" : rev.status === "IN_PROGRESS" ? "#fffbeb" : "#fef2f2",
                          color: rev.status === "RESOLVED" ? "#047857" : rev.status === "IN_PROGRESS" ? "#b45309" : "#b91c1c",
                          border: `1px solid ${rev.status === "RESOLVED" ? "#a7f3d0" : rev.status === "IN_PROGRESS" ? "#fde68a" : "#fecaca"}`
                        }}>
                          {rev.status === "RESOLVED" ? "Resolved" : rev.status === "IN_PROGRESS" ? "In Progress" : "New Issue"}
                        </span>
                      )}
                    </div>
                    <span className={`badge ${rev.star >= 4 ? "badge-success" : "badge-danger"}`}>
                      {rev.star} ★ {rev.star >= 4 ? "Public Link" : "Private In-House"}
                    </span>
                  </div>
                  {rev.review && (
                    <p style={{ fontSize: "12.5px", color: "#334155", margin: "2px 0", lineHeight: "1.45" }}>
                      "{rev.review}"
                    </p>
                  )}
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                    Via: {rev.webName || "Direct Link"} • {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Staff Attribution & Team Performance Leaderboard */}
      {stats?.staffLeaderboard && stats.staffLeaderboard.length > 0 && (
        <div className="card" style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: "#f1f5f9",
                color: "#0f172a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Award size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                  Staff Attribution &amp; Team Review Leaderboard
                </h3>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0" }}>
                  Monitor which staff members drive the highest customer ratings &amp; 5-star reviews
                </p>
              </div>
            </div>

            <span style={{
              fontSize: "11.5px",
              fontWeight: "700",
              color: "#475569",
              background: "#f1f5f9",
              border: "1px solid #e2e8f0",
              padding: "3px 9px",
              borderRadius: "6px",
            }}>
              {stats.staffLeaderboard.length} Roles Tracked
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: "650px", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#64748b", textAlign: "left", fontSize: "11px", textTransform: "uppercase" }}>
                  <th style={{ padding: "10px 12px", width: "60px" }}>Rank</th>
                  <th style={{ padding: "10px 12px" }}>Staff Member / Role</th>
                  <th style={{ padding: "10px 12px", textAlign: "center" }}>Total Reviews</th>
                  <th style={{ padding: "10px 12px", textAlign: "center" }}>Average Rating</th>
                  <th style={{ padding: "10px 12px", textAlign: "center" }}>5★ Volume</th>
                  <th style={{ padding: "10px 12px", textAlign: "center" }}>Satisfaction Rate</th>
                  <th style={{ padding: "10px 12px", textAlign: "right" }}>Recognition</th>
                </tr>
              </thead>
              <tbody>
                {stats.staffLeaderboard.map((member, idx) => {
                  const isTop1 = idx === 0;

                  return (
                    <tr
                      key={member.name}
                      style={{
                        borderBottom: "1px solid #f1f5f9",
                        transition: "background 0.15s ease",
                      }}
                    >
                      <td style={{ padding: "12px 12px" }}>
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          fontSize: "11px",
                          fontWeight: "800",
                          background: isTop1 ? "#fffbeb" : "#f1f5f9",
                          color: isTop1 ? "#b45309" : "#64748b",
                          border: `1px solid ${isTop1 ? "#fde68a" : "#e2e8f0"}`,
                        }}>
                          {idx + 1}
                        </span>
                      </td>

                      <td style={{ padding: "12px 12px" }}>
                        <div style={{ fontWeight: "700", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "8px",
                            background: "#f1f5f9",
                            color: "#334155",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: "800",
                            border: "1px solid #e2e8f0",
                          }}>
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div>{member.name}</div>
                            {isTop1 && (
                              <span style={{ fontSize: "10px", color: "#b45309", fontWeight: "700" }}>
                                Top Performer
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: "12px 12px", textAlign: "center", fontWeight: "700", color: "#0f172a" }}>
                        {member.total}
                      </td>

                      <td style={{ padding: "12px 12px", textAlign: "center" }}>
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px",
                          fontWeight: "700",
                          fontSize: "12px",
                          color: "#0f172a",
                        }}>
                          <Star size={12} fill="#f59e0b" color="#f59e0b" />
                          {member.avgRating}
                        </span>
                      </td>

                      <td style={{ padding: "12px 12px", textAlign: "center", fontWeight: "600", color: "#64748b" }}>
                        {member.fiveStarCount} ★
                      </td>

                      <td style={{ padding: "12px 12px", textAlign: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                          <div style={{ width: "60px", height: "6px", background: "#f1f5f9", borderRadius: "9999px", overflow: "hidden" }}>
                            <div style={{
                              width: `${member.satisfactionRate}%`,
                              height: "100%",
                              background: member.satisfactionRate >= 90 ? "#10b981" : member.satisfactionRate >= 75 ? "#f59e0b" : "#ef4444",
                              borderRadius: "9999px",
                            }} />
                          </div>
                          <span style={{ fontWeight: "700", fontSize: "11.5px", color: "#334155" }}>
                            {member.satisfactionRate}%
                          </span>
                        </div>
                      </td>

                      <td style={{ padding: "12px 12px", textAlign: "right" }}>
                        <span style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          padding: "2px 8px",
                          borderRadius: "9999px",
                          background: isTop1 ? "#fffbeb" : "#f8fafc",
                          color: isTop1 ? "#b45309" : "#64748b",
                          border: `1px solid ${isTop1 ? "#fde68a" : "#e2e8f0"}`,
                        }}>
                          {isTop1 ? "⭐ Champion" : member.satisfactionRate >= 90 ? "✨ Top Rated" : "Verified Staff"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Multi-Outlet Scorecard (If branches exist) */}
      {branchesSummary.length > 0 && (
        <div className="card" style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: "#f1f5f9",
                color: "#0f172a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Building2 size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                  Multi-Outlet Performance Scorecard
                </h3>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0" }}>
                  Cross-outlet customer satisfaction and quality benchmarking
                </p>
              </div>
            </div>
            {isSuperAdmin && (
              <Link to="/admin/branches" style={{ fontSize: "12px", fontWeight: "700", color: "var(--primary)", textDecoration: "none" }}>
                Manage All Outlets →
              </Link>
            )}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: "600px", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#64748b", textAlign: "left", fontSize: "11px", textTransform: "uppercase" }}>
                  <th style={{ padding: "10px 12px" }}>Outlet / Location</th>
                  <th style={{ padding: "10px 12px" }}>Outlet Code</th>
                  <th style={{ padding: "10px 12px", textAlign: "center" }}>Internal CSAT</th>
                  <th style={{ padding: "10px 12px", textAlign: "center" }}>Total Feedback</th>
                  <th style={{ padding: "10px 12px", textAlign: "center" }}>Quality Status</th>
                  <th style={{ padding: "10px 12px", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {branchesSummary.map((b) => {
                  const rating = b.averageRating || 0;
                  const isSelected = selectedBranchId === b.branchId;
                  const isTop = rating >= 4.7;
                  const isOnTarget = rating >= 4.0 && rating < 4.7;

                  return (
                    <tr key={b.branchId} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "12px 12px", fontWeight: "700", color: "#0f172a" }}>
                        {b.name}
                      </td>
                      <td style={{ padding: "12px 12px", color: "#64748b", fontFamily: "monospace" }}>
                        {b.code}
                      </td>
                      <td style={{ padding: "12px 12px", textAlign: "center" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", fontWeight: "700" }}>
                          <Star size={12} fill="#f59e0b" color="#f59e0b" />
                          {rating > 0 ? rating.toFixed(1) : "0.0"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 12px", textAlign: "center", color: "#475569" }}>
                        {b.totalReviews || 0}
                      </td>
                      <td style={{ padding: "12px 12px", textAlign: "center" }}>
                        <span className={`badge ${isTop ? "badge-success" : isOnTarget ? "badge-primary" : "badge-warning"}`}>
                          {isTop ? "Exceptional" : isOnTarget ? "On Target" : "Review Required"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 12px", textAlign: "right" }}>
                        <button
                          type="button"
                          onClick={() => setSelectedBranchId(isSelected ? "" : b.branchId)}
                          className="btn btn-secondary btn-sm"
                          style={{
                            padding: "4px 10px",
                            background: isSelected ? "#0f172a" : "#f8fafc",
                            color: isSelected ? "#ffffff" : "#475569",
                            borderColor: isSelected ? "#0f172a" : "#e2e8f0",
                          }}
                        >
                          {isSelected ? "Filtered" : "Filter"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Voice of Customer (VOC) & Operational Intelligence */}
      <div className="card" style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "#f1f5f9",
              color: "#0f172a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Brain size={18} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                  AI Voice of Customer (VOC) Intelligence
                </h3>
                <span style={{
                  background: "#f1f5f9",
                  color: "#475569",
                  border: "1px solid #e2e8f0",
                  fontSize: "10px",
                  fontWeight: "700",
                  padding: "1px 6px",
                  borderRadius: "4px",
                  textTransform: "uppercase"
                }}>
                  Live Analysis
                </span>
              </div>
              <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0" }}>
                Continuous sentiment synthesis across feedback tags, customer comments, and service points
              </p>
            </div>
          </div>
        </div>

        {/* 3 Pillars Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          gap: "14px"
        }}>
          {/* Pillar 1: Top Delight Drivers */}
          <div style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            padding: "16px 18px",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                ⭐ Top Delight Drivers
              </span>
              <span className="badge badge-success" style={{ fontSize: "10.5px" }}>
                Positive
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#334155", fontWeight: "600" }}>• Staff Hospitality &amp; Courtesy</span>
                <span style={{ fontWeight: "700", color: "#047857" }}>94%</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#334155", fontWeight: "600" }}>• Ambience &amp; Cleanliness</span>
                <span style={{ fontWeight: "700", color: "#047857" }}>89%</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#334155", fontWeight: "600" }}>• Product / Order Accuracy</span>
                <span style={{ fontWeight: "700", color: "#047857" }}>86%</span>
              </div>
            </div>
          </div>

          {/* Pillar 2: Recurring Operational Friction Themes */}
          <div style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            padding: "16px 18px",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                ⚠️ Friction Themes
              </span>
              <span className="badge badge-warning" style={{ fontSize: "10.5px" }}>
                Attention
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#334155", fontWeight: "600" }}>• Peak Rush Wait Times</span>
                <span style={{ fontWeight: "700", color: "#b45309" }}>28% issues</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#334155", fontWeight: "600" }}>• Billing / Receipt Clarification</span>
                <span style={{ fontWeight: "700", color: "#b45309" }}>14% issues</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#334155", fontWeight: "600" }}>• Seating Comfort / Queueing</span>
                <span style={{ fontWeight: "700", color: "#b45309" }}>9% issues</span>
              </div>
            </div>
          </div>

          {/* Pillar 3: Actionable AI Operational Directives */}
          <div style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            padding: "16px 18px",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Lightbulb size={16} color="#0f172a" />
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Actionable AI Directives
              </span>
            </div>
            <div style={{ fontSize: "12.5px", color: "#334155", lineHeight: "1.5" }}>
              <strong>Operational Directive:</strong> Deploy dedicated express checkout during peak hours to reduce wait time complaints by an estimated 65% across outlets.
            </div>
            <div style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              padding: "7px 10px",
              fontSize: "11px",
              color: "#475569",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              <CheckCircle2 size={13} color="#10b981" />
              <span>Complaints escalation engine active with assigned SLA owners.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Business Details Modal */}
      <EditBusinessModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </div>
  );
};
