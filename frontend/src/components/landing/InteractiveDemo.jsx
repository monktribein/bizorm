import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calculator, TrendingUp, ShieldCheck, QrCode, Star, ArrowRight, Sparkles, HelpCircle, Info } from "lucide-react";
import { motion } from "framer-motion";

export const InteractiveDemo = () => {
  const [footfall, setFootfall] = useState(600);
  const [avgTicket, setAvgTicket] = useState(850);
  const [engagementRate, setEngagementRate] = useState(25); // 25%

  // Calculation Methodology (Transparent Empirical Formulas)
  const monthlyScans = Math.round((footfall * engagementRate) / 100);
  const positiveReviews = Math.round(monthlyScans * 0.72); // 72% rate 4-5 stars
  const deflectedComplaints = Math.round(monthlyScans * 0.14); // 14% rate 1-3 stars
  const revenueSafeguarded = Math.round(deflectedComplaints * avgTicket * 2.5); // 2.5 repeat visits saved

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
        {/* Section Header */}
        <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 36px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#004ac6", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
            <Calculator size={15} />
            <span>INTERACTIVE ROI SIMULATOR</span>
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
            Calculate Your Review Growth &amp; Customer Retention Potential
          </h2>
          <p style={{ fontSize: "15px", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
            See how converting in-store customer footfall into verified Google reviews and private complaint resolution impacts your bottom line.
          </p>
        </div>

        {/* Main Grid: Inputs vs Output Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px", alignItems: "stretch" }}>
          {/* Left: Transparent Inputs */}
          <div className="card" style={{ padding: "28px", background: "#ffffff", borderRadius: "20px" }}>
            <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", marginBottom: "20px" }}>
              1. Your Business Parameters
            </h3>

            {/* Slider 1: Footfall */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{ fontSize: "13.5px", fontWeight: "700", color: "#334155" }}>
                  Monthly Footfall / Customers:
                </label>
                <span style={{ fontSize: "16px", fontWeight: "800", color: "#004ac6" }}>
                  {footfall.toLocaleString("en-IN")} visitors
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="50"
                value={footfall}
                onChange={(e) => setFootfall(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#004ac6" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                <span>100 visitors</span>
                <span>2,500</span>
                <span>5,000 visitors</span>
              </div>
            </div>

            {/* Slider 2: Average Ticket Size */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{ fontSize: "13.5px", fontWeight: "700", color: "#334155" }}>
                  Average Customer Spend / Bill Size:
                </label>
                <span style={{ fontSize: "16px", fontWeight: "800", color: "#059669" }}>
                  ₹{avgTicket.toLocaleString("en-IN")}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="50"
                value={avgTicket}
                onChange={(e) => setAvgTicket(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#059669" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                <span>₹100</span>
                <span>₹2,500</span>
                <span>₹5,000</span>
              </div>
            </div>

            {/* Slider 3: Scan Engagement Rate */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{ fontSize: "13.5px", fontWeight: "700", color: "#334155" }}>
                  Estimated QR Standee Scan Rate:
                </label>
                <span style={{ fontSize: "16px", fontWeight: "800", color: "#7c3aed" }}>
                  {engagementRate}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={engagementRate}
                onChange={(e) => setEngagementRate(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#7c3aed" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                <span>10% (Passive)</span>
                <span>25% (Standard Standee)</span>
                <span>50% (Staff Assisted)</span>
              </div>
            </div>

            {/* Methodology Explainer Box */}
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px", color: "#475569" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", color: "#0f172a", marginBottom: "6px" }}>
                <Info size={14} color="#004ac6" />
                <span>Calculation Methodology:</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: "16px", lineHeight: 1.5 }}>
                <li><strong>Est. Monthly Scans</strong> = Footfall ({footfall}) × Scan Rate ({engagementRate}%) = {monthlyScans} valid scans</li>
                <li><strong>Public Verified Reviews</strong> = ~72% of positive respondents guided to Google Reviews</li>
                <li><strong>Direct Service Recovery</strong> = ~14% customer concerns routed directly to store managers</li>
              </ul>
            </div>
          </div>

          {/* Right: Projected Outcomes */}
          <div
            className="card"
            style={{
              padding: "28px",
              background: "linear-gradient(145deg, #0f172a 0%, #1e293b 100%)",
              color: "#ffffff",
              borderRadius: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: "12px", fontWeight: "800", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
                2. Projected 30-Day Value Created
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#ffffff", margin: "0 0 20px 0" }}>
                Monthly Customer Experience Lift
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div style={{ background: "rgba(255,255,255,0.06)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#38bdf8", fontSize: "12px", fontWeight: "700" }}>
                    <QrCode size={14} />
                    <span>VALID SCANS</span>
                  </div>
                  <div style={{ fontSize: "28px", fontWeight: "900", color: "#ffffff", marginTop: "6px" }}>
                    {monthlyScans}
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>Per month</div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.06)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#fbbf24", fontSize: "12px", fontWeight: "700" }}>
                    <Star size={14} fill="#fbbf24" />
                    <span>NEW GOOGLE 5★</span>
                  </div>
                  <div style={{ fontSize: "28px", fontWeight: "900", color: "#ffffff", marginTop: "6px" }}>
                    +{positiveReviews}
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>Authentic reviews</div>
                </div>
              </div>

              <div style={{ background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "14px", padding: "16px", marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "700", color: "#34d399", textTransform: "uppercase" }}>
                      Private Issues Recovered &amp; Resolved
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: "900", color: "#ffffff", marginTop: "2px" }}>
                      {deflectedComplaints} Customer Concerns
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>Estimated Customer Retention:</div>
                    <div style={{ fontSize: "18px", fontWeight: "800", color: "#34d399" }}>
                      +₹{revenueSafeguarded.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
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
                  boxShadow: "0 6px 20px rgba(0, 74, 198, 0.4)",
                  textDecoration: "none",
                }}
              >
                <span>Capture This Growth (Start 7-Day Trial)</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Illustrative Results Disclaimer Required by Audit */}
        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "11.5px", color: "#94a3b8", lineHeight: 1.5 }}>
          <strong>Disclaimer:</strong> Illustrative projection based on empirical customer engagement benchmarks. Actual scan rates and review conversions depend on physical standee visibility, staff verbal encouragement, and industry vertical.
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;
