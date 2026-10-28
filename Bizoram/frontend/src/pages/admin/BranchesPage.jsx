import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Building2, MapPin, Plus, Edit2, Trash2, CheckCircle, XCircle, ArrowRight, Sparkles, X, ShieldAlert, Zap } from "lucide-react";

export const BranchesPage = () => {
  const { user, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [pricingPackage, setPricingPackage] = useState(null);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [cmpyName, setCmpyName] = useState("");
  const [active, setActive] = useState(1);
  const [error, setError] = useState(null);

  const loadBranches = async () => {
    setLoading(true);
    try {
      const res = await api.getBranches();
      if (res.success) setBranches(res.branches);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
    if (user?.pricingPackageId) {
      api.getActivePricing()
        .then((res) => {
          if (res.success && res.packages) {
            const currentPkgId = user.pricingPackageId?._id || user.pricingPackageId;
            const found = res.packages.find((p) => String(p._id) === String(currentPkgId));
            if (found) setPricingPackage(found);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const isMultiBusiness = Boolean(
    isSuperAdmin ||
    pricingPackage?.businessType === "multiple" ||
    user?.pricingPackageId?.businessType === "multiple" ||
    (pricingPackage?.maxBusinesses && pricingPackage.maxBusinesses > 1) ||
    (user?.pricingPackageId?.maxBusinesses && user.pricingPackageId.maxBusinesses > 1)
  );

  const maxAllowed = isSuperAdmin ? 999 : (pricingPackage?.maxBusinesses || 1);
  const isLimitReached = !isSuperAdmin && branches.length >= maxAllowed;

  const handleAddNewClick = () => {
    if (!isMultiBusiness && branches.length >= 1) {
      setShowUpgradeModal(true);
      return;
    }
    setError(null);
    setEditingId(null);
    setName("");
    setCode("");
    setCmpyName(user?.cmpy || "");
    setActive(1);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await api.updateBranch(editingId, { name, code, cmpyName, active });
      } else {
        await api.createBranch({ name, code, cmpyName, active });
      }
      setShowModal(false);
      setEditingId(null);
      setName("");
      setCode("");
      setCmpyName("");
      loadBranches();
    } catch (err) {
      setError(err.message || "Failed to save branch");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to deactivate/delete this branch?")) return;
    try {
      await api.deleteBranch(id);
      loadBranches();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--secondary)", display: "flex", alignItems: "center", gap: "10px" }}>
            {isMultiBusiness ? <Building2 size={24} color="#004ac6" /> : <MapPin size={24} color="#004ac6" />}
            <span>{isMultiBusiness ? "Branch Management" : "Business Location"}</span>
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
            {isMultiBusiness
              ? "Create and manage multiple branches with strict tenant isolation and individual review parameters"
              : "Manage your primary business location, Google review mapping and details"}
          </p>
        </div>

        <button
          onClick={handleAddNewClick}
          className="btn btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <Plus size={16} />
          <span>{isMultiBusiness ? "New Branch" : "Add Branch"}</span>
        </button>
      </div>

      {/* Plan Branch Usage Indicator */}
      {pricingPackage && (
        <div style={{
          background: isLimitReached ? "#fffbeb" : "#f0fdf4",
          border: `1.5px solid ${isLimitReached ? "#fde68a" : "#bbf7d0"}`,
          borderRadius: "14px",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Building2 size={22} color={isLimitReached ? "#d97706" : "#16a34a"} />
            <div>
              <div style={{ fontSize: "14px", fontWeight: "800", color: "#1e293b" }}>
                Active Plan: <span style={{ color: "var(--primary)" }}>{pricingPackage.packageName}</span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", marginLeft: "8px" }}>
                  ({pricingPackage.businessType === "multiple" ? "Multiple Business" : "Single Business"})
                </span>
              </div>
              <div style={{ fontSize: "13px", color: isLimitReached ? "#b45309" : "#15803d", fontWeight: "600" }}>
                {isLimitReached
                  ? `Branch quota reached (${branches.length} of ${maxAllowed} locations used). Upgrade to add more locations.`
                  : `Branch allocation: ${branches.length} of ${maxAllowed} location(s) used`}
              </div>
            </div>
          </div>

          {isLimitReached && (
            <Link
              to="/pricing"
              className="btn btn-primary btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Sparkles size={14} />
              <span>Upgrade Plan</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: "550px", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border)", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
              <th style={{ padding: "14px 20px" }}>Branch Name</th>
              <th style={{ padding: "14px 20px" }}>Branch Code</th>
              <th style={{ padding: "14px 20px" }}>Company Branding</th>
              <th style={{ padding: "14px 20px" }}>Status</th>
              <th style={{ padding: "14px 20px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((b) => (
              <tr key={b._id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "16px 20px", fontWeight: "700" }}>{b.name}</td>
                <td style={{ padding: "16px 20px" }}>
                  <code style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>{b.code}</code>
                </td>
                <td style={{ padding: "16px 20px", color: "var(--text-muted)" }}>{b.cmpyName || "Default"}</td>
                <td style={{ padding: "16px 20px" }}>
                  <span className={`badge ${b.active === 1 ? "badge-success" : "badge-secondary"}`}>
                    {b.active === 1 ? "Active" : "Inactive"}
                  </span>
                </td>
                <td style={{ padding: "16px 20px", textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: "6px" }}>
                    <button
                      onClick={() => {
                        setError(null);
                        setEditingId(b._id);
                        setName(b.name);
                        setCode(b.code);
                        setCmpyName(b.cmpyName || "");
                        setActive(b.active);
                        setShowModal(true);
                      }}
                      className="btn btn-outline btn-sm"
                      title="Edit Branch"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="btn btn-danger btn-sm"
                      title="Delete Branch"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {branches.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
            No branches found. Create your first branch above.
          </div>
        )}
      </div>

      {showModal &&
        createPortal(
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
              if (e.target === e.currentTarget) setShowModal(false);
            }}
          >
            <div
              className="card"
              style={{
                maxWidth: "460px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                padding: "0",
                borderRadius: "16px",
                background: "#ffffff",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  padding: "20px 24px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#f8fafc",
                  borderRadius: "16px 16px 0 0",
                }}
              >
                <div>
                  <h2 style={{ fontSize: "17px", fontWeight: "800", color: "var(--secondary)", margin: 0 }}>
                    {editingId ? "Edit Branch" : "Create New Branch"}
                  </h2>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "3px 0 0" }}>
                    Configure physical branch location & review scope
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline btn-sm"
                  style={{
                    padding: "6px",
                    borderRadius: "8px",
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title="Close modal"
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ padding: "24px" }}>
                {error && (
                  <div
                    style={{
                      background: "var(--danger-light)",
                      color: "var(--danger)",
                      padding: "12px",
                      borderRadius: "var(--radius-md)",
                      fontSize: "13px",
                      marginBottom: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <span>{error}</span>
                    {error.includes("upgrade") && (
                      <Link
                        to="/pricing"
                        style={{ color: "var(--primary)", fontWeight: "800", textDecoration: "underline", fontSize: "12px" }}
                      >
                        View Pricing Plans →
                      </Link>
                    )}
                  </div>
                )}

                <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>Branch Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Connaught Place Flagship"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      style={{ padding: "8px 12px", fontSize: "13px" }}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>Branch Code (Unique) *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. DEL-CP-01"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                      style={{ padding: "8px 12px", fontSize: "13px" }}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>Brand / Display Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Bistro Central"
                      value={cmpyName}
                      onChange={(e) => setCmpyName(e.target.value)}
                      style={{ padding: "8px 12px", fontSize: "13px" }}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>Status</label>
                    <select
                      className="form-select"
                      value={active}
                      onChange={(e) => setActive(Number(e.target.value))}
                      style={{ padding: "8px 12px", fontSize: "13px" }}
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "10px",
                      marginTop: "10px",
                      paddingTop: "16px",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingId ? "Save Changes" : "Create Branch"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Upgrade to Multiple Business Plan Modal */}
      {showUpgradeModal &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(15, 23, 42, 0.7)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 99999,
              padding: "16px",
            }}
          >
            <div
              className="card animate-fade-in"
              style={{
                width: "100%",
                maxWidth: "520px",
                padding: "28px 24px",
                position: "relative",
                background: "#ffffff",
                borderRadius: "22px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                border: "1.5px solid #e2e8f0",
              }}
            >
              <button
                onClick={() => setShowUpgradeModal(false)}
                style={{
                  position: "absolute",
                  top: "18px",
                  right: "18px",
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

              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)",
                    border: "1.5px solid #bfdbfe",
                    color: "#2563eb",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "14px",
                  }}
                >
                  <Building2 size={28} />
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: "900", color: "#0f172a", margin: "0 0 6px" }}>
                  Upgrade to Multiple Business Plan
                </h3>
                <p style={{ fontSize: "13.5px", color: "#64748b", margin: 0, lineHeight: "1.5" }}>
                  Your account is currently on a <strong>Single Business</strong> plan. To add branches and unlock multi-location reviews, you must first upgrade to our Multiple Business architecture.
                </p>
              </div>

              {/* Benefits Box */}
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "14px",
                  padding: "16px",
                  marginBottom: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  fontSize: "13px",
                  color: "#334155",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Sparkles size={16} color="#2563eb" />
                  <span><strong>Base Multi-Business Plan:</strong> ₹2,999/mo (unlocks multi-branch portal)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Zap size={16} color="#d97706" />
                  <span><strong>Add-on Branches:</strong> Only ₹599/mo per branch (+500 reviews each)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckCircle size={16} color="#16a34a" />
                  <span>Independent Google Review links &amp; staff isolation per branch</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: "11px" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUpgradeModal(false);
                    navigate("/pricing?tab=multiple");
                  }}
                  className="btn btn-primary"
                  style={{
                    flex: 1.5,
                    padding: "11px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <span>Upgrade Plan</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
