import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Star, Building2, Store, Sparkles, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const PricingSection = ({ hideHeader = false }) => {
  const [activeTab, setActiveTab] = useState("business"); // "business" | "enterprise"
  const [annualBilling, setAnnualBilling] = useState(true);

  // Business Plans (Single Location) - Exact Approved Spec
  const businessPlans = [
    {
      id: "starter",
      name: "Starter",
      tagline: "For small single-counter shops & local practices",
      monthlyPrice: 299,
      annualPrice: 2990,
      scans: "100 valid scans/month",
      locations: "1 business location",
      platforms: "5 review platforms",
      features: [
        "100 valid scans/month",
        "1 business location",
        "5 review platforms",
        "Branded QR feedback standee (300 DPI)",
        "Basic analytics & feedback logs",
        "Email notifications for negative ratings",
      ],
      popular: false,
      cta: "Choose Plan",
    },
    {
      id: "growth",
      name: "Growth",
      tagline: "For active clinics, cafes & busy retail counters",
      monthlyPrice: 999,
      annualPrice: 9990,
      scans: "1,000 valid scans/month",
      locations: "1 business location",
      platforms: "10 review platforms",
      features: [
        "1,000 valid scans/month",
        "1 business location",
        "10 review platforms",
        "Feedback and complaint tracking",
        "Expanded analytics & rating velocity",
        "Private complaint resolution workflow",
        "Priority email & WhatsApp support",
      ],
      popular: true,
      cta: "Choose Plan",
    },
    {
      id: "professional",
      name: "Professional",
      tagline: "For established practices, salons & high-footfall venues",
      monthlyPrice: 1499,
      annualPrice: 14990,
      scans: "3,000 valid scans/month",
      locations: "1 business location",
      platforms: "15 review platforms",
      features: [
        "3,000 valid scans/month",
        "1 business location",
        "15 review platforms",
        "Staff attribution & performance scoring",
        "Advanced reporting & CSV data exports",
        "Custom feedback question builder",
        "Automated customer recovery links",
      ],
      popular: false,
      cta: "Choose Plan",
    },
    {
      id: "business-pro",
      name: "Business Pro",
      tagline: "For high-volume flagship outlets & demanding brands",
      monthlyPrice: 2499,
      annualPrice: 24990,
      scans: "10,000 valid scans/month",
      locations: "1 business location",
      platforms: "20 review platforms",
      features: [
        "10,000 valid scans/month",
        "1 business location",
        "20 review platforms",
        "Automation features & webhook alerts",
        "Advanced insights & sentiment clustering",
        "Multi-staff accounts & custom QR tags",
        "Dedicated account onboarding",
      ],
      popular: false,
      cta: "Choose Plan",
    },
  ];

  // Enterprise Plans (Multi-Outlet Franchise & Corporate) - Complete Transparent Pricing
  const enterprisePlans = [
    {
      id: "franchise-10",
      name: "Franchise 10",
      tagline: "For regional chains with up to 10 outlets",
      monthlyPrice: 7999,
      annualPrice: 79990,
      scans: "25,000 Pooled Valid Scans / Month",
      locations: "Up to 10 Locations Included",
      features: [
        "Complete subscription for 10 branches",
        "25,000 pooled valid scans/month across all outlets",
        "Central Head-Office Command Center",
        "Individual Store Manager access & logins",
        "Regional SLA escalation engine",
        "Branch-by-branch comparative analytics",
        "Bulk printable acrylic standee kit",
      ],
      popular: false,
      cta: "Select Franchise 10",
    },
    {
      id: "franchise-25",
      name: "Franchise 25",
      tagline: "For growing retail & hospitality franchise networks",
      monthlyPrice: 16999,
      annualPrice: 169990,
      scans: "75,000 Pooled Valid Scans / Month",
      locations: "Up to 25 Locations Included",
      features: [
        "Complete subscription for 25 branches",
        "75,000 pooled valid scans/month across network",
        "Franchise Health Score™ & outlet rankings",
        "Multi-tier territory roles (Regional Directors & Branch Staff)",
        "Audit logs & centralized survey compliance",
        "Automated daily/weekly executive email digests",
        "Priority corporate phone & WhatsApp support",
      ],
      popular: true,
      cta: "Select Franchise 25",
    },
    {
      id: "franchise-50",
      name: "Franchise 50",
      tagline: "For national franchise brands with up to 50 outlets",
      monthlyPrice: 29999,
      annualPrice: 299990,
      scans: "175,000 Pooled Valid Scans / Month",
      locations: "Up to 50 Locations Included",
      features: [
        "Complete subscription for 50 branches",
        "175,000 pooled valid scans/month across network",
        "Multi-brand governance & sub-franchise hierarchies",
        "Automated bulk QR dispatch & acrylic standee production",
        "Advanced complaint root-cause AI clustering",
        "Quarterly business review with reputation strategists",
        "Dedicated Customer Success Manager",
      ],
      popular: false,
      cta: "Select Franchise 50",
    },
    {
      id: "franchise-corporate",
      name: "Franchise 100 / Corporate",
      tagline: "For large enterprise chains & multi-brand conglomerates",
      monthlyPrice: "Custom",
      annualPrice: "Custom",
      scans: "500,000+ Pooled Valid Scans / Month",
      locations: "100+ Locations & Custom Scale",
      features: [
        "Unlimited branches & custom location tiers",
        "Tailored high-volume pooled scan quotas",
        "Custom ERP, POS, and CRM API integrations",
        "Custom enterprise SLAs & contractual data governance",
        "On-premise or dedicated private cloud deployment options",
        "Dedicated Account Director & executive training",
      ],
      popular: false,
      cta: "Contact Enterprise Sales",
    },
  ];

  const currentPlans = activeTab === "business" ? businessPlans : enterprisePlans;

  return (
    <section
      id="pricing"
      style={{
        padding: hideHeader ? "20px 0 64px" : "64px 0 72px",
        backgroundColor: "#ffffff",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        {/* Section Header */}
        {!hideHeader && (
          <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 36px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#004ac6", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
              <Sparkles size={15} />
              <span>TRANSPARENT SCAN-BASED PRICING</span>
            </div>
            <h2
              className="font-outfit"
              style={{
                fontSize: "clamp(26px, 3.5vw, 38px)",
                fontWeight: "900",
                color: "#0f172a",
                lineHeight: 1.2,
                margin: "0 0 10px 0",
              }}
            >
              Plans for Every Business Stage
            </h2>
            <p style={{ fontSize: "15.5px", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
              Approved commercial direction built on <strong>valid QR scans</strong> and transparent quotas. No hidden per-review fees.
            </p>
          </div>
        )}

        {/* Category & Billing Toggles */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
          {/* Business vs Enterprise Segment Toggle */}
          <div style={{ display: "inline-flex", background: "#f1f5f9", padding: "4px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <button
              type="button"
              onClick={() => setActiveTab("business")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 22px",
                borderRadius: "8px",
                border: "none",
                background: activeTab === "business" ? "#ffffff" : "transparent",
                color: activeTab === "business" ? "#004ac6" : "#64748b",
                fontWeight: "700",
                fontSize: "13.5px",
                cursor: "pointer",
                boxShadow: activeTab === "business" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              <Store size={16} />
              <span>Single Business Locations</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("enterprise")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 22px",
                borderRadius: "8px",
                border: "none",
                background: activeTab === "enterprise" ? "#ffffff" : "transparent",
                color: activeTab === "enterprise" ? "#004ac6" : "#64748b",
                fontWeight: "700",
                fontSize: "13.5px",
                cursor: "pointer",
                boxShadow: activeTab === "enterprise" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              <Building2 size={16} />
              <span>Multi-Outlet Franchises &amp; Corporate</span>
            </button>
          </div>

          {/* Monthly / Annual Billing Toggle */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", background: "#f8fafc", padding: "4px 8px", borderRadius: "999px", border: "1px solid #e2e8f0" }}>
            <button
              type="button"
              onClick={() => setAnnualBilling(false)}
              style={{
                padding: "6px 16px",
                borderRadius: "999px",
                border: "none",
                background: !annualBilling ? "#004ac6" : "transparent",
                color: !annualBilling ? "#ffffff" : "#475569",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setAnnualBilling(true)}
              style={{
                padding: "6px 16px",
                borderRadius: "999px",
                border: "none",
                background: annualBilling ? "#004ac6" : "transparent",
                color: annualBilling ? "#ffffff" : "#475569",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>Annual Billing (2 Months Free)</span>
              <span style={{ fontSize: "10.5px", background: "#10b981", color: "#fff", padding: "1px 6px", borderRadius: "999px", fontWeight: "800" }}>
                SAVE 17%
              </span>
            </button>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px", alignItems: "stretch" }}>
          {currentPlans.map((plan) => {
            const isNumeric = typeof plan.monthlyPrice === "number";
            const price = isNumeric
              ? annualBilling
                ? `₹${plan.annualPrice.toLocaleString("en-IN")}`
                : `₹${plan.monthlyPrice.toLocaleString("en-IN")}`
              : "Custom";

            const cycle = isNumeric ? (annualBilling ? "/year" : "/mo") : "";

            return (
              <motion.div
                key={plan.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.15 }}
                style={{
                  background: "#ffffff",
                  borderRadius: "20px",
                  padding: "32px 24px",
                  border: plan.popular ? "2px solid #004ac6" : "1px solid #e2e8f0",
                  boxShadow: plan.popular
                    ? "0 12px 30px rgba(0, 74, 198, 0.12)"
                    : "0 4px 14px rgba(0, 0, 0, 0.04)",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {plan.popular && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-12px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#004ac6",
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: "800",
                      padding: "3px 14px",
                      borderRadius: "999px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    MOST POPULAR
                  </div>
                )}

                <div style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>
                  {plan.name}
                </div>
                <div style={{ fontSize: "12px", color: "#64748b", minHeight: "32px", marginBottom: "16px", lineHeight: 1.4 }}>
                  {plan.tagline}
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "36px", fontWeight: "900", color: "#0f172a", letterSpacing: "-0.5px" }}>
                    {price}
                  </span>
                  <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>{cycle}</span>
                </div>

                {/* Quota Highlights Box */}
                <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "10px 14px", marginBottom: "20px", border: "1px solid #f1f5f9" }}>
                  <div style={{ fontSize: "13px", fontWeight: "800", color: "#004ac6" }}>
                    🔍 {plan.scans}
                  </div>
                  <div style={{ fontSize: "12px", color: "#475569", marginTop: "2px", fontWeight: "600" }}>
                    📍 {plan.locations}
                  </div>
                </div>

                {/* Features List */}
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px 0", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {plan.features.map((f, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "12.5px", color: "#334155", lineHeight: 1.4 }}>
                      <Check size={15} color="#059669" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className={plan.popular ? "btn btn-primary" : "btn btn-outline"}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "10px",
                    fontWeight: "700",
                    fontSize: "13.5px",
                    textAlign: "center",
                    textDecoration: "none",
                  }}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Mandatory Commercial Disclaimers from Audit Spec */}
        <div style={{ marginTop: "32px", padding: "16px 20px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", textAlign: "center", fontSize: "12.5px", color: "#64748b", lineHeight: 1.5 }}>
          <div style={{ fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
            Commercial Terms &amp; Quota Policy:
          </div>
          <div>
            Interactive proposed pricing design. Prices are pending commercial sign-off; exclude GST and third-party messaging carrier charges. Annual subscriptions retain monthly scan resets.
          </div>
          <div style={{ marginTop: "4px" }}>
            Need custom volume beyond Franchise 50? <Link to="/contact" style={{ color: "#004ac6", fontWeight: "700", textDecoration: "none" }}>Contact our Enterprise Sales team →</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
