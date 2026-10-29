import React from "react";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Target, 
  ArrowRight,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

export const AboutSection = () => {
  const principles = [
    {
      icon: ShieldCheck,
      title: "Reputation Protection First",
      text: "Every business encounters tough days. We ensure private concerns reach leadership immediately so you can fix mistakes before public ratings suffer.",
    },
    {
      icon: Target,
      title: "Zero-Friction Customer Experience",
      text: "No annoying app installs or mandatory registrations. Customers scan a clean QR standee or tap a WhatsApp link and rate in under 5 seconds.",
    },
  ];

  return (
    <section
      id="about"
      style={{
        padding: "44px 0 52px",
        backgroundColor: "#ffffff",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "36px",
            alignItems: "stretch",
          }}
          className="about-grid"
        >
          {/* Left Column: Brand Story */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "clamp(24px, 3.2vw, 32px)",
                  fontWeight: "800",
                  color: "#0f172a",
                  lineHeight: 1.2,
                  marginBottom: "12px",
                  letterSpacing: "-0.02em",
                }}
              >
                Built to Give Business Owners Complete Control Over Their Reputation.
              </h2>

              <p style={{ fontSize: "14.5px", lineHeight: 1.6, color: "#475569", marginBottom: "12px" }}>
                In today's digital landscape, over <strong>88% of customers check Google Reviews</strong> before choosing a doctor, restaurant, salon, or retail store. Yet most businesses suffer from a persistent imbalance: happy customers leave silently, while a single disgruntled customer posts a damaging 1-star review on Google Maps.
              </p>

              <p style={{ fontSize: "14.5px", lineHeight: 1.6, color: "#475569", marginBottom: "18px" }}>
                <strong>BizORM</strong> was created to bridge this gap. By uniting dynamic 300 DPI QR standees, multi-platform review management, and real-time private escalation alerts, we make it effortless for satisfied customers to leave verified reviews while giving leadership immediate visibility into service concerns.
              </p>
            </div>

            {/* Core Stats Bar */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
                padding: "14px 16px",
                borderRadius: "14px",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                marginBottom: "18px",
              }}
              className="about-stats-bar"
            >
              <div>
                <div style={{ fontSize: "26px", fontWeight: "800", color: "#004ac6", fontFamily: "'Plus Jakarta Sans'" }}>
                  2,400+
                </div>
                <div style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", marginTop: "2px" }}>
                  Active Businesses
                </div>
              </div>
              <div>
                <div style={{ fontSize: "26px", fontWeight: "800", color: "#10b981", fontFamily: "'Plus Jakarta Sans'" }}>
                  4.9 ★
                </div>
                <div style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", marginTop: "2px" }}>
                  Average Rating Achieved
                </div>
              </div>
              <div>
                <div style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", fontFamily: "'Plus Jakarta Sans'" }}>
                  99.9%
                </div>
                <div style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", marginTop: "2px" }}>
                  Platform Uptime
                </div>
              </div>
            </div>

            <Link
              to="/about"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14.5px",
                fontWeight: "700",
                color: "#004ac6",
                textDecoration: "none",
              }}
            >
              <span>Read our complete company mission &amp; vision</span>
              <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Right Column: Exactly 2 Core Cards Matching Left Height */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              justifyContent: "space-between",
            }}
          >
            {principles.map((p, idx) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{
                    y: -4,
                    backgroundColor: "#ffffff",
                    borderColor: "#004ac6",
                    boxShadow: "0 12px 28px -6px rgba(0, 74, 198, 0.12)",
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    backgroundColor: "#f8fafc",
                    borderRadius: "18px",
                    border: "1px solid #e2e8f0",
                    padding: "26px 24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    flex: 1,
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.02)",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      backgroundColor: "#e7eeff",
                      color: "#004ac6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "14px",
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 style={{ fontSize: "17.5px", fontWeight: "800", color: "#0f172a", marginBottom: "8px", lineHeight: 1.3 }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                    {p.text}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
