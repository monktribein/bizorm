import React from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Award,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  MapPin,
  ChevronRight,
  Layers,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";

export const FranchiseIntelligenceSection = () => {
  const pillars = [
    {
      icon: Building2,
      tag: "Command Center",
      title: "Head Office Command Center",
      desc: "Consolidated bird's-eye view of customer satisfaction across all 10, 25, 50, or 100+ branches. Instant alerts when any outlet's rating or response velocity dips.",
      color: "#004ac6",
      bg: "#eff6ff",
    },
    {
      icon: Award,
      tag: "Franchise Health Score™",
      title: "Calibrated Outlet Scorecards",
      desc: "Rank every branch by CSAT, complaint resolution speed, and feedback volume. Hold store managers and regional operations heads accountable.",
      color: "#059669",
      bg: "#ecfdf5",
    },
    {
      icon: Users,
      tag: "Territory RBAC",
      title: "Multi-Tier Role-Based Access",
      desc: "Assign Regional Directors to territories (North, West, South) and Store Managers to single branches, keeping corporate HQ data strictly protected.",
      color: "#7c3aed",
      bg: "#f5f3ff",
    },
    {
      icon: Compass,
      tag: "Pooled Allowances",
      title: "Network-Wide Pooled Scans",
      desc: "High-traffic flagship outlets draw from a single pooled corporate scan allowance, preventing location lockouts or administrative billing overhead.",
      color: "#d97706",
      bg: "#fffbeb",
    },
  ];

  return (
    <section
      id="franchise"
      style={{
        padding: "64px 24px",
        background: "linear-gradient(180deg, #f0f5ff 0%, #ffffff 100%)",
        borderTop: "1px solid #e0edff",
        borderBottom: "1px solid #e0edff",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Section Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px", marginBottom: "36px" }}>
          <div style={{ maxWidth: "720px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#004ac6", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
              <Building2 size={15} />
              <span>MULTI-OUTLET FRANCHISE INTELLIGENCE™</span>
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
              Scale Across 10 to 100+ Outlets With Complete Centralized Governance
            </h2>
            <p style={{ fontSize: "15px", color: "#64748b", margin: 0, lineHeight: 1.55 }}>
              Give corporate head office real-time reputation visibility, regional scorecards, and territory RBAC while allowing local branch managers to resolve complaints on the ground.
            </p>
          </div>

          <Link
            to="/franchise"
            className="btn btn-primary"
            style={{
              padding: "12px 22px",
              fontSize: "13.5px",
              fontWeight: "700",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
            }}
          >
            <span>Explore Franchise Edition</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Corporate HQ Dashboard Visual (Requirement from Spec Section 4) */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            border: "1px solid #cbd5e1",
            boxShadow: "0 20px 45px -10px rgba(0, 82, 204, 0.12)",
            padding: "24px",
            marginBottom: "36px",
            overflow: "hidden",
          }}
        >
          {/* Corporate Header Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              borderBottom: "1px solid #f1f5f9",
              paddingBottom: "16px",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  backgroundColor: "#004ac6",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "900",
                  fontSize: "14px",
                }}
              >
                HQ
              </div>
              <div>
                <div style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>
                  Corporate Head Office Dashboard
                </div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                  Network Footprint: <strong>24 Active Outlets</strong> · 3 Regional Territories
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", background: "#ecfdf5", color: "#059669", padding: "4px 10px", borderRadius: "999px" }}>
                ● Real-Time Sync Active
              </span>
              <span style={{ fontSize: "11px", fontWeight: "700", background: "#f1f5f9", color: "#475569", padding: "4px 10px", borderRadius: "8px" }}>
                Franchise 25 Tier
              </span>
            </div>
          </div>

          {/* Metric Overview Cards: Head-Office Aggregates */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
              gap: "14px",
              marginBottom: "20px",
            }}
          >
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "11.5px", color: "#64748b", fontWeight: "600" }}>Network CSAT</div>
              <div style={{ fontSize: "22px", fontWeight: "900", color: "#0f172a", marginTop: "2px" }}>
                4.84 <span style={{ color: "#f59e0b", fontSize: "18px" }}>★</span>
              </div>
              <div style={{ fontSize: "10.5px", color: "#059669", marginTop: "2px", fontWeight: "700" }}>
                +0.3 vs last quarter
              </div>
            </div>

            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "11.5px", color: "#64748b", fontWeight: "600" }}>Pooled Scans Used</div>
              <div style={{ fontSize: "22px", fontWeight: "900", color: "#004ac6", marginTop: "2px" }}>
                58,420 <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>/ 75,000</span>
              </div>
              <div style={{ fontSize: "10.5px", color: "#64748b", marginTop: "2px" }}>
                77.9% quota consumed
              </div>
            </div>

            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "11.5px", color: "#64748b", fontWeight: "600" }}>Open Issue Escalations</div>
              <div style={{ fontSize: "22px", fontWeight: "900", color: "#dc2626", marginTop: "2px" }}>
                2 <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "500" }}>inbound tickets</span>
              </div>
              <div style={{ fontSize: "10.5px", color: "#059669", marginTop: "2px", fontWeight: "700" }}>
                100% within SLA deadline
              </div>
            </div>

            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "11.5px", color: "#64748b", fontWeight: "600" }}>Standee Deployment</div>
              <div style={{ fontSize: "22px", fontWeight: "900", color: "#059669", marginTop: "2px" }}>
                48 <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "500" }}>active standees</span>
              </div>
              <div style={{ fontSize: "10.5px", color: "#64748b", marginTop: "2px" }}>
                2 standees / counter active
              </div>
            </div>
          </div>

          {/* Regional & Branch Level Representation */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
              gap: "18px",
            }}
          >
            {/* Territory Breakdown */}
            <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "12.5px", fontWeight: "800", color: "#0f172a", marginBottom: "12px", display: "flex", justifyContent: "space-between" }}>
                <span>Regional Territory Matrix</span>
                <span style={{ fontSize: "11px", color: "#64748b" }}>RBAC Scoped</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { region: "North Region", outlets: "10 Outlets", csat: "4.9★", scans: "28,150", sla: "99.2%" },
                  { region: "West Region", outlets: "8 Outlets", csat: "4.8★", scans: "19,400", sla: "96.5%" },
                  { region: "South Region", outlets: "6 Outlets", csat: "4.7★", scans: "10,870", sla: "95.0%" },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "#ffffff", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a" }}>{r.region}</div>
                      <div style={{ fontSize: "10.5px", color: "#64748b" }}>{r.outlets} · {r.scans} scans</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "12px", fontWeight: "800", color: "#f59e0b" }}>{r.csat}</div>
                      <div style={{ fontSize: "10px", color: "#059669", fontWeight: "700" }}>{r.sla} SLA met</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Branch Level Benchmarking */}
            <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "12.5px", fontWeight: "800", color: "#0f172a", marginBottom: "12px", display: "flex", justifyContent: "space-between" }}>
                <span>Branch Performance Scorecards</span>
                <span style={{ fontSize: "11px", color: "#004ac6", fontWeight: "700" }}>Live Outlets</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { outlet: "Connaught Place, Delhi", manager: "Rajesh S.", csat: "4.95★", status: "Top 5% Performer" },
                  { outlet: "Bandra West, Mumbai", manager: "Pooja M.", csat: "4.88★", status: "Exceeding Benchmark" },
                  { outlet: "Indiranagar, Bengaluru", manager: "Karthik R.", csat: "4.82★", status: "On Track" },
                ].map((b, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "#ffffff", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a" }}>{b.outlet}</div>
                      <div style={{ fontSize: "10.5px", color: "#64748b" }}>Manager: {b.manager}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "12px", fontWeight: "800", color: "#004ac6" }}>{b.csat}</div>
                      <div style={{ fontSize: "9.5px", color: "#059669", fontWeight: "700", background: "#ecfdf5", padding: "1px 6px", borderRadius: "4px" }}>
                        {b.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillar Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "20px" }}>
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.15 }}
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "24px 20px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.03)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "10px",
                    background: p.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                  }}
                >
                  <Icon size={20} color={p.color} />
                </div>

                <div style={{ fontSize: "11px", fontWeight: "800", color: p.color, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                  {p.tag}
                </div>

                <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>
                  {p.title}
                </h3>

                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.5, margin: 0, flex: 1 }}>
                  {p.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FranchiseIntelligenceSection;
