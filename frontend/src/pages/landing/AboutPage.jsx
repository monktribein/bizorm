import React from "react";
import { LandingNavbar } from "../../components/landing/Navbar";
import { LandingFooter } from "../../components/landing/Footer";
import { AboutSection } from "../../components/landing/AboutSection";
import { CtaSection } from "../../components/landing/CtaSection";
import { ShieldCheck, Award, HeartHandshake, Sparkles, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";

export const AboutPage = () => {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <LandingNavbar />
      
      {/* Hero Header */}
      <section style={{ paddingTop: "76px", paddingBottom: "24px", backgroundColor: "#f0f3ff", textAlign: "center" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 24px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(30px, 4.5vw, 46px)",
                fontWeight: "800",
                color: "#0f172a",
                lineHeight: 1.18,
                marginBottom: "12px",
              }}
            >
              Building Better Customer Experiences Through Better Intelligence.
            </h1>
            <p style={{ fontSize: "16px", lineHeight: 1.6, color: "#475569", maxWidth: "760px", margin: "0 auto 16px" }}>
              BizORM™ is an enterprise customer experience and franchise intelligence platform by <strong>Bizwoke Nova</strong>, powered by the <strong>NKTech Enterprise Platform™</strong>, within the <strong>Mission FTC</strong> portfolio.
            </p>
            <p style={{ fontSize: "14.5px", lineHeight: 1.5, color: "#64748b", maxWidth: "680px", margin: "0 auto" }}>
              We help single business owners and multi-location franchise brands turn everyday customer feedback into measurable operational improvements and authentic online reputation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Story & Core Principles */}
      <AboutSection />

      {/* Executive Team / Commitment to Quality */}
      <section style={{ padding: "48px 0", backgroundColor: "#f8fafc" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 48px" }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "32px", fontWeight: "800", color: "#0f172a", marginBottom: "12px" }}>
              Our Core Commitments
            </h2>
            <p style={{ fontSize: "16px", color: "#64748b" }}>
              What sets Bizorm apart as India's leading customer feedback management platform.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            <div style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: "18px", border: "1px solid #e2e8f0" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#eff6ff", color: "#004ac6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>100% Genuine Reviews</h3>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.6 }}>
                We believe in authentic customer advocacy. All reviews originate from real patrons scanning physical QR standees or verified WhatsApp/SMS invites.
              </p>
            </div>

            <div style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: "18px", border: "1px solid #e2e8f0" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#ecfdf5", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>Private Customer Privacy</h3>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.6 }}>
                Unhappy customer grievances are protected by bank-grade encryption and delivered directly to the business owner to facilitate personal amends.
              </p>
            </div>

            <div style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: "18px", border: "1px solid #e2e8f0" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#fffbeb", color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>
                <HeartHandshake size={24} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>Customer First Support</h3>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.6 }}>
                Our team provides dedicated onboarding assistance, custom acrylic standee design checks, and continuous support to maximize your ROI.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaSection />
      <LandingFooter />
    </div>
  );
};
export default AboutPage;
