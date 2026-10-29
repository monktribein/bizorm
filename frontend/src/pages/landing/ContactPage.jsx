import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { LandingNavbar } from "../../components/landing/Navbar";
import { LandingFooter } from "../../components/landing/Footer";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock, Building2, Layers } from "lucide-react";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <LandingNavbar />

      <section style={{ paddingTop: "clamp(110px, 9vw, 124px)", paddingBottom: "32px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 24px" }}>
            <h1
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(32px, 4.5vw, 46px)",
                fontWeight: "800",
                color: "#0f172a",
                lineHeight: 1.2,
                marginBottom: "14px",
              }}
            >
              {isEnterprise ? "Book an Enterprise Franchise Demo" : "We're Here to Help Your Business Grow."}
            </h1>
            <p style={{ fontSize: "16.5px", color: "#64748b" }}>
              {isEnterprise
                ? "See how BizORM Enterprise™ provides corporate head-office command, outlet scorecards, and pooled scans across your franchise network."
                : "Have questions about our review platform integrations, franchise packages, or QR standees? Speak with our team."}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              gap: "40px",
              alignItems: "start",
            }}
          >
            {/* Left: Contact Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "18px",
                  border: "1px solid #e2e8f0",
                  padding: "32px",
                  boxShadow: "0 4px 20px rgba(0, 74, 198, 0.04)",
                }}
              >
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", marginBottom: "20px" }}>
                  Direct Contact Information
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#eff6ff", color: "#004ac6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Mail size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: "12.5px", fontWeight: "600", color: "#64748b" }}>Email Support</div>
                      <a href="mailto:support@bizorm.com" style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", textDecoration: "none" }}>
                        support@bizorm.com
                      </a>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#ecfdf5", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Phone size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: "12.5px", fontWeight: "600", color: "#64748b" }}>Sales & Support Hotline</div>
                      <div style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>
                        +91 99999 99999
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#fffbeb", color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Clock size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: "12.5px", fontWeight: "600", color: "#64748b" }}>Working Hours</div>
                      <div style={{ fontSize: "14.5px", fontWeight: "600", color: "#0f172a" }}>
                        Mon – Sat: 9:30 AM to 6:30 PM IST
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Free Trial Highlight */}
              <div
                style={{
                  backgroundColor: "#f0f3ff",
                  borderRadius: "18px",
                  border: "1px solid #dee8ff",
                  padding: "28px",
                }}
              >
                <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#004ac6", marginBottom: "8px" }}>
                  Want to test drive Bizorm immediately?
                </h4>
                <p style={{ fontSize: "13.5px", color: "#475569", lineHeight: 1.5, marginBottom: "16px" }}>
                  You don't need to wait for a salesperson. You can register now and activate your 7-day free trial in under 2 minutes.
                </p>
                <a
                  href="/register"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "10px 18px",
                    borderRadius: "10px",
                    backgroundColor: "#004ac6",
                    color: "#ffffff",
                    fontSize: "13.5px",
                    fontWeight: "700",
                    textDecoration: "none",
                  }}
                >
                  Start 7-Day Free Trial
                </a>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                padding: "36px",
                boxShadow: "0 10px 30px rgba(0, 74, 198, 0.05)",
              }}
            >
              {submitted ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "#ecfdf5", color: "#10b981", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>
                    Thank you! Message Received.
                  </h3>
                  <p style={{ fontSize: "14.5px", color: "#64748b", maxWidth: "420px", margin: "0 auto 24px" }}>
                    A Bizorm reputation specialist will review your request and contact you within 2 business hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      backgroundColor: "#ffffff",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>
                    Send Us a Message
                  </h3>
                  <p style={{ fontSize: "13.5px", color: "#64748b", marginBottom: "12px" }}>
                    Fill out the form below and we'll connect with you shortly.
                  </p>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. Rajesh Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "11px 14px",
                        borderRadius: "10px",
                        border: "1px solid #cbd5e1",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="rajesh@clinic.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "11px 14px",
                          borderRadius: "10px",
                          border: "1px solid #cbd5e1",
                          fontSize: "14px",
                          outline: "none",
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "11px 14px",
                          borderRadius: "10px",
                          border: "1px solid #cbd5e1",
                          fontSize: "14px",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                        Company / Brand Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Grand Bistro or Apex Healthcare"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "11px 14px",
                          borderRadius: "10px",
                          border: "1px solid #cbd5e1",
                          fontSize: "14px",
                          outline: "none",
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                        Number of Outlets / Branches
                      </label>
                      <select
                        value={formData.outlets}
                        onChange={(e) => setFormData({ ...formData, outlets: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "11px 14px",
                          borderRadius: "10px",
                          border: "1px solid #cbd5e1",
                          fontSize: "14px",
                          outline: "none",
                          backgroundColor: "#ffffff",
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

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                      How can we help you? *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about your locations, expected monthly customer volume, or any specific questions..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "11px 14px",
                        borderRadius: "10px",
                        border: "1px solid #cbd5e1",
                        fontSize: "14px",
                        outline: "none",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "13px",
                      borderRadius: "10px",
                      backgroundColor: "#004ac6",
                      color: "#ffffff",
                      fontSize: "15px",
                      fontWeight: "700",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 6px 18px rgba(0, 74, 198, 0.25)",
                    }}
                  >
                    <Send size={16} />
                    <span>Submit Request</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};
export default ContactPage;
