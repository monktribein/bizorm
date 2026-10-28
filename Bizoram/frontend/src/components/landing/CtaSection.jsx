import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const CtaSection = () => {
  return (
    <section
      style={{
        padding: "24px 0 48px",
        backgroundColor: "#ffffff",
      }}
    >
      <div
        style={{
          maxWidth: "1140px",
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
            backgroundImage: "radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.4) 0%, transparent 60%), radial-gradient(circle at 90% 80%, rgba(30, 64, 175, 0.5) 0%, transparent 60%)",
            borderRadius: "20px",
            padding: "clamp(28px, 4vw, 44px) 24px",
            textAlign: "center",
            color: "#ffffff",
            boxShadow: "0 16px 45px -12px rgba(0, 74, 198, 0.35)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle Decorative Star Circles */}
          <div
            style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "220px",
              height: "220px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              pointerEvents: "none",
            }}
          />

          <div style={{ maxWidth: "700px", margin: "0 auto", position: "relative", zIndex: 1 }}>

            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(24px, 3.5vw, 36px)",
                fontWeight: "800",
                lineHeight: 1.18,
                marginBottom: "12px",
                letterSpacing: "-0.02em",
              }}
            >
              Ready to take control of your reputation?
            </h2>

            <p
              style={{
                fontSize: "15.5px",
                lineHeight: 1.5,
                color: "rgba(255, 255, 255, 0.9)",
                marginBottom: "24px",
              }}
            >
              Start collecting genuine 5-star Google reviews today with a <strong>free 7-day trial</strong>. 
              No credit card required. Free SMS, email & WhatsApp credits included.
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
                  borderRadius: "12px",
                  backgroundColor: "#ffffff",
                  color: "#004ac6",
                  fontSize: "16px",
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
                <span>Start My 7-Day Free Trial</span>
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/pricing"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "16px 28px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  color: "#ffffff",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  fontSize: "15px",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.22)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.12)")}
              >
                View Plans & Pricing
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
                color: "rgba(255, 255, 255, 0.85)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={16} />
                <span>No credit card required</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={16} />
                <span>Cancel anytime in 1-click</span>
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
