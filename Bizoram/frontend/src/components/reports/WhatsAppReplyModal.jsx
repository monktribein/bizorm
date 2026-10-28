import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Send, Copy, Check, Gift, Star, AlertTriangle, ExternalLink, MessageCircle, Sparkles } from "lucide-react";

export const WhatsAppReplyModal = ({ review, businessName, reviewLink, isOpen, onClose }) => {
  if (!isOpen || !review) return null;

  const isPositive = review.star >= 4;
  const customerName = review.name && review.name !== "Happy Customer" && review.name !== "Customer"
    ? review.name
    : "Valued Customer";

  const [selectedOffer, setSelectedOffer] = useState("10off");
  const [customOfferText, setCustomOfferText] = useState("");
  const [includeReviewLink, setIncludeReviewLink] = useState(true);
  const [customizedMessage, setCustomizedMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // Available offer templates
  const OFFERS = [
    { id: "10off", label: "🎁 10% OFF on next visit (Code: SAVE10)", text: "As a token of our appreciation, please enjoy 10% OFF on your next visit! Use promo code: SAVE10 🎁" },
    { id: "15off", label: "🎁 15% OFF on next order (Code: VIP15)", text: "We'd love to treat you to 15% OFF on your next order! Use code: VIP15 🎁" },
    { id: "20off", label: "🌟 20% OFF Loyalty Reward (Code: LOYAL20)", text: "Please accept a special 20% OFF discount as our loyal customer! Code: LOYAL20 🌟" },
    { id: "freeItem", label: "☕ Complimentary Refreshment / Dessert", text: "Please enjoy a complimentary treat / refreshment on the house during your next visit! ☕🍰" },
    { id: "custom", label: "✏️ Custom Offer", text: "" },
    { id: "none", label: "❌ No Offer", text: "" },
  ];

  // Helper to generate the message draft based on customer's rating & feedback description
  const generateDraft = (offerId = selectedOffer, customText = customOfferText, withLink = includeReviewLink) => {
    const biz = businessName || "our business";
    const feedbackSnippet = review.review && review.review.length > 8
      ? `"${review.review.slice(0, 160)}${review.review.length > 160 ? "..." : ""}"`
      : "";

    let greeting = `Dear ${customerName},\n\n`;
    let body = "";

    if (isPositive) {
      body += `Thank you so much for taking the time to share your glowing ${review.star}-star rating for ${biz}! 🌟\n\n`;
      if (feedbackSnippet) {
        body += `We are thrilled to read your feedback: ${feedbackSnippet}\n\n`;
      }
      body += `Our team takes immense pride in delivering top-quality service, and words like yours truly motivate us.\n\n`;
    } else {
      body += `We noticed your ${review.star}-star feedback for ${biz}, and we sincerely apologize that your experience did not meet expectations.\n\n`;
      if (feedbackSnippet) {
        body += `Regarding your concern: ${feedbackSnippet}\n\n`;
      }
      body += `Our management team has taken note of this and is already taking steps to resolve it. We value you and want to make things right.\n\n`;
    }

    // Add Offer
    const offerObj = OFFERS.find((o) => o.id === offerId);
    let offerContent = "";
    if (offerId === "custom" && customText.trim()) {
      offerContent = `${customText.trim()}\n\n`;
    } else if (offerObj && offerObj.text) {
      offerContent = `${offerObj.text}\n\n`;
    }
    if (offerContent) {
      body += offerContent;
    }

    // Add Review Link if enabled
    if (withLink && reviewLink) {
      body += `You can also check our review portal or update your review anytime here:\n👉 ${reviewLink}\n\n`;
    }

    body += `Warm regards,\nManagement Team\n${biz}`;
    return greeting + body;
  };

  useEffect(() => {
    setCustomizedMessage(generateDraft(selectedOffer, customOfferText, includeReviewLink));
  }, [review, selectedOffer, customOfferText, includeReviewLink, businessName, reviewLink]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(customizedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = customizedMessage;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Launch WhatsApp with recipient & pre-encoded message
  const handleSendWhatsApp = () => {
    const rawMobile = review.mobile ? review.mobile.replace(/[^0-9]/g, "") : "";
    let formattedPhone = "";
    if (rawMobile.length === 10) {
      formattedPhone = `91${rawMobile}`;
    } else if (rawMobile.length > 10) {
      formattedPhone = rawMobile;
    }

    const encoded = encodeURIComponent(customizedMessage);
    const waUrl = formattedPhone
      ? `https://wa.me/${formattedPhone}?text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;

    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const hasValidPhone = review.mobile && review.mobile !== "N/A" && review.mobile.replace(/[^0-9]/g, "").length >= 10;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999999,
        padding: "20px",
        boxSizing: "border-box",
        overflowY: "auto",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "18px",
          width: "100%",
          maxWidth: "580px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.45)",
          overflow: "hidden",
          margin: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 22px",
            borderBottom: "1px solid #e2e8f0",
            background: "#f8fafc",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "#25D366",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <MessageCircle size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                Send WhatsApp Reply & Offer
              </h2>
              <span style={{ fontSize: "11px", color: "#64748b" }}>
                Auto-tailored to {customerName}'s {review.star}★ review
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "6px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "20px 22px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px", flex: "1 1 auto", minHeight: 0 }}>
          {/* Customer Review Summary Card */}
          <div style={{
            background: isPositive ? "#f0fdf4" : "#fff1f2",
            border: isPositive ? "1px solid #bbf7d0" : "1px solid #fecdd3",
            borderRadius: "12px",
            padding: "12px 14px",
            fontSize: "12px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <div style={{ fontWeight: "700", color: isPositive ? "#166534" : "#9f1239", display: "flex", alignItems: "center", gap: "6px" }}>
                <span>{customerName}</span>
                <span style={{ fontWeight: "500", color: "#64748b" }}>({review.mobile || "No Mobile"})</span>
              </div>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                background: isPositive ? "#15803d" : "#e11d48",
                color: "#ffffff",
                padding: "2px 8px",
                borderRadius: "9999px",
                fontWeight: "700",
                fontSize: "11px",
              }}>
                <Star size={11} fill="#ffffff" />
                <span>{review.star}.0</span>
              </div>
            </div>
            {review.review && (
              <p style={{ margin: "4px 0 0", color: isPositive ? "#14532d" : "#881337", fontStyle: "italic", fontSize: "12px", lineHeight: "1.4" }}>
                "{review.review}"
              </p>
            )}
          </div>

          {/* Offer Selection */}
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
              <Gift size={14} color="#2563eb" />
              <span>Attach Customer Offer / Discount:</span>
            </label>
            <select
              value={selectedOffer}
              onChange={(e) => setSelectedOffer(e.target.value)}
              className="form-input"
              style={{
                width: "100%",
                padding: "8px 10px",
                fontSize: "12px",
                fontWeight: "600",
                borderRadius: "8px",
                cursor: "pointer",
                background: "#f8fafc",
              }}
            >
              {OFFERS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>

            {selectedOffer === "custom" && (
              <input
                type="text"
                placeholder="e.g. Enjoy Flat 10% off + free beverage on your next bill!"
                value={customOfferText}
                onChange={(e) => setCustomOfferText(e.target.value)}
                className="form-input"
                style={{ marginTop: "6px", fontSize: "12px", padding: "8px 10px" }}
              />
            )}
          </div>

          {/* Review Link Inclusion */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              id="includeReviewLinkCheckbox"
              checked={includeReviewLink}
              onChange={(e) => setIncludeReviewLink(e.target.checked)}
              style={{ width: "15px", height: "15px", cursor: "pointer" }}
            />
            <label htmlFor="includeReviewLinkCheckbox" style={{ fontSize: "12px", color: "#334155", cursor: "pointer", fontWeight: "600" }}>
              Include Review Portal Link in message for customer convenience
            </label>
          </div>

          {/* Editable WhatsApp Message Box */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", margin: 0 }}>
                WhatsApp Message (Ready to Send / Editable):
              </label>
              <button
                type="button"
                onClick={handleCopy}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  background: copied ? "#dcfce7" : "#f1f5f9",
                  border: "1px solid #cbd5e1",
                  color: copied ? "#16a34a" : "#475569",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
            <textarea
              rows={8}
              value={customizedMessage}
              onChange={(e) => setCustomizedMessage(e.target.value)}
              className="form-textarea"
              style={{
                width: "100%",
                borderRadius: "10px",
                fontSize: "12px",
                lineHeight: "1.5",
                padding: "10px 12px",
                background: "#fafafa",
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: "14px 22px",
          borderTop: "1px solid #e2e8f0",
          background: "#f8fafc",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
        }}>
          <button
            onClick={onClose}
            className="btn btn-outline btn-sm"
            style={{ borderRadius: "8px", padding: "8px 16px" }}
          >
            Cancel
          </button>

          <button
            onClick={handleSendWhatsApp}
            className="btn btn-sm"
            style={{
              background: "#25D366",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              padding: "9px 18px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "700",
              fontSize: "13px",
              boxShadow: "0 2px 8px rgba(37, 211, 102, 0.3)",
              cursor: "pointer",
            }}
          >
            <MessageCircle size={16} />
            <span>Send on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
