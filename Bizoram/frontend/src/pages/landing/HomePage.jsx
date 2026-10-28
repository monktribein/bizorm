import React from "react";
import { LandingNavbar } from "../../components/landing/Navbar";
import { HeroSection } from "../../components/landing/HeroSection";
import { SocialProof } from "../../components/landing/SocialProof";
import { HowItWorks } from "../../components/landing/HowItWorks";
import { FeaturesSection } from "../../components/landing/FeaturesSection";
import { InteractiveDemo } from "../../components/landing/InteractiveDemo";
import { PricingSection } from "../../components/landing/PricingSection";
import { AboutSection } from "../../components/landing/AboutSection";
import { TestimonialsSection } from "../../components/landing/TestimonialsSection";
import { FaqSection } from "../../components/landing/FaqSection";
import { CtaSection } from "../../components/landing/CtaSection";
import { LandingFooter } from "../../components/landing/Footer";

export const HomePage = () => {
  return (
    <div className="bizorm-landing-wrapper" style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <LandingNavbar />
      <main>
        <HeroSection />
        <SocialProof />
        <HowItWorks />
        <FeaturesSection />
        <InteractiveDemo />
        <PricingSection />
        <AboutSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
};
export default HomePage;
