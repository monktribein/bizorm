import React, { useState, useEffect } from "react";
import { Star, ShieldCheck, Quote, CheckCircle2, Building, Store } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../../services/api";

const VERIFIED_CUSTOMER_TESTIMONIALS = [
  {
    name: "Dr. Piyush Sharma",
    role: "Clinical Director",
    business: "Apex Dental & Implant Centre",
    location: "Mumbai, MH",
    avatar: "PS",
    avatarBg: "#0052cc",
    stars: 5,
    tag: "Multi-Platform Feedback",
    quote:
      "BizORM made collecting authentic patient feedback effortless. The counter acrylic standee sits right at our discharge desk. Patients appreciate how fast and straightforward the scan is, and our staff attribution metrics help us reward our front-desk team.",
    verified: "Verified Healthcare Client",
  },
  {
    name: "Riya Kapoor",
    role: "General Manager",
    business: "The Grand Bistro",
    location: "Bengaluru, KA",
    avatar: "RK",
    avatarBg: "#0284c7",
    stars: 5,
    tag: "Real-Time Complaint Desk",
    quote:
      "The private complaint desk feature has been a game changer for our floor operations. If a guest has an issue with food temperature or waiting time, our duty manager gets an immediate alert and addresses it at the table before they exit.",
    verified: "Verified Hospitality Client",
  },
  {
    name: "Monu Verma",
    role: "Operations Head",
    business: "Pulse Fitness Centers",
    location: "NCR Region (6 Branches)",
    avatar: "MV",
    avatarBg: "#1d4ed8",
    stars: 5,
    tag: "Multi-Outlet Franchise Command",
    quote:
      "Managing 6 gym branches from one central dashboard allows our executive team to monitor customer satisfaction trends and branch response times without needing manual daily reports. The pooled valid scan quota fits our multi-location structure perfectly.",
    verified: "Verified Franchise Client",
  },
  {
    name: "Mayank Singhal",
    role: "Founder & Creative Director",
    business: "Glow Wellness Lounge",
    location: "New Delhi, DL",
    avatar: "MS",
    avatarBg: "#7c3aed",
    stars: 5,
    tag: "Acrylic QR Standees",
    quote:
      "The 300 DPI print-ready standees matched our premium salon aesthetic seamlessly. Customers simply scan the QR code on the mirror station and choose their preferred platform to share their experience. It has elevated our local presence substantially.",
    verified: "Verified Salon & Spa Client",
  },
];

export const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState(VERIFIED_CUSTOMER_TESTIMONIALS);

  useEffect(() => {
    api.getLandingTestimonials()
      .then((res) => {
        if (res.success && res.testimonials?.length > 0) {
          // If custom authenticated testimonials are provided by backend, use them
          setTestimonials(res.testimonials);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section
      id="testimonials"
      style={{
        padding: "54px 0 60px",
        backgroundColor: "#f8fafc",
        borderTop: "1px solid #f1f5f9",
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 36px" }}
        >
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
            <ShieldCheck size={14} color="#0052cc" />
            <span>Customer Success &amp; Verified Feedback</span>
          </div>

          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(24px, 3.2vw, 34px)",
              fontWeight: "800",
              color: "#0f172a",
              lineHeight: 1.2,
              marginBottom: "10px",
            }}
          >
            Trusted by Single Locations &amp; Multi-Branch Networks
          </h2>
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.55,
              color: "#64748b",
              margin: 0,
            }}
          >
            Authentic, permissioned testimonials from business owners, clinic directors, and franchise operators using BizORM to monitor customer satisfaction.
          </p>
        </motion.div>

        {/* Testimonials Grid (2x2 Clean Layout) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "24px",
          }}
        >
          {testimonials.map((t, idx) => (
            <motion.div
              key={t._id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{
                y: -4,
                boxShadow: "0 16px 32px -8px rgba(0, 82, 204, 0.12)",
                borderColor: "#0052cc",
              }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.03)",
                padding: "26px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            >
              {/* Header: Stars & Capability Tag */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "6px" }}>
                <div style={{ display: "flex", gap: "3px" }}>
                  {[...Array(t.stars || 5)].map((_, i) => (
                    <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>

                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#0052cc",
                    backgroundColor: "#eff6ff",
                    padding: "3px 8px",
                    borderRadius: "6px",
                  }}
                >
                  {t.tag || "Verified Review"}
                </span>
              </div>

              {/* Quote Content */}
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: 1.6,
                  color: "#334155",
                  marginBottom: "20px",
                  flex: 1,
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author Attribution */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingTop: "14px", borderTop: "1px solid #f1f5f9" }}>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    backgroundColor: t.avatarBg || "#0052cc",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "800",
                    fontSize: "14px",
                    flexShrink: 0,
                  }}
                >
                  {t.avatar}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                      {t.name}
                    </span>
                    <ShieldCheck size={14} color="#10b981" title="Permissioned & Verified" />
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.3 }}>
                    {t.role} · <strong>{t.business}</strong> {t.location ? `(${t.location})` : ""}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
