import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { api } from "../../services/api";
import {
  Star,
  ShieldCheck,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Quote,
  Building2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export const ReviewWidgetPage = () => {
  const { formKey } = useParams();
  const [searchParams] = useSearchParams();

  const theme = searchParams.get("theme") || "light"; // "light" | "dark"
  const layout = searchParams.get("layout") || "carousel"; // "carousel" | "grid"
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!formKey) return;
    setLoading(true);
    api
      .getPublicReviews(formKey)
      .then((res) => {
        if (res.success) {
          setData(res);
        } else {
          setError(res.message || "Failed to load reviews");
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load reviews");
      })
      .finally(() => setLoading(false));
  }, [formKey]);

  const business = data?.business;
  const reviews = data?.reviews || [];

  // Navigation for Carousel
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, reviews.length - 1) : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= reviews.length - 1 ? 0 : prev + 1));
  };

  // Color tokens
  const bgColor = isDark ? "#0f172a" : "#ffffff";
  const cardBg = isDark ? "#1e293b" : "#f8fafc";
  const borderColor = isDark ? "#334155" : "#e2e8f0";
  const textColor = isDark ? "#f8fafc" : "#0f172a";
  const textMuted = isDark ? "#94a3b8" : "#64748b";
  const starColor = "#f59e0b";

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          background: bgColor,
          color: textMuted,
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
        }}
      >
        <span>Loading reviews...</span>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div
        style={{
          padding: "24px",
          textAlign: "center",
          background: bgColor,
          color: textMuted,
          fontFamily: "Inter, sans-serif",
        }}
      >
        <p style={{ margin: 0, fontSize: "14px" }}>No reviews available to display.</p>
      </div>
    );
  }

  const reviewUrl = `${window.location.origin}/wtr/${formKey}`;

  return (
    <div
      style={{
        background: bgColor,
        color: textColor,
        fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: "16px 20px",
        boxSizing: "border-box",
        minHeight: "100%",
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Widget Header Strip */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
          paddingBottom: "14px",
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {business.logo ? (
            <img
              src={business.logo}
              alt={business.name}
              style={{
                height: "38px",
                width: "auto",
                maxWidth: "110px",
                objectFit: "contain",
                borderRadius: "6px",
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: "#2563eb",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                fontSize: "15px",
              }}
            >
              {business.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <div style={{ fontSize: "16px", fontWeight: "800", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>{business.name}</span>
              <ShieldCheck size={16} color="#10b981" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
              <div style={{ display: "flex", gap: "2px" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    fill={s <= Math.round(business.averageRating) ? starColor : "none"}
                    color={starColor}
                  />
                ))}
              </div>
              <span style={{ fontSize: "13px", fontWeight: "800", color: starColor }}>
                {business.averageRating}
              </span>
              <span style={{ fontSize: "12px", color: textMuted }}>
                ({business.totalReviews || reviews.length} customer reviews)
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <a
            href={reviewUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "7px 14px",
              borderRadius: "9999px",
              background: "#2563eb",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: "700",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              boxShadow: "0 2px 6px rgba(37, 99, 235, 0.25)",
            }}
          >
            <span>Leave a Review</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Reviews Content */}
      {reviews.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "30px 16px",
            background: cardBg,
            borderRadius: "12px",
            color: textMuted,
            fontSize: "13px",
          }}
        >
          <span>Collecting reviews. Be the first to share your positive experience!</span>
        </div>
      ) : layout === "carousel" ? (
        /* CAROUSEL VIEW */
        <div style={{ position: "relative" }}>
          <div
            style={{
              background: cardBg,
              border: `1.5px solid ${borderColor}`,
              borderRadius: "16px",
              padding: "24px 28px",
              boxShadow: isDark ? "0 4px 14px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.03)",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              minHeight: "150px",
            }}
          >
            {/* Top row: Avatar, Name, Rating, Quote icon */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "800",
                    fontSize: "15px",
                  }}
                >
                  {(reviews[currentIndex].name || "H").charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: "800", display: "flex", alignItems: "center", gap: "5px" }}>
                    <span>{reviews[currentIndex].name || "Verified Customer"}</span>
                    <CheckCircle2 size={14} color="#10b981" />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                    <div style={{ display: "flex", gap: "1px" }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={13}
                          fill={s <= reviews[currentIndex].star ? starColor : "none"}
                          color={starColor}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: "11px", color: textMuted }}>
                      {reviews[currentIndex].createdAt
                        ? new Date(reviews[currentIndex].createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Verified Review"}
                    </span>
                    {reviews[currentIndex].staffMember && (
                      <span
                        style={{
                          fontSize: "11px",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          background: isDark ? "#334155" : "#e2e8f0",
                          color: textColor,
                          fontWeight: "600",
                        }}
                      >
                        Assisted by {reviews[currentIndex].staffMember}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <Quote size={28} color={isDark ? "#334155" : "#cbd5e1"} style={{ opacity: 0.7 }} />
            </div>

            {/* Review Body */}
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.6,
                color: textColor,
                margin: 0,
                fontStyle: "italic",
              }}
            >
              "{reviews[currentIndex].review || "Excellent experience and outstanding customer service!"}"
            </p>

            {/* Navigation Dots and Arrows */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "6px",
                paddingTop: "10px",
                borderTop: `1px solid ${borderColor}`,
              }}
            >
              <div style={{ display: "flex", gap: "5px" }}>
                {reviews.slice(0, 10).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    style={{
                      width: i === currentIndex ? "18px" : "6px",
                      height: "6px",
                      borderRadius: "9999px",
                      background: i === currentIndex ? "#2563eb" : borderColor,
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  />
                ))}
              </div>

              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={handlePrev}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: isDark ? "#334155" : "#ffffff",
                    border: `1px solid ${borderColor}`,
                    color: textColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNext}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: isDark ? "#334155" : "#ffffff",
                    border: `1px solid ${borderColor}`,
                    color: textColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
            gap: "14px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {reviews.slice(0, 6).map((r, i) => (
            <div
              key={i}
              style={{
                background: cardBg,
                border: `1px solid ${borderColor}`,
                borderRadius: "12px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                boxSizing: "border-box",
                minWidth: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "#2563eb",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "800",
                    fontSize: "13px",
                    flexShrink: 0,
                  }}
                >
                  {(r.name || "C").charAt(0).toUpperCase()}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: "800", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {r.name || "Customer"}
                  </div>
                  <div style={{ display: "flex", gap: "1px" }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={11} fill={s <= r.star ? starColor : "none"} color={starColor} />
                    ))}
                  </div>
                </div>
              </div>
              <p
                style={{
                  fontSize: "12px",
                  lineHeight: 1.5,
                  margin: 0,
                  color: textColor,
                  fontStyle: "italic",
                  display: "-webkit-box",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                "{r.review || "Great experience!"}"
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Powered by Bizwoke Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "5px",
          fontSize: "11px",
          color: textMuted,
        }}
      >
        <span>Verified Reviews powered by</span>
        <span style={{ fontWeight: "800", color: "#2563eb" }}>Bizwoke</span>
      </div>
    </div>
  );
};
