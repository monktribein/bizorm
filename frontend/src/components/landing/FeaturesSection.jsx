import React, { useState } from "react";
import { 
  Sparkles, 
  MessageSquare, 
  QrCode, 
  BarChart3, 
  ShieldCheck, 
  Store, 
  CheckCircle2,
  ArrowRight,
  Star,
  Smartphone,
  Building,
  Clock,
  ThumbsUp,
  Share2
} from "lucide-react";
import { motion } from "framer-motion";

export const FeaturesSection = () => {
  const [selectedReviewPlatform, setSelectedReviewPlatform] = useState("Google");

  const coreFeatures = [
    {
      id: "qr-standees",
      icon: QrCode,
      tag: "QR Standee Engine",
      title: "Dynamic Branded QR Standees",
      desc: "Turn on-counter transactions into verified reviews. Generate print-ready 300 DPI acrylic standees with your brand colors, custom logo, and instant-scan routing.",
      highlight: "300 DPI Print-Ready Acrylic Standees",
      color: "#0052cc",
      bg: "#eff6ff",
      // Visual Screenshot Mockup
      preview: (
        <div style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          borderRadius: "12px",
          padding: "16px",
          border: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginTop: "16px",
        }}>
          {/* Acrylic Standee Mini Mockup */}
          <div style={{
            width: "72px",
            height: "90px",
            background: "#ffffff",
            borderRadius: "8px",
            border: "2px solid #0052cc",
            boxShadow: "0 8px 16px rgba(0, 82, 204, 0.15)",
            padding: "6px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            position: "relative"
          }}>
            <div style={{ width: "32px", height: "4px", background: "#0052cc", borderRadius: "2px" }} />
            <div style={{
              width: "42px",
              height: "42px",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0052cc"
            }}>
              <QrCode size={28} />
            </div>
            <span style={{ fontSize: "7px", fontWeight: "800", color: "#0052cc" }}>SCAN TO RATE</span>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
              <span style={{ fontSize: "12px", fontWeight: "800", color: "#0f172a" }}>Acrylic Standee Kit</span>
              <span style={{ fontSize: "9px", background: "#dbeafe", color: "#0052cc", padding: "1px 5px", borderRadius: "4px", fontWeight: "700" }}>300 DPI</span>
            </div>
            <p style={{ fontSize: "11px", color: "#64748b", margin: 0, lineHeight: 1.4 }}>
              Includes custom business logo, dynamic table URL &amp; counter display holder.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "multi-platform",
      icon: Sparkles,
      tag: "Platform Hub",
      title: "20+ Connected Review Platforms",
      desc: "Connect Google, Justdial, Facebook, TripAdvisor, Trustpilot, Zomato, Practo and custom URLs. Direct verified feedback to where it matters most for your industry.",
      highlight: "Unified Google, Justdial, Zomato & 20+ Platforms",
      color: "#7c3aed",
      bg: "#f5f3ff",
      // Visual Screenshot Mockup
      preview: (
        <div style={{
          background: "#ffffff",
          borderRadius: "12px",
          padding: "14px",
          border: "1px solid #e2e8f0",
          marginTop: "16px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b" }}>Active Destinations:</span>
            <span style={{ fontSize: "11px", fontWeight: "800", color: "#7c3aed" }}>20+ Platforms</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {[
              { name: "Google", rating: "4.9★", color: "#4285F4" },
              { name: "Justdial", rating: "4.8★", color: "#EA4335" },
              { name: "Facebook", rating: "4.9★", color: "#1877F2" },
              { name: "Trustpilot", rating: "4.7★", color: "#00B67A" },
              { name: "TripAdvisor", rating: "4.8★", color: "#34E0A1" },
              { name: "Zomato", rating: "4.6★", color: "#E23744" },
            ].map((p, i) => (
              <span key={i} style={{
                fontSize: "10px",
                fontWeight: "700",
                color: "#1e293b",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                padding: "3px 8px",
                borderRadius: "6px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px"
              }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: p.color }} />
                {p.name} <strong style={{ color: "#f59e0b" }}>{p.rating}</strong>
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "ai-intelligence",
      icon: BarChart3,
      tag: "AI Intelligence",
      title: "Aspect Sentiment & Root-Cause AI",
      desc: "Our neural sentiment engine breaks down customer feedback by key operational drivers: service speed, staff courtesy, hygiene, and product quality in real time.",
      highlight: "Automated Sentiment & Aspect Classification",
      color: "#059669",
      bg: "#ecfdf5",
      // Visual Screenshot Mockup
      preview: (
        <div style={{
          background: "#ffffff",
          borderRadius: "12px",
          padding: "14px",
          border: "1px solid #e2e8f0",
          marginTop: "16px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "11px" }}>
            <span style={{ fontWeight: "700", color: "#0f172a" }}>Sentiment Score: 94% Positive</span>
            <span style={{ color: "#059669", fontWeight: "800" }}>+12% this month</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              { aspect: "Staff Courtesy", score: 98, color: "#10b981" },
              { aspect: "Cleanliness & Hygiene", score: 94, color: "#059669" },
              { aspect: "Service Speed", score: 88, color: "#3b82f6" },
            ].map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "10px", color: "#64748b", width: "95px" }}>{a.aspect}</span>
                <div style={{ flex: 1, height: "6px", background: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ width: `${a.score}%`, height: "100%", background: a.color, borderRadius: "999px" }} />
                </div>
                <span style={{ fontSize: "10px", fontWeight: "700", color: "#0f172a", width: "24px", textAlign: "right" }}>{a.score}%</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "service-recovery",
      icon: ShieldCheck,
      tag: "Service Recovery",
      title: "Real-Time Complaint Escalation",
      desc: "Receive instant notifications when a customer expresses concern. Assign tickets to branch managers, set resolution SLAs, and solve issues before public escalation.",
      highlight: "Private Manager Alerts & SLA Tracking",
      color: "#dc2626",
      bg: "#fef2f2",
      // Visual Screenshot Mockup
      preview: (
        <div style={{
          background: "#fef2f2",
          borderRadius: "12px",
          padding: "12px 14px",
          border: "1px solid #fee2e2",
          marginTop: "16px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "11px", fontWeight: "800", color: "#991b1b" }}>Incident #4182 · Escalate</span>
            <span style={{ fontSize: "9.5px", background: "#fee2e2", color: "#b91c1c", padding: "1px 6px", borderRadius: "4px", fontWeight: "700" }}>SLA: 15m remaining</span>
          </div>
          <p style={{ fontSize: "11px", color: "#7f1d1d", margin: "0 0 8px 0", lineHeight: 1.3 }}>
            &ldquo;Food arrived cold at table 14. Waiter apologized but issue unaddressed.&rdquo;
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "10px" }}>
            <span style={{ color: "#991b1b", fontWeight: "600" }}>Assigned: Manager on Duty</span>
            <span style={{ background: "#10b981", color: "#ffffff", padding: "2px 8px", borderRadius: "999px", fontWeight: "700" }}>Resolve Now</span>
          </div>
        </div>
      ),
    },
    {
      id: "franchise-command",
      icon: Store,
      tag: "Franchise Intelligence",
      title: "Multi-Outlet Franchise Command",
      desc: "Give corporate and regional directors complete visibility across 5 to 100+ branches. Compare outlet satisfaction ratings, track response velocities, and benchmark performance.",
      highlight: "Head-Office Command Center & Outlets Matrix",
      color: "#d97706",
      bg: "#fffbeb",
      // Visual Screenshot Mockup
      preview: (
        <div style={{
          background: "#ffffff",
          borderRadius: "12px",
          padding: "12px",
          border: "1px solid #e2e8f0",
          marginTop: "16px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", fontWeight: "700", color: "#64748b", borderBottom: "1px solid #f1f5f9", paddingBottom: "4px", marginBottom: "6px" }}>
            <span>Outlet Name</span>
            <span>Rating</span>
            <span>Valid Scans</span>
            <span>Status</span>
          </div>
          {[
            { name: "Delhi Connaught", rating: "4.9★", scans: "1,420", status: "Top 5%" },
            { name: "Mumbai Bandra", rating: "4.8★", scans: "1,180", status: "Good" },
            { name: "Bengaluru Indiranagar", rating: "4.9★", scans: "980", status: "Top 5%" },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "10.5px", padding: "3px 0", color: "#0f172a" }}>
              <span style={{ fontWeight: "600" }}>{row.name}</span>
              <span style={{ fontWeight: "700", color: "#f59e0b" }}>{row.rating}</span>
              <span style={{ color: "#64748b" }}>{row.scans}</span>
              <span style={{ fontSize: "9px", background: "#ecfdf5", color: "#059669", padding: "1px 5px", borderRadius: "4px", fontWeight: "700" }}>{row.status}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "automated-workflows",
      icon: MessageSquare,
      tag: "Customer Workflows",
      title: "Automated Feedback Invitations",
      desc: "Trigger review requests after purchase, dining, or appointments. Engage customers through seamless QR encounters or opted-in WhatsApp and SMS communication.",
      highlight: "Real-Time Delivery & Scan Attribution",
      color: "#25d366",
      bg: "#f0fdf4",
      // Visual Screenshot Mockup
      preview: (
        <div style={{
          background: "#f0fdf4",
          borderRadius: "12px",
          padding: "12px 14px",
          border: "1px solid #dcfce7",
          marginTop: "16px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#25d366" }} />
            <span style={{ fontSize: "11px", fontWeight: "800", color: "#166534" }}>Opted-In Follow-up Trigger</span>
            <span style={{ fontSize: "9px", color: "#15803d", marginLeft: "auto" }}>Delivered</span>
          </div>
          <div style={{ background: "#ffffff", padding: "8px 10px", borderRadius: "8px", border: "1px solid #bbf7d0", fontSize: "11px", color: "#1f2937" }}>
            &ldquo;Hi Rahul, thank you for choosing us today! We'd love your 5-second rating:&rdquo;
            <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
              <span style={{ background: "#0052cc", color: "#ffffff", padding: "3px 8px", borderRadius: "4px", fontSize: "9.5px", fontWeight: "700" }}>Rate on Google</span>
              <span style={{ background: "#f1f5f9", color: "#475569", padding: "3px 8px", borderRadius: "4px", fontSize: "9.5px" }}>Direct Feedback</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section
      id="features"
      style={{
        padding: "54px 0 60px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #f1f5f9",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Section Header */}
        <div style={{ textAlign: "center", maxWidth: "780px", margin: "0 auto 36px" }}>
          <span
            style={{
              fontSize: "12px",
              fontWeight: "800",
              color: "#0052cc",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              display: "block",
              marginBottom: "8px",
            }}
          >
            Core Capabilities
          </span>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(26px, 3.2vw, 36px)",
              fontWeight: "900",
              color: "#0f172a",
              lineHeight: 1.2,
              marginBottom: "12px",
              letterSpacing: "-0.02em",
            }}
          >
            Six Core Product Features Built for Scalable Reputation
          </h2>
          <p
            style={{
              fontSize: "15.5px",
              lineHeight: 1.55,
              color: "#64748b",
              margin: 0,
            }}
          >
            Everything single locations and franchise enterprises need to collect genuine customer sentiment, expand review velocity, and resolve issues before they hurt brand equity.
          </p>
        </div>

        {/* 6 Concise Feature Cards Grid (3x2 Desktop Layout) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "24px",
          }}
        >
          {coreFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.id}
                whileHover={{ y: -4, borderColor: "#0052cc", boxShadow: "0 14px 32px -8px rgba(0, 82, 204, 0.12)" }}
                transition={{ duration: 0.2 }}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "18px",
                  border: "1px solid #e2e8f0",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
              >
                <div>
                  {/* Header: Icon + Tag */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "10px",
                        backgroundColor: feat.bg,
                        color: feat.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        color: feat.color,
                        backgroundColor: feat.bg,
                        padding: "4px 10px",
                        borderRadius: "999px",
                      }}
                    >
                      {feat.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "800",
                      color: "#0f172a",
                      marginBottom: "8px",
                      lineHeight: 1.3,
                    }}
                  >
                    {feat.title}
                  </h3>

                  {/* Concise Description */}
                  <p
                    style={{
                      fontSize: "13.5px",
                      color: "#64748b",
                      lineHeight: 1.55,
                      margin: "0 0 12px 0",
                    }}
                  >
                    {feat.desc}
                  </p>

                  {/* Strong Product Screenshot / UI Mockup */}
                  {feat.preview}
                </div>

                {/* Footer Highlight */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    paddingTop: "14px",
                    marginTop: "16px",
                    borderTop: "1px solid #f1f5f9",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#0052cc",
                  }}
                >
                  <CheckCircle2 size={15} color="#0052cc" />
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
