import React from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Users, 
  Star, 
  TrendingUp, 
  ShieldCheck,
  Utensils,
  Hotel,
  Stethoscope,
  GraduationCap,
  ShoppingBag,
  Car,
  Building2,
  Sparkles,
  ChevronRight,
  Dumbbell,
  Gem,
  Package,
} from "lucide-react";
import { motion } from "framer-motion";

export const SocialProof = () => {
  // 11 Core Review Platforms from Image 2
  const platforms = [
    {
      name: "Google",
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.27-2.09 3.67-5.17 3.67-9.15z"/>
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.25v3.15C3.25 21.36 7.31 24 12 24z"/>
          <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.25C.45 8.24 0 10.06 0 12s.45 3.76 1.25 5.39l4.02-3.15z"/>
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.64 1.25 6.61l4.02 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
        </svg>
      )
    },
    {
      name: "Facebook",
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: "Instagram",
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24">
          <radialGradient id="rg" r="150%" cx="30%" cy="107%">
            <stop stopColor="#fdf497" offset="0%" />
            <stop stopColor="#fdf497" offset="5%" />
            <stop stopColor="#fd5949" offset="45%" />
            <stop stopColor="#d6249f" offset="60%" />
            <stop stopColor="#285AEB" offset="90%" />
          </radialGradient>
          <path fill="url(#rg)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      name: "Justdial",
      svg: (
        <div style={{ width: "22px", height: "22px", borderRadius: "5px", backgroundColor: "#ff6600", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontWeight: "900", fontSize: "11px", letterSpacing: "-0.5px" }}>
          Jd
        </div>
      )
    },
    {
      name: "TripAdvisor",
      svg: (
        <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#34E0A1", display: "flex", alignItems: "center", justifyContent: "center", color: "#000000", fontWeight: "900", fontSize: "12px" }}>
          🦉
        </div>
      )
    },
    {
      name: "Trustpilot",
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#00B67A">
          <path d="M12 0l3.708 7.513L24 8.729l-6 5.848 1.417 8.261L12 18.937 4.583 22.838 6 14.577 0 8.729l8.292-1.216L12 0z"/>
        </svg>
      )
    },
    {
      name: "Amazon",
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#FF9900">
          <path d="M13.9 12.3c-.1-.7-.6-1.1-1.4-1.1-.9 0-1.5.5-1.8 1.3l3.2-.2zm-3.3 2.1c.3.9 1.1 1.3 2 1.3.8 0 1.4-.3 1.8-.8l1.3 1c-.8 1-2 1.5-3.3 1.5-2.2 0-3.7-1.4-3.7-3.8 0-2.2 1.6-3.8 3.8-3.8 2.4 0 3.6 1.7 3.6 3.9v.5h-5.5v.2zm10.7 4.1c-3.8 2.6-9.1 3.8-13.8 2.3-3.7-1.2-6.5-3.6-7.5-5.5-.3-.5.1-.9.6-.6 2.8 1.7 6.4 2.7 10.3 2.7 3.4 0 7.2-.8 10-2.1.6-.3 1 .4.4.9zm1.3-1.6c-.3-.4-1.8-.2-2.8-.1-.3 0-.4-.2-.1-.4 1.7-1.2 3.7-.4 3.9-.2.2.3-.2 2.3-1.8 3.6-.3.2-.5.1-.4-.2.4-.9 1.4-2.4 1.2-2.7z"/>
        </svg>
      )
    },
    {
      name: "Zomato",
      svg: (
        <div style={{ width: "22px", height: "22px", borderRadius: "5px", backgroundColor: "#E23744", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontWeight: "900", fontSize: "11px", fontStyle: "italic" }}>
          z
        </div>
      )
    },
    {
      name: "Swiggy",
      svg: (
        <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#FC8019", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontWeight: "900", fontSize: "12px" }}>
          S
        </div>
      )
    },
    {
      name: "YouTube",
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#FF0000">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
    {
      name: "LinkedIn",
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#0A66C2">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      )
    },
  ];

  // Industry Solution Cards from Image 2 + High-Value Verticals
  const industries = [
    { title: "Marketplace Sellers", path: "/solutions/marketplace-sellers", icon: <Package size={18} color="#0052cc" />, bg: "#eff6ff", border: "#bfdbfe" },
    { title: "Restaurants & Cafes", path: "/#solutions", icon: <Utensils size={18} color="#e11d48" />, bg: "#fff1f2", border: "#fecdd3" },
    { title: "Hotels & Hospitality", path: "/#solutions", icon: <Hotel size={18} color="#0284c7" />, bg: "#f0f9ff", border: "#bae6fd" },
    { title: "Healthcare & Clinics", path: "/#solutions", icon: <Stethoscope size={18} color="#059669" />, bg: "#ecfdf5", border: "#a7f3d0" },
    { title: "Franchise & Multi-Outlet", path: "/franchise", icon: <Building2 size={18} color="#2563eb" />, bg: "#eff6ff", border: "#bfdbfe" },
    { title: "Retail & Showrooms", path: "/#solutions", icon: <ShoppingBag size={18} color="#d97706" />, bg: "#fffbeb", border: "#fde68a" },
    { title: "Automotive & Dealerships", path: "/#solutions", icon: <Car size={18} color="#dc2626" />, bg: "#fef2f2", border: "#fecaca" },
    { title: "Salons & Spas", path: "/#solutions", icon: <Sparkles size={18} color="#db2777" />, bg: "#fdf2f8", border: "#fbcfe8" },
    { title: "Education & Schools", path: "/#solutions", icon: <GraduationCap size={18} color="#7c3aed" />, bg: "#f5f3ff", border: "#ddd6fe" },
    { title: "Gyms & Fitness", path: "/#solutions", icon: <Dumbbell size={18} color="#059669" />, bg: "#ecfdf5", border: "#a7f3d0" },
    { title: "Jewelry & Luxury", path: "/#solutions", icon: <Gem size={18} color="#7c3aed" />, bg: "#f5f3ff", border: "#ddd6fe" },
  ];

  return (
    <section style={{ backgroundColor: "#ffffff", padding: "10px 0 0" }}>
      {/* =========================================================================
          STRIP 1: REVIEW PLATFORMS BAR (20+ Platforms)
         ========================================================================= */}
      <div
        style={{
          borderTop: "1px solid #eef2f6",
          borderBottom: "1px solid #eef2f6",
          padding: "22px 24px",
          backgroundColor: "#ffffff",
        }}
      >
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: "12.5px",
                fontWeight: "700",
                color: "#0f172a",
                letterSpacing: "0.2px",
                whiteSpace: "nowrap",
              }}
            >
              Collect &amp; Manage Reviews From 20+ Platforms
            </span>

            {/* Platform Logos Icons */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {platforms.map((p, i) => (
                <div
                  key={i}
                  title={p.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "transform 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  {p.svg}
                </div>
              ))}
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#94a3b8",
                  marginLeft: "4px",
                }}
              >
                and many more...
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          STRIP 2: TRUSTED BY BUSINESSES ACROSS INDUSTRIES
         ========================================================================= */}
      <div
        style={{
          padding: "36px 24px 44px",
          backgroundColor: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "800",
                  color: "#0f172a",
                  letterSpacing: "-0.01em",
                  margin: 0,
                }}
              >
                Trusted by Businesses Across Industries
              </h2>
              <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0" }}>
                Tailored workflows &amp; QR routing engineered for specific customer touchpoints
              </p>
            </div>

            <Link
              to="/franchise"
              style={{
                fontSize: "13px",
                fontWeight: "700",
                color: "#0052cc",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>Explore Multi-Outlet Solutions</span>
              <ChevronRight size={15} />
            </Link>
          </div>

          {/* Continuous Single-Line Infinite Marquee Scroll */}
          <div className="industry-marquee-container" style={{ cursor: "pointer" }}>
            <div className="industry-marquee-track">
              {[...industries, ...industries].map((ind, idx) => (
                <Link
                  key={idx}
                  to={ind.path || "/#solutions"}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "14px",
                    border: `1px solid ${ind.border}`,
                    padding: "16px 18px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    gap: "10px",
                    width: "165px",
                    minWidth: "165px",
                    flexShrink: 0,
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.borderColor = "#0052cc";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 82, 204, 0.14)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = ind.border;
                    e.currentTarget.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.03)";
                  }}
                >
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "10px",
                      backgroundColor: ind.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {ind.icon}
                  </div>
                  <span
                    style={{
                      fontSize: "12.5px",
                      fontWeight: "700",
                      color: "#0f172a",
                      lineHeight: 1.25,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {ind.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
