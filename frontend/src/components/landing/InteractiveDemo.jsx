import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calculator, QrCode, Star, ArrowRight, MessageSquare, Info, ShieldCheck, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";

export const InteractiveDemo = () => {
  const [footfall, setFootfall] = useState(600);
  const [scanRate, setScanRate] = useState(20); // 20% estimated scan engagement

  // Transparent Empirical Calculation Formulas
  // 1. Valid QR Scans: deduplicated scans of physical standees / links
  const projectedScans = Math.round((footfall * scanRate) / 100);

  // 2. Feedback Submissions: ~70% of customers who scan complete feedback
  const feedbackSubmissions = Math.round(projectedScans * 0.7);

  // 3. Neutral Public Review Choice: ~40% of customers choose to post publicly on Google / external platforms
  const publicReviewChoices = Math.round(feedbackSubmissions * 0.45);

  // 4. Service Recovery Inquiries: ~18% express private concerns or service requests handled directly
  const serviceRecoveryInquiries = Math.round(feedbackSubmissions * 0.18);

  const handleSliderChange = (setter, value, metric) => {
    setter(value);
    // Custom non-PII analytics tracking event (QA-12 compliant)
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "calculator_interact", {
        metric_name: metric,
        metric_value: value,
      });
    }
  };

  return (
    <section
      id="demo"
      style={{
        padding: "64px 0",
        backgroundColor: "#f8fafc",
        borderTop: "1px solid #f1f5f9",
        borderBottom: "1px solid #f1f5f9",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        {/* Section Header: Approved Title per Spec Section 10 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto 36px" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "#0052cc",
              fontSize: "12px",
              fontWeight: "800",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "8px",
            }}
          >
            <Calculator size={15} />
            <span>OPERATIONAL IMPACT SIMULATOR</span>
          </div>
          <h2
            className="font-outfit"
            style={{
              fontSize: "clamp(24px, 3.2vw, 36px)",
              fontWeight: "900",
              color: "#0f172a",
              lineHeight: 1.2,
              margin: "0 0 10px 0",
            }}
          >
            Customer Feedback &amp; Experience Impact Calculator
          </h2>
          <p style={{ fontSize: "15px", color: "#64748b", margin: 0, lineHeight: 1.55 }}>
            Simulate how converting in-store customer footfall into valid QR scans and feedback submissions drives real-time issue recovery and neutral public review engagement.
          </p>
        </motion.div>

        {/* Main Grid: Inputs vs Output Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "28px",
            alignItems: "stretch",
          }}
        >
          {/* Left: Input Parameters & Methodology */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            style={{
              padding: "28px",
              background: "#ffffff",
              borderRadius: "20px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", marginBottom: "20px" }}>
                1. Footfall &amp; Engagement Inputs
              </h3>

              {/* Slider 1: Footfall */}
              <div style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label style={{ fontSize: "13.5px", fontWeight: "700", color: "#334155" }}>
                    Monthly Customer Footfall:
                  </label>
                  <span style={{ fontSize: "16px", fontWeight: "800", color: "#0052cc" }}>
                    {footfall.toLocaleString("en-IN")} visitors
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="50"
                  value={footfall}
                  onChange={(e) => handleSliderChange(setFootfall, Number(e.target.value), "footfall")}
                  style={{ width: "100%", accentColor: "#0052cc" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                  <span>100 visitors</span>
                  <span>2,500</span>
                  <span>5,000 visitors</span>
                </div>
              </div>

              {/* Slider 2: Estimated QR Scan Engagement Rate */}
              <div style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label style={{ fontSize: "13.5px", fontWeight: "700", color: "#334155" }}>
                    Estimated QR Standee Scan Rate:
                  </label>
                  <span style={{ fontSize: "16px", fontWeight: "800", color: "#7c3aed" }}>
                    {scanRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="5"
                  value={scanRate}
                  onChange={(e) => handleSliderChange(setScanRate, Number(e.target.value), "scan_rate")}
                  style={{ width: "100%", accentColor: "#7c3aed" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                  <span>5% (Passive Counter)</span>
                  <span>20% (Prominent Standee)</span>
                  <span>40% (Staff Encouraged)</span>
                </div>
              </div>
            </div>

            {/* Methodology Explainer Box */}
            <div
              style={{
                background: "#f8fafc",
                padding: "16px",
                borderRadius: "14px",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
                color: "#475569",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "800", color: "#0f172a", marginBottom: "6px" }}>
                <Info size={14} color="#0052cc" />
                <span>Transparent Calculation Assumptions:</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: "18px", lineHeight: 1.6 }}>
                <li>
                  <strong>Valid QR Scans</strong> = Footfall ({footfall}) × Scan Rate ({scanRate}%) = <strong>{projectedScans} scans/mo</strong>.
                </li>
                <li>
                  <strong>Feedback Submissions</strong> = ~70% completion rate among scanning customers = <strong>{feedbackSubmissions} submissions</strong>.
                </li>
                <li>
                  <strong>Public Review Choices</strong> = Neutral opt-in to post on Google / external platforms (~45% of respondents) = <strong>{publicReviewChoices} reviews</strong>.
                </li>
                <li>
                  <strong>Service Inquiries Handled</strong> = Concerns and suggestions routed for immediate management resolution = <strong>{serviceRecoveryInquiries} tickets</strong>.
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Right: Projected Operational Outcomes */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
            style={{
              padding: "28px",
              background: "linear-gradient(145deg, #0f172a 0%, #1e293b 100%)",
              color: "#ffffff",
              borderRadius: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 12px 36px rgba(15, 23, 42, 0.16)",
            }}
          >
            <div>
              <div style={{ fontSize: "11.5px", fontWeight: "800", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
                2. Illustrative 30-Day Projections
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#ffffff", margin: "0 0 20px 0" }}>
                Projected Monthly Experience Lift
              </h3>

              {/* 2 Top Metric Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  style={{ background: "rgba(255,255,255,0.06)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", transition: "all 0.2s ease" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#38bdf8", fontSize: "11.5px", fontWeight: "700" }}>
                    <QrCode size={14} />
                    <span>VALID SCANS</span>
                  </div>
                  <motion.div
                    key={projectedScans}
                    initial={{ scale: 0.9, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{ fontSize: "28px", fontWeight: "900", color: "#ffffff", marginTop: "6px" }}
                  >
                    {projectedScans}
                  </motion.div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>Scans / month</div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  style={{ background: "rgba(255,255,255,0.06)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", transition: "all 0.2s ease" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#fbbf24", fontSize: "11.5px", fontWeight: "700" }}>
                    <Star size={14} fill="#fbbf24" />
                    <span>PUBLIC REVIEWS</span>
                  </div>
                  <motion.div
                    key={publicReviewChoices}
                    initial={{ scale: 0.9, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{ fontSize: "28px", fontWeight: "900", color: "#ffffff", marginTop: "6px" }}
                  >
                    ~{publicReviewChoices}
                  </motion.div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>Public review choices</div>
                </motion.div>
              </div>

              {/* Middle Metric Card: Service Recovery Tickets */}
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                style={{
                  background: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "14px",
                  padding: "16px",
                  marginBottom: "20px",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "11.5px", fontWeight: "700", color: "#34d399", textTransform: "uppercase" }}>
                      Private Issues Recovered &amp; Resolved
                    </div>
                    <motion.div
                      key={serviceRecoveryInquiries}
                      initial={{ scale: 0.9, opacity: 0.7 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      style={{ fontSize: "20px", fontWeight: "900", color: "#ffffff", marginTop: "2px" }}
                    >
                      ~{serviceRecoveryInquiries} Customer Inquiries
                    </motion.div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>Feedback Completed:</div>
                    <motion.div
                      key={feedbackSubmissions}
                      initial={{ scale: 0.9, opacity: 0.7 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      style={{ fontSize: "18px", fontWeight: "800", color: "#34d399" }}
                    >
                      {feedbackSubmissions}
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Distinction reminder */}
              <div style={{ fontSize: "11.5px", color: "#94a3b8", lineHeight: 1.45, marginBottom: "20px" }}>
                * Differentiates valid QR scans, completed feedback, and public review transitions. External reviews are voluntary customer actions.
              </div>
            </div>

            <div>
              <Link
                to="/register"
                className="btn btn-primary"
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  fontWeight: "700",
                  fontSize: "14.5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 6px 20px rgba(0, 82, 204, 0.4)",
                  textDecoration: "none",
                }}
              >
                <span>Start 7-Day Free Trial (100 Scans)</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Visible Disclaimer Required by Audit */}
        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "11.5px", color: "#94a3b8", lineHeight: 1.6, maxWidth: "900px", margin: "24px auto 0" }}>
          <strong>Methodology &amp; Illustrative Result Disclaimer:</strong> This simulator provides hypothetical, illustrative projections based on empirical engagement averages. It does not promise causal review growth or financial return. Actual scan engagement and customer review selections depend on physical standee placement, staff verbal invitation, service quality, and patron choice.
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;
