import React from "react";
import { LandingNavbar } from "../../components/landing/Navbar";
import { LandingFooter } from "../../components/landing/Footer";
import { PricingSection } from "../../components/landing/PricingSection";
import { FaqSection } from "../../components/landing/FaqSection";
import { CtaSection } from "../../components/landing/CtaSection";
import { motion } from "framer-motion";

export const PricingPublicPage = () => {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <LandingNavbar />

      {/* Hero Header */}
      <section style={{ paddingTop: "clamp(84px, 6.5vw, 100px)", paddingBottom: "12px", backgroundColor: "#f0f3ff", textAlign: "center" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 24px" }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(22px, 2.8vw, 30px)",
                fontWeight: "800",
                color: "#0f172a",
                lineHeight: 1.2,
                marginBottom: "4px",
              }}
            >
              Subscription Plans &amp; Packages
            </h1>
            <p style={{ fontSize: "14px", lineHeight: 1.5, color: "#64748b", margin: 0 }}>
              Transparent pricing with valid QR scan quotas, neutral public review links, and dedicated service triage.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Pricing Section with All Tabs */}
      <PricingSection hideHeader={true} />

      {/* FAQ & CTA */}
      <FaqSection />
      <CtaSection />
      <LandingFooter />
    </div>
  );
};
export default PricingPublicPage;
