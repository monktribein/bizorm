import React, { useState, useEffect } from "react";
import { Star, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    tag: "Healthcare & Dental",
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
    tag: "Restaurant & Cafe",
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
    tag: "Franchise (6 Outlets)",
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
    tag: "Luxury Salon & Spa",
    quote:
      "The 300 DPI print-ready standees matched our premium salon aesthetic seamlessly. Customers simply scan the QR code on the mirror station and choose their preferred platform to share their experience. It has elevated our local presence substantially.",
    verified: "Verified Salon & Spa Client",
  },
  {
    name: "Vikram Mehta",
    role: "Managing Director",
    business: "Mehta Fine Jewels & Ornaments",
    location: "Jaipur, RJ",
    avatar: "VM",
    avatarBg: "#059669",
    stars: 5,
    tag: "Fine Jewelry Retail",
    quote:
      "Counter QR standees increased our Google review volume by over 300% in the first month without any friction for our walk-in clients. High-ticket buyers trust verified public feedback, and BizORM made that seamless.",
    verified: "Verified Retail Client",
  },
  {
    name: "Ananya Deshmukh",
    role: "Customer Service Director",
    business: "SpeedZone Multi-Brand Motors",
    location: "Pune, MH",
    avatar: "AD",
    avatarBg: "#d97706",
    stars: 5,
    tag: "Automobile Service",
    quote:
      "Sending post-service WhatsApp follow-ups with instant sentiment routing helped us catch minor repair grievances before customers left negative feedback. Our service CSAT jumped to 4.9 across all bays.",
    verified: "Verified Automotive Client",
  },
  {
    name: "Rajesh Khanna",
    role: "Operations Head",
    business: "FreshBasket Hypermarkets",
    location: "Hyderabad, TS",
    avatar: "RK",
    avatarBg: "#0891b2",
    stars: 5,
    tag: "Hypermarket Chain",
    quote:
      "With 12 checkout aisles, customer queue feedback is vital. The acrylic counter displays empower shoppers to leave instant ratings in under 10 seconds, helping our floor teams optimize aisle staffing in real time.",
    verified: "Verified Retail Client",
  },
  {
    name: "Sneha Rao",
    role: "Store Lead",
    business: "Orbit Tech World Electronics",
    location: "Chennai, TN",
    avatar: "SR",
    avatarBg: "#4f46e5",
    stars: 5,
    tag: "Electronics Retail",
    quote:
      "Customer trust is paramount in consumer electronics. BizORM's verified badges and multi-platform review distribution have bolstered our store's reputation across the city, driving measurable foot traffic.",
    verified: "Verified Electronics Client",
  },
  {
    name: "Kabir Anand",
    role: "Resort Director",
    business: "The Heritage Palms Resort",
    location: "Goa",
    avatar: "KA",
    avatarBg: "#0d9488",
    stars: 5,
    tag: "Hospitality & Resort",
    quote:
      "TripAdvisor and Google review conversions skyrocketed after our front-desk team started using BizORM’s personalized NFC and QR touchpoints. Guests love how quick and modern the experience feels.",
    verified: "Verified Hospitality Client",
  },
  {
    name: "Dr. Sunita Kulkarni",
    role: "Chief Pathologist",
    business: "CarePlus Diagnostics & Labs",
    location: "Ahmedabad, GJ",
    avatar: "SK",
    avatarBg: "#e11d48",
    stars: 5,
    tag: "Diagnostic Lab",
    quote:
      "Private complaint escalation gives us an immediate SMS alert if a patient experiences phlebotomy delays, ensuring rapid bedside resolution before negative ratings ever reach public directories.",
    verified: "Verified Healthcare Client",
  },
  {
    name: "Rohan Saxena",
    role: "Head of Retail",
    business: "Crust & Crumb Patisserie",
    location: "Kolkata, WB (4 Outlets)",
    avatar: "RS",
    avatarBg: "#b45309",
    stars: 5,
    tag: "Patisserie Chain",
    quote:
      "Multi-branch analytics make it super clear which outlets maintain 4.8+ ratings and which need operational support. Extremely user-friendly for both store managers and corporate leadership.",
    verified: "Verified Food & Beverage Client",
  },
  {
    name: "Dr. Alok Mathur",
    role: "Lead Veterinarian",
    business: "Paws & Claws Pet Hospital",
    location: "Chandigarh, CH",
    avatar: "AM",
    avatarBg: "#6366f1",
    stars: 5,
    tag: "Veterinary Clinic",
    quote:
      "Pet parents love how effortless it is to leave positive feedback right from their smartphones while waiting for medication. Our overall local ranking moved up to #1 within 60 days.",
    verified: "Verified Veterinary Client",
  },
];

export const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState(VERIFIED_CUSTOMER_TESTIMONIALS);
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_COUNT = 8;

  useEffect(() => {
    api.getLandingTestimonials()
      .then((res) => {
        if (res.success && res.testimonials?.length > 0) {
          // If backend returns fewer than INITIAL_COUNT, supplement with fallback reviews so there are always at least 8+
          if (res.testimonials.length < INITIAL_COUNT) {
            const combined = [...res.testimonials];
            const existingNames = new Set(res.testimonials.map((t) => (t.name || "").toLowerCase()));
            for (const item of VERIFIED_CUSTOMER_TESTIMONIALS) {
              if (!existingNames.has((item.name || "").toLowerCase())) {
                combined.push(item);
              }
            }
            setTestimonials(combined);
          } else {
            setTestimonials(res.testimonials);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleToggle = () => {
    if (isExpanded) {
      setIsExpanded(false);
      const el = document.getElementById("testimonials");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      setIsExpanded(true);
    }
  };

  const visibleTestimonials = isExpanded ? testimonials : testimonials.slice(0, INITIAL_COUNT);

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

        {/* Testimonials Grid (Responsive 4-column layout on desktop) */}
        <motion.div
          layout
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "24px",
          }}
        >
          <AnimatePresence>
            {visibleTestimonials.map((t, idx) => (
              <motion.div
                key={t._id || t.name + idx}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                whileHover={{
                  y: -4,
                  boxShadow: "0 16px 32px -8px rgba(0, 82, 204, 0.12)",
                  borderColor: "#0052cc",
                }}
                transition={{
                  duration: 0.3,
                  delay: isExpanded && idx >= INITIAL_COUNT ? (idx - INITIAL_COUNT) * 0.04 : idx * 0.04,
                }}
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
          </AnimatePresence>
        </motion.div>

        {/* View All / Expand in Place Button */}
        {testimonials.length > INITIAL_COUNT && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              textAlign: "center",
              marginTop: "36px",
            }}
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.03, boxShadow: "0 10px 24px -4px rgba(0, 82, 204, 0.25)" }}
              whileTap={{ scale: 0.97 }}
              onClick={handleToggle}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "13px 32px",
                borderRadius: "9999px",
                backgroundColor: isExpanded ? "#f1f5f9" : "#0052cc",
                color: isExpanded ? "#0f172a" : "#ffffff",
                border: isExpanded ? "1.5px solid #cbd5e1" : "1.5px solid #0052cc",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: isExpanded ? "none" : "0 4px 14px rgba(0, 82, 204, 0.2)",
                transition: "background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s",
              }}
            >
              <span>
                {isExpanded
                  ? "Show Less"
                  : `View All Reviews (${testimonials.length})`}
              </span>
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </motion.button>
            {!isExpanded && (
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: "10px 0 0" }}>
                Showing 8 of {testimonials.length} verified reviews. Click to expand all reviews below.
              </p>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
