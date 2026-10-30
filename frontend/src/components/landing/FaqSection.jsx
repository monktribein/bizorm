import React, { useState } from "react";
import { ChevronDown, HelpCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "What is a 'Valid QR Scan' and how is my monthly quota tracked?",
      a: "A valid QR scan is registered when a unique customer scans your acrylic standee QR code or opens your direct feedback link to view your feedback form. Repeated or accidental scans from the same device within a short window are deduplicated automatically so your monthly scan allowance is never consumed unfairly.",
    },
    {
      q: "How does BizORM remain compliant with Google and platform review policies?",
      a: "BizORM is built in full compliance with Google, FTC, and major review platform anti-gating regulations. We never restrict, block, or gate customers from expressing their voice on public review websites. Customers are presented open choices to post on public platforms (Google, Justdial, Facebook, etc.), while simultaneously having an immediate private line to alert duty managers so service issues can be resolved in real time.",
    },
    {
      q: "What is included in the 7-day free trial?",
      a: "Every new account receives an unrestricted 7-day free trial with 100 valid QR scans, access to the 300 DPI acrylic standee generator, and multi-platform review integrations. No credit card is required to begin.",
    },
    {
      q: "How does monthly and annual billing work, and when do scan quotas reset?",
      a: "Monthly subscriptions bill every 30 days, and your scan quota resets at the start of each billing cycle. Annual plans offer 17% savings (marketed as 2 months free) with exact annual billing upfront, while retaining monthly scan entitlement resets so your business enjoys a fresh quota every month without rollover degradation.",
    },
    {
      q: "How does Enterprise pooled scan billing work for multi-outlet franchises?",
      a: "For multi-branch franchise networks (Franchise 10, 25, 50, 100 and Corporate), your valid scan allowance is pooled across all outlets. A high-footfall flagship outlet can utilize scans dynamically from the central pool without hitting artificial single-store barriers, while Head Office monitors branch-by-branch consumption in real time.",
    },
    {
      q: "Can I download print-ready acrylic counter standees for our stores?",
      a: "Yes. From your dashboard, you can preview photorealistic acrylic counter standees customized with your business name, high-resolution QR code, and uploaded logo in the center. Click 'Download Standee' to get a 300 DPI vector-sharp PDF/PNG ready for acrylic frame production.",
    },
    {
      q: "Which public review platforms can be connected?",
      a: "You can configure up to 20 review destinations, including Google Business Profile, Justdial, Facebook Recommendations, TripAdvisor, Trustpilot, Practo Healthcare, Zomato, Amazon, Flipkart, or custom web links tailored to your specific industry.",
    },
  ];

  return (
    <section
      id="faq"
      style={{
        padding: "54px 0 60px",
        backgroundColor: "#ffffff",
      }}
    >
      <div
        style={{
          maxWidth: "880px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
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
              marginBottom: "10px",
            }}
          >
            <HelpCircle size={14} color="#0052cc" />
            <span>Got Questions? We Have Answers</span>
          </div>

          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(24px, 3.2vw, 34px)",
              fontWeight: "800",
              color: "#0f172a",
              lineHeight: 1.2,
              marginBottom: "8px",
            }}
          >
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: "15px", color: "#64748b", margin: 0 }}>
            Everything you need to know about valid QR scans, billing resets, platform compliance, and multi-outlet franchise intelligence.
          </p>
        </div>

        {/* Accordion List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                style={{
                  borderRadius: "14px",
                  border: "1px solid",
                  borderColor: isOpen ? "#0052cc" : "#e2e8f0",
                  backgroundColor: isOpen ? "#f8fafc" : "#ffffff",
                  transition: "border-color 0.2s ease, background-color 0.2s ease",
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "18px 22px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "#0f172a",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "15.5px",
                      fontWeight: "700",
                      paddingRight: "16px",
                      color: isOpen ? "#0052cc" : "#0f172a",
                      lineHeight: 1.35,
                    }}
                  >
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ flexShrink: 0, color: isOpen ? "#0052cc" : "#64748b" }}
                  >
                    <ChevronDown size={19} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div
                        style={{
                          padding: "0 22px 20px",
                          fontSize: "14.5px",
                          lineHeight: 1.6,
                          color: "#475569",
                          borderTop: "1px solid #f1f5f9",
                          paddingTop: "12px",
                        }}
                      >
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
