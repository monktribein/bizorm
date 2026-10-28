import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Search, Star, Filter, ThumbsUp, AlertTriangle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Building2, X, MessageCircle, Check, CheckCircle2, FileText, PhoneCall, Download, BarChart3, ShieldCheck, TrendingUp } from "lucide-react";
import { ReviewCharts } from "../../components/charts/ReviewCharts";
import { WhatsAppReplyModal } from "../../components/reports/WhatsAppReplyModal";

export const ReportsPage = () => {
  const { isSuperAdmin, user, companyDetails } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialClient = searchParams.get("client") || "";
  const initialStatus = searchParams.get("status") || "";

  const [reviews, setReviews] = useState([]);
  const [clientsList, setClientsList] = useState([]);
  const [clientFilter, setClientFilter] = useState(initialClient);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [loading, setLoading] = useState(true);
  const [starFilter, setStarFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Visual Charts & WhatsApp Reply States
  const [stats, setStats] = useState(null);
  const [timeframe, setTimeframe] = useState("1month");
  const [statsLoading, setStatsLoading] = useState(false);
  const [whatsAppModalReview, setWhatsAppModalReview] = useState(null);
  const [exporting, setExporting] = useState(false);

  // Resolution & Escalation SLA Modal State
  const [resolutionModalReview, setResolutionModalReview] = useState(null);
  const [notesInput, setNotesInput] = useState("");
  const [statusInput, setStatusInput] = useState("RESOLVED");
  const [priorityInput, setPriorityInput] = useState("MEDIUM");
  const [assignedToInput, setAssignedToInput] = useState("");
  const [escalationInput, setEscalationInput] = useState("OUTLET");
  const [dueDateInput, setDueDateInput] = useState("");
  const [savingResolution, setSavingResolution] = useState(false);

  const loadReviews = async (
    pageNum = page,
    limitNum = limit,
    star = starFilter,
    searchVal = search,
    clientKey = clientFilter,
    statusVal = statusFilter
  ) => {
    setLoading(true);
    try {
      const params = {
        page: pageNum,
        limit: limitNum,
      };
      if (star) params.star = star;
      if (searchVal) params.search = searchVal;
      if (clientKey) params.formKey = clientKey;
      if (statusVal) params.status = statusVal;

      const res = await api.getReviews(params);
      if (res.success) {
        setReviews(res.reviews || []);
        setTotal(res.total || 0);
        setPage(res.page || pageNum);
        setTotalPages(res.totalPages || 1);
        if (res.clientsList && res.clientsList.length > 0) {
          setClientsList(res.clientsList);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async (tf = timeframe, cFilter = clientFilter) => {
    setStatsLoading(true);
    try {
      const params = { timeframe: tf };
      if (cFilter) params.formKey = cFilter;
      const res = await api.getReviewStats(params);
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error("Failed to load review stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleTimeframeChange = (newTf) => {
    setTimeframe(newTf);
    loadStats(newTf, clientFilter);
  };

  useEffect(() => {
    const clientParam = searchParams.get("client") || "";
    const statusParam = searchParams.get("status") || "";
    setClientFilter(clientParam);
    setStatusFilter(statusParam);
  }, [searchParams]);

  useEffect(() => {
    setPage(1);
    loadReviews(1, limit, starFilter, search, clientFilter, statusFilter);
    loadStats(timeframe, clientFilter);
  }, [starFilter, clientFilter, statusFilter]);

  const handleClientFilterChange = (formKey) => {
    setClientFilter(formKey);
    const newParams = {};
    if (formKey) newParams.client = formKey;
    if (statusFilter) newParams.status = statusFilter;
    setSearchParams(newParams);
  };

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    const newParams = {};
    if (clientFilter) newParams.client = clientFilter;
    if (newStatus) newParams.status = newStatus;
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadReviews(1, limit, starFilter, search, clientFilter, statusFilter);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
    loadReviews(newPage, limit, starFilter, search, clientFilter, statusFilter);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
    loadReviews(1, newLimit, starFilter, search, clientFilter, statusFilter);
  };

  // Direct status update from row dropdown
  const handleDirectStatusChange = async (reviewId, newStatus) => {
    try {
      const res = await api.updateReviewStatus(reviewId, { status: newStatus });
      if (res.success) {
        setReviews((prev) =>
          prev.map((r) => (r._id === reviewId ? { ...r, status: newStatus } : r))
        );
        loadStats(timeframe, clientFilter);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Open modal to add or edit resolution notes & complaint SLA
  const handleOpenResolutionModal = (r) => {
    setResolutionModalReview(r);
    setNotesInput(r.resolutionNotes || "");
    setStatusInput(r.status || "RESOLVED");
    setPriorityInput(r.priority || "MEDIUM");
    setAssignedToInput(r.assignedTo || (r.staffMember || ""));
    setEscalationInput(r.escalationLevel || "OUTLET");
    setDueDateInput(r.dueDate ? new Date(r.dueDate).toISOString().slice(0, 10) : "");
  };

  const handleSaveResolution = async (e) => {
    e.preventDefault();
    if (!resolutionModalReview) return;
    setSavingResolution(true);
    try {
      const res = await api.updateReviewStatus(resolutionModalReview._id, {
        status: statusInput,
        resolutionNotes: notesInput,
        priority: priorityInput,
        assignedTo: assignedToInput,
        escalationLevel: escalationInput,
        dueDate: dueDateInput || null,
      });
      if (res.success) {
        setReviews((prev) =>
          prev.map((r) =>
            r._id === resolutionModalReview._id
              ? {
                  ...r,
                  status: statusInput,
                  resolutionNotes: notesInput,
                  priority: priorityInput,
                  assignedTo: assignedToInput,
                  escalationLevel: escalationInput,
                  dueDate: dueDateInput || null,
                  resolvedAt: statusInput === "RESOLVED" ? new Date() : null,
                }
              : r
          )
        );
        loadStats(timeframe, clientFilter);
        setResolutionModalReview(null);
      }
    } catch (err) {
      console.error("Failed to save resolution:", err);
    } finally {
      setSavingResolution(false);
    }
  };

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    if (page <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (page >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
    }
    return pages;
  };

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const params = {
        page: 1,
        limit: 2000,
      };
      if (starFilter) params.star = starFilter;
      if (search) params.search = search;
      if (clientFilter) params.formKey = clientFilter;
      if (statusFilter) params.status = statusFilter;

      const res = await api.getReviews(params);
      const exportData = (res && res.reviews && res.reviews.length > 0) ? res.reviews : reviews;

      if (!exportData || exportData.length === 0) {
        alert("No reviews found to export with the current filter settings.");
        return;
      }

      const headers = [
        "Date",
        "Time",
        "Customer Name",
        "Mobile Number",
        "Star Rating",
        "Type",
        "Resolution Status",
        "Staff Attributed",
        "Review / Feedback Content",
        "Resolution Notes",
        "Target Platform",
        "Client Business"
      ];

      const escapeCSV = (val) => {
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      const rows = exportData.map((r) => {
        const d = r.createdAt ? new Date(r.createdAt) : new Date();
        const dateStr = d.toLocaleDateString();
        const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const type = r.star >= 4 ? "Public (Redirected)" : "Gated (Private Complaint)";
        const status = r.star <= 3 ? (r.status || "NEW") : "REDIRECTED";
        const staff = r.staffMember || "Unassigned";
        const client = r.clientName || r.formKey || "Default";
        const platform = r.platform || (r.star >= 4 ? "Google" : "Internal");

        return [
          escapeCSV(dateStr),
          escapeCSV(timeStr),
          escapeCSV(r.name || "Anonymous"),
          escapeCSV(r.mobile || "N/A"),
          escapeCSV(r.star),
          escapeCSV(type),
          escapeCSV(status),
          escapeCSV(staff),
          escapeCSV(r.review || ""),
          escapeCSV(r.resolutionNotes || ""),
          escapeCSV(platform),
          escapeCSV(client)
        ].join(",");
      });

      const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows].join("\r\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      const safeKey = clientFilter ? `${clientFilter}_` : "";
      const dateTag = new Date().toISOString().slice(0, 10);
      link.setAttribute("download", `Bizwoke_Reviews_Audit_${safeKey}${dateTag}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export CSV failed:", err);
      alert("Failed to export reviews. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const activeClientObj = clientsList.find((c) => c.formKey === clientFilter);

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--secondary)" }}>
            Reviews & Feedback Reports
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Inspect incoming customer ratings, external redirection records, and gated private feedback
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={handleExportCSV}
            disabled={exporting}
            className="btn btn-outline"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 18px",
              borderRadius: "10px",
              fontWeight: "600",
              fontSize: "13px",
              background: "#ffffff",
              border: "1.5px solid #cbd5e1",
              color: "#1e293b",
              boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
              cursor: exporting ? "not-allowed" : "pointer"
            }}
          >
            <Download size={16} style={{ color: "#2563eb" }} />
            {exporting ? "Generating CSV..." : "Export Audit CSV"}
          </button>
        </div>
      </div>

      {/* Executive Quick Stats Strip */}
      {stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            gap: "16px",
          }}
        >
          {/* Card 1: Total Audited Reviews */}
          <div
            className="card"
            style={{
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              borderLeft: "4px solid #3b82f6",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)" }}>
                Audited Volume
              </span>
              <BarChart3 size={18} style={{ color: "#3b82f6" }} />
            </div>
            <div style={{ fontSize: "26px", fontWeight: "800", color: "var(--secondary)" }}>
              {stats.total || 0}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              <span style={{ fontWeight: "700", color: "#10b981" }}>{stats.positiveCount || 0} 4-5★</span>
              {" · "}
              <span style={{ fontWeight: "700", color: "#ef4444" }}>{stats.criticalCount || 0} 1-3★</span>
            </div>
          </div>

          {/* Card 2: Quality Score */}
          <div
            className="card"
            style={{
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              borderLeft: "4px solid #f59e0b",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)" }}>
                Average Rating
              </span>
              <Star size={18} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <span style={{ fontSize: "26px", fontWeight: "800", color: "var(--secondary)" }}>
                {stats.averageRating ? Number(stats.averageRating).toFixed(1) : "0.0"}
              </span>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-muted)" }}>/ 5.0</span>
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              {stats.total > 0 ? Math.round(((stats.positiveCount || 0) / stats.total) * 100) : 0}% Satisfaction rate
            </div>
          </div>

          {/* Card 3: Shield Interception */}
          <div
            className="card"
            style={{
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              borderLeft: "4px solid #10b981",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)" }}>
                Shield Intercepted
              </span>
              <ShieldCheck size={18} style={{ color: "#10b981" }} />
            </div>
            <div style={{ fontSize: "26px", fontWeight: "800", color: "#10b981" }}>
              {stats.criticalCount || 0}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Private complaints saved from public ranking
            </div>
          </div>

          {/* Card 4: Resolution Desk SLA */}
          <div
            className="card"
            style={{
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              borderLeft: "4px solid #6366f1",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)" }}>
                Resolution SLA
              </span>
              <CheckCircle2 size={18} style={{ color: "#6366f1" }} />
            </div>
            <div style={{ fontSize: "26px", fontWeight: "800", color: "#6366f1" }}>
              {stats.criticalCount > 0
                ? `${Math.round(((stats.resolvedComplaints || 0) / stats.criticalCount) * 100)}%`
                : "100%"}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              {stats.resolvedComplaints || 0} resolved · {stats.unresolvedComplaints || 0} pending
            </div>
          </div>
        </div>
      )}

      {/* Visual Analytics: Pie Chart & Trend Bar Graph */}
      <ReviewCharts
        stats={stats}
        timeframe={timeframe}
        onTimeframeChange={handleTimeframeChange}
        loading={statsLoading}
      />

      {/* Filters Bar */}
      <div className="card" style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "10px", flex: 1, minWidth: "260px" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-subtle)" }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: "36px" }}
                placeholder="Search by customer name, mobile, or feedback text..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-secondary">Search</button>
          </form>

          {/* Super Admin Client Filter */}
          {isSuperAdmin && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Building2 size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                <select
                  value={clientFilter}
                  onChange={(e) => handleClientFilterChange(e.target.value)}
                  className="form-input"
                  style={{
                    padding: "7px 10px",
                    fontSize: "13px",
                    fontWeight: clientFilter ? "700" : "500",
                    borderColor: clientFilter ? "var(--primary)" : "var(--border)",
                    background: clientFilter ? "#fdfbf7" : "#fff",
                    minWidth: "210px",
                  }}
                >
                  <option value="">🏢 All Clients (Global)</option>
                  {clientsList.map((c) => (
                    <option key={c.formKey} value={c.formKey}>
                      {c.businessName} (@{c.uname})
                    </option>
                  ))}
                </select>
              </div>
              {clientFilter && (
                <button
                  type="button"
                  onClick={() => handleClientFilterChange("")}
                  className="btn btn-sm btn-secondary"
                  title="Clear business filter"
                  style={{ padding: "6px 8px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                >
                  <X size={14} />
                  <span>Clear</span>
                </button>
              )}
            </div>
          )}

          {/* Resolution Status Filter */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-muted)" }}>Resolution:</span>
            <button
              type="button"
              onClick={() => handleStatusFilterChange("")}
              className={`btn btn-sm ${!statusFilter ? "btn-primary" : "btn-outline"}`}
              style={{ borderRadius: "8px", padding: "5px 10px" }}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => handleStatusFilterChange("UNRESOLVED")}
              className={`btn btn-sm ${statusFilter === "UNRESOLVED" ? "btn-danger" : "btn-outline"}`}
              style={{
                borderRadius: "8px",
                padding: "5px 10px",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                borderColor: statusFilter === "UNRESOLVED" ? "transparent" : "#fca5a5",
                color: statusFilter === "UNRESOLVED" ? "#ffffff" : "#b91c1c",
              }}
            >
              <AlertTriangle size={13} />
              <span>Unresolved ({stats?.unresolvedComplaints || 0})</span>
            </button>
            <button
              type="button"
              onClick={() => handleStatusFilterChange("RESOLVED")}
              className={`btn btn-sm ${statusFilter === "RESOLVED" ? "btn-success" : "btn-outline"}`}
              style={{
                borderRadius: "8px",
                padding: "5px 10px",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                borderColor: statusFilter === "RESOLVED" ? "transparent" : "#86efac",
                color: statusFilter === "RESOLVED" ? "#ffffff" : "#15803d",
              }}
            >
              <Check size={13} />
              <span>Resolved ({stats?.resolvedComplaints || 0})</span>
            </button>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-muted)" }}>Filter Stars:</span>
            {["", "5", "4", "3", "2", "1"].map((s) => (
              <button
                key={s}
                onClick={() => setStarFilter(s)}
                className={`btn btn-sm ${starFilter === s ? "btn-primary" : "btn-outline"}`}
              >
                {s ? `${s} ★` : "All"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Client Filter Banner */}
      {isSuperAdmin && clientFilter && (
        <div
          style={{
            padding: "12px 18px",
            background: "#fdfbf7",
            borderRadius: "12px",
            border: "1.5px solid #ded3c3",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                background: "#0f172a",
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "12px",
              }}
            >
              🏢
            </span>
            <div>
              <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Currently filtering reviews for: </span>
              <strong style={{ fontSize: "14px", color: "var(--secondary)" }}>
                {activeClientObj ? activeClientObj.businessName : clientFilter}
              </strong>
              {activeClientObj && (
                <span style={{ fontSize: "12px", color: "var(--text-muted)", marginLeft: "6px" }}>
                  (@{activeClientObj.uname} • Form Key: <code>{clientFilter}</code>)
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleClientFilterChange("")}
            className="btn btn-sm btn-outline"
            style={{ fontSize: "12px" }}
          >
            Show All Clients (Clear Filter)
          </button>
        </div>
      )}

      {/* Reviews Table Card */}
      <div className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ overflowX: "auto", position: "relative" }}>
          {loading && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(255, 255, 255, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 5,
                backdropFilter: "blur(1px)",
              }}
            >
              <div
                style={{
                  padding: "8px 16px",
                  background: "#fff",
                  borderRadius: "8px",
                  boxShadow: "var(--shadow-md)",
                  fontWeight: "600",
                  fontSize: "13px",
                  color: "var(--primary)",
                }}
              >
                Loading reviews...
              </div>
            </div>
          )}
          <table style={{ width: "100%", minWidth: "720px", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border)", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                <th style={{ padding: "14px 20px" }}>Customer</th>
                {isSuperAdmin && <th style={{ padding: "14px 20px" }}>Target Client / Business</th>}
                <th style={{ padding: "14px 20px" }}>Rating</th>
                <th style={{ padding: "14px 20px" }}>Status / Gating</th>
                <th style={{ padding: "14px 20px" }}>Feedback Text</th>
                <th style={{ padding: "14px 20px" }}>Platform</th>
                <th style={{ padding: "14px 20px" }}>Date</th>
                <th style={{ padding: "14px 20px", textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => {
                const isPositive = r.star >= 4;
                return (
                  <tr key={r._id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ fontWeight: "700" }}>{r.name}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{r.mobile}</div>
                      {r.staffMember && (
                        <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px", fontWeight: "600" }}>
                          👤 Staff: {r.staffMember}
                        </div>
                      )}
                    </td>
                    {isSuperAdmin && (
                      <td style={{ padding: "16px 20px" }}>
                        {r.clientInfo ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {r.clientInfo.cmpyLogo ? (
                              <img
                                src={r.clientInfo.cmpyLogo}
                                alt=""
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "8px",
                                  objectFit: "contain",
                                  background: "#ffffff",
                                  border: "1px solid var(--border)",
                                  padding: "2px",
                                  flexShrink: 0,
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "8px",
                                  background: "#f4ede4",
                                  color: "#6b4722",
                                  border: "1px solid #ded3c3",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: "800",
                                  fontSize: "12px",
                                  flexShrink: 0,
                                }}
                              >
                                {(r.clientInfo.businessName?.[0] || "B").toUpperCase()}
                              </div>
                            )}
                            <div>
                              <button
                                type="button"
                                onClick={() => handleClientFilterChange(r.formKey)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  padding: 0,
                                  cursor: "pointer",
                                  textAlign: "left",
                                  fontWeight: "700",
                                  fontSize: "13px",
                                  color: "var(--primary)",
                                  textDecoration: "underline",
                                  textUnderlineOffset: "2px",
                                }}
                                title="Click to filter by this business"
                              >
                                {r.clientInfo.businessName}
                              </button>
                              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                                @{r.clientInfo.uname}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span style={{ fontSize: "12px", color: "var(--text-subtle)", fontStyle: "italic" }}>
                            {r.formKey || "Unassigned"}
                          </span>
                        )}
                      </td>
                    )}
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", fontWeight: "700", color: "#d97706" }}>
                        <Star size={16} fill="#f59e0b" color="#f59e0b" />
                        <span>{r.star}.0</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      {isPositive ? (
                        <span className="badge badge-success" title="Customer opened the public Google review link">
                          <ThumbsUp size={12} />
                          <span>Public Review Opened</span>
                        </span>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <span className="badge badge-danger" title="Customer requested direct in-house management resolution">
                            <ShieldCheck size={12} />
                            <span>Private Resolution</span>
                          </span>
                          <select
                            value={r.status || "NEW"}
                            onChange={(e) => handleDirectStatusChange(r._id, e.target.value)}
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              padding: "3px 6px",
                              borderRadius: "6px",
                              border: "1.5px solid",
                              borderColor: r.status === "RESOLVED" ? "#86efac" : r.status === "ESCALATED" ? "#f87171" : r.status === "IN_PROGRESS" ? "#fde047" : "#fca5a5",
                              background: r.status === "RESOLVED" ? "#f0fdf4" : r.status === "ESCALATED" ? "#fef2f2" : r.status === "IN_PROGRESS" ? "#fefce8" : "#fff1f2",
                              color: r.status === "RESOLVED" ? "#15803d" : r.status === "ESCALATED" ? "#991b1b" : r.status === "IN_PROGRESS" ? "#a16207" : "#be123c",
                              cursor: "pointer",
                              outline: "none",
                            }}
                            title="Update complaint status"
                          >
                            <option value="NEW">🔴 New Complaint</option>
                            <option value="IN_PROGRESS">🟡 In Progress</option>
                            <option value="RESOLVED">🟢 Resolved</option>
                            <option value="ESCALATED">🚨 Escalated to HQ</option>
                          </select>

                          {/* Priority and Assignee Indicators */}
                          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", fontSize: "10px", marginTop: "2px" }}>
                            <span style={{
                              padding: "1px 5px",
                              borderRadius: "4px",
                              fontWeight: "700",
                              background: r.priority === "URGENT" ? "#fee2e2" : r.priority === "HIGH" ? "#ffedd5" : "#f1f5f9",
                              color: r.priority === "URGENT" ? "#b91c1c" : r.priority === "HIGH" ? "#c2410c" : "#475569",
                              border: "1px solid rgba(0,0,0,0.06)"
                            }}>
                              {r.priority === "URGENT" ? "🔴 Urgent" : r.priority === "HIGH" ? "🟠 High" : r.priority === "LOW" ? "🟢 Low" : "🟡 Medium"}
                            </span>

                            {r.escalationLevel === "HEAD_OFFICE" && (
                              <span style={{ padding: "1px 5px", borderRadius: "4px", fontWeight: "700", background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" }}>
                                🏛️ HQ
                              </span>
                            )}
                          </div>

                          {r.assignedTo && (
                            <div style={{ fontSize: "10.5px", color: "#64748b" }}>
                              👤 {r.assignedTo}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "16px 20px", maxWidth: "340px" }}>
                      {r.title && <div style={{ fontWeight: "600", fontSize: "13px" }}>{r.title}</div>}
                      <div style={{ fontSize: "13px", color: r.review ? "var(--text-main)" : "var(--text-subtle)", fontStyle: r.review ? "normal" : "italic" }}>
                        {r.review ? `"${r.review}"` : "No written review text provided"}
                      </div>

                      {/* Display resolution notes if present */}
                      {r.resolutionNotes && (
                        <div style={{
                          marginTop: "6px",
                          padding: "6px 10px",
                          background: "#f0fdf4",
                          border: "1px solid #bbf7d0",
                          borderRadius: "6px",
                          fontSize: "11px",
                          color: "#166534",
                          lineHeight: "1.4"
                        }}>
                          <div style={{ fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                            <CheckCircle2 size={12} color="#16a34a" /> Resolution Note:
                          </div>
                          <div>{r.resolutionNotes}</div>
                          {r.resolvedBy && <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px" }}>By {r.resolvedBy}</div>}
                        </div>
                      )}

                      {!isPositive && !r.resolutionNotes && (
                        <button
                          type="button"
                          onClick={() => handleOpenResolutionModal(r)}
                          style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            marginTop: "4px",
                            fontSize: "11px",
                            fontWeight: "600",
                            color: "var(--primary)",
                            cursor: "pointer",
                            textDecoration: "underline",
                            textUnderlineOffset: "2px"
                          }}
                        >
                          + Add resolution note
                        </button>
                      )}
                    </td>
                    <td style={{ padding: "16px 20px", color: "var(--text-muted)", fontSize: "13px" }}>
                      {r.webName || "Direct Link"}
                    </td>
                    <td style={{ padding: "16px 20px", color: "var(--text-muted)", fontSize: "13px" }}>
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "center", whiteSpace: "nowrap" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        {!isPositive && (
                          <button
                            type="button"
                            onClick={() => handleOpenResolutionModal(r)}
                            style={{
                              background: r.status === "RESOLVED" ? "#f0fdf4" : "#fff7ed",
                              color: r.status === "RESOLVED" ? "#166534" : "#c2410c",
                              border: `1px solid ${r.status === "RESOLVED" ? "#bbf7d0" : "#ffedd5"}`,
                              borderRadius: "8px",
                              padding: "6px 10px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "12px",
                              fontWeight: "700",
                              cursor: "pointer",
                            }}
                            title="Log resolution details"
                          >
                            <FileText size={13} />
                            <span>Notes</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setWhatsAppModalReview(r)}
                          style={{
                            background: "#ecfdf5",
                            color: "#047857",
                            border: "1px solid #a7f3d0",
                            borderRadius: "8px",
                            padding: "6px 12px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            fontSize: "12px",
                            fontWeight: "700",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            boxShadow: "0 1px 2px rgba(4, 120, 87, 0.05)",
                          }}
                          title="Send personalized WhatsApp reply with offer & review link"
                        >
                          <MessageCircle size={14} color="#059669" />
                          <span>Reply</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {reviews.length === 0 && !loading && (
            <div style={{ textAlign: "center", padding: "50px 20px", color: "var(--text-muted)" }}>
              No reviews matching this criteria.
            </div>
          )}
        </div>

        {/* Pagination Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderTop: "1px solid var(--border)",
            background: "#f8fafc",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          {/* Record info & limit */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "13px", color: "var(--text-muted)", flexWrap: "wrap" }}>
            <span>
              Showing{" "}
              <strong style={{ color: "var(--secondary)" }}>
                {total > 0 ? (page - 1) * limit + 1 : 0}
              </strong>{" "}
              to{" "}
              <strong style={{ color: "var(--secondary)" }}>
                {Math.min(page * limit, total)}
              </strong>{" "}
              of <strong style={{ color: "var(--secondary)" }}>{total}</strong> reviews
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span>Rows per page:</span>
              <select
                value={limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  background: "#fff",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--secondary)",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              type="button"
              onClick={() => handlePageChange(1)}
              disabled={page <= 1 || loading}
              className="btn btn-sm btn-secondary"
              title="First Page"
              style={{
                padding: "6px 8px",
                opacity: page <= 1 || loading ? 0.4 : 1,
                cursor: page <= 1 || loading ? "not-allowed" : "pointer",
              }}
            >
              <ChevronsLeft size={16} />
            </button>

            <button
              type="button"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1 || loading}
              className="btn btn-sm btn-secondary"
              style={{
                padding: "6px 12px",
                gap: "4px",
                opacity: page <= 1 || loading ? 0.4 : 1,
                cursor: page <= 1 || loading ? "not-allowed" : "pointer",
              }}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            {/* Page number buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {getPageNumbers().map((p, idx) => {
                if (p === "...") {
                  return (
                    <span
                      key={`dots-${idx}`}
                      style={{ padding: "0 6px", color: "var(--text-subtle)", fontSize: "14px", fontWeight: "600" }}
                    >
                      ...
                    </span>
                  );
                }
                const isActive = p === page;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePageChange(p)}
                    disabled={loading}
                    className={`btn btn-sm ${isActive ? "btn-primary" : "btn-secondary"}`}
                    style={{
                      minWidth: "32px",
                      height: "32px",
                      padding: "0 6px",
                      fontSize: "13px",
                      fontWeight: isActive ? "700" : "600",
                    }}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages || loading}
              className="btn btn-sm btn-secondary"
              style={{
                padding: "6px 12px",
                gap: "4px",
                opacity: page >= totalPages || loading ? 0.4 : 1,
                cursor: page >= totalPages || loading ? "not-allowed" : "pointer",
              }}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => handlePageChange(totalPages)}
              disabled={page >= totalPages || loading}
              className="btn btn-sm btn-secondary"
              title="Last Page"
              style={{
                padding: "6px 8px",
                opacity: page >= totalPages || loading ? 0.4 : 1,
                cursor: page >= totalPages || loading ? "not-allowed" : "pointer",
              }}
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp Personalized Reply Modal */}
      <WhatsAppReplyModal
        review={whatsAppModalReview}
        businessName={activeClientObj?.businessName || user?.cmpy || companyDetails?.cmpyName || "Our Business"}
        reviewLink={
          clientFilter || user?.formKey
            ? `${window.location.origin}/wtr/${clientFilter || user?.formKey}`
            : ""
        }
        isOpen={Boolean(whatsAppModalReview)}
        onClose={() => setWhatsAppModalReview(null)}
      />

      {/* Internal Complaint Resolution Modal */}
      {resolutionModalReview &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(15, 23, 42, 0.72)",
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 99999999,
              padding: "16px",
              boxSizing: "border-box",
              overflowY: "auto",
            }}
            onClick={(e) => e.target === e.currentTarget && setResolutionModalReview(null)}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: "18px",
                width: "100%",
                maxWidth: "540px",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
                overflow: "hidden",
                margin: "auto",
              }}
            >
            {/* Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #e2e8f0",
                background: "#f8fafc",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "#ea580c",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FileText size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                    Complaint Resolution Desk
                  </h3>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>
                    Track customer recovery &amp; staff resolution notes
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setResolutionModalReview(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveResolution} style={{ display: "flex", flexDirection: "column", overflowY: "auto", flex: "1 1 auto", minHeight: 0 }}>
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
                {/* Customer Snapshot */}
                <div
                  style={{
                    background: "#fff1f2",
                    border: "1px solid #fecdd3",
                    borderRadius: "12px",
                    padding: "12px 14px",
                    fontSize: "12px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <div style={{ fontWeight: "700", color: "#9f1239" }}>
                      {resolutionModalReview.name}
                      <span style={{ fontWeight: "500", color: "#64748b", marginLeft: "6px" }}>
                        ({resolutionModalReview.mobile || "No Mobile"})
                      </span>
                    </div>
                    <div
                      style={{
                        background: "#e11d48",
                        color: "#fff",
                        padding: "2px 8px",
                        borderRadius: "9999px",
                        fontSize: "11px",
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Star size={11} fill="#fff" />
                      <span>{resolutionModalReview.star}.0★ Gated</span>
                    </div>
                  </div>
                  {resolutionModalReview.review && (
                    <p style={{ margin: "4px 0 0", color: "#881337", fontStyle: "italic", lineHeight: "1.4" }}>
                      "{resolutionModalReview.review}"
                    </p>
                  )}
                </div>

                {/* Quick Contact Buttons */}
                {resolutionModalReview.mobile && resolutionModalReview.mobile !== "N/A" && (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <a
                      href={`tel:${resolutionModalReview.mobile.replace(/[^0-9]/g, "")}`}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        color: "#166534",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "700",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <PhoneCall size={14} />
                      <span>Call Customer</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setWhatsAppModalReview(resolutionModalReview);
                      }}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        background: "#ecfdf5",
                        border: "1px solid #a7f3d0",
                        color: "#047857",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <MessageCircle size={14} />
                      <span>Send WhatsApp</span>
                    </button>
                  </div>
                )}

                {/* Status Selection */}
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "6px" }}>
                    Resolution Status:
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                    {[
                      { id: "NEW", label: "🔴 New Alert", desc: "Awaiting review" },
                      { id: "IN_PROGRESS", label: "🟡 Contacted", desc: "Speaking with user" },
                      { id: "RESOLVED", label: "🟢 Resolved", desc: "Customer satisfied" },
                      { id: "ESCALATED", label: "🚨 Escalated", desc: "HQ Attention" },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setStatusInput(st.id)}
                        style={{
                          padding: "8px 6px",
                          borderRadius: "10px",
                          border: statusInput === st.id ? "2px solid #2563eb" : "1px solid #e2e8f0",
                          background: statusInput === st.id ? "#eff6ff" : "#f8fafc",
                          textAlign: "center",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <div style={{ fontSize: "11px", fontWeight: "700", color: statusInput === st.id ? "#1d4ed8" : "#334155" }}>
                          {st.label}
                        </div>
                        <div style={{ fontSize: "9px", color: "#64748b", marginTop: "2px" }}>
                          {st.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Enterprise SLA: Priority & Escalation Level */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "5px" }}>
                      Complaint Priority:
                    </label>
                    <select
                      value={priorityInput}
                      onChange={(e) => setPriorityInput(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "7px 10px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "12px",
                        fontWeight: "600",
                        background: "#ffffff",
                      }}
                    >
                      <option value="LOW">🟢 Low (Routine Feedback)</option>
                      <option value="MEDIUM">🟡 Medium (Follow-up Recommended)</option>
                      <option value="HIGH">🟠 High (Urgent Action Required)</option>
                      <option value="URGENT">🔴 Urgent SLA (Critical Escalation)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "5px" }}>
                      Escalation Tier:
                    </label>
                    <select
                      value={escalationInput}
                      onChange={(e) => setEscalationInput(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "7px 10px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "12px",
                        fontWeight: "600",
                        background: "#ffffff",
                      }}
                    >
                      <option value="OUTLET">🏪 Outlet Level (Branch Staff)</option>
                      <option value="REGIONAL">🗺️ Regional Manager</option>
                      <option value="HEAD_OFFICE">🏛️ Head Office Executive</option>
                    </select>
                  </div>
                </div>

                {/* Assignee & Target SLA Due Date */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "5px" }}>
                      Assigned Manager / Staff:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe (Store Manager)"
                      value={assignedToInput}
                      onChange={(e) => setAssignedToInput(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "7px 10px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "12px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "5px" }}>
                      Target SLA Due Date:
                    </label>
                    <input
                      type="date"
                      value={dueDateInput}
                      onChange={(e) => setDueDateInput(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "7px 10px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "12px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                {/* Resolution Notes Textarea */}
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "6px" }}>
                    Manager / Staff Resolution Notes:
                  </label>
                  <textarea
                    rows={4}
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder="e.g. Called customer at 3 PM, apologized for wait time, offered 15% discount code for next visit. Customer happy and promised to revisit."
                    style={{
                      width: "100%",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      padding: "10px 12px",
                      fontSize: "12px",
                      lineHeight: "1.5",
                      fontFamily: "inherit",
                      background: "#fafafa",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                  <span style={{ fontSize: "11px", color: "#64748b" }}>
                    Internal notes visible only to your team and Bizwoke admins.
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: "14px 20px",
                  borderTop: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <button
                  type="button"
                  onClick={() => setResolutionModalReview(null)}
                  className="btn btn-outline btn-sm"
                  style={{ borderRadius: "8px", padding: "8px 16px" }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingResolution}
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: "8px", padding: "8px 18px", fontWeight: "700" }}
                >
                  {savingResolution ? "Saving..." : "Save Resolution Status"}
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

