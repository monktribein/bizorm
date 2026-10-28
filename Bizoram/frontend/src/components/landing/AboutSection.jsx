import React from "react";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Target, 
  Users2, 
  HeartHandshake, 
  TrendingUp, 
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
    {
      icon: TrendingUp,
      title: "Measurable SEO & Revenue Lift",
      text: "A 0.5-star increase on Google Maps increases local walk-in traffic by an average of 19%. Bizorm directly impacts local search engine prominence.",
    },
    {
      icon: HeartHandshake,
      title: "Genuine Human Relationships",
      text: "Feedback is not just a metric — it's an opportunity to turn a disappointed visitor into a lifelong loyal advocate through prompt private resolution.",
    },
  ];

  return (
    <section
      id="about"
      style={{
        padding: "40px 0 48px",
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
            alignItems: "center",
          }}
          className="about-grid"
        >
          {/* Left Column: Brand Story */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(22px, 3.2vw, 30px)",
                fontWeight: "800",
                color: "#0f172a",
                lineHeight: 1.2,
                marginBottom: "10px",
              }}
            >
              Built to Give Business Owners Complete Control Over Their Reputation.
            </h2>

            <p style={{ fontSize: "14.5px", lineHeight: 1.6, color: "#475569", marginBottom: "12px" }}>
              In today's digital landscape, over <strong>88% of customers check Google Reviews</strong> before choosing a doctor, restaurant, salon, or retail store. Yet most businesses suffer from a persistent imbalance: happy customers leave silently, while a single disgruntled customer posts a damaging 1-star review on Google Maps.
            </p>

            <p style={{ fontSize: "14.5px", lineHeight: 1.6, color: "#475569", marginBottom: "18px" }}>
              <strong>Bizorm</strong> was created to bridge this gap. By uniting dynamic QR standees, WhatsApp invitations, and our proprietary <strong>Smart Review Gate</strong>, we make it effortless for satisfied customers to leave 5-star praise on Google, while channeling negative feedback privately to your team.
            </p>

            {/* Core Stats Bar */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
                padding: "14px 16px",
                borderRadius: "12px",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                marginBottom: "20px",
              }}
            >
              <div>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "#004ac6", fontFamily: "'Plus Jakarta Sans'" }}>
                  2,400+
                </div>
                <div style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", marginTop: "2px" }}>
                  Active Businesses
                </div>
              </div>
              <div>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "#10b981", fontFamily: "'Plus Jakarta Sans'" }}>
                  4.9 ★
                </div>
                <div style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", marginTop: "2px" }}>
                  Average Rating Achieved
                </div>
              </div>
              <div>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", fontFamily: "'Plus Jakarta Sans'" }}>
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
                fontSize: "15px",
                fontWeight: "700",
                color: "#004ac6",
                textDecoration: "none",
              }}
            >
              <span>Read our complete company mission & vision</span>
              <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Right Column: 4 Core Pillars Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px",
            }}
          >
            {principles.map((p, idx) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  whileHover={{
                    y: -6,
                    backgroundColor: "#ffffff",
                    borderColor: "#004ac6",
                    boxShadow: "0 16px 32px -6px rgba(0, 74, 198, 0.12)",
                  }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  style={{
                    backgroundColor: "#f8fafc",
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    padding: "24px 22px",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 6 }}
                    transition={{ type: "spring", stiffness: 350 }}
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "10px",
                      backgroundColor: "#e7eeff",
                      color: "#004ac6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <Icon size={22} />
                  </motion.div>
                  <h3 style={{ fontSize: "16.5px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: "13.5px", color: "#64748b", lineHeight: 1.55 }}>
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
