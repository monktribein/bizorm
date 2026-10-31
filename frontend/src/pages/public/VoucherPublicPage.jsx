import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Gift,
  Copy,
  Check,
  Calendar,
  ShieldCheck,
  AlertCircle,
  Scissors,
  Sparkles,
  ArrowRight,
  Store,
} from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../../services/api";

export const VoucherPublicPage = () => {
  const { code } = useParams();
  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!code) return;
    setLoading(true);
    api.getPublicVoucher(code)
      .then((res) => {
        if (res.success && res.voucher) {
          setVoucher(res.voucher);
        } else {
          setError("Voucher pass not found or may have expired.");
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load voucher pass.");
      })
      .finally(() => setLoading(false));
  }, [code]);

  const handleCopyCode = () => {
    if (!voucher?.couponCode) return;
    navigator.clipboard.writeText(voucher.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <div style={{ textAlign: "center", color: "#64748b" }}>
          <div className="spin" style={{ display: "inline-block", marginBottom: "12px" }}>
            <Gift size={32} color="#0052cc" />
          </div>
          <div style={{ fontSize: "15px", fontWeight: "700" }}>Loading your exclusive voucher pass...</div>
        </div>
      </div>
    );
  }

  if (error || !voucher) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: "20px" }}>
        <div style={{ maxWidth: "420px", background: "#ffffff", padding: "32px", borderRadius: "16px", textAlign: "center", border: "1px solid #e2e8f0" }}>
          <AlertCircle size={42} color="#ef4444" style={{ marginBottom: "12px" }} />
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: "0 0 8px" }}>Pass Not Available</h2>
          <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 20px" }}>{error || "This coupon pass is inactive or has expired."}</p>
          <Link to="/" style={{ display: "inline-block", padding: "10px 20px", borderRadius: "8px", background: "#0052cc", color: "#ffffff", textDecoration: "none", fontWeight: "700", fontSize: "13.5px" }}>
            Return to BizORM
          </Link>
        </div>
      </div>
    );
  }

  const isLuxury = voucher.templateStyle === "luxury";
  const isFestive = voucher.templateStyle === "festive";
  const isMinimal = voucher.templateStyle === "minimal";
  const isTicket = voucher.templateStyle === "voucher_ticket";

  const themeColor = voucher.themeColor || "#0052cc";

  const bgColor = isLuxury
    ? "#0f172a"
    : isFestive
    ? `linear-gradient(135deg, ${themeColor} 0%, #ff6b6b 100%)`
    : voucher.templateStyle === "modern"
    ? `linear-gradient(135deg, ${themeColor} 0%, #3b82f6 100%)`
    : "#ffffff";

  const textColor = isLuxury || isFestive || voucher.templateStyle === "modern" ? "#ffffff" : "#0f172a";
  const subtextColor = isLuxury || isFestive || voucher.templateStyle === "modern" ? "rgba(255,255,255,0.8)" : "#64748b";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
        padding: "36px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: "460px", width: "100%" }}>
        {/* Brand Banner */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "999px",
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              fontSize: "12px",
              fontWeight: "700",
              color: "#0052cc",
              boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
            }}
          >
            <ShieldCheck size={14} color="#059669" />
            <span>Verified Customer Privilege Pass</span>
          </div>
        </div>

        {/* Voucher Pass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            fontFamily: voucher.fontFamily || "Outfit",
            background: bgColor,
            color: textColor,
            borderRadius: "24px",
            border: isMinimal ? `2px solid ${themeColor}` : `1px solid ${isLuxury ? "#334155" : "#e2e8f0"}`,
            boxShadow: "0 20px 48px -12px rgba(0,0,0,0.18)",
            padding: "30px 24px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: themeColor,
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Store size={16} />
              </div>
              <span style={{ fontSize: "14px", fontWeight: "800" }}>{voucher.businessName}</span>
            </div>

            <span
              style={{
                fontSize: "11px",
                fontWeight: "800",
                padding: "4px 12px",
                borderRadius: "999px",
                background: themeColor,
                color: "#ffffff",
              }}
            >
              VIP PASS
            </span>
          </div>

          {/* Offer Value Highlight */}
          <div style={{ margin: "20px 0 10px", textAlign: "center" }}>
            <div style={{ fontSize: "11.5px", textTransform: "uppercase", letterSpacing: "1.2px", color: subtextColor, fontWeight: "700" }}>
              Exclusive Offer
            </div>
            <div
              style={{
                fontSize: "clamp(34px, 7vw, 44px)",
                fontWeight: "900",
                color: isLuxury ? "#38bdf8" : isMinimal ? themeColor : textColor,
                lineHeight: 1.1,
                margin: "4px 0",
              }}
            >
              {voucher.offerValue}
            </div>
            <div style={{ fontSize: "17px", fontWeight: "700" }}>{voucher.title}</div>
          </div>

          <p style={{ textAlign: "center", fontSize: "13px", color: subtextColor, lineHeight: 1.45, margin: "10px 0 20px" }}>
            {voucher.description}
          </p>

          {/* Ticket Perforation */}
          {isTicket && (
            <div style={{ display: "flex", alignItems: "center", margin: "20px -24px", position: "relative" }}>
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#f1f5f9", marginLeft: "-11px" }} />
              <div style={{ flex: 1, borderTop: "2px dashed #cbd5e1" }} />
              <div style={{ padding: "0 8px", color: subtextColor }}>
                <Scissors size={15} />
              </div>
              <div style={{ flex: 1, borderTop: "2px dashed #cbd5e1" }} />
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#f1f5f9", marginRight: "-11px" }} />
            </div>
          )}

          {/* Coupon Code Box */}
          <div
            onClick={handleCopyCode}
            style={{
              background: isLuxury ? "rgba(255,255,255,0.08)" : "#f8fafc",
              border: `2px dashed ${themeColor}`,
              padding: "16px",
              borderRadius: "14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              transition: "transform 0.15s ease",
            }}
          >
            <div>
              <div style={{ fontSize: "10.5px", fontWeight: "700", color: subtextColor, textTransform: "uppercase" }}>
                Coupon Promo Code
              </div>
              <div style={{ fontSize: "24px", fontWeight: "900", letterSpacing: "2.5px", color: themeColor }}>
                {voucher.couponCode}
              </div>
            </div>

            <button
              type="button"
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                backgroundColor: copied ? "#10b981" : themeColor,
                color: "#ffffff",
                border: "none",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "background 0.2s",
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? "COPIED" : "TAP TO COPY"}</span>
            </button>
          </div>

          {/* Barcode Mock */}
          <div style={{ textAlign: "center", marginTop: "22px" }}>
            <div
              style={{
                display: "inline-block",
                padding: "10px 18px",
                background: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ display: "flex", gap: "3px", height: "36px", alignItems: "center" }}>
                {[3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3].map((w, idx) => (
                  <div key={idx} style={{ width: `${w}px`, height: "100%", background: "#0f172a" }} />
                ))}
              </div>
              <div style={{ fontSize: "10px", color: "#64748b", fontWeight: "700", marginTop: "4px", letterSpacing: "1px" }}>
                *{voucher.couponCode}*
              </div>
            </div>
          </div>

          {/* Expiry & Terms */}
          <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: `1px solid ${isLuxury ? "#334155" : "#f1f5f9"}`, fontSize: "11.5px", color: subtextColor, textAlign: "center" }}>
            <div>⏳ Valid Till: <strong>{new Date(voucher.expiryDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</strong></div>
            <div style={{ marginTop: "4px" }}>{voucher.terms}</div>
          </div>
        </motion.div>

        {/* Footer info */}
        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "#64748b" }}>
          Show this pass to the store manager or cashier to redeem your discount.
        </div>
      </div>
    </div>
  );
};

export default VoucherPublicPage;

