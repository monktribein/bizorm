import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { api } from "../../services/api";
import { Star, ShieldCheck, ExternalLink } from "lucide-react";

export const ReviewBadgeWidgetPage = () => {
  const { formKey } = useParams();
  const [searchParams] = useSearchParams();

  const theme = searchParams.get("theme") || "light";
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState(null);

  useEffect(() => {
    if (!formKey) return;
    setLoading(true);
    api
      .getPublicReviews(formKey)
      .then((res) => {
        if (res.success) {
          setBusiness(res.business);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [formKey]);

  if (loading || !business) {
    return null;
  }

  const reviewUrl = `${window.location.origin}/wtr/${formKey}`;
  const starColor = "#f59e0b";

  return (
    <div
      style={{
        margin: 0,
        padding: "6px",
        background: "transparent",
        fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: "inline-block",
      }}
    >
      <a
        href={reviewUrl}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          padding: "8px 16px",
          borderRadius: "9999px",
          background: isDark ? "#0f172a" : "#ffffff",
          color: isDark ? "#ffffff" : "#0f172a",
          border: isDark ? "1.5px solid #334155" : "1.5px solid #e2e8f0",
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          textDecoration: "none",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          cursor: "pointer",
        }}
      >
        {/* Google / Brand Icon */}
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "#2563eb",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontWeight: "800",
            fontSize: "13px",
          }}
        >
          {business.name ? business.name.charAt(0).toUpperCase() : "G"}
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ fontSize: "13px", fontWeight: "800", lineHeight: 1.2 }}>
              {business.averageRating || "5.0"}
            </span>
            <div style={{ display: "flex", gap: "1px" }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={12}
                  fill={s <= Math.round(business.averageRating || 5) ? starColor : "none"}
                  color={starColor}
                />
              ))}
            </div>
          </div>
          <div style={{ fontSize: "10px", color: isDark ? "#94a3b8" : "#64748b", lineHeight: 1.2 }}>
            {business.totalReviews || 0}+ Verified Reviews
          </div>
        </div>

        <ShieldCheck size={16} color="#10b981" />
      </a>
    </div>
  );
};
