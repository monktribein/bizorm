import React from "react";
import { QrCode, Star, ThumbsUp, ShieldAlert, ArrowRight, MessageSquare, Send } from "lucide-react";
import { motion } from "framer-motion";

export const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      style={{
        padding: "40px 0 48px",
        backgroundColor: "#f0f3ff",
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 20px" }}>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(22px, 3.2vw, 30px)",
              fontWeight: "800",
              color: "#0f172a",
              lineHeight: 1.2,
              marginBottom: "8px",
            }}
          >
            How Smart Routing Works
          </h2>
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.5,
              color: "#64748b",
            }}
          >
            One frictionless rating decides the customer journey — public 5-star praise goes directly to Google Maps, while private concerns come straight to your management inbox.
          </p>
        </div>

        {/* 3 Step Flow Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "18px",
            alignItems: "stretch",
          }}
        >
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{
              y: -7,
              boxShadow: "0 16px 36px -6px rgba(0, 74, 198, 0.12)",
              borderColor: "#004ac6",
              transition: { duration: 0.2 }
            }}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "24px 20px",
              border: "1px solid #dee8ff",
              boxShadow: "0 6px 20px -4px rgba(0, 74, 198, 0.04)",
              display: "flex",
              flexDirection: "column",
              cursor: "default",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "46px",
                height: "46px",
                borderRadius: "12px",
                backgroundColor: "#eff6ff",
                color: "#004ac6",
                marginBottom: "16px",
              }}
            >
              <QrCode size={26} />
            </motion.div>
            <div
              style={{
                fontSize: "11.5px",
                fontWeight: "700",
                color: "#004ac6",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "4px",
              }}
            >
              Step 01
            </div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#0f172a",
                marginBottom: "8px",
              }}
            >
              Customer Opens Link
            </h3>
            <p style={{ fontSize: "13.5px", color: "#64748b", lineHeight: 1.5, marginBottom: "16px" }}>
              Customers simply scan an acrylic counter standee QR code or tap a custom review invite sent over WhatsApp, SMS, or Email.
            </p>
            <div
              style={{
                marginTop: "auto",
                padding: "8px 12px",
                borderRadius: "8px",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
                color: "#475569",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Send size={13} color="#004ac6" />
              <span>Zero app install needed · Mobile-first</span>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{
              y: -7,
              boxShadow: "0 16px 36px -6px rgba(245, 158, 11, 0.16)",
              borderColor: "#f59e0b",
              transition: { duration: 0.2 }
            }}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "24px 20px",
              border: "1px solid #dee8ff",
              boxShadow: "0 6px 20px -4px rgba(0, 74, 198, 0.04)",
              display: "flex",
              flexDirection: "column",
              cursor: "default",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "46px",
                height: "46px",
                borderRadius: "12px",
                backgroundColor: "#fffbeb",
                color: "#f59e0b",
                marginBottom: "16px",
              }}
            >
              <Star size={24} />
            </motion.div>
            <div
              style={{
                fontSize: "11.5px",
                fontWeight: "700",
                color: "#d97706",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "4px",
              }}
            >
              Step 02
            </div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#0f172a",
                marginBottom: "8px",
              }}
            >
              They Select a Star Rating
            </h3>
            <p style={{ fontSize: "13.5px", color: "#64748b", lineHeight: 1.5, marginBottom: "16px" }}>
              A lightning-fast, 1-click star experience (1 to 5 stars). No tedious forms or mandatory registrations upfront to discourage feedback.
            </p>
            <div
              style={{
                marginTop: "auto",
                padding: "8px 12px",
                borderRadius: "8px",
                backgroundColor: "#fffbeb",
                border: "1px solid #fef3c7",
                fontSize: "12px",
                color: "#b45309",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Star size={13} fill="#f59e0b" color="#f59e0b" />
              <span>Takes less than 5 seconds to complete</span>
            </div>
          </motion.div>

          {/* Step 3: Two Split Paths */}
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{
              y: -7,
              boxShadow: "0 18px 40px -6px rgba(0, 74, 198, 0.16)",
              transition: { duration: 0.2 }
            }}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "22px 18px",
              border: "1.5px solid #004ac6",
              boxShadow: "0 8px 24px -4px rgba(0, 74, 198, 0.1)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              cursor: "default",
              transition: "box-shadow 0.2s",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: "700",
                color: "#004ac6",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Step 03 · Smart Bifurcation
            </div>

            {/* Path A: Happy */}
            <div
              style={{
                padding: "16px",
                borderRadius: "12px",
                backgroundColor: "#ecfdf5",
                border: "1px solid #a7f3d0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: "#10b981",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <ThumbsUp size={14} />
                </div>
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#065f46" }}>
                    4 & 5 Stars → Public Boost
                  </h4>
                </div>
              </div>
              <p style={{ fontSize: "12.5px", color: "#047857", lineHeight: 1.45, paddingLeft: "38px" }}>
                Routed directly to Google Maps, TripAdvisor or Facebook with auto-copied praise!
              </p>
            </div>

            {/* Path B: Unhappy */}
            <div
              style={{
                padding: "16px",
                borderRadius: "12px",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: "#ef4444",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <ShieldAlert size={14} />
                </div>
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#991b1b" }}>
                    1 to 3 Stars → Private Shield
                  </h4>
                </div>
              </div>
              <p style={{ fontSize: "12.5px", color: "#b91c1c", lineHeight: 1.45, paddingLeft: "38px" }}>
                Kept strictly internal. Customer shares complaint privately so you resolve it and keep 5★ online!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default HowItWorks;
