import React from "react";
import { Link } from "react-router-dom";
import { LandingNavbar } from "../../components/landing/Navbar";
import { LandingFooter } from "../../components/landing/Footer";
import { PricingSection } from "../../components/landing/PricingSection";
import { FaqSection } from "../../components/landing/FaqSection";
import {
  Building2,
  Layers,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Award,
  Sparkles,
  Users,
  QrCode,
  MapPin,
  Clock,
  Compass,
} from "lucide-react";
import { motion } from "framer-motion";

export const FranchisePage = () => {
  const pillars = [
    {
      icon: Building2,
      tag: "Command Center",
      title: "Head Office Command Center",
      desc: "Get a consolidated bird's-eye view of customer satisfaction across all 10, 50, or 200+ franchise outlets. Instant alerts when an outlet's service dips.",
    },
    {
      icon: Award,
      tag: "Franchise Health Score™",
      title: "Calibrated Outlet Scorecards",
      desc: "Rank every branch by CSAT, complaint resolution speed, service consistency, and feedback participation. Hold regional managers and franchisees accountable.",
    },
    {
      icon: Users,
      tag: "Territory Permissions",
      title: "Multi-Tier Role-Based Access (RBAC)",
      desc: "Assign Regional Directors to territories (e.g. North, West) and Store Managers to single branches, keeping corporate HQ data strictly protected.",
    },
    {
      icon: AlertTriangle,
      tag: "SLA Management",
      title: "Complaint Escalation Engine",
      desc: "Set automatic response deadlines. Unresolved private customer feedback escalates up the management ladder before it spills onto public platforms.",
    },
    {
      icon: QrCode,
      tag: "Fast Onboarding",
      title: "Bulk QR Code Generation",
      desc: "Generate 100+ unique, 300 DPI print-ready acrylic counter standees for every outlet in minutes, linked directly to individual branch dashboards.",
    },
    {
      icon: Compass,
      tag: "Pooled Quota",
      title: "Network-Wide Pooled Scans",
      desc: "High-traffic flagship outlets draw from a single corporate quota without individual location caps or operational lockouts.",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <LandingNavbar />

      {/* Hero Section */}
      <section
        style={{
          paddingTop: "clamp(120px, 10vw, 140px)",
          paddingBottom: "56px",
          background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "400px",
            background: "radial-gradient(circle, rgba(0, 74, 198, 0.25) 0%, rgba(15, 23, 42, 0) 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: "center", maxWidth: "860px", margin: "0 auto" }}
          >
            

            <h1
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(32px, 4.5vw, 52px)",
                fontWeight: "800",
                lineHeight: 1.2,
                letterSpacing: "-0.03em",
                marginBottom: "20px",
                color: "#ffffff",
              }}
            >
              One Brand. Every Outlet.{" "}
              <span style={{ color: "#60a5fa" }}>Complete Customer Experience Visibility.</span>
            </h1>

            <p style={{ fontSize: "clamp(15px, 1.8vw, 18px)", lineHeight: 1.6, color: "#cbd5e1", marginBottom: "32px" }}>
              Give corporate leadership and regional directors the centralized intelligence needed to monitor service quality, compare outlet scorecards, and resolve complaints across every franchise location.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
              <Link
                to="/contact?type=enterprise"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 28px",
                  borderRadius: "12px",
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: "700",
                  textDecoration: "none",
                  boxShadow: "0 8px 24px rgba(37, 99, 235, 0.4)",
                }}
              >
                <span>Schedule Enterprise Demo</span>
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/register?businessType=multiple"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "14px 24px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.2)",
                  fontSize: "15px",
                  fontWeight: "700",
                  textDecoration: "none",
                }}
              >
                Start Multi-Outlet Trial
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6 Enterprise Pillars Grid */}
      <section style={{ padding: "64px 0", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 40px" }}>
            <h2 style={{ fontSize: "clamp(24px, 3.2vw, 32px)", fontWeight: "800", color: "#0f172a", marginBottom: "10px" }}>
              Engineered Specifically for Franchise Operations
            </h2>
            <p style={{ fontSize: "15px", color: "#64748b" }}>
              Move beyond basic store-level review links. Standardize customer satisfaction monitoring across your entire retail, restaurant, hospital, or clinic footprint.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "24px" }}>
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  style={{
                    padding: "26px",
                    borderRadius: "16px",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <div style={{ width: "42px", height: "42px", borderRadius: "10px", backgroundColor: "#eff6ff", color: "#004ac6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={22} />
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "#004ac6", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {p.tag}
                  </span>
                  <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: "13.5px", color: "#475569", lineHeight: 1.5, margin: 0 }}>
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Franchise Pricing Preview */}
      <PricingSection hideHeader={false} />

      <FaqSection />
      <LandingFooter />
    </div>
  );
};

export default FranchisePage;
