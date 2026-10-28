import React from "react";
import { useAuth } from "../../context/AuthContext";
import { LogOut, User as UserIcon, Building2, ExternalLink, Menu, X, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { getCleanBrandName } from "../../utils/brand";

export const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, companyDetails, logout, isSuperAdmin } = useAuth();

  const businessName = getCleanBrandName(user, companyDetails);
  const businessLogo = companyDetails?.cmpyLogo || "";

  const cleanInitial = (
    businessName?.[0] ||
    user?.fname?.[0] ||
    user?.uname?.replace(/^[^a-zA-Z0-9]+/, "")?.[0] ||
    "B"
  ).toUpperCase();

  return (
    <header className="app-header">
      {/* Left: Hamburger Button (Mobile) + Brand Logo & Name */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
        {/* Mobile Hamburger Drawer Toggle */}
        <button
          type="button"
          onClick={() => setSidebarOpen && setSidebarOpen(!sidebarOpen)}
          className="mobile-menu-btn"
          aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
          title={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {businessLogo ? (
          <img
            src={businessLogo}
            alt={businessName}
            style={{ height: "32px", width: "auto", maxWidth: "100px", objectFit: "contain", borderRadius: "6px", flexShrink: 0 }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "#0f172a",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "800",
            fontSize: "14px",
            flexShrink: 0
          }}>
            {cleanInitial}
          </div>
        )}

        <div style={{ minWidth: 0 }}>
          <h2 style={{ fontSize: "15px", fontWeight: "800", color: "var(--secondary)", letterSpacing: "-0.4px", margin: 0, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {businessName}
          </h2>
          <span className="hide-on-mobile" style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "500" }}>
            Review Automation Portal
          </span>
        </div>

        {user?.branchId?.name && (
          <span className="badge badge-secondary hide-on-tablet" style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
            <Building2 size={12} /> {user.branchId.name}
          </span>
        )}
      </div>

      {/* Right: Quick Review Link, User Profile & Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        {/* Back to Website */}
        <Link
          to="/"
          className="btn btn-outline btn-sm"
          style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 10px", textDecoration: "none" }}
          title="Back to Website"
        >
          <Globe size={13} />
          <span className="hide-on-mobile">Website</span>
        </Link>

        {user?.formKey && (
          <a
            href={`/wtr/${user.formKey}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
            style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 10px" }}
            title="View Live Review Portal"
          >
            <ExternalLink size={13} />
            <span className="hide-on-mobile">Live Review</span>
          </a>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "3px 6px", borderRadius: "var(--radius-md)", background: "#f8fafc" }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "var(--primary-light)",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "700",
            fontSize: "13px",
            overflow: "hidden",
            border: "1px solid var(--border)",
            flexShrink: 0
          }}>
            {companyDetails?.cmpyLogo ? (
              <img
                src={companyDetails.cmpyLogo}
                alt={user?.fname || user?.uname}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerText = cleanInitial;
                }}
              />
            ) : (
              cleanInitial
            )}
          </div>
          <div className="hide-on-tablet" style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", lineHeight: "1.2" }}>{user?.uname}</span>
            <span style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "capitalize" }}>
              {user?.role?.replace("_", " ").toLowerCase()}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="btn btn-outline btn-sm"
          title="Sign Out"
          style={{ color: "var(--danger)", borderColor: "#fecaca", padding: "5px 10px" }}
        >
          <LogOut size={15} />
          <span className="hide-on-xs">Logout</span>
        </button>
      </div>
    </header>
  );
};
