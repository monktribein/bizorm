import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { LandingNavbar } from "../../components/landing/Navbar";
import { LandingFooter } from "../../components/landing/Footer";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Clock, 
  Building2, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Headphones,
  Check
} from "lucide-react";
import { motion } from "framer-motion";

export const ContactPage = () => {
  const [searchParams] = useSearchParams();
  const isEnterprise = searchParams.get("type") === "enterprise";

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    outlets: isEnterprise ? "11-25" : "1",
    inquiryType: isEnterprise ? "enterprise_demo" : "general",
    message: "",
  });

  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const getInputStyle = (fieldName) => ({
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: focusedField === fieldName ? "1.5px solid #0052cc" : "1.5px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
    backgroundColor: focusedField === fieldName ? "#ffffff" : "#fcfdfd",
    boxShadow: focusedField === fieldName ? "0 0 0 3px rgba(0, 82, 204, 0.14)" : "none",
    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
    boxSizing: "border-box",
    fontFamily: "inherit",
    color: "#0f172a",
  });

  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <LandingNavbar />

      {/* Hero Header with Seamless Clean Gradient */}
      <section
        style={{
          paddingTop: "clamp(120px, 9vw, 138px)",
          paddingBottom: "56px",
          background: "linear-gradient(180deg, #edf4ff 0%, #f6f9fe 50%, #f8fafc 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle Ambient Glow */}
        <div
          style={{
            position: "absolute",
            top: "-60px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "900px",
            height: "300px",
            background: "radial-gradient(ellipse at center, rgba(191, 219, 254, 0.45) 0%, rgba(248, 250, 252, 0) 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 40px" }}
          >
            {/* Pill Badge */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "6px 16px",
                borderRadius: "9999px",
                backgroundColor: "#ffffff",
                border: "1px solid #bfdbfe",
                color: "#0052cc",
                fontSize: "12.5px",
                fontWeight: "700",
                boxShadow: "0 2px 8px rgba(0, 82, 204, 0.08)",
                marginBottom: "16px",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#10b981",
                  display: "inline-block",
                  boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.2)",
                }}
              />
              <MessageSquare size={13} color="#0052cc" />
              <span>{isEnterprise ? "Enterprise & Franchise Consultation" : "Customer Success & Advisory"}</span>
            </motion.div>

            <h1
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(32px, 4.2vw, 48px)",
                fontWeight: "900",
                color: "#0f172a",
                lineHeight: 1.16,
                letterSpacing: "-0.03em",
                margin: "0 0 16px 0",
              }}
            >
              {isEnterprise ? (
                <>
                  Book an Enterprise <span style={{ color: "#0052cc" }}>Franchise Demo.</span>
                </>
              ) : (
                <>
                  We're Here to Help Your <span style={{ color: "#0052cc" }}>Business Grow.</span>
                </>
              )}
            </h1>

            <p style={{ fontSize: "16.5px", color: "#475569", lineHeight: 1.6, margin: "0 auto", maxWidth: "620px" }}>
              {isEnterprise
                ? "See how BizORM Enterprise™ provides corporate head-office command, outlet scorecards, and pooled scans across your multi-location network."
                : "Have questions about our multi-platform review links, 300 DPI acrylic standees, or complaint resolution tickets? Speak with our team."}
            </p>
          </motion.div>

          {/* Main 2-Column Grid with Staggered Entrance */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
              gap: "32px",
              alignItems: "start",
            }}
          >
            {/* =========================================================
                LEFT COLUMN: CONTACT INFO & INSTANT TRIAL CARDS
               ========================================================= */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Card 1: Direct Contact Channels */}
              <motion.div
                variants={itemVariants}
                whileHover={{
                  y: -6,
                  boxShadow: "0 20px 38px -8px rgba(0, 82, 204, 0.12)",
                  borderColor: "#93c5fd",
                  transition: { duration: 0.25, ease: "easeOut" },
                }}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "20px",
                  border: "1px solid #e2e8f0",
                  padding: "32px 28px",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.03)",
                  transition: "all 0.25s ease",
                  cursor: "default",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        backgroundColor: "#eff6ff",
                        color: "#0052cc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Headphones size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                        Direct Channels
                      </h3>
                      <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>Average response under 2 hours</p>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#16a34a",
                      backgroundColor: "#dcfce7",
                      padding: "3px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    Online
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  {/* Channel: Email */}
                  <motion.a
                    href="mailto:support@bizorm.com"
                    whileHover={{ x: 5, backgroundColor: "#f8fafc" }}
                    transition={{ duration: 0.18 }}
                    style={{
                      display: "flex",
                      gap: "14px",
                      alignItems: "center",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      textDecoration: "none",
                      border: "1px solid transparent",
                      transition: "all 0.18s ease",
                    }}
                  >
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "12px",
                        backgroundColor: "#eff6ff",
                        border: "1px solid #dbeafe",
                        color: "#0052cc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Mail size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: "11.5px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        Email Advisory
                      </div>
                      <div style={{ fontSize: "15px", fontWeight: "800", color: "#0052cc" }}>
                        support@bizorm.com
                      </div>
                    </div>
                  </motion.a>

                  {/* Channel: Phone */}
                  <motion.a
                    href="tel:+919999999999"
                    whileHover={{ x: 5, backgroundColor: "#f8fafc" }}
                    transition={{ duration: 0.18 }}
                    style={{
                      display: "flex",
                      gap: "14px",
                      alignItems: "center",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      textDecoration: "none",
                      border: "1px solid transparent",
                      transition: "all 0.18s ease",
                    }}
                  >
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "12px",
                        backgroundColor: "#ecfdf5",
                        border: "1px solid #bbf7d0",
                        color: "#059669",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Phone size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: "11.5px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        Sales &amp; Enterprise Hotline
                      </div>
                      <div style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>
                        +91 99999 99999
                      </div>
                    </div>
                  </motion.a>

                  {/* Channel: Hours */}
                  <motion.div
                    whileHover={{ x: 5, backgroundColor: "#f8fafc" }}
                    transition={{ duration: 0.18 }}
                    style={{
                      display: "flex",
                      gap: "14px",
                      alignItems: "center",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      border: "1px solid transparent",
                    }}
                  >
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "12px",
                        backgroundColor: "#fffbeb",
                        border: "1px solid #fef3c7",
                        color: "#d97706",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Clock size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: "11.5px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        Business Desk Hours
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                        Mon – Sat: 9:30 AM – 6:30 PM IST
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Card 2: Instant Trial Callout Card with Interactive Hover */}
              <motion.div
                variants={itemVariants}
                whileHover={{
                  y: -6,
                  scale: 1.01,
                  boxShadow: "0 22px 45px -8px rgba(0, 82, 204, 0.35)",
                  transition: { duration: 0.25, ease: "easeOut" },
                }}
                style={{
                  background: "linear-gradient(140deg, #0052cc 0%, #1e40af 100%)",
                  borderRadius: "20px",
                  padding: "30px 28px",
                  color: "#ffffff",
                  boxShadow: "0 10px 28px rgba(0, 82, 204, 0.25)",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "default",
                }}
              >
                {/* Decorative glow overlay */}
                <div
                  style={{
                    position: "absolute",
                    top: "-30px",
                    right: "-30px",
                    width: "160px",
                    height: "160px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    pointerEvents: "none",
                  }}
                />

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "3px 10px",
                    borderRadius: "6px",
                    backgroundColor: "rgba(255, 255, 255, 0.16)",
                    fontSize: "11.5px",
                    fontWeight: "700",
                    marginBottom: "12px",
                  }}
                >
                  <Sparkles size={12} color="#ffffff" />
                  <span>Instant Setup</span>
                </div>

                <h4 style={{ fontSize: "18px", fontWeight: "800", color: "#ffffff", margin: "0 0 8px 0" }}>
                  Want to test drive BizORM immediately?
                </h4>
                <p style={{ fontSize: "13.5px", color: "rgba(255, 255, 255, 0.9)", lineHeight: 1.55, marginBottom: "22px" }}>
                  No salesperson required. You can register your account right now and get full access to <strong>100 valid QR scans</strong> and printable acrylic standees free for 7 days.
                </p>

                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ display: "inline-block" }}
                >
                  <Link
                    to="/register"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "12px 24px",
                      borderRadius: "9999px",
                      backgroundColor: "#ffffff",
                      color: "#0052cc",
                      fontSize: "13.5px",
                      fontWeight: "800",
                      textDecoration: "none",
                      boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f0f5ff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                    }}
                  >
                    <span>Start 7-Day Free Trial</span>
                    <ArrowRight size={15} />
                  </Link>
                </motion.div>
              </motion.div>

              {/* Card 3: Trust & Assurance Micro-Card */}
              <motion.div
                variants={itemVariants}
                whileHover={{
                  y: -3,
                  boxShadow: "0 10px 24px -6px rgba(0, 0, 0, 0.05)",
                  borderColor: "#bfdbfe",
                  transition: { duration: 0.2 },
                }}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  padding: "18px 22px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    backgroundColor: "#f0fdf4",
                    color: "#16a34a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a" }}>
                    100% Policy-Compliant &amp; Anti-Gating
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    Fully adheres to Google Review policies and FTC compliance guidelines.
                  </div>
                </div>
              </motion.div>
            </div>

            {/* =========================================================
                RIGHT COLUMN: CONTACT FORM CARD
               ========================================================= */}
            <motion.div
              variants={itemVariants}
              whileHover={{
                y: -6,
                boxShadow: "0 22px 45px -8px rgba(0, 82, 204, 0.12)",
                borderColor: "#93c5fd",
                transition: { duration: 0.25, ease: "easeOut" },
              }}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "22px",
                border: "1px solid #e2e8f0",
                padding: "36px 32px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                transition: "all 0.25s ease",
              }}
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{ textAlign: "center", padding: "48px 16px" }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      backgroundColor: "#ecfdf5",
                      border: "2px solid #bbf7d0",
                      color: "#059669",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "18px",
                    }}
                  >
                    <CheckCircle2 size={34} />
                  </motion.div>
                  <h3 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>
                    Thank you! Message Received.
                  </h3>
                  <p style={{ fontSize: "14.5px", color: "#64748b", maxWidth: "420px", margin: "0 auto 24px", lineHeight: 1.55 }}>
                    A BizORM reputation specialist will review your request and get in touch with you within <strong>2 business hours</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    style={{
                      padding: "10px 22px",
                      borderRadius: "10px",
                      border: "1.5px solid #cbd5e1",
                      backgroundColor: "#ffffff",
                      color: "#0f172a",
                      fontSize: "14px",
                      fontWeight: "700",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8fafc";
                      e.currentTarget.style.borderColor = "#0052cc";
                      e.currentTarget.style.color = "#0052cc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                      e.currentTarget.style.borderColor = "#cbd5e1";
                      e.currentTarget.style.color = "#0f172a";
                    }}
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  <div>
                    <h3 style={{ fontSize: "21px", fontWeight: "900", color: "#0f172a", margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>
                      Send Us a Message
                    </h3>
                    <p style={{ fontSize: "13.5px", color: "#64748b", margin: 0 }}>
                      Fill out the form below and our team will connect with you shortly.
                    </p>
                  </div>

                  {/* Field: Full Name */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. Rajesh Sharma"
                      value={formData.name}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={getInputStyle("name")}
                    />
                  </div>

                  {/* Fields: Email & Phone Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="rajesh@clinic.com"
                        value={formData.email}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={getInputStyle("email")}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onFocus={() => setFocusedField("phone")}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={getInputStyle("phone")}
                      />
                    </div>
                  </div>

                  {/* Fields: Business & Outlets Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                        Company / Brand Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Grand Bistro or Apex Healthcare"
                        value={formData.businessName}
                        onFocus={() => setFocusedField("businessName")}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        style={getInputStyle("businessName")}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                        Number of Outlets / Branches
                      </label>
                      <select
                        value={formData.outlets}
                        onFocus={() => setFocusedField("outlets")}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setFormData({ ...formData, outlets: e.target.value })}
                        style={{
                          ...getInputStyle("outlets"),
                          cursor: "pointer",
                        }}
                      >
                        <option value="1">1 Single Location</option>
                        <option value="2-10">2 – 10 Outlets (Franchise 10)</option>
                        <option value="11-25">11 – 25 Outlets (Franchise 25)</option>
                        <option value="26-50">26 – 50 Outlets (Franchise 50)</option>
                        <option value="51-100">51 – 100 Outlets (Franchise 100)</option>
                        <option value="100+">100+ Enterprise Corporate Network</option>
                      </select>
                    </div>
                  </div>

                  {/* Field: Message */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                      How can we help your business? *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about your locations, expected monthly customer footfall, or specific platform questions..."
                      value={formData.message}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{
                        ...getInputStyle("message"),
                        resize: "vertical",
                        minHeight: "100px",
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.015, backgroundColor: "#1d4ed8" }}
                    whileTap={{ scale: 0.985 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "14px 20px",
                      borderRadius: "10px",
                      backgroundColor: "#0052cc",
                      color: "#ffffff",
                      fontSize: "15px",
                      fontWeight: "700",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 6px 20px rgba(0, 82, 204, 0.3)",
                      transition: "background-color 0.15s ease",
                      marginTop: "4px",
                    }}
                  >
                    <Send size={16} />
                    <span>Submit Request</span>
                  </motion.button>

                  {/* Form Trust Badges */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "11.5px",
                      color: "#64748b",
                      marginTop: "6px",
                      paddingTop: "14px",
                      borderTop: "1px solid #f1f5f9",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                      <CheckCircle2 size={13} color="#059669" />
                      <span>2-Hour Rapid Response</span>
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                      <ShieldCheck size={13} color="#0052cc" />
                      <span>100% Confidential Data</span>
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                      <CheckCircle2 size={13} color="#059669" />
                      <span>Zero Sales Pressure</span>
                    </span>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default ContactPage;
