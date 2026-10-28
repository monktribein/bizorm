import React from "react";
import { Link } from "react-router-dom";

export const BizormLogo = ({ 
  size = "md", 
  variant = "full", 
  showTagline = true, 
  to = "/", 
  className = "" 
}) => {
  const iconSizes = {
    sm: 28,
    md: 36,
    lg: 44,
    xl: 52,
  };
  const iconPx = iconSizes[size] || iconSizes.md;

  const logoGraphic = (
    <div
      className={`bizorm-logo-wrap ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        textDecoration: "none",
        userSelect: "none",
      }}
    >
      {/* Brand Icon Badge with Analytics Growth Chart */}
      <div
        style={{
          width: iconPx,
          height: iconPx,
          borderRadius: "10px",
          background: "linear-gradient(135deg, #004ac6 0%, #2563eb 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0, 74, 198, 0.22)",
          flexShrink: 0,
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <svg
          width={iconPx * 0.62}
          height={iconPx * 0.62}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bar chart bars */}
          <rect x="3" y="14" width="3.5" height="7" rx="1" fill="#ffffff" fillOpacity="0.8" />
          <rect x="8.5" y="10" width="3.5" height="11" rx="1" fill="#ffffff" fillOpacity="0.9" />
          <rect x="14" y="6" width="3.5" height="15" rx="1" fill="#5eead4" />
          <rect x="19.5" y="3" width="3.5" height="18" rx="1" fill="#ffffff" />
          {/* Trend line through tops */}
          <path
            d="M4 13L9.5 9L15 5.5L20.5 2"
            stroke="#5eead4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {variant !== "icon" && (
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: size === "sm" ? "19px" : size === "lg" ? "26px" : size === "xl" ? "30px" : "22px",
                fontWeight: "900",
                letterSpacing: "-0.03em",
                color: "#0f172a",
              }}
            >
              Biz<span style={{ color: "#004ac6" }}>ORM</span>
            </span>
            <span
              style={{
                fontSize: size === "sm" ? "10px" : "12px",
                fontWeight: "800",
                color: "#0d9488",
                marginLeft: "2px",
                lineHeight: 1,
              }}
            >
              ™
            </span>
          </div>

          {showTagline && size !== "sm" && (
            <span
              style={{
                fontSize: "7.5px",
                fontWeight: "800",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#64748b",
                marginTop: "2px",
                whiteSpace: "nowrap",
              }}
            >
              CUSTOMER EXPERIENCE. STRONGER BRANDS.
            </span>
          )}
        </div>
      )}
    </div>
  );

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  if (to) {
    return (
      <Link 
        to={to} 
        onClick={handleClick}
        style={{ textDecoration: "none", cursor: "pointer", display: "inline-block" }}
        title="BizORM™ - Home"
      >
        {logoGraphic}
      </Link>
    );
  }

  return logoGraphic;
};

export default BizormLogo;
