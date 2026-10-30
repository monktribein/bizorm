import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Globe,
  Share2,
  FileText,
  UserCheck,
  Building2,
  MapPin,
  Users,
  CreditCard,
  History,
  Settings,
  ShieldAlert,
  Package,
} from "lucide-react";

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, isSuperAdmin, isBranchAdmin, isStaffOnly } = useAuth();
  const isMultiBusiness =
    user?.pricingPackageId?.businessType === "multiple" ||
    (user?.pricingPackageId?.maxBusinesses && user?.pricingPackageId?.maxBusinesses > 1);

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const linkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 16px",
    borderRadius: "var(--radius-md)",
    fontSize: "14px",
    fontWeight: isActive ? "700" : "500",
    color: isActive ? "var(--primary)" : "var(--text-muted)",
    background: isActive ? "var(--primary-light)" : "transparent",
    textDecoration: "none",
    transition: "var(--transition)",
  });

  return (
    <aside className={`app-sidebar ${isOpen ? "open" : ""}`}>
      <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--text-subtle)", padding: "0 10px 6px" }}>
        {isStaffOnly ? "Staff Menu" : "Menu"}
      </div>

      <NavLink to="/dashboard" style={linkStyle} onClick={handleLinkClick}>
        <LayoutDashboard size={18} />
        <span>{isStaffOnly ? "My Performance" : "Dashboard"}</span>
      </NavLink>

      {!isStaffOnly && (
        <NavLink to="/platform" style={linkStyle} onClick={handleLinkClick}>
          <Globe size={18} />
          <span>Platforms</span>
        </NavLink>
      )}

      <NavLink to="/share" style={linkStyle} onClick={handleLinkClick}>
        <Share2 size={18} />
        <span>{isStaffOnly ? "My Review QR" : "Share & QR"}</span>
      </NavLink>

      <NavLink to="/report" style={linkStyle} onClick={handleLinkClick}>
        <FileText size={18} />
        <span>{isStaffOnly ? "My Feedback" : "Reviews & Reports"}</span>
      </NavLink>

      <NavLink to="/seller-intelligence" style={linkStyle} onClick={handleLinkClick}>
        <Package size={18} />
        <span>Seller Intelligence</span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: "9.5px",
            fontWeight: "800",
            backgroundColor: "#004ac6",
            color: "#ffffff",
            padding: "1px 6px",
            borderRadius: "999px",
            letterSpacing: "0.4px",
          }}
        >
          NEW
        </span>
      </NavLink>

      <NavLink to="/account" style={linkStyle} onClick={handleLinkClick}>
        <UserCheck size={18} />
        <span>{isStaffOnly ? "My Profile" : "My Account"}</span>
      </NavLink>

      {/* Administration & Branch Management Section */}
      {isSuperAdmin && (
        <>
          <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--text-subtle)", padding: "16px 10px 6px", letterSpacing: "0.5px" }}>
            Bizorm SaaS Admin
          </div>

          <NavLink to="/admin/branches" style={linkStyle} onClick={handleLinkClick}>
            <Building2 size={18} />
            <span>All Branches</span>
          </NavLink>

          <NavLink to="/admin/users" style={linkStyle} onClick={handleLinkClick}>
            <Users size={18} />
            <span>Global Users & RBAC</span>
          </NavLink>

          <NavLink to="/admin/pricing" style={linkStyle} onClick={handleLinkClick}>
            <CreditCard size={18} />
            <span>Pricing & Packages</span>
          </NavLink>

          <NavLink to="/admin/logs" style={linkStyle} onClick={handleLinkClick}>
            <History size={18} />
            <span>Audit Logs</span>
          </NavLink>

          <NavLink to="/admin/settings" style={linkStyle} onClick={handleLinkClick}>
            <Settings size={18} />
            <span>Survey Settings</span>
          </NavLink>
        </>
      )}

      {/* Business Client Administration (Tenant Owner) */}
      {!isSuperAdmin && isBranchAdmin && (
        <>
          <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--text-subtle)", padding: "16px 10px 6px", letterSpacing: "0.5px" }}>
            Business Management
          </div>

          <NavLink to="/branches" style={linkStyle} onClick={handleLinkClick}>
            {isMultiBusiness ? <Building2 size={18} /> : <MapPin size={18} />}
            <span>{isMultiBusiness ? "Branches & Locations" : "Business Location"}</span>
          </NavLink>

          <NavLink to="/team" style={linkStyle} onClick={handleLinkClick}>
            <Users size={18} />
            <span>Staff & Team</span>
          </NavLink>

          <NavLink to="/subscription" style={linkStyle} onClick={handleLinkClick}>
            <CreditCard size={18} />
            <span>Subscription & Upgrade</span>
          </NavLink>
        </>
      )}

      {/* Quick link to main website */}
      <div style={{ marginTop: "auto", paddingTop: "20px" }}>
        <Link
          to="/"
          onClick={handleLinkClick}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 14px",
            borderRadius: "10px",
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            fontSize: "12.5px",
            fontWeight: "600",
            color: "#004ac6",
            textDecoration: "none",
          }}
        >
          <span>Bizorm Website</span>
          <span style={{ fontSize: "11px", opacity: 0.7 }}>→</span>
        </Link>
      </div>
    </aside>
  );
};
