import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "How does Smart Routing work?",
      a: "When a customer rates you 4 or 5 stars, they are automatically prompted with confetti and directed to post that review on your public platforms like Google Maps. Lower ratings (1, 2, or 3 stars) immediately trigger a private internal feedback form that alerts your management team directly, preventing public damage and letting you resolve customer complaints privately.",
    },
    {
      q: "How do I invite customers to leave a review?",
      a: "You have multiple effortless options: (1) Display your downloadable 300 DPI acrylic QR code standee on reception desks or dining tables, (2) Send single or bulk WhatsApp review links directly from your dashboard, (3) Dispatch automated SMS or Email invites via our CSV batch import tool.",
    },
    {
      q: "Is there a completely free trial?",
      a: "Yes! Every newly registered account starts with an unrestricted 7-day free trial that includes 100 review invites, SMS, email, and WhatsApp credits. No credit card is required to get started.",
    },
    {
      q: "Which public review platforms can I connect?",
      a: "Google Reviews (Google Business Profile) is our primary direct integration. You can also connect TripAdvisor, Facebook Recommendations, Practo Healthcare, Zomato, or any custom review URL specific to your industry.",
    },
    {
      q: "Can I download print-ready standees for my physical store?",
      a: "Yes. From your 'Share & Standee' dashboard, you can preview photorealistic acrylic counter standees featuring your business name, high-resolution QR code, and uploaded logo in the center. Click 'Download High-Res Standee' to get a 300 DPI print-ready file for acrylic frames.",
    },
    {
      q: "Can I manage multiple clinic or restaurant branches?",
      a: "Yes! Bizorm supports multi-branch role-based access control (RBAC). You can manage 2 to 50+ locations, assign branch receptionists with restricted staff permissions, and inspect branch-by-branch review velocity all in one master portal.",
    },
  ];

  return (
    <section
      id="faq"
      style={{
        padding: "40px 0 48px",
        backgroundColor: "#ffffff",
      }}
    >
      <div
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "18px" }}>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(22px, 3.2vw, 30px)",
              fontWeight: "800",
              color: "#0f172a",
              lineHeight: 1.2,
              marginBottom: "6px",
            }}
          >
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: "15px", color: "#64748b" }}>
            Everything you need to know about Bizorm's review management platform and smart routing technology.
          </p>
        </div>

        {/* Accordion List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                style={{
                  borderRadius: "14px",
                  border: "1px solid",
                  borderColor: isOpen ? "#004ac6" : "#e2e8f0",
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
                    padding: "20px 24px",
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
                      fontSize: "16px",
                      fontWeight: "700",
                      paddingRight: "16px",
                      color: isOpen ? "#004ac6" : "#0f172a",
                    }}
                  >
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ flexShrink: 0, color: isOpen ? "#004ac6" : "#64748b" }}
                  >
                    <ChevronDown size={20} />
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
                          padding: "0 24px 22px",
                          fontSize: "14.5px",
                          lineHeight: 1.65,
                          color: "#475569",
                          borderTop: "1px solid #f1f5f9",
                          paddingTop: "14px",
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
