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
      <section style={{ paddingTop: "76px", paddingBottom: "16px", backgroundColor: "#f0f3ff", textAlign: "center" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 24px" }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(24px, 3.2vw, 34px)",
                fontWeight: "800",
                color: "#0f172a",
                lineHeight: 1.2,
                marginBottom: "6px",
              }}
            >
              Subscription Plans & Packages
            </h1>
            <p style={{ fontSize: "14.5px", lineHeight: 1.5, color: "#475569" }}>
              Choose the perfect plan for your single store, dental clinic, restaurant, or multi-branch franchise. All plans include our <strong>7-Day Free Trial</strong>.
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
