import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Users, Plus, Trash2, Edit2, Shield, AlertCircle, UserPlus, Eye, Building2, Star, CreditCard, X, Clock } from "lucide-react";
import { ClientDetailsModal } from "../../components/admin/ClientDetailsModal";

export const UsersPage = () => {
  const { isSuperAdmin, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [uname, setUname] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [pwd, setPwd] = useState("");
  const [role, setRole] = useState("BRANCH_USER");
  const [branchId, setBranchId] = useState("");
  const [dutyTiming, setDutyTiming] = useState("09:00 AM - 06:00 PM");
  const [error, setError] = useState(null);

  const openAddModal = () => {
    if (branches.length > 0 && !branchId) {
      setBranchId(branches[0]._id);
    }
    setShowModal(true);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [uRes, bRes] = await Promise.all([api.getUsers(), api.getBranches()]);
      if (uRes.success) setUsers(uRes.users);
      if (bRes.success) {
        setBranches(bRes.branches);
        if (bRes.branches?.length > 0 && !branchId) {
          setBranchId(bRes.branches[0]._id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.createUser({
        fname,
        lname,
        uname,
        email,
        mobile,
        pwd,
        role,
        branchId: branchId || undefined,
        dutyTiming: dutyTiming.trim() || "09:00 AM - 06:00 PM",
      });
      setShowModal(false);
      setFname("");
      setLname("");
      setUname("");
      setEmail("");
      setMobile("");
      setPwd("");
      setDutyTiming("09:00 AM - 06:00 PM");
      loadData();
    } catch (err) {
      setError(err.message || "Failed to create user");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.deleteUser(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--secondary)" }}>
            {isSuperAdmin ? "Global User & Client Management" : "Staff & Team Management"}
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            {isSuperAdmin
              ? "Inspect client business profiles, review quotas, subscription tiers, and configure RBAC privileges"
              : "Manage receptionists and team members who collect reviews for your business"}
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={16} />
          <span>{isSuperAdmin ? "Add User" : "Add Staff Member"}</span>
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: "620px", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border)", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
              <th style={{ padding: "14px 20px" }}>{isSuperAdmin ? "Client / Business" : "Staff Member"}</th>
              <th style={{ padding: "14px 20px" }}>Email &amp; Phone</th>
              <th style={{ padding: "14px 20px" }}>{isSuperAdmin ? "Assigned Role" : "Duty Timing / Shift"}</th>
              <th style={{ padding: "14px 20px" }}>{isSuperAdmin ? "Reviews & Plan" : "Customer Ratings & Performance"}</th>
              <th style={{ padding: "14px 20px" }}>Status</th>
              <th style={{ padding: "14px 20px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "48px 20px", color: "var(--text-muted)" }}>
                  <Users size={36} style={{ margin: "0 auto 12px", opacity: 0.35, display: "block" }} />
                  <div style={{ fontWeight: "700", fontSize: "15px", color: "var(--secondary)", marginBottom: "4px" }}>
                    {loading ? "Loading staff & team members..." : "No Staff Members Found"}
                  </div>
                  <div style={{ fontSize: "13px" }}>
                    {loading
                      ? "Please wait while team data is retrieved"
                      : "Click \"+ Add Staff Member\" to add team members or receptionists for your business."}
                  </div>
                </td>
              </tr>
            ) : (
              users.map((u) => {
              const cd = u.companyDetails;
              const logo = cd?.cmpyLogo || u.cmpyLogo;
              const initial = (u.businessName?.[0] || u.fname?.[0] || "B").toUpperCase();
              const isClient = u.role === "BRANCH_ADMIN";

              return (
                <tr
                  key={u._id}
                  style={{
                    borderBottom: "1px solid var(--border)",
                    cursor: isSuperAdmin ? "pointer" : "default",
                    transition: "background 0.15s ease",
                  }}
                  onClick={() => {
                    if (isSuperAdmin) setSelectedClient(u);
                  }}
                  onMouseEnter={(e) => {
                    if (isSuperAdmin) e.currentTarget.style.background = "#fbf9f6";
                  }}
                  onMouseLeave={(e) => {
                    if (isSuperAdmin) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <td style={{ padding: "16px 20px" }}>
                    {isSuperAdmin ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                          style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "10px",
                            background: isClient ? "#fdfbf7" : "#0f172a",
                            color: isClient ? "#6b4722" : "#ffffff",
                            border: isClient ? "1.5px solid #ded3c3" : "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "800",
                            fontSize: "14px",
                            flexShrink: 0,
                            overflow: "hidden",
                          }}
                        >
                          {logo ? (
                            <img src={logo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                          ) : (
                            initial
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: "800", color: "var(--secondary)", fontSize: "14px" }}>
                            {u.businessName || `${u.fname}'s Business`}
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                            {u.fname} {u.lname} (@{u.uname})
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontWeight: "700", color: "var(--secondary)" }}>{u.fname} {u.lname}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>@{u.uname} • {u.role === "BRANCH_ADMIN" ? "Admin" : "Staff"}</div>
                      </div>
                    )}
                  </td>

                  <td style={{ padding: "16px 20px" }}>
                    <div>{u.email}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{u.mobile}</div>
                  </td>

                  <td style={{ padding: "16px 20px" }}>
                    {isSuperAdmin ? (
                      <span className={`badge ${u.role === "SUPER_ADMIN" ? "badge-primary" : u.role === "BRANCH_ADMIN" ? "badge-warning" : "badge-secondary"}`}>
                        {u.role === "BRANCH_ADMIN" ? "CLIENT (ADMIN)" : u.role}
                      </span>
                    ) : (
                      <div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#f8fafc", border: "1px solid var(--border)", padding: "4px 9px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", color: "#334155" }}>
                          <Clock size={13} color="var(--primary)" />
                          <span>{u.dutyTiming || "09:00 AM - 06:00 PM"}</span>
                        </div>
                        {u.branchId?.name && (
                          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                            📍 {u.branchId.name}
                          </div>
                        )}
                      </div>
                    )}
                  </td>

                  <td style={{ padding: "16px 20px" }}>
                    {isSuperAdmin ? (
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", color: "var(--primary)", fontSize: "13px" }}>
                          <span>⚡ {u.stats?.totalReviews || 0} reviews</span>
                          {u.stats?.totalReviews > 0 && (
                            <span style={{ color: "#d97706", display: "inline-flex", alignItems: "center", gap: "2px" }}>
                              • <Star size={12} fill="#f59e0b" color="#f59e0b" /> {u.stats?.avgRating || "0.0"}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                          Plan: <strong>{u.pricingPackageId?.packageName || "Free Trial"}</strong>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "800", color: "var(--secondary)", fontSize: "13px" }}>
                          <span>⚡ {u.stats?.totalReviews || 0} reviews</span>
                          <span style={{ color: "#d97706", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                            • <Star size={12} fill="#f59e0b" color="#f59e0b" /> {u.stats?.avgRating || "0.0"}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "5px", fontSize: "11px", flexWrap: "wrap" }}>
                          <span style={{ background: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0", padding: "1px 5px", borderRadius: "5px", fontWeight: "700" }}>
                            5★: {u.stats?.starCounts?.[5] || 0}
                          </span>
                          <span style={{ background: "#eff6ff", color: "#1e40af", border: "1px solid #bfdbfe", padding: "1px 5px", borderRadius: "5px", fontWeight: "600" }}>
                            4★: {u.stats?.starCounts?.[4] || 0}
                          </span>
                          <span style={{ background: "#fefce8", color: "#854d0e", border: "1px solid #fef08a", padding: "1px 5px", borderRadius: "5px", fontWeight: "600" }}>
                            3★: {u.stats?.starCounts?.[3] || 0}
                          </span>
                          <span style={{ background: "#fff7ed", color: "#9a3412", border: "1px solid #fed7aa", padding: "1px 5px", borderRadius: "5px", fontWeight: "600" }}>
                            2★: {u.stats?.starCounts?.[2] || 0}
                          </span>
                          <span style={{ background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca", padding: "1px 5px", borderRadius: "5px", fontWeight: "600" }}>
                            1★: {u.stats?.starCounts?.[1] || 0}
                          </span>
                        </div>
                      </div>
                    )}
                  </td>

                  <td style={{ padding: "16px 20px" }}>
                    <span className={`badge ${u.active === 1 ? "badge-success" : "badge-danger"}`}>
                      {u.active === 1 ? "Active" : "Unverified"}
                    </span>
                  </td>

                  <td style={{ padding: "16px 20px", textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                      {isSuperAdmin && (
                        <button
                          type="button"
                          onClick={() => setSelectedClient(u)}
                          className="btn btn-outline btn-sm"
                          title="Inspect Client Details &amp; Quotas"
                          style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                        >
                          <Eye size={14} />
                          <span>Inspect</span>
                        </button>
                      )}

                      {u.sadmin !== 1 && String(u._id) !== String(currentUser?.id) && (
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="btn btn-danger btn-sm"
                          title="Delete User"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
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

      {/* Client Business Details Inspection Drawer/Modal */}
      {selectedClient && (
        <ClientDetailsModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}

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
                maxWidth: "520px",
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
              {/* Header */}
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
                    {isSuperAdmin ? "Add Platform User" : "Add Staff Member"}
                  </h2>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "3px 0 0" }}>
                    {isSuperAdmin
                      ? "Create account with branch scope and RBAC privileges"
                      : "Add team member or receptionist to collect customer reviews"}
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

              {/* Form Body */}
              <div style={{ padding: "24px" }}>
                {error && (
                  <div
                    style={{
                      background: "var(--danger-light)",
                      color: "var(--danger)",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      marginBottom: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <AlertCircle size={15} />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div className="grid-2">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>First Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Rahul"
                        value={fname}
                        onChange={(e) => setFname(e.target.value)}
                        required
                        style={{ padding: "8px 12px", fontSize: "13px" }}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>Last Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Sharma"
                        value={lname}
                        onChange={(e) => setLname(e.target.value)}
                        required
                        style={{ padding: "8px 12px", fontSize: "13px" }}
                      />
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>Username *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. rahul_reception"
                        value={uname}
                        onChange={(e) => setUname(e.target.value)}
                        required
                        style={{ padding: "8px 12px", fontSize: "13px" }}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>Mobile *</label>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="e.g. 9876543210"
                        maxLength={10}
                        inputMode="numeric"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        required
                        style={{ padding: "8px 12px", fontSize: "13px" }}
                      />
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>Email *</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="e.g. rahul@business.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ padding: "8px 12px", fontSize: "13px" }}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>Password *</label>
                      <input
                        type="password"
                        className="form-input"
                        placeholder="••••••••"
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                        required
                        style={{ padding: "8px 12px", fontSize: "13px" }}
                      />
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>Role</label>
                      <select
                        className="form-select"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        style={{ padding: "8px 12px", fontSize: "13px" }}
                      >
                        <option value="BRANCH_USER">Staff / Receptionist (Collects Reviews)</option>
                        <option value="BRANCH_ADMIN">Manager / Branch Admin</option>
                        {isSuperAdmin && (
                          <option value="SUPER_ADMIN">SUPER_ADMIN (Full Global Control)</option>
                        )}
                      </select>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>Branch Scope</label>
                      <select
                        className="form-select"
                        value={branchId}
                        onChange={(e) => setBranchId(e.target.value)}
                        style={{ padding: "8px 12px", fontSize: "13px" }}
                      >
                        <option value="">None (Global)</option>
                        {branches.map((b) => (
                          <option key={b._id} value={b._id}>{b.name} ({b.code})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Duty Timing / Shift Hours */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <label className="form-label" style={{ fontSize: "12px", margin: 0, display: "inline-flex", alignItems: "center", gap: "5px" }}>
                        <Clock size={13} color="var(--primary)" />
                        <span>Duty Timing / Shift Hours *</span>
                      </label>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>e.g. 09:00 AM - 06:00 PM</span>
                    </div>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 09:00 AM - 06:00 PM"
                      value={dutyTiming}
                      onChange={(e) => setDutyTiming(e.target.value)}
                      required
                      style={{ padding: "8px 12px", fontSize: "13px" }}
                    />
                    <div style={{ display: "flex", gap: "6px", marginTop: "6px", flexWrap: "wrap" }}>
                      {["09:00 AM - 06:00 PM", "10:00 AM - 07:00 PM", "08:00 AM - 04:00 PM", "02:00 PM - 10:00 PM"].map((timing) => (
                        <button
                          key={timing}
                          type="button"
                          onClick={() => setDutyTiming(timing)}
                          style={{
                            border: dutyTiming === timing ? "1px solid var(--primary)" : "1px solid var(--border)",
                            background: dutyTiming === timing ? "var(--primary-light)" : "#f8fafc",
                            color: dutyTiming === timing ? "var(--primary)" : "var(--text-muted)",
                            borderRadius: "6px",
                            padding: "2px 8px",
                            fontSize: "11px",
                            fontWeight: dutyTiming === timing ? "700" : "500",
                            cursor: "pointer",
                          }}
                        >
                          {timing}
                        </button>
                      ))}
                    </div>
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
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {isSuperAdmin ? "Create User" : "Add Staff Member"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
