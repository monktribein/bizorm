import React, { useState, useRef } from "react";
import { 
  Sparkles, 
  MessageSquare, 
  QrCode, 
  BarChart3, 
  ShieldCheck, 
  Store, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

export const FeaturesSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const scrollRef = useRef(null);

  const features = [
    {
      icon: QrCode,
      tag: "QR Feedback",
      title: "One QR. Every Customer's Voice.",
      description: "Turn everyday customer interactions into actionable feedback. Generate branded 300 DPI acrylic counter standees, share dynamic feedback links, and collect responses in seconds.",
      highlight: "Custom branded acrylic standees",
      color: "#0052cc",
      bg: "#eff6ff",
    },
    {
      icon: Sparkles,
      tag: "Multi-Platform",
      title: "Manage Reviews Across 20+ Platforms",
      description: "Configure up to 20 review destinations including Google, Justdial, Facebook, TripAdvisor, Trustpilot, Zomato, and Practo. Make it seamless for happy customers to share praise.",
      highlight: "Up to 20 platform destinations",
      color: "#7c3aed",
      bg: "#f5f3ff",
    },
    {
      icon: BarChart3,
      tag: "AI Intelligence",
      title: "AI That Turns Feedback Into Action",
      description: "Understand sentiment, classify complaints automatically into categories (hygiene, staff, delays), and generate authentic AI-assisted review copy with selectable tones.",
      highlight: "Sentiment & complaint intelligence",
      color: "#059669",
      bg: "#ecfdf5",
    },
    {
      icon: Store,
      tag: "Franchise Scale",
      title: "One Brand. Hundreds of Outlets. One Dashboard.",
      description: "Give head office a centralized command center to monitor service quality across franchise networks. Compare outlet scorecards, track satisfaction, and hold teams accountable.",
      highlight: "Centralized HQ Command Center",
      color: "#d97706",
      bg: "#fffbeb",
    },
    {
      icon: MessageSquare,
      tag: "WhatsApp Campaigns",
      title: "Reach Customers Through WhatsApp",
      description: "Automate feedback invitations, send service-recovery follow-ups, and launch opted-in campaigns with real-time delivery and click tracking from one unified platform.",
      highlight: "Automated invitations & follow-ups",
      color: "#25d366",
      bg: "#f0fdf4",
    },
    {
      icon: ShieldCheck,
      tag: "Service Recovery",
      title: "Complaint Escalation & Resolution",
      description: "Receive instant notifications when a customer reports an issue. Assign tickets to branch managers, track resolution SLAs, and turn unhappy visitors into loyal advocates.",
      highlight: "Direct private escalation & recovery",
      color: "#ef4444",
      bg: "#fef2f2",
    },
  ];

  const scrollToCard = (index) => {
    setActiveTab(index);
    if (scrollRef.current) {
      const cardWidth = 326; // width + gap
      scrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: "smooth",
      });
    }
  };

  const handlePrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -330, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 330, behavior: "smooth" });
    }
  };

  return (
    <section
      id="features"
      style={{
        padding: "36px 0 40px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #f1f5f9",
      }}
    >
      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Section Header with Arrow Controls on Right */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "16px",
            flexWrap: "wrap",
            gap: "14px",
          }}
        >
          <div style={{ maxWidth: "680px" }}>
            <span
              style={{
                fontSize: "12px",
                fontWeight: "700",
                color: "#0052cc",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Enterprise CX Platform
            </span>
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(22px, 3vw, 28px)",
                fontWeight: "800",
                color: "#0f172a",
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              Everything You Need to Understand &amp; Improve Experience
            </h2>
          </div>

          {/* Carousel Next/Prev Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              type="button"
              onClick={handlePrev}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "1px solid #e2e8f0",
                backgroundColor: "#ffffff",
                color: "#0f172a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.15s ease",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#eff6ff";
                e.currentTarget.style.borderColor = "#0052cc";
                e.currentTarget.style.color = "#0052cc";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.color = "#0f172a";
              }}
              aria-label="Previous feature"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={handleNext}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "1px solid #e2e8f0",
                backgroundColor: "#ffffff",
                color: "#0f172a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.15s ease",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#eff6ff";
                e.currentTarget.style.borderColor = "#0052cc";
                e.currentTarget.style.color = "#0052cc";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.color = "#0f172a";
              }}
              aria-label="Next feature"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Feature Quick-Jump Tabs (Single Row) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            overflowX: "auto",
            scrollbarWidth: "none",
            paddingBottom: "12px",
            marginBottom: "16px",
          }}
        >
          {features.map((feat, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToCard(idx)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "9999px",
                border: activeTab === idx ? "1.5px solid #0052cc" : "1px solid #e2e8f0",
                backgroundColor: activeTab === idx ? "#eff6ff" : "#ffffff",
                color: activeTab === idx ? "#0052cc" : "#64748b",
                fontSize: "12.5px",
                fontWeight: "700",
                whiteSpace: "nowrap",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: activeTab === idx ? "#0052cc" : "#cbd5e1",
                }}
              />
              <span>{feat.tag}</span>
            </button>
          ))}
        </div>

        {/* STRICTLY SINGLE-ROW HORIZONTAL CAROUSEL (Never breaks into 2 lines) */}
        <div
          ref={scrollRef}
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            overflowX: "auto",
            scrollbarWidth: "none",
            gap: "16px",
            paddingBottom: "8px",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -4, borderColor: "#0052cc", boxShadow: "0 12px 28px -6px rgba(0, 82, 204, 0.14)" }}
                transition={{ duration: 0.2 }}
                style={{
                  width: "310px",
                  minWidth: "310px",
                  flexShrink: 0,
                  scrollSnapAlign: "start",
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  padding: "18px 18px",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "default",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
              >
                {/* Header: Icon + Tag */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "10px",
                      backgroundColor: feat.bg,
                      color: feat.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={19} />
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: feat.color,
                      backgroundColor: feat.bg,
                      padding: "3px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    {feat.tag}
                  </span>
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: "16.5px",
                    fontWeight: "800",
                    color: "#0f172a",
                    marginBottom: "8px",
                    lineHeight: 1.3,
                  }}
                >
                  {feat.title}
                </h3>

                {/* Description (Concise & compact) */}
                <p
                  style={{
                    fontSize: "13px",
                    color: "#64748b",
                    lineHeight: 1.55,
                    marginBottom: "14px",
                    flex: 1,
                  }}
                >
                  {feat.description}
                </p>

                {/* Footer Highlight */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    paddingTop: "12px",
                    borderTop: "1px solid #f1f5f9",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#059669",
                  }}
                >
                  <CheckCircle2 size={14} color="#059669" />
                  <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {feat.highlight}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
