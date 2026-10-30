import React, { useState } from "react";
import { 
  Sparkles, 
  MessageSquare, 
  QrCode, 
  BarChart3, 
  ShieldCheck, 
  Share2,
  Clock,
  ExternalLink,
  Store,
  Layers,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

export const FeaturesSection = () => {
  const coreFeatures = [
    {
      id: "branded-qr-feedback",
      icon: QrCode,
      tag: "Branded QR Feedback",
      title: "Branded QR Feedback",
      desc: "Collect customer experiences through branded, mobile-friendly QR journeys. Generate print-ready 300 DPI acrylic counter standees with your brand colors, custom logo, and dynamic scan routing.",
      highlight: "300 DPI Print-Ready Acrylic Standees",
      color: "#0052cc",
      bg: "#eff6ff",
      status: "deployed",
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
              Custom logo, dynamic branch link &amp; durable counter display template.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "multi-platform-links",
      icon: ExternalLink,
      tag: "Public Review Destinations",
      title: "Multi-Platform Review Links",
      desc: "Connect customers with configured public-review destinations without sentiment-based filtering. Support Google Business, Justdial, Facebook, TripAdvisor, and industry-specific portals.",
      highlight: "Neutral Destination Routing (No Gating)",
      color: "#7c3aed",
      bg: "#f5f3ff",
      status: "deployed",
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
            <span style={{ fontSize: "10px", fontWeight: "800", color: "#059669", background: "#ecfdf5", padding: "1px 6px", borderRadius: "4px" }}>Neutral Access</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {[
              { name: "Google Reviews", color: "#4285F4" },
              { name: "Justdial", color: "#EA4335" },
              { name: "Facebook", color: "#1877F2" },
              { name: "Trustpilot", color: "#00B67A" },
              { name: "TripAdvisor", color: "#34E0A1" },
              { name: "Zomato", color: "#E23744" },
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
                gap: "5px"
              }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: p.color }} />
                {p.name}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "complaint-resolution",
      icon: ShieldCheck,
      tag: "Issue Management",
      title: "Complaint Resolution",
      desc: "Assign, track, escalate and close customer service issues in real time. Notify duty managers immediately when concerns are submitted to resolve problems before customer churn.",
      highlight: "Private Manager Alerts & SLA Resolution",
      color: "#dc2626",
      bg: "#fef2f2",
      status: "deployed",
      preview: (
        <div style={{
          background: "#fef2f2",
          borderRadius: "12px",
          padding: "12px 14px",
          border: "1px solid #fee2e2",
          marginTop: "16px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "11px", fontWeight: "800", color: "#991b1b" }}>Ticket #4182 · Service Alert</span>
            <span style={{ fontSize: "9.5px", background: "#fee2e2", color: "#b91c1c", padding: "1px 6px", borderRadius: "4px", fontWeight: "700" }}>SLA: 15m remaining</span>
          </div>
          <p style={{ fontSize: "11px", color: "#7f1d1d", margin: "0 0 8px 0", lineHeight: 1.3 }}>
            &ldquo;Food arrived cold at table 14. Manager alerted for on-site table check.&rdquo;
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "10px" }}>
            <span style={{ color: "#991b1b", fontWeight: "600" }}>Assigned: Store Manager</span>
            <span style={{ background: "#10b981", color: "#ffffff", padding: "2px 8px", borderRadius: "999px", fontWeight: "700" }}>Resolve Issue</span>
          </div>
        </div>
      ),
    },
    {
      id: "ai-feedback-intelligence",
      icon: BarChart3,
      tag: "AI Feedback Intelligence",
      title: "AI Feedback Intelligence",
      desc: "Identify sentiment and recurring themes across customer comments. Automatically tag operational drivers like service speed, staff courtesy, hygiene, and product quality.",
      highlight: "Sentiment Analytics · Generative AI (Coming Soon)",
      color: "#059669",
      bg: "#ecfdf5",
      status: "coming_soon",
      preview: (
        <div style={{
          background: "#ffffff",
          borderRadius: "12px",
          padding: "14px",
          border: "1px solid #e2e8f0",
          marginTop: "16px",
          position: "relative",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "11px" }}>
            <span style={{ fontWeight: "700", color: "#0f172a" }}>Sentiment Tracking</span>
            <span style={{ background: "#fef3c7", color: "#b45309", padding: "1px 6px", borderRadius: "4px", fontSize: "9.5px", fontWeight: "800" }}>
              Generative NLP: Coming Soon
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              { aspect: "Staff Courtesy", score: 96, color: "#10b981" },
              { aspect: "Cleanliness & Hygiene", score: 92, color: "#059669" },
              { aspect: "Service Speed", score: 86, color: "#3b82f6" },
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
      id: "whatsapp-engagement",
      icon: MessageSquare,
      tag: "Customer Engagement",
      title: "WhatsApp Engagement",
      desc: "Consent-based invitations and service follow-up. Engage customers via opted-in WhatsApp and SMS communication with transparent carrier charges (~₹1/msg) and policy constraints disclosed.",
      highlight: "Consent-Based Outreach · Carrier Rates Apply",
      color: "#25d366",
      bg: "#f0fdf4",
      status: "deployed",
      preview: (
        <div style={{
          background: "#f0fdf4",
          borderRadius: "12px",
          padding: "12px 14px",
          border: "1px solid #dcfce7",
          marginTop: "16px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "11px", fontWeight: "800", color: "#166534" }}>Opted-In Follow-up</span>
            <span style={{ fontSize: "9.5px", color: "#15803d", fontWeight: "700" }}>₹1 / message</span>
          </div>
          <p style={{ fontSize: "11px", color: "#14532d", margin: "0 0 6px 0", lineHeight: 1.35 }}>
            &ldquo;Hi Rahul, thank you for dining at The Grand Bistro! Tap to rate your experience or alert management.&rdquo;
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "10px", color: "#166534" }}>
            <span>✓ Verified Consent</span>
            <span>Delivered via WhatsApp API</span>
          </div>
        </div>
      ),
    },
    {
      id: "business-analytics",
      icon: BarChart3,
      tag: "Operational Command",
      title: "Business Analytics",
      desc: "Monitor feedback volume, trends, branch comparison and resolution performance. Gain real-time executive visibility across single stores or multi-outlet franchise networks.",
      highlight: "Volume, Trends & Branch Scorecards",
      color: "#0284c7",
      bg: "#f0f9ff",
      status: "deployed",
      preview: (
        <div style={{
          background: "#ffffff",
          borderRadius: "12px",
          padding: "12px",
          border: "1px solid #e2e8f0",
          marginTop: "16px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", fontWeight: "700", color: "#64748b", borderBottom: "1px solid #f1f5f9", paddingBottom: "4px", marginBottom: "6px" }}>
            <span>Location</span>
            <span>CSAT</span>
            <span>Valid Scans</span>
            <span>SLA Met</span>
          </div>
          {[
            { name: "Delhi Connaught", csat: "4.9★", scans: "1,420", sla: "99%" },
            { name: "Mumbai Bandra", csat: "4.8★", scans: "1,180", sla: "96%" },
            { name: "Bengaluru Indiranagar", csat: "4.9★", scans: "980", sla: "98%" },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "10.5px", padding: "3px 0", color: "#0f172a" }}>
              <span style={{ fontWeight: "600" }}>{row.name}</span>
              <span style={{ fontWeight: "700", color: "#f59e0b" }}>{row.csat}</span>
              <span style={{ color: "#64748b" }}>{row.scans}</span>
              <span style={{ fontSize: "9px", background: "#ecfdf5", color: "#059669", padding: "1px 5px", borderRadius: "4px", fontWeight: "700" }}>{row.sla}</span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <section
      id="features"
      style={{
        padding: "100px 0",
        backgroundColor: "#ffffff",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ textAlign: "center", maxWidth: "740px", margin: "0 auto 44px" }}
        >
          <h2
            className="font-outfit"
            style={{
              fontSize: "clamp(26px, 3.4vw, 36px)",
              fontWeight: "900",
              color: "#0f172a",
              lineHeight: 1.2,
              margin: "0 0 10px 0",
            }}
          >
            Capabilities Engineered for Real-World Customer Operations
          </h2>
          <p style={{ fontSize: "15px", color: "#64748b", margin: 0, lineHeight: 1.55 }}>
            Six core pillars connecting in-store physical touchpoints with actionable feedback, operational triage, and multi-platform review presence.
          </p>
        </motion.div>

        {/* 6 Feature Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
            gap: "24px",
          }}
        >
          {coreFeatures.map((f, index) => {
            const Icon = f.icon;
            const isComingSoon = f.status === "coming_soon";
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
                whileHover={{
                  y: -6,
                  boxShadow: "0 20px 38px -10px rgba(0, 82, 204, 0.12)",
                  borderColor: "#93c5fd",
                }}
                style={{
                  background: "#ffffff",
                  borderRadius: "18px",
                  padding: "24px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "border-color 0.2s ease",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        background: f.bg,
                        color: f.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    {isComingSoon ? (
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "800",
                          background: "#fef3c7",
                          color: "#b45309",
                          padding: "3px 8px",
                          borderRadius: "999px",
                          border: "1px solid #fde68a",
                        }}
                      >
                        COMING SOON
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "800",
                          background: "#ecfdf5",
                          color: "#059669",
                          padding: "3px 8px",
                          borderRadius: "999px",
                          border: "1px solid #a7f3d0",
                        }}
                      >
                        ACTIVE &amp; DEPLOYED
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: "11px", fontWeight: "800", color: f.color, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
                    {f.tag}
                  </div>

                  <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>
                    {f.title}
                  </h3>

                  <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.55, margin: 0 }}>
                    {f.desc}
                  </p>
                </div>

                {f.preview}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
