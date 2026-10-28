import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import {
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  RefreshCw,
  Send,
  User,
  Phone,
  Trash2,
  ExternalLink,
  Sparkles,
  TrendingUp,
  UserCheck,
  Star,
} from "lucide-react";

export const ReviewBoosterQueue = ({ brandName, formKey, onInviteLoggedTrigger }) => {
  const [invites, setInvites] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(""); // "" | "DUE" | "INVITED" | "COMPLETED"
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const loadQueue = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;
      const res = await api.getReviewInvites(params);
      if (res.success) {
        setInvites(res.invites || []);
        setStats(res.stats || null);
      }
    } catch (err) {
      console.error("Failed to load review booster queue:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, [statusFilter, onInviteLoggedTrigger]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadQueue();
  };

  const handleSendFollowUp = async (invite) => {
    try {
      setProcessingId(invite._id);

      const reviewUrl = `${window.location.origin}/wtr/${formKey || invite.formKey}?name=${encodeURIComponent(
        invite.customerName
      )}&mobile=${invite.customerMobile}&staff=${encodeURIComponent(invite.staffMember || "")}&star=5`;

      const followUpMsg = `Hi ${invite.customerName}! Just a quick follow-up — we hope you had a wonderful experience at ${brandName}. If you have 30 seconds, our team would truly appreciate your quick rating: ${reviewUrl}`;

      // Open WhatsApp Web/App
      const cleanMobile = invite.customerMobile.replace(/[^0-9]/g, "").slice(-10);
      const waUrl = `https://wa.me/91${cleanMobile}?text=${encodeURIComponent(followUpMsg)}`;
      window.open(waUrl, "_blank");

      // Record follow-up in database
      const res = await api.recordFollowUp(invite._id);
      if (res.success) {
        loadQueue();
      }
    } catch (err) {
      console.error("Failed to record follow-up:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteInvite = async (id) => {
    if (!window.confirm("Delete this customer invite from the booster queue?")) return;
    try {
      const res = await api.deleteInvite(id);
      if (res.success) {
        setInvites((prev) => prev.filter((i) => i._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete invite:", err);
    }
  };

  return (
    <div
      className="card no-print"
      style={{
        padding: "24px",
        background: "#ffffff",
        border: "1.5px solid #e2e8f0",
        boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {/* Booster Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
            }}
          >
            <Clock size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
              Review Booster &amp; Follow-up Queue
            </h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
              Automated tracking for invited customers with 1-click WhatsApp follow-ups for pending reviews
            </p>
          </div>
        </div>

        <button
          onClick={loadQueue}
          disabled={loading}
          className="btn btn-outline btn-sm"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      {stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "14px",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderLeft: "4px solid #3b82f6",
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
              Total Invites
            </div>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>
              {stats.totalInvites}
            </div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>Sent across all channels</div>
          </div>

          <div
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderLeft: "4px solid #10b981",
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#166534", textTransform: "uppercase" }}>
              Completed Reviews
            </div>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "#166534" }}>
              {stats.completedCount}
            </div>
            <div style={{ fontSize: "11px", color: "#15803d", fontWeight: "700" }}>
              {stats.conversionRate}% Conversion Rate
            </div>
          </div>

          <div
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              background: stats.dueReminderCount > 0 ? "#fef2f2" : "#f8fafc",
              border: stats.dueReminderCount > 0 ? "1px solid #fecaca" : "1px solid #e2e8f0",
              borderLeft: stats.dueReminderCount > 0 ? "4px solid #ef4444" : "4px solid #94a3b8",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: stats.dueReminderCount > 0 ? "#991b1b" : "#64748b",
                textTransform: "uppercase",
              }}
            >
              Follow-Ups Due (&gt;24h)
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: "800",
                color: stats.dueReminderCount > 0 ? "#dc2626" : "#0f172a",
              }}
            >
              {stats.dueReminderCount}
            </div>
            <div style={{ fontSize: "11px", color: stats.dueReminderCount > 0 ? "#b91c1c" : "#64748b" }}>
              {stats.dueReminderCount > 0 ? "Ready for gentle reminder" : "All up to date"}
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        {/* Status Tabs */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {[
            { id: "", label: "All Customers" },
            { id: "DUE", label: "⏰ Follow-Up Due" },
            { id: "INVITED", label: "⏳ Awaiting Review" },
            { id: "COMPLETED", label: "✅ Completed" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "700",
                border: statusFilter === tab.id ? "2px solid #059669" : "1px solid #cbd5e1",
                background: statusFilter === tab.id ? "#ecfdf5" : "#ffffff",
                color: statusFilter === tab.id ? "#047857" : "#475569",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "6px" }}>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: "10px", top: "10px", color: "#9ca3af" }} />
            <input
              type="text"
              placeholder="Search name or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                paddingLeft: "30px",
                paddingRight: "10px",
                height: "34px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "12px",
                width: "200px",
              }}
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: "0 12px" }}>
            Search
          </button>
        </form>
      </div>

      {/* Queue Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: "600px", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #e2e8f0", textAlign: "left" }}>
              <th style={{ padding: "12px 14px", fontWeight: "700", color: "#475569" }}>Customer</th>
              <th style={{ padding: "12px 14px", fontWeight: "700", color: "#475569" }}>Mobile</th>
              <th style={{ padding: "12px 14px", fontWeight: "700", color: "#475569" }}>Staff Attributed</th>
              <th style={{ padding: "12px 14px", fontWeight: "700", color: "#475569" }}>Invited Date</th>
              <th style={{ padding: "12px 14px", fontWeight: "700", color: "#475569" }}>Status</th>
              <th style={{ padding: "12px 14px", fontWeight: "700", color: "#475569", textAlign: "right" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {invites.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
                  {loading ? "Loading customer queue..." : "No customer invites found in this queue."}
                </td>
              </tr>
            ) : (
              invites.map((inv) => {
                const isCompleted = inv.status === "COMPLETED";
                const isDue = inv.isReminderDue && !isCompleted;

                return (
                  <tr
                    key={inv._id}
                    style={{
                      borderBottom: "1px solid #e2e8f0",
                      background: isDue ? "#fefefe" : "transparent",
                    }}
                  >
                    {/* Customer Name */}
                    <td style={{ padding: "12px 14px", fontWeight: "700", color: "#0f172a" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            background: isCompleted ? "#10b981" : "#3b82f6",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "800",
                            fontSize: "12px",
                          }}
                        >
                          {(inv.customerName || "C").charAt(0).toUpperCase()}
                        </div>
                        <span>{inv.customerName}</span>
                      </div>
                    </td>

                    {/* Mobile */}
                    <td style={{ padding: "12px 14px", color: "#64748b", fontFamily: "monospace" }}>
                      +91 {inv.customerMobile}
                    </td>

                    {/* Staff Attributed */}
                    <td style={{ padding: "12px 14px", color: "#334155" }}>
                      {inv.staffMember ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "2px 8px",
                            borderRadius: "6px",
                            background: "#eff6ff",
                            color: "#1d4ed8",
                            fontSize: "11px",
                            fontWeight: "700",
                          }}
                        >
                          <UserCheck size={12} />
                          <span>{inv.staffMember}</span>
                        </span>
                      ) : (
                        <span style={{ color: "#94a3b8", fontSize: "12px" }}>General Team</span>
                      )}
                    </td>

                    {/* Date */}
                    <td style={{ padding: "12px 14px", color: "#64748b", fontSize: "12px" }}>
                      {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : "Recent"}
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: "12px 14px" }}>
                      {isCompleted ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "3px 9px",
                            borderRadius: "9999px",
                            background: "#ecfdf5",
                            color: "#059669",
                            fontSize: "11px",
                            fontWeight: "800",
                            border: "1px solid #a7f3d0",
                          }}
                        >
                          <CheckCircle2 size={13} />
                          <span>Reviewed {inv.completedStar ? `(${inv.completedStar}★)` : ""}</span>
                        </span>
                      ) : isDue ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "3px 9px",
                            borderRadius: "9999px",
                            background: "#fef2f2",
                            color: "#dc2626",
                            fontSize: "11px",
                            fontWeight: "800",
                            border: "1px solid #fecaca",
                          }}
                        >
                          <Clock size={13} />
                          <span>Follow-Up Due</span>
                        </span>
                      ) : inv.status === "REMINDER_SENT" ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "3px 9px",
                            borderRadius: "9999px",
                            background: "#f0f9ff",
                            color: "#0284c7",
                            fontSize: "11px",
                            fontWeight: "700",
                            border: "1px solid #bae6fd",
                          }}
                        >
                          <Send size={12} />
                          <span>Reminder #{inv.reminderCount || 1}</span>
                        </span>
                      ) : (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "3px 9px",
                            borderRadius: "9999px",
                            background: "#f8fafc",
                            color: "#64748b",
                            fontSize: "11px",
                            fontWeight: "600",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <span>Waiting</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "12px 14px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px", alignItems: "center" }}>
                        {!isCompleted ? (
                          <button
                            type="button"
                            onClick={() => handleSendFollowUp(inv)}
                            disabled={processingId === inv._id}
                            className="btn btn-sm"
                            style={{
                              padding: "4px 10px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: "700",
                              background: isDue ? "#16a34a" : "#0f172a",
                              color: "#ffffff",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            <MessageCircle size={13} />
                            <span>{inv.reminderCount > 0 ? "Follow-Up Again" : "Send Follow-Up"}</span>
                          </button>
                        ) : (
                          <span style={{ fontSize: "11px", color: "#10b981", fontWeight: "700" }}>
                            Verified Reviewer
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteInvite(inv._id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#cbd5e1",
                            cursor: "pointer",
                            padding: "4px",
                          }}
                          title="Delete invite record"
                        >
                          <Trash2 size={14} color="#94a3b8" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
