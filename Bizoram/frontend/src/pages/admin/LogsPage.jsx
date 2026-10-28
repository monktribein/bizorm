import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { History, ShieldCheck, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const loadLogs = async (targetPage = page, targetLimit = limit) => {
    setLoading(true);
    try {
      const res = await api.getActivityLogs({ page: targetPage, limit: targetLimit });
      if (res.success) {
        setLogs(res.logs || []);
        setTotal(res.total || 0);
        setPage(res.page || targetPage);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs(page, limit);
  }, [page, limit]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
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

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--secondary)" }}>
          Audit & Security Logs
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
          Chronological record of user logins, role modifications, platform changes, and customer feedback submissions
        </p>
      </div>

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
                Loading audit logs...
              </div>
            </div>
          )}

          <table style={{ width: "100%", minWidth: "600px", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border)", color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>
                <th style={{ padding: "12px 20px" }}>Action Type</th>
                <th style={{ padding: "12px 20px" }}>Message</th>
                <th style={{ padding: "12px 20px" }}>User</th>
                <th style={{ padding: "12px 20px" }}>Branch</th>
                <th style={{ padding: "12px 20px" }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}>
                  <td style={{ padding: "14px 20px" }}>
                    <span className="badge badge-secondary" style={{ fontFamily: "monospace" }}>
                      {log.actionType}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", fontWeight: "500" }}>{log.msg}</td>
                  <td style={{ padding: "14px 20px", color: "var(--text-muted)" }}>
                    {log.userId?.uname ? `@${log.userId.uname}` : "System / Customer"}
                  </td>
                  <td style={{ padding: "14px 20px", color: "var(--text-muted)" }}>
                    {log.branchId?.name || "Global"}
                  </td>
                  <td style={{ padding: "14px 20px", color: "var(--text-subtle)", whiteSpace: "nowrap" }}>
                    {log.actTime || new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {logs.length === 0 && !loading && (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              No activity logs found.
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
              of <strong style={{ color: "var(--secondary)" }}>{total}</strong> logs
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
    </div>
  );
};

