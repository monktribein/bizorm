import React from "react";
import { QrCode, Sparkles, HeartHandshake, ArrowRight, ShieldCheck, ExternalLink, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { FEEDBACK_WORKFLOW } from "../../constants/plans";

export const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      style={{
        padding: "54px 0 60px",
        backgroundColor: "#f0f5ff",
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
        {/* Header - Mandatory Copy Section 5 */}
        <div style={{ textAlign: "center", maxWidth: "740px", margin: "0 auto 36px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "9999px",
              backgroundColor: "#dbeafe",
              color: "#004ac6",
              fontSize: "12px",
              fontWeight: "700",
              marginBottom: "12px",
            }}
          >
            <span>Smart Feedback &amp; Resolution</span>
          </div>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(24px, 3.4vw, 34px)",
              fontWeight: "800",
              color: "#0f172a",
              lineHeight: 1.2,
              marginBottom: "12px",
            }}
          >
            {FEEDBACK_WORKFLOW.sectionTitle}
          </h2>
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.6,
              color: "#475569",
              margin: 0,
            }}
          >
            {FEEDBACK_WORKFLOW.sectionSubtitle}
          </p>
        </div>

        {/* 3 Step Flow Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "24px",
            alignItems: "stretch",
          }}
        >
          {/* Step 1: Collect */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -5, boxShadow: "0 16px 36px -6px rgba(0, 82, 204, 0.12)" }}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "18px",
              padding: "28px 24px",
              border: "1px solid #dbeafe",
              boxShadow: "0 4px 18px rgba(0, 82, 204, 0.05)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#eff6ff",
                color: "#0052cc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "18px",
              }}
            >
              <QrCode size={26} />
            </div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "800",
                color: "#0052cc",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "6px",
              }}
            >
              Step 01 · {FEEDBACK_WORKFLOW.steps[0].badge}
            </div>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "800",
                color: "#0f172a",
                marginBottom: "10px",
              }}
            >
              {FEEDBACK_WORKFLOW.steps[0].title}
            </h3>
            <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.6, margin: "0 0 16px 0", flex: 1 }}>
              {FEEDBACK_WORKFLOW.steps[0].desc}
            </p>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
                color: "#475569",
              }}
            >
              ✓ 300 DPI acrylic standees or 1-click WhatsApp invites
            </div>
          </motion.div>

          {/* Step 2: Understand */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileHover={{ y: -5, boxShadow: "0 16px 36px -6px rgba(124, 58, 237, 0.12)" }}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "18px",
              padding: "28px 24px",
              border: "1px solid #e9d5ff",
              boxShadow: "0 4px 18px rgba(124, 58, 237, 0.05)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#f5f3ff",
                color: "#7c3aed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "18px",
              }}
            >
              <Sparkles size={26} />
            </div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "800",
                color: "#7c3aed",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "6px",
              }}
            >
              Step 02 · {FEEDBACK_WORKFLOW.steps[1].badge}
            </div>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "800",
                color: "#0f172a",
                marginBottom: "10px",
              }}
            >
              {FEEDBACK_WORKFLOW.steps[1].title}
            </h3>
            <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.6, margin: "0 0 16px 0", flex: 1 }}>
              {FEEDBACK_WORKFLOW.steps[1].desc}
            </p>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                backgroundColor: "#fdf4ff",
                border: "1px solid #f5d0fe",
                fontSize: "12px",
                color: "#86198f",
              }}
            >
              ✓ Neural sentiment categorizes service, hygiene &amp; staff speed
            </div>
          </motion.div>

          {/* Step 3: Improve */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ y: -5, boxShadow: "0 16px 36px -6px rgba(16, 185, 129, 0.12)" }}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "18px",
              padding: "28px 24px",
              border: "1px solid #bbf7d0",
              boxShadow: "0 4px 18px rgba(16, 185, 129, 0.05)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#ecfdf5",
                color: "#059669",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "18px",
              }}
            >
              <HeartHandshake size={26} />
            </div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "800",
                color: "#059669",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "6px",
              }}
            >
              Step 03 · {FEEDBACK_WORKFLOW.steps[2].badge}
            </div>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "800",
                color: "#0f172a",
                marginBottom: "10px",
              }}
            >
              {FEEDBACK_WORKFLOW.steps[2].title}
            </h3>
            <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.6, margin: "0 0 16px 0", flex: 1 }}>
              {FEEDBACK_WORKFLOW.steps[2].desc}
            </p>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                fontSize: "12px",
                color: "#166534",
              }}
            >
              ✓ Real-time manager triage alerts &amp; neutral public review paths
            </div>
          </motion.div>
        </div>

        {/* Neutral Customer Journey Rule Banner */}
        <div
          style={{
            marginTop: "28px",
            padding: "16px 20px",
            backgroundColor: "#ffffff",
            borderRadius: "14px",
            border: "1px solid #cbd5e1",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#eff6ff",
              color: "#0052cc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={20} />
          </div>
          <div style={{ flex: 1, minWidth: "260px" }}>
            <div style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a" }}>
              Compliant &amp; Neutral Customer Journey
            </div>
            <div style={{ fontSize: "12.5px", color: "#64748b", marginTop: "2px" }}>
              Every customer is given a neutral, unhindered opportunity to leave a public review on Google, Justdial, Facebook, etc., while private complaint handling and support tickets run in parallel.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
