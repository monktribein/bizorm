import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BizormLogo } from "../common/BizormLogo";
import { 
  Menu, 
  X, 
  ArrowRight, 
  LayoutDashboard, 
  ChevronRight, 
  Star,
  Sparkles,
  ShieldCheck,
  LogOut,
  Search,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const LandingNavbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const [solutionsOpen, setSolutionsOpen] = useState(false);

  const navLinks = [
    { name: "Features", href: "/#features" },
    { 
      name: "Solutions", 
      href: "/#solutions", 
      hasDropdown: true,
      items: [
        { label: "Franchise & Multi-Outlet", path: "/franchise", desc: "Centralized control for 5 to 50+ branches" },
        { label: "Restaurants & Cafes", path: "/#solutions", desc: "Dining feedback, Zomato & Google ratings" },
        { label: "Healthcare & Clinics", path: "/#solutions", desc: "Private patient feedback & doctor reputation" },
        { label: "Hotels & Hospitality", path: "/#solutions", desc: "TripAdvisor rankings & guest experience" },
        { label: "Retail & Showrooms", path: "/#solutions", desc: "On-spot counter QR code review collection" },
      ]
    },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: scrolled ? "rgba(255, 255, 255, 0.98)" : "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid",
        borderColor: scrolled ? "#e2e8f0" : "rgba(226, 232, 240, 0.6)",
        height: "72px",
        display: "flex",
        alignItems: "center",
        boxShadow: scrolled ? "0 4px 20px -2px rgba(15, 23, 42, 0.06)" : "none",
        transition: "all 0.2s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          width: "100%",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand Logo */}
        <BizormLogo size="md" />

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: "none",
            alignItems: "center",
            gap: "24px",
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => {
            if (link.hasDropdown) {
              const isOpen = solutionsOpen;
              const setOpen = setSolutionsOpen;

              return (
                <div
                  key={link.name}
                  style={{ position: "relative", padding: "6px 0" }}
                  onMouseEnter={() => setOpen(true)}
                  onMouseLeave={() => setOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(!isOpen)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "8px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "14.5px",
                      fontWeight: "600",
                      color: isOpen ? "#004ac6" : "#475569",
                      transition: "color 0.15s ease",
                    }}
                  >
                    <span>{link.name}</span>
                    <ChevronDown 
                      size={14} 
                      style={{ 
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", 
                        transition: "transform 0.2s ease" 
                      }} 
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        style={{
                          position: "absolute",
                          top: "calc(100% + 2px)",
                          left: "-20px",
                          width: "300px",
                          backgroundColor: "#ffffff",
                          borderRadius: "14px",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 20px 45px -4px rgba(15, 23, 42, 0.18), 0 8px 16px -4px rgba(15, 23, 42, 0.08)",
                          padding: "10px",
                          zIndex: 1100,
                        }}
                      >
                        {link.items.map((sub, sIdx) => (
                          <Link
                            key={sIdx}
                            to={sub.path}
                            onClick={() => setOpen(false)}
                            style={{
                              display: "block",
                              padding: "10px 12px",
                              borderRadius: "8px",
                              textDecoration: "none",
                              transition: "background-color 0.15s ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                          >
                            <div style={{ fontSize: "13.5px", fontWeight: "700", color: "#0f172a" }}>
                              {sub.label}
                            </div>
                            <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: "2px" }}>
                              {sub.desc}
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <a
                key={link.name}
                href={link.href}
                style={{
                  fontSize: "14.5px",
                  fontWeight: "600",
                  color: "#475569",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                  padding: "8px 0",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#004ac6")}
                onMouseLeave={(e) => (e.target.style.color = "#475569")}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div
          style={{
            display: "none",
            alignItems: "center",
            gap: "14px",
          }}
          className="desktop-actions"
        >

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link
                to="/dashboard"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "9px 20px",
                  borderRadius: "9999px",
                  backgroundColor: "#004ac6",
                  color: "#ffffff",
                  fontSize: "13.5px",
                  fontWeight: "700",
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(0, 74, 198, 0.22)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1d4ed8";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#004ac6";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <LayoutDashboard size={15} />
                <span>Dashboard</span>
                <ArrowRight size={14} />
              </Link>

              <button
                type="button"
                onClick={logout}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "9999px",
                  backgroundColor: "#fef2f2",
                  color: "#ef4444",
                  border: "1px solid #fee2e2",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#fee2e2";
                  e.currentTarget.style.borderColor = "#fca5a5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#fef2f2";
                  e.currentTarget.style.borderColor = "#fee2e2";
                }}
                title="Log Out"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Link
                to="/login"
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#0f172a",
                  textDecoration: "none",
                  padding: "8px 22px",
                  borderRadius: "9999px",
                  border: "1.5px solid #cbd5e1",
                  backgroundColor: "#ffffff",
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#004ac6";
                  e.currentTarget.style.color = "#004ac6";
                  e.currentTarget.style.backgroundColor = "#f8fafc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  e.currentTarget.style.color = "#0f172a";
                  e.currentTarget.style.backgroundColor = "#ffffff";
                }}
              >
                Login
              </Link>

              <Link
                to="/register"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "9px 22px",
                  borderRadius: "9999px",
                  backgroundColor: "#0052cc",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "700",
                  textDecoration: "none",
                  boxShadow: "0 4px 16px rgba(0, 82, 204, 0.28)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1d4ed8";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 82, 204, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#0052cc";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 82, 204, 0.28)";
                }}
              >
                <span>Start Free Trial</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            backgroundColor: "#ffffff",
            color: "#0f172a",
            cursor: "pointer",
          }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              top: "72px",
              left: 0,
              right: 0,
              backgroundColor: "#ffffff",
              borderBottom: "1px solid #e2e8f0",
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#1e293b",
                  textDecoration: "none",
                  padding: "8px 0",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                {link.name}
              </a>
            ))}

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "12px",
                      borderRadius: "10px",
                      backgroundColor: "#004ac6",
                      color: "#ffffff",
                      fontWeight: "700",
                      fontSize: "14.5px",
                      textDecoration: "none",
                    }}
                  >
                    <LayoutDashboard size={18} />
                    <span>Open Dashboard</span>
                    <ArrowRight size={15} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "11px",
                      borderRadius: "10px",
                      backgroundColor: "#fef2f2",
                      color: "#ef4444",
                      border: "1px solid #fee2e2",
                      fontWeight: "700",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      color: "#0f172a",
                      fontWeight: "700",
                      textDecoration: "none",
                    }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "12px",
                      borderRadius: "10px",
                      backgroundColor: "#004ac6",
                      color: "#ffffff",
                      fontWeight: "700",
                      textDecoration: "none",
                      boxShadow: "0 4px 12px rgba(0, 74, 198, 0.25)",
                    }}
                  >
                    <span>Sign Up / Free Trial</span>
                    <ArrowRight size={16} />
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
export default LandingNavbar;
