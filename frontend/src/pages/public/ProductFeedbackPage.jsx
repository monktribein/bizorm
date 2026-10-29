import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import confetti from "canvas-confetti";
import {
  Star,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Package,
  ShieldCheck,
  Send,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Truck,
  ThumbsUp,
  RotateCcw,
} from "lucide-react";

export const ProductFeedbackPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  // Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState(["Good Quality", "Packaging"]);
  const [comment, setComment] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [orderId, setOrderId] = useState("");
  const [isDefect, setIsDefect] = useState(false);
  const [defectCategory, setDefectCategory] = useState("PRODUCT_DAMAGED");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedReview, setCopiedReview] = useState(false);

  const availableTags = [
    { label: "Good Quality", icon: ThumbsUp },
    { label: "Packaging", icon: Package },
    { label: "Fast Delivery", icon: Truck },
    { label: "Value for Money", icon: Sparkles },
    { label: "Product Defect", icon: AlertTriangle, isAlert: true },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getPublicProductByCode(code);
        if (res.success && res.product) {
          setProduct(res.product);
        } else {
          setError(res.message || "Product QR code inactive or not found.");
        }
      } catch (err) {
        setError(err.message || "Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    if (code) fetchProduct();
  }, [code]);

  const toggleTag = (tag) => {
    if (tag === "Product Defect") {
      setIsDefect(!isDefect);
      if (!isDefect) setRating(Math.min(rating, 3));
    }
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleStarClick = (num) => {
    setRating(num);
    if (num <= 3) {
      setIsDefect(true);
      if (!selectedTags.includes("Product Defect")) {
        setSelectedTags([...selectedTags, "Product Defect"]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        rating,
        tags: selectedTags,
        isDefect: isDefect || rating <= 3,
        defectCategory: isDefect || rating <= 3 ? defectCategory : "NONE",
        comment: comment.trim(),
        customerName: customerName.trim() || "Customer",
        customerEmail: customerContact.includes("@") ? customerContact.trim() : "",
        customerPhone: !customerContact.includes("@") ? customerContact.trim() : "",
        orderId: orderId.trim(),
      };

      const res = await api.submitProductFeedback(code, payload);
      if (res.success) {
        setSubmitted(true);
        if (rating >= 4) {
          try {
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          } catch {}
        }
      } else {
        alert(res.message || "Failed to submit feedback");
      }
    } catch (err) {
      alert(err.message || "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyFeedback = () => {
    const text = comment || `Excellent product quality from ${product?.brandName || "this brand"}! Highly recommended.`;
    navigator.clipboard.writeText(text);
    setCopiedReview(true);
    setTimeout(() => setCopiedReview(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <div style={{ textAlign: "center" }}>
          <div className="spinner" style={{ width: 36, height: 36, border: "3px solid #e2e8f0", borderTopColor: "#004ac6", borderRadius: "50%", margin: "0 auto 14px", animation: "spin 0.8s linear infinite" }} />
          <p style={{ color: "#64748b", fontSize: "14px", fontWeight: "600" }}>Loading Product Experience...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: "20px" }}>
        <div className="card" style={{ maxWidth: "420px", width: "100%", textAlign: "center", padding: "32px 24px", borderRadius: "16px", background: "#ffffff", border: "1px solid #e2e8f0" }}>
          <AlertTriangle size={48} color="#ef4444" style={{ margin: "0 auto 16px" }} />
          <h2 style={{ fontSize: "19px", fontWeight: "800", color: "#0f172a" }}>Product QR Inactive</h2>
          <p style={{ fontSize: "13.5px", color: "#64748b", marginTop: "8px", lineHeight: 1.5 }}>
            {error || "The product packaging QR you scanned is not registered or has expired."}
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn btn-primary btn-sm"
            style={{ marginTop: "20px" }}
          >
            Go to BizORM Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", display: "flex", flexDirection: "column", position: "relative" }}>
      {/* Top Header */}
      <header style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            type="button"
            onClick={() => window.history.length > 1 ? navigate(-1) : navigate("/")}
            style={{ border: "none", background: "transparent", cursor: "pointer", padding: "4px", color: "#64748b" }}
            title="Back"
          >
            <ArrowLeft size={16} />
          </button>
          <div style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Product Feedback
          </div>
        </div>
        <div style={{ fontSize: "11px", fontWeight: "600", color: "#64748b" }}>
          Powered by <strong style={{ color: "#004ac6" }}>BizORM™</strong>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, padding: "20px 14px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            maxWidth: "460px",
            width: "100%",
            background: "#ffffff",
            borderRadius: "18px",
            boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.08)",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}
        >
          {/* Product Header Banner */}
          <div style={{ padding: "20px 22px 16px", background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", background: "#e0f2fe", color: "#0284c7", padding: "2px 8px", borderRadius: "999px" }}>
                {product.channel} VERIFIED
              </span>
              {product.qrType && (
                <span style={{ fontSize: "11px", fontWeight: "600", color: "#64748b" }}>
                  {product.qrType} QR
                </span>
              )}
            </div>

            <h1 style={{ fontSize: "17.5px", fontWeight: "800", color: "#0f172a", margin: "4px 0 2px", lineHeight: 1.3 }}>
              {product.name}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
              <span>SKU: <strong style={{ color: "#334155" }}>{product.sku}</strong></span>
              {product.batchNumber && <span>• Batch: <strong style={{ color: "#334155" }}>{product.batchNumber}</strong></span>}
            </div>
          </div>

          {/* Submitted Screen */}
          {submitted ? (
            <div style={{ padding: "32px 24px", textAlign: "center" }}>
              <CheckCircle2 size={54} color="#16a34a" style={{ margin: "0 auto 16px" }} />
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>
                {isDefect ? "Complaint Registered" : "Thank You For Your Review!"}
              </h2>

              <p style={{ fontSize: "13.5px", color: "#64748b", margin: "8px 0 20px", lineHeight: 1.5 }}>
                {isDefect
                  ? `Your ticket has been prioritized directly with the ${product.brandName} quality & support team. Our support engineer will reach out via WhatsApp/email shortly.`
                  : `Your product rating has been recorded for ${product.brandName}. We appreciate your support in helping us maintain the highest product quality!`}
              </p>

              {rating >= 4 && (
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px", marginBottom: "18px", textAlign: "left" }}>
                  <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#0f172a", marginBottom: "6px" }}>
                    Share Your Honest Feedback on {product.channel === "FLIPKART" ? "Flipkart" : "Amazon"}:
                  </div>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 12px 0" }}>
                    Copy your review text below to share your genuine experience with other buyers:
                  </p>
                  <button
                    type="button"
                    onClick={copyFeedback}
                    className="btn btn-secondary btn-sm"
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                  >
                    {copiedReview ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                    <span>{copiedReview ? "Review Copied to Clipboard!" : "Copy Review Text"}</span>
                  </button>
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="btn btn-outline btn-sm"
                >
                  <RotateCcw size={13} style={{ marginRight: "4px" }} />
                  Submit Another Feedback
                </button>
              </div>
            </div>
          ) : (
            /* Review Form */
            <form onSubmit={handleSubmit} style={{ padding: "20px 22px" }}>
              {/* Star Rating Section */}
              <div style={{ textAlign: "center", marginBottom: "18px" }}>
                <div style={{ fontSize: "13.5px", fontWeight: "700", color: "#334155", marginBottom: "8px" }}>
                  How was your product experience?
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "4px",
                        transform: (hoverRating || rating) >= star ? "scale(1.15)" : "scale(1)",
                        transition: "transform 0.15s ease",
                      }}
                    >
                      <Star
                        size={32}
                        color={(hoverRating || rating) >= star ? "#f59e0b" : "#cbd5e1"}
                        fill={(hoverRating || rating) >= star ? "#f59e0b" : "none"}
                      />
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: "12px", fontWeight: "600", color: rating >= 4 ? "#16a34a" : "#dc2626", marginTop: "6px" }}>
                  {rating === 5 ? "⭐⭐⭐⭐⭐ Outstanding" : rating === 4 ? "⭐⭐⭐⭐ Very Good" : rating === 3 ? "⭐⭐⭐ Average / Issue" : rating === 2 ? "⭐⭐ Disappointed" : "⭐ Poor / Defective"}
                </div>
              </div>

              {/* Aspect Feedback Tags */}
              <div style={{ marginBottom: "18px" }}>
                <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#475569", marginBottom: "8px" }}>
                  What would you like to highlight?
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag.label);
                    const TagIcon = tag.icon;
                    return (
                      <button
                        type="button"
                        key={tag.label}
                        onClick={() => toggleTag(tag.label)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 12px",
                          borderRadius: "999px",
                          border: isSelected
                            ? tag.isAlert
                              ? "1px solid #ef4444"
                              : "1px solid #004ac6"
                            : "1px solid #e2e8f0",
                          backgroundColor: isSelected
                            ? tag.isAlert
                              ? "#fef2f2"
                              : "#eff6ff"
                            : "#ffffff",
                          color: isSelected
                            ? tag.isAlert
                              ? "#dc2626"
                              : "#004ac6"
                            : "#475569",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <TagIcon size={13} />
                        <span>{tag.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Defect Reporting Card (if defect or low rating) */}
              {(isDefect || rating <= 3) && (
                <div
                  style={{
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "12px",
                    padding: "14px 16px",
                    marginBottom: "18px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", color: "#991b1b", fontSize: "13px", marginBottom: "8px" }}>
                    <AlertTriangle size={16} color="#ef4444" />
                    <span>Quality Resolution &amp; Free Replacement</span>
                  </div>
                  <p style={{ fontSize: "11.5px", color: "#7f1d1d", margin: "0 0 10px 0", lineHeight: 1.4 }}>
                    We apologize for the inconvenience! Report what went wrong so the {product.brandName} team can resolve it directly.
                  </p>

                  <label style={{ display: "block", fontSize: "11.5px", fontWeight: "700", color: "#374151", marginBottom: "4px" }}>
                    Defect Classification:
                  </label>
                  <select
                    value={defectCategory}
                    onChange={(e) => setDefectCategory(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      backgroundColor: "#ffffff",
                      fontSize: "12.5px",
                      color: "#0f172a",
                      marginBottom: "10px",
                    }}
                  >
                    <option value="PRODUCT_DAMAGED">Product Damaged / Broken in Transit</option>
                    <option value="PACKAGING_DEFECT">Outer Box / Packaging Crushed</option>
                    <option value="WRONG_ITEM">Wrong Item or Variant Sent</option>
                    <option value="MISSING_PARTS">Missing Parts or Accessories</option>
                    <option value="QUALITY_ISSUE">Material / Workmanship Quality Issue</option>
                    <option value="DELIVERY_DELAY">Severe Delivery Delay / Seal Broken</option>
                    <option value="OTHER">Other Issue</option>
                  </select>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#475569", marginBottom: "2px" }}>
                        Order ID (Optional):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 402-892182"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        style={{ width: "100%", padding: "7px 9px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#475569", marginBottom: "2px" }}>
                        Phone / WhatsApp:
                      </label>
                      <input
                        type="text"
                        placeholder="For replacement status"
                        value={customerContact}
                        onChange={(e) => setCustomerContact(e.target.value)}
                        style={{ width: "100%", padding: "7px 9px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Review Comment Field */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                  What would you like to share?
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about the quality, durability, or packaging..."
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "13px",
                    color: "#0f172a",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* Optional Name */}
              {!isDefect && rating >= 4 && (
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "4px" }}>
                    Your Name (Optional):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Priya M."
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "12.5px",
                    }}
                  />
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  fontWeight: "700",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 14px rgba(0, 74, 198, 0.25)",
                }}
              >
                {submitting ? (
                  <span>Saving feedback...</span>
                ) : (
                  <>
                    <Send size={15} />
                    <span>{isDefect ? "Submit Complaint &amp; Get Support" : "Submit Experience Rating"}</span>
                  </>
                )}
              </button>

              {/* FTC & Policy Compliance Footer Note */}
              <div style={{ marginTop: "14px", textAlign: "center", fontSize: "11px", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                <ShieldCheck size={13} color="#10b981" />
                <span>FTC &amp; Marketplace Policy Compliant Feedback Engine</span>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductFeedbackPage;
