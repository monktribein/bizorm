import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check, Star, Zap, Building2, Layers, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../services/api";

export const PricingSection = ({ hideHeader = false }) => {
  const [activeTab, setActiveTab] = useState("single"); // "single" | "multiple" | "annual"
  const [livePackages, setLivePackages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch live packages from backend if available
  useEffect(() => {
    const fetchLive = async () => {
      try {
        setLoading(true);
        const res = await api.getActivePricing();
        if (res.success && Array.isArray(res.packages) && res.packages.length > 0) {
          setLivePackages(res.packages);
        }
      } catch (err) {
        // Fallback gracefully to default static list
      } finally {
        setLoading(false);
      }
    };
    fetchLive();
  }, []);

  // Default Single Business Packages (BizORM Business™ Blueprint)
  const defaultSinglePlans = [
    {
      _id: "trial-single",
      packageName: "Free Trial (7 Days)",
      category: "Trial",
      price: 0,
      billingType: "7 Days",
      businessType: "single",
      reviewLimit: 100,
      maxBusinesses: 1,
      popularBadge: false,
      featuresList: [
        "7 Days Full Access Free Trial",
        "100 Valid QR Scans Included",
        "1 Business Location / Branch",
        "Up to 5 Review Platform Destinations",
        "Dynamic Branded QR Standee (300 DPI)",
        "AI Feedback Writing Assistant",
        "Private Complaint Management",
      ],
      ctaText: "Start 7-Day Free Trial",
    },
    {
      _id: "starter-single",
      packageName: "Starter Plan",
      category: "Standard",
      price: 499,
      billingType: "Monthly",
      businessType: "single",
      reviewLimit: 500,
      maxBusinesses: 1,
      popularBadge: false,
      featuresList: [
        "500 Valid QR Scans / Month",
        "1 Business Location / Branch",
        "5 Review Platform Destinations",
        "Dynamic Branded QR Standee (300 DPI)",
        "Basic AI Feedback Assistant",
        "Real-Time Feedback Dashboard",
        "WhatsApp Campaign Add-on Available",
      ],
      ctaText: "Start 7-Day Free Trial",
    },
    {
      _id: "growth-single",
      packageName: "Growth Professional",
      category: "Popular",
      price: 999,
      billingType: "Monthly",
      businessType: "single",
      reviewLimit: 1000,
      maxBusinesses: 1,
      popularBadge: true,
      featuresList: [
        "1,000 Valid QR Scans / Month",
        "1 Business Location + Staff Logins",
        "10 Review Platform Destinations",
        "Standard AI Sentiment & Review Assistant",
        "Custom Feedback Survey Builder",
        "Staff Performance Attribution",
        "Complaint Escalation & Resolution",
        "Priority WhatsApp & Phone Support",
      ],
      ctaText: "Start 7-Day Free Trial",
    },
    {
      _id: "pro-single",
      packageName: "Business Pro",
      category: "High Volume",
      price: 2499,
      billingType: "Monthly",
      businessType: "single",
      reviewLimit: 10000,
      maxBusinesses: 1,
      popularBadge: false,
      featuresList: [
        "10,000 Valid QR Scans / Month",
        "1 Flagship Business Location",
        "Up to 20 Review Platform Destinations",
        "Advanced AI Review & Complaint Intelligence",
        "Full Custom Survey Builder & Staff Scoring",
        "Automated Review Follow-ups & Campaigns",
        "Complete Audit Logs & CSV Data Export",
        "24/7 Dedicated Account Support",
      ],
      ctaText: "Start 7-Day Free Trial",
    },
  ];

  // Default Franchise & Multi-Outlet Packages (BizORM Enterprise™ Blueprint)
  const defaultMultiPlans = [
    {
      _id: "franchise-10",
      packageName: "Franchise 10",
      category: "Standard",
      price: 24999,
      billingType: "Yearly",
      periodLabel: "/year",
      businessType: "multiple",
      reviewLimit: 10000,
      maxBusinesses: 10,
      popularBadge: false,
      featuresList: [
        "Up to 10 Outlets / Franchise Locations",
        "10,000 Pooled Valid Scans / Month",
        "Head Office Centralized Command Center",
        "Individual Branded QR for Each Outlet",
        "Up to 20 Review Platform Destinations",
        "Outlet Scorecard & Performance Ranking",
        "Basic Complaint Assignment & Tracking",
        "Bulk QR Code Generation",
      ],
      ctaText: "Choose Franchise 10",
    },
    {
      _id: "franchise-25",
      packageName: "Franchise 25",
      category: "Recommended",
      price: 49999,
      billingType: "Yearly",
      periodLabel: "/year",
      businessType: "multiple",
      reviewLimit: 25000,
      maxBusinesses: 25,
      popularBadge: true,
      featuresList: [
        "Up to 25 Outlets / Franchise Locations",
        "25,000 Pooled Valid Scans / Month",
        "Head Office Command Center + Scorecards",
        "Regional Manager Access & Territory RBAC",
        "Complaint Escalation & Resolution SLAs",
        "AI Sentiment & Outlier Detection",
        "Monthly Franchise Health Score™",
        "Priority Onboarding & Dedicated Support",
      ],
      ctaText: "Choose Franchise 25",
    },
    {
      _id: "franchise-50",
      packageName: "Franchise 50",
      category: "Enterprise",
      price: 89999,
      billingType: "Yearly",
      periodLabel: "/year",
      businessType: "multiple",
      reviewLimit: 50000,
      maxBusinesses: 50,
      popularBadge: false,
      featuresList: [
        "Up to 50 Outlets / Franchise Locations",
        "50,000 Pooled Valid Scans / Month",
        "Full Enterprise HQ Multi-Territory Command",
        "Multi-Tier RBAC (HQ, Regional, Store)",
        "Advanced SLA Escalation Engine",
        "AI Executive Summary for Leadership",
        "Custom Survey Templates by Branch",
        "API Integration & Webhook Support",
      ],
      ctaText: "Choose Franchise 50",
    },
    {
      _id: "franchise-100",
      packageName: "Franchise 100",
      category: "Enterprise Plus",
      price: 149999,
      billingType: "Yearly",
      periodLabel: "/year",
      businessType: "multiple",
      reviewLimit: 100000,
      maxBusinesses: 100,
      popularBadge: false,
      featuresList: [
        "Up to 100 Outlets / Large Chain",
        "1,00,000 Pooled Valid Scans / Month",
        "Complete Franchise Intelligence Platform",
        "Franchise Health Score™ Calibrated Index",
        "Custom Integrations (POS, Billing, CRM)",
        "Dedicated Enterprise Account Director",
        "Usage-Based High-Volume WhatsApp Messaging",
        "Custom SLA & 99.9% Uptime Guarantee",
      ],
      ctaText: "Choose Franchise 100",
    },
  ];

  // Annual GST Plans (from bizorm.com)
  const annualGstPlans = [
    {
      _id: "gst-essential",
      packageName: "Essential",
      category: "Standard",
      price: 955,
      billingType: "Yearly",
      periodLabel: "/+ GST Per Year",
      businessType: "annual",
      reviewLimit: 100,
      maxBusinesses: 1,
      popularBadge: false,
      featuresList: [
        "5 Email Review Invites",
        "40 SMS Review Invites",
        "5 WhatsApp Review Invites",
        "5 Review Platforms (Google, etc.)",
        "Smart Routing (1-3★ Gated, 4-5★ Public)",
        "Real-time Analytics Dashboard",
        "Standard Email Support",
      ],
      ctaText: "Start 7-Day Free Trial",
    },
    {
      _id: "gst-premium",
      packageName: "Premium Plan",
      category: "Popular",
      price: 5550,
      billingType: "Yearly",
      periodLabel: "/+ GST Per Year",
      businessType: "annual",
      reviewLimit: 500,
      maxBusinesses: 1,
      popularBadge: true,
      featuresList: [
        "10 Email Review Invites",
        "100 SMS Review Invites",
        "10 WhatsApp Review Invites",
        "10 Review Platforms",
        "Smart Routing & Private Star Shield",
        "Printable 300 DPI Counter Standee",
        "Bulk CSV Customer Import",
        "Priority Support via Phone & WhatsApp",
      ],
      ctaText: "Start 7-Day Free Trial",
    },
    {
      _id: "gst-premium-plus",
      packageName: "Premium Plus",
      category: "Enterprise",
      price: 9550,
      billingType: "Yearly",
      periodLabel: "/+ GST Per Year",
      businessType: "annual",
      reviewLimit: 1000,
      maxBusinesses: 1,
      popularBadge: false,
      featuresList: [
        "20 Email Review Invites",
        "200 SMS Review Invites",
        "20 WhatsApp Review Invites",
        "20 Review Platforms",
        "Smart Routing & Private Complaint Inbox",
        "Dynamic Multi-QR Standee Generator",
        "Competitor Review Benchmarking",
        "Dedicated Account Growth Manager",
      ],
      ctaText: "Start 7-Day Free Trial",
    },
  ];

  // Determine which list to render
  let displayPlans = [];
  if (activeTab === "single") {
    const liveSingle = livePackages.filter((p) => p.businessType === "single");
    displayPlans = liveSingle.length > 0 ? liveSingle : defaultSinglePlans;
  } else if (activeTab === "multiple") {
    const liveMulti = livePackages.filter((p) => p.businessType === "multiple");
    displayPlans = liveMulti.length > 0 ? liveMulti : defaultMultiPlans;
  } else {
    displayPlans = annualGstPlans;
  }

  return (
    <section
      id="pricing"
      style={{
        padding: hideHeader ? "10px 0 32px" : "28px 0 36px",
        backgroundColor: "#f0f3ff",
      }}
    >
      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        {/* Section Header */}
        {!hideHeader && (
          <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 16px" }}>
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(22px, 3vw, 30px)",
                fontWeight: "800",
                color: "#0f172a",
                lineHeight: 1.2,
                marginBottom: "6px",
              }}
            >
              Transparent Plans for Every Business Stage
            </h2>
            <p
              style={{
                fontSize: "14.5px",
                lineHeight: 1.5,
                color: "#64748b",
                margin: "0 auto",
              }}
            >
              Choose the best plan for your business. All packages include our <strong>7-Day Free Trial</strong> with instant access.
            </p>
          </div>
        )}

        {/* 3 Categories Navigation Tabs - Single Clean Row */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              padding: "4px",
              border: "1px solid #dee8ff",
              boxShadow: "0 2px 8px rgba(0, 74, 198, 0.05)",
              gap: "4px",
              maxWidth: "100%",
              overflowX: "auto",
            }}
          >
            {/* Single Business Tab */}
            <button
              type="button"
              onClick={() => setActiveTab("single")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 14px",
                borderRadius: "8px",
                border: "none",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                whiteSpace: "nowrap",
                backgroundColor: activeTab === "single" ? "#004ac6" : "transparent",
                color: activeTab === "single" ? "#ffffff" : "#475569",
                transition: "all 0.15s ease",
              }}
            >
              <Building2 size={15} />
              <span>BizORM Business™</span>
              <span
                style={{
                  fontSize: "10.5px",
                  fontWeight: "800",
                  backgroundColor: activeTab === "single" ? "rgba(255,255,255,0.25)" : "#f1f5f9",
                  color: activeTab === "single" ? "#ffffff" : "#64748b",
                  padding: "1px 5px",
                  borderRadius: "5px",
                }}
              >
                Single Store
              </span>
            </button>

            {/* Franchise & Multi-Outlet Tab */}
            <button
              type="button"
              onClick={() => setActiveTab("multiple")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 14px",
                borderRadius: "8px",
                border: "none",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                whiteSpace: "nowrap",
                backgroundColor: activeTab === "multiple" ? "#004ac6" : "transparent",
                color: activeTab === "multiple" ? "#ffffff" : "#475569",
                transition: "all 0.15s ease",
              }}
            >
              <Layers size={15} />
              <span>BizORM Enterprise™</span>
              <span
                style={{
                  fontSize: "10.5px",
                  fontWeight: "800",
                  backgroundColor: activeTab === "multiple" ? "rgba(255,255,255,0.25)" : "#eff6ff",
                  color: activeTab === "multiple" ? "#ffffff" : "#004ac6",
                  padding: "1px 6px",
                  borderRadius: "5px",
                }}
              >
                Franchise Networks
              </span>
            </button>

            {/* Annual GST Tab */}
            <button
              type="button"
              onClick={() => setActiveTab("annual")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 14px",
                borderRadius: "8px",
                border: "none",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                whiteSpace: "nowrap",
                backgroundColor: activeTab === "annual" ? "#004ac6" : "transparent",
                color: activeTab === "annual" ? "#ffffff" : "#475569",
                transition: "all 0.15s ease",
              }}
            >
              <Zap size={14} />
              <span>Annual GST</span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  backgroundColor: activeTab === "annual" ? "#ffffff" : "#dbeafe",
                  color: "#004ac6",
                  padding: "1px 6px",
                  borderRadius: "4px",
                }}
              >
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "18px",
            alignItems: "stretch",
          }}
        >
          {displayPlans.map((pkg, idx) => {
            const isPopular = pkg.popularBadge || pkg.category === "Popular";
            const priceLabel = pkg.price === 0 ? "₹0" : `₹${Number(pkg.price).toLocaleString()}`;
            const periodLabel = pkg.periodLabel || (pkg.billingType === "7 Days" ? "/7 Days" : "/Monthly");

            return (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{
                  y: -8,
                  boxShadow: isPopular
                    ? "0 20px 48px -8px rgba(0, 74, 198, 0.24)"
                    : "0 16px 36px -6px rgba(0, 74, 198, 0.12)",
                  borderColor: isPopular ? "#004ac6" : "#93c5fd",
                  transition: { duration: 0.2 }
                }}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  border: isPopular ? "2px solid #004ac6" : "1px solid #dee8ff",
                  boxShadow: isPopular
                    ? "0 12px 30px -8px rgba(0, 74, 198, 0.14)"
                    : "0 4px 16px -2px rgba(0, 74, 198, 0.04)",
                  padding: "20px 18px",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  cursor: "default",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
              >
                {/* Popular Ribbon */}
                {isPopular && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-11px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "#004ac6",
                      color: "#ffffff",
                      fontSize: "10px",
                      fontWeight: "800",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      padding: "2px 10px",
                      borderRadius: "6px",
                      boxShadow: "0 2px 8px rgba(0, 74, 198, 0.25)",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Sparkles size={11} />
                    <span>MOST POPULAR</span>
                  </div>
                )}

                {/* Top Category & Branch Badge */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span
                    style={{
                      fontSize: "10.5px",
                      fontWeight: "800",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: isPopular ? "#004ac6" : "#64748b",
                      backgroundColor: isPopular ? "#eff6ff" : "#f1f5f9",
                      padding: "2px 7px",
                      borderRadius: "5px",
                    }}
                  >
                    {pkg.category || "STANDARD"}
                  </span>
                  <span
                    style={{
                      fontSize: "10.5px",
                      fontWeight: "700",
                      color: "#64748b",
                      backgroundColor: "#f8fafc",
                      padding: "2px 7px",
                      borderRadius: "5px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    {pkg.maxBusinesses ? `${pkg.maxBusinesses} ${pkg.maxBusinesses > 1 ? "Branches" : "Branch"}` : "1 Branch"}
                  </span>
                </div>

                {/* Package Name */}
                <h3
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "17px",
                    fontWeight: "800",
                    color: "#0f172a",
                    marginBottom: "8px",
                    lineHeight: 1.25,
                  }}
                >
                  {pkg.packageName}
                </h3>

                {/* Price */}
                <div style={{ marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "3px" }}>
                    <span
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: "28px",
                        fontWeight: "800",
                        color: isPopular ? "#004ac6" : "#0f172a",
                        lineHeight: 1,
                      }}
                    >
                      {priceLabel}
                    </span>
                    <span style={{ fontSize: "12.5px", fontWeight: "600", color: "#64748b" }}>
                      {periodLabel}
                    </span>
                  </div>
                  {pkg.extraBizPrice > 0 && (
                    <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                      +₹{pkg.extraBizPrice}/mo for extra branches
                    </div>
                  )}
                </div>

                {/* Review Limit Highlight Box */}
                <div
                  style={{
                    backgroundColor: "#f0f3ff",
                    border: "1px solid #dee8ff",
                    borderRadius: "8px",
                    padding: "7px 10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "12px",
                  }}
                >
                  <Zap size={14} color="#004ac6" />
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#004ac6" }}>
                    {pkg.billingType === "7 Days" || pkg.category === "Trial"
                      ? `${pkg.reviewLimit || 100} Reviews Included`
                      : `${pkg.reviewLimit || 500} Monthly Reviews Included`}
                  </span>
                </div>

                {/* Features Checklist */}
                <div style={{ flex: 1, marginBottom: "16px" }}>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "7px" }}>
                    {(pkg.featuresList || []).map((feat, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "7px", fontSize: "12px", color: "#334155", lineHeight: 1.4 }}>
                        <div
                          style={{
                            width: "15px",
                            height: "15px",
                            borderRadius: "50%",
                            backgroundColor: "#ecfdf5",
                            color: "#10b981",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            marginTop: "2px",
                          }}
                        >
                          <Check size={10} strokeWidth={3} />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action CTA Button */}
                <Link
                  to={`/register?plan=${pkg._id}&businessType=${pkg.businessType || "single"}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: "700",
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                    backgroundColor: isPopular ? "#004ac6" : "#ffffff",
                    color: isPopular ? "#ffffff" : "#004ac6",
                    border: isPopular ? "none" : "1.5px solid #004ac6",
                  }}
                >
                  <span>{pkg.price === 0 ? "Start Free 7-Day Trial" : (pkg.ctaText || "Get Started")}</span>
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Transparent Blueprint Disclosures */}
        <div
          style={{
            marginTop: "24px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "14px",
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            padding: "18px 20px",
          }}
        >
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "6px", backgroundColor: "#eff6ff", color: "#004ac6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
              <Check size={14} strokeWidth={2.5} />
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", margin: "0 0 2px" }}>Fair-Use Valid Scans</p>
              <p style={{ fontSize: "12px", color: "#64748b", margin: 0, lineHeight: 1.4 }}>
                Counted as 1 unique human visitor per QR code within 24 hours (with bot filtering and deduplication).
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "6px", backgroundColor: "#ecfdf5", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
              <Check size={14} strokeWidth={2.5} />
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", margin: "0 0 2px" }}>Pooled Franchise Allowance</p>
              <p style={{ fontSize: "12px", color: "#64748b", margin: 0, lineHeight: 1.4 }}>
                Enterprise scans pool across your network so high-traffic outlets never hit artificial limits.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "6px", backgroundColor: "#fffbeb", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
              <Check size={14} strokeWidth={2.5} />
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", margin: "0 0 2px" }}>WhatsApp Usage Rates</p>
              <p style={{ fontSize: "12px", color: "#64748b", margin: 0, lineHeight: 1.4 }}>
                Transparent ₹0.75–₹1.00/message for customer feedback invitations and opted-in service recovery.
              </p>
            </div>
          </div>
        </div>

        {/* Footnote */}
        <div
          style={{
            marginTop: "16px",
            textAlign: "center",
            padding: "12px 18px",
            borderRadius: "10px",
            backgroundColor: "#ffffff",
            border: "1px solid #dee8ff",
            maxWidth: "720px",
            margin: "16px auto 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#e7eeff", color: "#004ac6", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={13} />
          </div>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
            Need a custom enterprise setup for 100+ franchise locations?
          </span>
          <Link to="/contact?type=enterprise" style={{ fontSize: "13px", fontWeight: "700", color: "#004ac6", textDecoration: "none" }}>
            Contact Enterprise Sales →
          </Link>
        </div>
      </div>
    </section>
  );
};
export default PricingSection;
