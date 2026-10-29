import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export const CtaSection = () => {
  return (
    <section
      id="cta"
      style={{
        padding: "36px 0 64px",
        backgroundColor: "#ffffff",
      }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: "#004ac6",
            backgroundImage: "radial-gradient(circle at 15% 20%, rgba(59, 130, 246, 0.45) 0%, transparent 60%), radial-gradient(circle at 85% 80%, rgba(30, 64, 175, 0.6) 0%, transparent 60%)",
            borderRadius: "24px",
            padding: "clamp(36px, 5vw, 56px) 28px",
            textAlign: "center",
            color: "#ffffff",
            boxShadow: "0 20px 50px -12px rgba(0, 74, 198, 0.38)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle Decorative Ambient Circles */}
          <div
            style={{
              position: "absolute",
              top: "-60px",
              right: "-60px",
              width: "240px",
              height: "240px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.07)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-40px",
              left: "-40px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              pointerEvents: "none",
            }}
          />

          <div style={{ maxWidth: "760px", margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 14px",
                borderRadius: "9999px",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: "700",
                marginBottom: "14px",
                backdropFilter: "blur(6px)",
              }}
            >
              <Sparkles size={14} />
              <span>Instant Setup · Ready for Single &amp; Multi-Outlet Brands</span>
            </div>

            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(26px, 3.8vw, 40px)",
                fontWeight: "900",
                lineHeight: 1.16,
                marginBottom: "14px",
                letterSpacing: "-0.02em",
              }}
            >
              Ready to Strengthen Your Brand Reputation?
            </h2>

            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.55,
                color: "rgba(255, 255, 255, 0.92)",
                marginBottom: "28px",
              }}
            >
              Start collecting authentic customer feedback and expanding verified reviews today with a <strong>7-day free trial</strong>. 
              No credit card required. Includes 100 valid QR scans and full access to printable acrylic standees.
            </p>

            {/* CTA Buttons */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "14px",
                justifyContent: "center",
                marginBottom: "28px",
              }}
            >
              <Link
                to="/register"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  padding: "16px 36px",
                  borderRadius: "9999px",
                  backgroundColor: "#ffffff",
                  color: "#004ac6",
                  fontSize: "15.5px",
                  fontWeight: "800",
                  textDecoration: "none",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f0f3ff";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                  e.currentTarget.style.transform = "translateY(0)";
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
                  padding: "16px 30px",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  color: "#ffffff",
                  border: "1.5px solid rgba(255, 255, 255, 0.35)",
                  fontSize: "15px",
                  fontWeight: "700",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.22)";
                  e.currentTarget.style.borderColor = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.12)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.35)";
                }}
              >
                <Calendar size={16} />
                <span>Book Franchise Demo</span>
              </Link>
            </div>

            {/* Trust Checks */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "24px",
                fontSize: "13.5px",
                color: "rgba(255, 255, 255, 0.88)",
                fontWeight: "600",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={16} />
                <span>No credit card required</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={16} />
                <span>100 valid scans included</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={16} />
                <span>300 DPI acrylic standees ready</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
