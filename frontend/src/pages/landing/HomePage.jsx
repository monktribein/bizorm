import React from "react";
import { LandingNavbar } from "../../components/landing/Navbar";
import { HeroSection } from "../../components/landing/HeroSection";
import { SocialProof } from "../../components/landing/SocialProof";
import { HowItWorks } from "../../components/landing/HowItWorks";
import { FeaturesSection } from "../../components/landing/FeaturesSection";
import { FranchiseIntelligenceSection } from "../../components/landing/FranchiseIntelligenceSection";
import { InteractiveDemo } from "../../components/landing/InteractiveDemo";
import { PricingSection } from "../../components/landing/PricingSection";
import { TestimonialsSection } from "../../components/landing/TestimonialsSection";
import { FaqSection } from "../../components/landing/FaqSection";
import { CtaSection } from "../../components/landing/CtaSection";
import { LandingFooter } from "../../components/landing/Footer";

export const HomePage = () => {
  return (
    <div className="bizorm-landing-wrapper" style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <LandingNavbar />
      <main>
        {/* 01 Hero + Actual Product Preview */}
        <HeroSection />

        {/* 02 Trusted Industries / Solutions */}
        <SocialProof />

        {/* 03 How BizORM Works */}
        <HowItWorks />

        {/* 04 Six Core Product Features */}
        <FeaturesSection />

        {/* 05 Multi-Outlet Franchise Intelligence */}
        <FranchiseIntelligenceSection />

        {/* 06 Interactive ROI Calculator */}
        <InteractiveDemo />

        {/* 07 Pricing Preview */}
        <PricingSection />

        {/* 08 Customer Success / Verified Testimonials */}
        <TestimonialsSection />

        {/* 09 Frequently Asked Questions */}
        <FaqSection />

        {/* 10 Final Trial + Demo CTA */}
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default HomePage;
