import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Calculator, 
  TrendingUp, 
  ShieldCheck, 
  QrCode, 
  Star, 
  ArrowRight, 
  Sparkles,
  Building,
  Check
} from "lucide-react";
import { motion } from "framer-motion";

export const InteractiveDemo = () => {
  const [customersPerMonth, setCustomersPerMonth] = useState(450);
  const [businessName, setBusinessName] = useState("Apex Dental & Orthodontics");

  // Calculations
  const estimatedPositiveReviews = Math.round(customersPerMonth * 0.28);
  const estimatedDeflectedComplaints = Math.round(customersPerMonth * 0.04);
  const estimatedRevenueBoost = Math.round(estimatedPositiveReviews * 450);

  return (
    <section
      id="demo"
      style={{
        padding: "40px 0 48px",
        backgroundColor: "#f8fafc",
        borderTop: "1px solid #f1f5f9",
        borderBottom: "1px solid #f1f5f9",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Section Header */}
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 18px" }}>
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
            Calculate Your Customer Feedback &amp; Review Growth Potential
          </h2>
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.5,
              color: "#64748b",
            }}
          >
            See how many genuine 5-star reviews Bizorm can generate each month across 20+ platforms while resolving private complaints directly with customers.
          </p>
        </div>

        {/* Interactive Calculator Container */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "18px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 30px -8px rgba(0, 74, 198, 0.06)",
            padding: "24px 22px",
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "28px",
          }}
          className="demo-grid"
        >
          {/* Controls Side */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ marginBottom: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
                <label style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>
                  Monthly Customer Footfall / Invoices:
                </label>
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "24px",
                    fontWeight: "800",
                    color: "#004ac6",
                  }}
                >
                  {customersPerMonth.toLocaleString()} customers
                </span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="50"
                max="2500"
                step="50"
                value={customersPerMonth}
                onChange={(e) => setCustomersPerMonth(Number(e.target.value))}
                style={{
                  width: "100%",
                  height: "8px",
                  borderRadius: "6px",
                  background: `linear-gradient(to right, #004ac6 0%, #004ac6 ${
                    ((customersPerMonth - 50) / (2500 - 50)) * 100
                  }%, #e2e8f0 ${((customersPerMonth - 50) / (2500 - 50)) * 100}%, #e2e8f0 100%)`,
                  appearance: "none",
                  cursor: "pointer",
                  outline: "none",
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#94a3b8", marginTop: "8px" }}>
                <span>50 / mo (Boutique)</span>
                <span>1,000 / mo (Busy Clinic)</span>
                <span>2,500+ / mo (Chain / High Street)</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "32px" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b", alignSelf: "center", marginRight: "4px" }}>
                Quick Presets:
              </span>
              {[
                { label: "Clinic (200/mo)", val: 200 },
                { label: "Restaurant (600/mo)", val: 600 },
                { label: "Retail / Salon (1,200/mo)", val: 1200 },
              ].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCustomersPerMonth(p.val)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "8px",
                    backgroundColor: customersPerMonth === p.val ? "#004ac6" : "#f1f5f9",
                    color: customersPerMonth === p.val ? "#ffffff" : "#334155",
                    border: "none",
                    fontSize: "12.5px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Guaranteed Deliverables Checklist */}
            <div
              style={{
                backgroundColor: "#f8fafc",
                borderRadius: "14px",
                border: "1px solid #e2e8f0",
                padding: "20px",
              }}
            >
              <h4 style={{ fontSize: "13.5px", fontWeight: "700", color: "#0f172a", marginBottom: "12px" }}>
                What Bizorm Delivers Every Month:
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  "Automated WhatsApp & SMS review prompts with zero staff manual effort",
                  "Printable high-density Acrylic Counter QR Standee with your center logo",
                  "Unhappy customers gated from Google Maps and routed to management",
                  "CSV customer contact list upload for instant batch invites",
                ].map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#475569" }}>
                    <div style={{ width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "#10b981", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                      <Check size={10} strokeWidth={3} />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Results Side (Cards & Impact) */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              justifyContent: "center",
            }}
          >
            {/* Projected Metric 1 */}
            <motion.div
              whileHover={{ y: -4, scale: 1.01, boxShadow: "0 12px 28px -6px rgba(0, 74, 198, 0.15)" }}
              transition={{ duration: 0.2 }}
              style={{
                backgroundColor: "#f0f3ff",
                borderRadius: "16px",
                border: "1.5px solid #004ac6",
                padding: "24px 28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <div>
                <span style={{ fontSize: "12.5px", fontWeight: "700", color: "#004ac6", textTransform: "uppercase" }}>
                  Projected 5-Star Growth
                </span>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginTop: "2px" }}>
                  New 5-Star Google Reviews
                </h3>
                <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                  Real customers routed straight to Google Maps
                </p>
              </div>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "38px",
                  fontWeight: "800",
                  color: "#004ac6",
                  textAlign: "right",
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                +{estimatedPositiveReviews}
                <div style={{ fontSize: "11px", fontWeight: "600", color: "#64748b" }}>per month</div>
              </div>
            </motion.div>

            {/* Projected Metric 2 */}
            <motion.div
              whileHover={{ y: -4, scale: 1.01, boxShadow: "0 12px 28px -6px rgba(239, 68, 68, 0.15)" }}
              transition={{ duration: 0.2 }}
              style={{
                backgroundColor: "#fef2f2",
                borderRadius: "16px",
                border: "1px solid #fecaca",
                padding: "24px 28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <div>
                <span style={{ fontSize: "12.5px", fontWeight: "700", color: "#ef4444", textTransform: "uppercase" }}>
                  Service Recovery
                </span>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginTop: "2px" }}>
                  Private Complaints Resolved
                </h3>
                <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                  Customer issues addressed directly before escalating publicly
                </p>
              </div>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "38px",
                  fontWeight: "800",
                  color: "#ef4444",
                  textAlign: "right",
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                ~{estimatedDeflectedComplaints}
                <div style={{ fontSize: "11px", fontWeight: "600", color: "#64748b" }}>resolved / mo</div>
              </div>
            </motion.div>

            {/* CTA in Calculator */}
            <div style={{ marginTop: "10px" }}>
              <Link
                to="/register"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  width: "100%",
                  padding: "16px",
                  borderRadius: "12px",
                  backgroundColor: "#004ac6",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: "700",
                  textDecoration: "none",
                  boxShadow: "0 8px 24px rgba(0, 74, 198, 0.25)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#004ac6")}
              >
                <span>Claim Your 7-Day Free Trial & Start Growing</span>
                <ArrowRight size={18} />
              </Link>
              <p style={{ textAlign: "center", fontSize: "12px", color: "#94a3b8", marginTop: "8px" }}>
                ✓ Includes all features · Instant activation · Cancel anytime
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default InteractiveDemo;
