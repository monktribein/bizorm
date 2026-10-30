import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Store, Building2, ShieldAlert, Info, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BUSINESS_PLANS, FRANCHISE_PLANS, PRICING_DISCLAIMERS } from "../../constants/plans";

export const PricingSection = ({ hideHeader = false }) => {
  const [activeTab, setActiveTab] = useState("business"); // "business" | "enterprise"
  const [annualBilling, setAnnualBilling] = useState(true);

  const currentPlans = activeTab === "business" ? BUSINESS_PLANS : FRANCHISE_PLANS;

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
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 36px" }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                borderRadius: "9999px",
                backgroundColor: "#eff6ff",
                border: "1px solid #bfdbfe",
                color: "#0052cc",
                fontSize: "12px",
                fontWeight: "700",
                marginBottom: "12px",
              }}
            >
              <span>Subscription &amp; Scan Quota Pricing</span>
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
              Transparent pricing based on <strong>valid QR scans</strong> and clear location allowances. No hidden per-review fees.
            </p>
          </motion.div>
        )}

        {/* Category & Billing Toggles */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
          {/* Business vs Enterprise Segment Toggle */}
          <div
            style={{
              display: "inline-flex",
              background: "#f1f5f9",
              padding: "4px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              maxWidth: "100%",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTab("business")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 22px",
                borderRadius: "8px",
                border: "none",
                background: activeTab === "business" ? "#ffffff" : "transparent",
                color: activeTab === "business" ? "#0052cc" : "#64748b",
                fontWeight: "700",
                fontSize: "13.5px",
                cursor: "pointer",
                boxShadow: activeTab === "business" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              <Store size={16} />
              <span>Single Business Locations</span>
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTab("enterprise")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 22px",
                borderRadius: "8px",
                border: "none",
                background: activeTab === "enterprise" ? "#ffffff" : "transparent",
                color: activeTab === "enterprise" ? "#0052cc" : "#64748b",
                fontWeight: "700",
                fontSize: "13.5px",
                cursor: "pointer",
                boxShadow: activeTab === "enterprise" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              <Building2 size={16} />
              <span>Multi-Outlet Franchises &amp; Corporate</span>
            </motion.button>
          </div>

          {/* Monthly / Annual Billing Toggle */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#f8fafc",
              padding: "4px 8px",
              borderRadius: "999px",
              border: "1px solid #e2e8f0",
            }}
          >
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setAnnualBilling(false)}
              style={{
                padding: "6px 16px",
                borderRadius: "999px",
                border: "none",
                background: !annualBilling ? "#0052cc" : "transparent",
                color: !annualBilling ? "#ffffff" : "#475569",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              Monthly Billing
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setAnnualBilling(true)}
              style={{
                padding: "6px 16px",
                borderRadius: "999px",
                border: "none",
                background: annualBilling ? "#0052cc" : "transparent",
                color: annualBilling ? "#ffffff" : "#475569",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.15s ease",
              }}
            >
              <span>Annual Billing</span>
              <span
                style={{
                  fontSize: "10.5px",
                  background: "#10b981",
                  color: "#ffffff",
                  padding: "1px 7px",
                  borderRadius: "999px",
                  fontWeight: "800",
                }}
              >
                SAVE 17% (2 Mo. Free)
              </span>
            </motion.button>
          </div>
        </div>

        {/* 4 Cards Grid with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${annualBilling ? "annual" : "monthly"}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
              gap: "24px",
              alignItems: "stretch",
            }}
          >
            {currentPlans.map((plan, idx) => {
              const isNumeric = typeof plan.monthlyPrice === "number";
              const effectiveMonthly = isNumeric
                ? annualBilling
                  ? Math.round(plan.annualPrice / 12)
                  : plan.monthlyPrice
                : "Custom";

              const price = isNumeric
                ? `₹${effectiveMonthly.toLocaleString("en-IN")}`
                : "Custom";

              const cycle = isNumeric ? " / month" : "";

              const targetLink = plan.isCustomQuote
                ? "/contact?type=enterprise"
                : `/register?plan=${plan.id}&billing=${annualBilling ? "annual" : "monthly"}`;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.07, ease: "easeOut" }}
                  whileHover={{
                    y: -8,
                    scale: 1.015,
                    boxShadow: plan.popular
                      ? "0 24px 48px -10px rgba(0, 82, 204, 0.22)"
                      : "0 18px 36px -8px rgba(0, 0, 0, 0.08)",
                  }}
                  style={{
                    background: "#ffffff",
                    borderRadius: "20px",
                    padding: "30px 22px",
                    border: plan.popular ? "2px solid #0052cc" : "1px solid #e2e8f0",
                    boxShadow: plan.popular
                      ? "0 12px 30px rgba(0, 82, 204, 0.14)"
                      : "0 4px 14px rgba(0, 0, 0, 0.04)",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  {plan.popular && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-12px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#0052cc",
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
                    {plan.packageName}
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b", minHeight: "34px", marginBottom: "16px", lineHeight: 1.4 }}>
                    {plan.tagline}
                  </div>

                  <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: isNumeric ? "4px" : "16px" }}>
                    <span style={{ fontSize: "34px", fontWeight: "900", color: "#0f172a", letterSpacing: "-0.5px" }}>
                      {price}
                    </span>
                    <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>{cycle}</span>
                  </div>

                  {annualBilling && isNumeric && (
                    <div style={{ fontSize: "11.5px", color: "#0052cc", fontWeight: "700", marginBottom: "14px" }}>
                      Billed annually at ₹{plan.annualPrice.toLocaleString("en-IN")}/yr (Save ~17%)
                    </div>
                  )}
                  {!annualBilling && isNumeric && (
                    <div style={{ fontSize: "11.5px", color: "#64748b", fontWeight: "600", marginBottom: "14px" }}>
                      Billed on monthly renewal
                    </div>
                  )}

                  {/* Quota Highlights Box */}
                  <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "10px 14px", marginBottom: "18px", border: "1px solid #f1f5f9" }}>
                    <div style={{ fontSize: "13px", fontWeight: "800", color: "#0052cc" }}>
                      🔍 {plan.scansDisplay}
                    </div>
                    <div style={{ fontSize: "12px", color: "#475569", marginTop: "3px", fontWeight: "600" }}>
                      📍 {plan.locationsDisplay}
                    </div>
                    {annualBilling && isNumeric && (
                      <div style={{ fontSize: "11px", color: "#059669", marginTop: "4px", fontWeight: "700" }}>
                        ✓ Monthly scan reset included
                      </div>
                    )}
                  </div>

                  {/* Features List */}
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: "0 0 24px 0",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {plan.features.map((f, i) => (
                      <li
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "8px",
                          fontSize: "12.5px",
                          color: "#334155",
                          lineHeight: 1.45,
                        }}
                      >
                        <Check size={15} color="#059669" style={{ flexShrink: 0, marginTop: "2px" }} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={targetLink}
                    className={plan.popular ? "btn btn-primary" : "btn btn-outline"}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      fontWeight: "700",
                      fontSize: "13.5px",
                      textAlign: "center",
                      textDecoration: "none",
                      transition: "transform 0.15s ease",
                    }}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Mandatory Commercial Disclaimers Required by Specification */}
        <div
          style={{
            marginTop: "36px",
            padding: "20px 24px",
            background: "#f8fafc",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            fontSize: "12.5px",
            color: "#475569",
            lineHeight: 1.6,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "800", color: "#0f172a", marginBottom: "6px" }}>
            <Info size={16} color="#0052cc" />
            <span>Commercial Terms, Quota Allocation &amp; Compliance Disclosure</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            <li>
              <strong>Proposed Values:</strong> Displayed pricing tables represent proposed configuration values pending commercial sign-off.
            </li>
            <li>
              <strong>Taxes &amp; Carrier Fees:</strong> Prices exclude applicable 18% GST. WhatsApp / SMS communication triggers carrier charges (~₹1/message) under verified opt-in consent.
            </li>
            <li>
              <strong>Annual Quota Resets:</strong> Annual subscriptions reflect 17% savings (2 months free marketing shorthand). Scans reset monthly and are not accessible all at once.
            </li>
            <li>
              <strong>Franchise Pooling:</strong> Franchise scan quotas are pooled across active outlets. Outlets may be added, transferred, or reassigned within tier caps.
            </li>
            <li>
              <strong>Enterprise Entitlements:</strong> Dedicated success managers, custom SLA guarantees, POS/ERP APIs, and private hosting require signed commercial delivery agreements.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
