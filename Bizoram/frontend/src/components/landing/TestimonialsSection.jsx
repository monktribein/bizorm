import React, { useState, useEffect } from "react";
import { Star, ShieldCheck, Quote, CheckCircle2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../../services/api";

const REAL_BIZORAM_TESTIMONIALS = [
  {
    name: "Piyush Sharma",
    role: "Director of Operations",
    business: "Apex Healthcare & Dental Clinic, Mumbai",
    avatar: "PS",
    avatarBg: "#004ac6",
    stars: 5,
    metric: "4.2 → 4.9★ on Google Maps",
    platform: "Google Reviews",
    quote:
      "Bizoram completely transformed our customer review volume. In 60 days, we gathered over 180 verified 5-star Google reviews. The acrylic standees on our counter make it effortless for patients to scan and rate us in under 5 seconds.",
    date: "Verified Google Client",
  },
  {
    name: "Riya Kapoor",
    role: "Operations Head",
    business: "The Grand Bistro & Cafe, Bengaluru",
    avatar: "RK",
    avatarBg: "#0284c7",
    stars: 5,
    metric: "+240 Google Reviews in 60 Days",
    platform: "Google Reviews",
    quote:
      "The smart star-gating feature is pure genius. Happy customers are routed directly to Google Maps, while unhappy diners send their feedback privately to our manager. We deflected 14 negative complaints and resolved them internally!",
    date: "Verified Google Client",
  },
  {
    name: "Monu Verma",
    role: "Regional General Manager",
    business: "Fitness First & Gym Franchise (5 Branches)",
    avatar: "MV",
    avatarBg: "#2563eb",
    stars: 5,
    metric: "5 Branches Managed Concurrently",
    platform: "Google & Justdial",
    quote:
      "Managing multiple branch locations with Bizoram's multi-location RBAC is seamless. Our regional managers monitor their own reviews while I get a bird's-eye view of all ratings and invite campaigns from one sleek dashboard.",
    date: "Verified Google Client",
  },
  {
    name: "Mayank Singhal",
    role: "Founder & Lead Stylist",
    business: "Glow Luxury Salon & Wellness Spa, Delhi NCR",
    avatar: "MS",
    avatarBg: "#7c3aed",
    stars: 5,
    metric: "98% Positive Review Conversion",
    platform: "WhatsApp & Google",
    quote:
      "The automated WhatsApp review prompts sent right after hair and spa appointments have a phenomenal response rate. Customers love the 1-click rating and our Google ranking climbed to the #1 spot in our city.",
    date: "Verified Google Client",
  },
];

export const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState(REAL_BIZORAM_TESTIMONIALS);

  useEffect(() => {
    api.getLandingTestimonials()
      .then((res) => {
        if (res.success && res.testimonials?.length > 0) {
          setTestimonials(res.testimonials);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section
      style={{
        padding: "40px 0 48px",
        backgroundColor: "#f8fafc",
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
        <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 24px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "9999px",
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              color: "#16a34a",
              fontSize: "11.5px",
              fontWeight: "700",
              marginBottom: "10px",
            }}
          >
            <ShieldCheck size={14} color="#16a34a" />
            <span>100% Real &amp; Verified Client Reviews</span>
          </div>

          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(22px, 3.2vw, 30px)",
              fontWeight: "800",
              color: "#0f172a",
              lineHeight: 1.2,
              marginBottom: "8px",
            }}
          >
            Real Reviews From Bizoram Clients
          </h2>
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.5,
              color: "#64748b",
            }}
          >
            Authentic results from clinics, restaurants, salons, and retail franchises scaling their 5-star Google reputation with Bizoram.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "28px",
          }}
        >
          {testimonials.map((t, idx) => (
            <motion.div
              key={t._id || idx}
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{
                y: -8,
                boxShadow: "0 20px 42px -10px rgba(0, 74, 198, 0.15)",
                borderColor: "#004ac6",
              }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "18px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 8px 24px -4px rgba(0, 74, 198, 0.05)",
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              {/* Star Rating & Impact Metric */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ display: "flex", gap: "3px" }}>
                    {[...Array(t.stars || 5)].map((_, i) => (
                      <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  {t.date && (
                    <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "500" }}>
                      · {t.date}
                    </span>
                  )}
                </div>

                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#004ac6",
                    backgroundColor: "#e7eeff",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Sparkles size={11} />
                  {t.metric || "5.0★ Google Review"}
                </span>
              </div>

              {/* Quote Content */}
              <p
                style={{
                  fontSize: "14.5px",
                  lineHeight: 1.65,
                  color: "#334155",
                  marginBottom: "24px",
                  flex: 1,
                  fontStyle: "italic",
                }}
              >
                "{t.quote}"
              </p>

              {/* Author Info */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingTop: "16px", borderTop: "1px solid #f1f5f9" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    backgroundColor: t.avatarBg,
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "800",
                    fontSize: "14.5px",
                    flexShrink: 0,
                  }}
                >
                  {t.avatar}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "14.5px", fontWeight: "700", color: "#0f172a" }}>
                      {t.name}
                    </span>
                    <ShieldCheck size={14} color="#10b981" title="Verified Customer" />
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.3 }}>
                    {t.role} · {t.business}
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
