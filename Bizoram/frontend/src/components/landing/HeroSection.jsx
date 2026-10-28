import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  TrendingUp, 
  ExternalLink,
  MessageSquare,
  Lock,
  Sparkles,
  QrCode,
  Calendar,
  Search,
  ChevronDown,
  Check,
  Send,
  Zap,
  Layers,
  Smile
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const HeroSection = () => {
  const [phoneRating, setPhoneRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState(["Good Service", "Friendly Staff"]);
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <section
      style={{
        position: "relative",
        paddingTop: "clamp(125px, 11vw, 152px)",
        paddingBottom: "56px",
        background: "linear-gradient(180deg, #dbeafe 0%, #edf5ff 35%, #ffffff 85%)",
        overflow: "hidden",
      }}
    >
      {/* Subtle Sky Clouds & Radial Ambient Lights */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "1100px",
          height: "480px",
          background: "radial-gradient(ellipse at 50% 30%, rgba(191, 219, 254, 0.55) 0%, rgba(255, 255, 255, 0) 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "120px",
          right: "0",
          width: "480px",
          height: "480px",
          background: "radial-gradient(circle, rgba(147, 197, 253, 0.35) 0%, rgba(255, 255, 255, 0) 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "44px",
            alignItems: "center",
          }}
          className="hero-grid"
        >
          {/* =========================================================================
              LEFT COLUMN: HERO COPY & CALL-TO-ACTIONS
             ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ maxWidth: "600px" }}
          >

            {/* Main Headline */}
            <h1
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(34px, 4.4vw, 52px)",
                fontWeight: "900",
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                color: "#0f172a",
                marginBottom: "20px",
              }}
            >
              Every Customer <br />
              Experience Matters. <br />
              <span
                style={{
                  color: "#0052cc",
                  position: "relative",
                  display: "inline-block",
                }}
              >
                Build a Stronger Brand.
              </span>
            </h1>

            {/* Subhead Description */}
            <p
              style={{
                fontSize: "clamp(15px, 1.6vw, 17px)",
                lineHeight: 1.65,
                color: "#475569",
                marginBottom: "30px",
                fontWeight: "500",
              }}
            >
              Collect genuine customer feedback, manage reviews across <strong>20+ platforms</strong>, use branded QR codes, automate WhatsApp campaigns, and get AI insights to improve service quality and grow your business.
            </p>

            {/* CTA Buttons */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "14px",
                alignItems: "center",
                marginBottom: "26px",
              }}
            >
              <Link
                to="/register"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  padding: "14px 28px",
                  borderRadius: "9999px",
                  backgroundColor: "#0052cc",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: "700",
                  textDecoration: "none",
                  boxShadow: "0 8px 24px rgba(0, 82, 204, 0.32)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1d4ed8";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 12px 28px rgba(0, 82, 204, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#0052cc";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 82, 204, 0.32)";
                }}
              >
                <span>Start 7-Day Free Trial</span>
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/contact?type=enterprise"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "14px 26px",
                  borderRadius: "9999px",
                  backgroundColor: "#ffffff",
                  color: "#0f172a",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "15px",
                  fontWeight: "700",
                  textDecoration: "none",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.04)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8fafc";
                  e.currentTarget.style.borderColor = "#0052cc";
                  e.currentTarget.style.color = "#0052cc";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  e.currentTarget.style.color = "#0f172a";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <Calendar size={16} color="#0052cc" />
                <span>Book Enterprise Demo</span>
              </Link>
            </div>

            {/* 3 Trust Checkmarks */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "20px",
                color: "#475569",
                fontSize: "13.5px",
                fontWeight: "600",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={16} color="#0052cc" />
                <span>No Credit Card Required</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={16} color="#0052cc" />
                <span>100 QR Scans Included</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={16} color="#0052cc" />
                <span>Setup in Minutes</span>
              </div>
            </div>
          </motion.div>

          {/* =========================================================================
              RIGHT COLUMN: MULTI-LAYERED VISUAL SHOWCASE (LAPTOP + PHONE + FLOATING PILLS)
             ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "680px",
              margin: "0 auto",
            }}
          >
            {/* FLOATING PILL TOP-LEFT: Send WhatsApp Invites */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              style={{
                position: "absolute",
                top: "-26px",
                left: "20px",
                backgroundColor: "#ffffff",
                padding: "8px 16px",
                borderRadius: "9999px",
                border: "1px solid #dcfce7",
                boxShadow: "0 10px 25px rgba(16, 185, 129, 0.14)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                zIndex: 20,
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  backgroundColor: "#25d366",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(37, 211, 102, 0.4)",
                }}
              >
                <MessageSquare size={16} />
              </div>
              <div>
                <p style={{ fontSize: "12.5px", fontWeight: "700", color: "#0f172a", margin: 0, lineHeight: 1.2 }}>
                  Send WhatsApp Invites
                </p>
                <p style={{ fontSize: "11px", fontWeight: "600", color: "#059669", margin: 0 }}>
                  ₹1 per message
                </p>
              </div>
            </motion.div>

            {/* Curved Pointer Line to Laptop */}
            <svg
              style={{
                position: "absolute",
                top: "14px",
                left: "140px",
                width: "60px",
                height: "35px",
                zIndex: 10,
                pointerEvents: "none",
              }}
              viewBox="0 0 60 35"
              fill="none"
            >
              <path
                d="M10 2 Q 40 10 50 30"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            </svg>

            {/* FLOATING PILL TOP-RIGHT: Branded QR Codes */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
              style={{
                position: "absolute",
                top: "-26px",
                right: "40px",
                backgroundColor: "#ffffff",
                padding: "8px 16px",
                borderRadius: "9999px",
                border: "1px solid #dbeafe",
                boxShadow: "0 10px 25px rgba(0, 82, 204, 0.12)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                zIndex: 20,
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  backgroundColor: "#0052cc",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0, 82, 204, 0.35)",
                }}
              >
                <QrCode size={16} />
              </div>
              <div>
                <p style={{ fontSize: "12.5px", fontWeight: "700", color: "#0f172a", margin: 0, lineHeight: 1.2 }}>
                  Branded QR Codes
                </p>
                <p style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", margin: 0 }}>
                  Ready to print
                </p>
              </div>
            </motion.div>

            {/* =======================================================================
                MAIN DASHBOARD FRAME (DESKTOP / LAPTOP INTERFACE MOCKUP)
               ======================================================================= */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "20px",
                border: "1px solid #cbd5e1",
                boxShadow: "0 25px 60px -15px rgba(0, 82, 204, 0.16), 0 10px 30px -8px rgba(15, 23, 42, 0.08)",
                padding: "20px",
                position: "relative",
                zIndex: 2,
                overflow: "hidden",
                marginRight: "60px", // space for phone overlap
              }}
            >
              {/* Window Header Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: "14px",
                  borderBottom: "1px solid #f1f5f9",
                  marginBottom: "16px",
                }}
              >
                {/* Window Dots & Mini Brand */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <div style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
                    <div style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: "#f59e0b" }} />
                    <div style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: "#10b981" }} />
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: "800", color: "#0f172a", marginLeft: "4px" }}>
                    Biz<span style={{ color: "#0052cc" }}>ORM</span>™
                  </span>
                </div>

                {/* Dashboard Title & Filter */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#1e293b" }}>
                    Reputation &amp; Analytics
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#64748b",
                    }}
                  >
                    <span>Last 30 Days</span>
                    <ChevronDown size={11} />
                  </div>
                </div>
              </div>

              {/* Top Row: 4 Metric KPI Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "10px",
                  marginBottom: "16px",
                }}
              >
                {/* Metric 1: Total Reviews */}
                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "10px 12px",
                  }}
                >
                  <span style={{ fontSize: "10.5px", fontWeight: "600", color: "#64748b" }}>
                    Reviews
                  </span>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "5px", marginTop: "2px" }}>
                    <span style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a" }}>
                      1,248
                    </span>
                    <span style={{ fontSize: "9.5px", fontWeight: "700", color: "#10b981" }}>
                      +18.4%
                    </span>
                  </div>
                </div>

                {/* Metric 2: Average Rating */}
                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "10px 12px",
                  }}
                >
                  <span style={{ fontSize: "10.5px", fontWeight: "600", color: "#64748b" }}>
                    Avg Rating
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                    <span style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a" }}>
                      4.6
                    </span>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>/5.0</span>
                    <Star size={12} fill="#f59e0b" color="#f59e0b" />
                  </div>
                </div>

                {/* Metric 3: CSAT */}
                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "10px 12px",
                  }}
                >
                  <span style={{ fontSize: "10.5px", fontWeight: "600", color: "#64748b" }}>
                    CSAT
                  </span>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "5px", marginTop: "2px" }}>
                    <span style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a" }}>
                      82%
                    </span>
                    <Smile size={12} color="#0052cc" />
                  </div>
                </div>

                {/* Metric 4: Complaints */}
                <div
                  style={{
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fee2e2",
                    borderRadius: "10px",
                    padding: "10px 12px",
                  }}
                >
                  <span style={{ fontSize: "10.5px", fontWeight: "600", color: "#991b1b" }}>
                    Complaints
                  </span>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "5px", marginTop: "2px" }}>
                    <span style={{ fontSize: "16px", fontWeight: "800", color: "#b91c1c" }}>
                      12
                    </span>
                    <span style={{ fontSize: "9.5px", fontWeight: "700", color: "#10b981" }}>
                      -35%
                    </span>
                  </div>
                </div>
              </div>

              {/* Mid Row: Rating Distribution & Review Trends Chart */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.1fr",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                {/* Rating Distribution Card */}
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "12px",
                  }}
                >
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#1e293b", display: "block", marginBottom: "8px" }}>
                    Rating Distribution
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    {[
                      { star: 5, pct: 82, color: "#10b981", label: "82%" },
                      { star: 4, pct: 12, color: "#3b82f6", label: "12%" },
                      { star: 3, pct: 4, color: "#f59e0b", label: "4%" },
                      { star: 2, pct: 1, color: "#f97316", label: "1%" },
                      { star: 1, pct: 1, color: "#ef4444", label: "1%" },
                    ].map((row) => (
                      <div key={row.star} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "10px", fontWeight: "600", color: "#64748b", width: "16px" }}>
                          {row.star}★
                        </span>
                        <div
                          style={{
                            flex: 1,
                            height: "6px",
                            backgroundColor: "#f1f5f9",
                            borderRadius: "9999px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${row.pct}%`,
                              height: "100%",
                              backgroundColor: row.color,
                              borderRadius: "9999px",
                            }}
                          />
                        </div>
                        <span style={{ fontSize: "9.5px", fontWeight: "600", color: "#64748b", width: "24px", textAlign: "right" }}>
                          {row.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Trends Chart Card */}
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "12px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#1e293b" }}>
                      Review Trends
                    </span>
                    <span style={{ fontSize: "10px", fontWeight: "700", color: "#0052cc" }}>
                      +240% Growth
                    </span>
                  </div>

                  {/* SVG Trend Chart */}
                  <svg viewBox="0 0 160 55" style={{ width: "100%", height: "55px", overflow: "visible" }}>
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0052cc" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#0052cc" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Area under curve */}
                    <path
                      d="M 5,45 Q 35,38 65,30 T 115,18 T 155,8 L 155,50 L 5,50 Z"
                      fill="url(#chartGradient)"
                    />
                    {/* Curve line */}
                    <path
                      d="M 5,45 Q 35,38 65,30 T 115,18 T 155,8"
                      fill="none"
                      stroke="#0052cc"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Highlight point */}
                    <circle cx="155" cy="8" r="3.5" fill="#0052cc" stroke="#ffffff" strokeWidth="1.5" />
                  </svg>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#94a3b8", marginTop: "2px" }}>
                    <span>Jan</span>
                    <span>Mar</span>
                    <span>May</span>
                    <span>Now</span>
                  </div>
                </div>
              </div>

              {/* Bottom Card: Recent Feedback Snippet */}
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  padding: "10px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "#eff6ff",
                    color: "#0052cc",
                    fontSize: "12px",
                    fontWeight: "800",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #bfdbfe",
                    flexShrink: 0,
                  }}
                >
                  SM
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "11.5px", fontWeight: "700", color: "#0f172a" }}>
                      Saurabh Mishra
                    </span>
                    <div style={{ display: "flex", gap: "1px" }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} fill="#f59e0b" color="#f59e0b" />
                      ))}
                    </div>
                    <span style={{ fontSize: "9.5px", fontWeight: "700", color: "#0052cc", backgroundColor: "#e0effe", padding: "1px 5px", borderRadius: "3px" }}>
                      Google Reviews
                    </span>
                    <span style={{ fontSize: "9.5px", color: "#94a3b8" }}>
                      2h ago
                    </span>
                  </div>
                  <p style={{ fontSize: "11px", color: "#475569", margin: "2px 0 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    &ldquo;Excellent service and very good staff. Highly recommended!&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* =======================================================================
                3 FLOATING FEATURE BADGES (LEFT SIDE OF DASHBOARD)
               ======================================================================= */}
            <div
              style={{
                position: "absolute",
                left: "-25px",
                top: "110px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                zIndex: 25,
                pointerEvents: "none",
              }}
              className="desktop-feature-pills"
            >
              {/* Badge 1: Multi-Platform */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{
                  backgroundColor: "#ffffff",
                  padding: "9px 14px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  maxWidth: "240px",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "8px",
                    backgroundColor: "#fffbeb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#f59e0b",
                    flexShrink: 0,
                  }}
                >
                  <Star size={16} fill="#f59e0b" />
                </div>
                <div>
                  <p style={{ fontSize: "11.5px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                    Multi-Platform Reviews
                  </p>
                  <p style={{ fontSize: "10px", color: "#64748b", margin: 0 }}>
                    Google, Justdial, Facebook &amp; 20+
                  </p>
                </div>
              </motion.div>

              {/* Badge 2: AI-Powered Insights */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                style={{
                  backgroundColor: "#ffffff",
                  padding: "9px 14px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  maxWidth: "240px",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "8px",
                    backgroundColor: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#0052cc",
                    flexShrink: 0,
                  }}
                >
                  <Zap size={16} />
                </div>
                <div>
                  <p style={{ fontSize: "11.5px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                    AI-Powered Insights
                  </p>
                  <p style={{ fontSize: "10px", color: "#64748b", margin: 0 }}>
                    Understand sentiment &amp; improve service
                  </p>
                </div>
              </motion.div>

              {/* Badge 3: Private Feedback */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                style={{
                  backgroundColor: "#ffffff",
                  padding: "9px 14px",
                  borderRadius: "12px",
                  border: "1px solid #fee2e2",
                  boxShadow: "0 8px 20px rgba(239, 68, 68, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  maxWidth: "240px",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "8px",
                    backgroundColor: "#fef2f2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ef4444",
                    flexShrink: 0,
                  }}
                >
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <p style={{ fontSize: "11.5px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                    Private Feedback
                  </p>
                  <p style={{ fontSize: "10px", color: "#64748b", margin: 0 }}>
                    Resolve issues before public posting
                  </p>
                </div>
              </motion.div>
            </div>

            {/* =======================================================================
                OVERLAPPING SMARTPHONE MOCKUP (BOTTOM RIGHT OF LAPTOP)
               ======================================================================= */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.25 }}
              style={{
                position: "absolute",
                bottom: "-25px",
                right: "-10px",
                width: "220px",
                backgroundColor: "#ffffff",
                borderRadius: "28px",
                border: "4px solid #0f172a",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.22)",
                zIndex: 30,
                overflow: "hidden",
                padding: "16px 14px 18px",
              }}
            >
              {/* Phone Speaker Notch */}
              <div
                style={{
                  width: "48px",
                  height: "4px",
                  backgroundColor: "#0f172a",
                  borderRadius: "9999px",
                  margin: "0 auto 12px",
                }}
              />

              {/* Phone App Content */}
              <div style={{ textAlign: "center" }}>
                {/* Brand Header */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "6px" }}>
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "3px",
                      backgroundColor: "#0052cc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Star size={8} color="#ffffff" fill="#ffffff" />
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "#0f172a" }}>
                    Biz<span style={{ color: "#0052cc" }}>ORM</span>™
                  </span>
                </div>

                <p style={{ fontSize: "12px", fontWeight: "800", color: "#0f172a", margin: "0 0 6px" }}>
                  Rate your experience
                </p>

                {/* 5 Interactive Stars */}
                <div style={{ display: "flex", justifyContent: "center", gap: "4px", marginBottom: "10px" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setPhoneRating(s)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        transition: "transform 0.15s ease",
                        transform: s <= phoneRating ? "scale(1.15)" : "scale(1)",
                      }}
                      title={`Rate ${s} stars`}
                    >
                      <Star
                        size={18}
                        fill={s <= phoneRating ? "#f59e0b" : "#e2e8f0"}
                        color={s <= phoneRating ? "#f59e0b" : "#cbd5e1"}
                      />
                    </button>
                  ))}
                </div>

                {/* Feedback Tags */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "4px",
                    justifyContent: "center",
                    marginBottom: "10px",
                  }}
                >
                  {["Good Service", "Friendly Staff", "Clean & Hygienic", "Quick Response"].map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        style={{
                          fontSize: "8.5px",
                          fontWeight: "700",
                          padding: "3px 7px",
                          borderRadius: "9999px",
                          border: isSelected ? "1px solid #0052cc" : "1px solid #e2e8f0",
                          backgroundColor: isSelected ? "#eff6ff" : "#ffffff",
                          color: isSelected ? "#0052cc" : "#64748b",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>

                {/* Fake Input */}
                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    padding: "6px 8px",
                    fontSize: "9px",
                    color: "#94a3b8",
                    textAlign: "left",
                    marginBottom: "10px",
                  }}
                >
                  Tell us about your experience...
                </div>

                {/* Submit Feedback Button */}
                <button
                  type="button"
                  onClick={() => setSubmitted(true)}
                  style={{
                    width: "100%",
                    padding: "7px 10px",
                    borderRadius: "9999px",
                    backgroundColor: submitted ? "#10b981" : "#0052cc",
                    color: "#ffffff",
                    border: "none",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0, 82, 204, 0.25)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {submitted ? "✓ Feedback Sent!" : "Submit Feedback"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
