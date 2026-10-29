import React from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Award,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

export const FranchiseIntelligenceSection = () => {
  const pillars = [
    {
      icon: Building2,
      tag: "Command Center",
      title: "Head Office Command Center",
      desc: "Consolidated bird's-eye view of customer satisfaction across all 5, 25, or 100+ branches. Instant alerts when any outlet's rating drops.",
      color: "#004ac6",
      bg: "#eff6ff",
    },
    {
      icon: Award,
      tag: "Franchise Health Score™",
      title: "Calibrated Outlet Scorecards",
      desc: "Rank every branch by CSAT, complaint resolution speed, and feedback volume. Hold store managers and regional teams accountable.",
      color: "#059669",
      bg: "#ecfdf5",
    },
    {
      icon: Users,
      tag: "Territory RBAC",
      title: "Multi-Tier Role-Based Access",
      desc: "Assign Regional Directors to territories (North, West) and Store Managers to single branches, keeping corporate data strictly secure.",
      color: "#7c3aed",
      bg: "#f5f3ff",
    },
    {
      icon: Compass,
      tag: "Pooled Allowances",
      title: "Network-Wide Pooled Scans",
      desc: "High-traffic flagship outlets draw from a single corporate scan quota, preventing location lockouts or administrative overhead.",
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px", marginBottom: "40px" }}>
          <div style={{ maxWidth: "700px" }}>
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
              Scale Across 5 to 50+ Branches With Complete Centralized Governance
            </h2>
            <p style={{ fontSize: "15px", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
              Give corporate head office real-time reputation visibility, outlet scorecards, and territory RBAC while allowing local branch managers to resolve customer feedback on the spot.
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
