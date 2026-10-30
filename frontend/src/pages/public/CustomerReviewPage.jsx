import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { BUSINESS_CATEGORIES } from "../../constants/categories";
import { getCleanBrandName } from "../../utils/brand";
import confetti from "canvas-confetti";
import {
  Star,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Building2,
  HeartHandshake,
  Send,
  RefreshCw,
  Check,
  ArrowRight,
  ArrowLeft,
  Copy,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export const CustomerReviewPage = () => {
  const navigate = useNavigate();
  const { formKey } = useParams();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [context, setContext] = useState(null);
  const [error, setError] = useState(null);

  // Helper to get or create a persistent device identifier
  const getDeviceId = () => {
    try {
      let id = localStorage.getItem("bizwoke_client_device_id");
      if (!id) {
        id = "dev_" + Math.random().toString(36).substring(2, 10) + "_" + Date.now().toString(36);
        localStorage.setItem("bizwoke_client_device_id", id);
      }
      return id;
    } catch {
      return "";
    }
  };

  // Step 1 Review Form State (Prefilled if query params present)
  const initialStarParam = Number(searchParams.get("star"));
  const [star, setStar] = useState(initialStarParam >= 1 && initialStarParam <= 5 ? initialStarParam : 5);
  const [hoverStar, setHoverStar] = useState(0);
  const [name, setName] = useState(searchParams.get("name") || "");
  const [mobile, setMobile] = useState(searchParams.get("mobile") || "");
  const [staffMember, setStaffMember] = useState(searchParams.get("staff") || "");
  const [review, setReview] = useState("");
  const [title, setTitle] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [seed, setSeed] = useState(0);
  const [reviewOptions, setReviewOptions] = useState([]);
  const [selectedOptionId, setSelectedOptionId] = useState("quick");
  const [lang, setLang] = useState("en");
  const [generatingOptions, setGeneratingOptions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Step 2 Private Survey State (for 1-3 stars)
  const [isGatedSurveyStep, setIsGatedSurveyStep] = useState(false);
  const [ratingId, setRatingId] = useState(null);
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [surveyAnswers, setSurveyAnswers] = useState({});
  const [completed, setCompleted] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const copySynchronous = (cleanText) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = cleanText;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.left = "0";
      textArea.style.top = "0";
      textArea.style.width = "2em";
      textArea.style.height = "2em";
      textArea.style.padding = "0";
      textArea.style.border = "none";
      textArea.style.outline = "none";
      textArea.style.boxShadow = "none";
      textArea.style.background = "transparent";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, cleanText.length);
      const copied = document.execCommand("copy");
      document.body.removeChild(textArea);
      return copied;
    } catch (err) {
      console.warn("execCommand copy failed", err);
      return false;
    }
  };

  // Reliable Dual-Engine Clipboard Copier (Works across modern & legacy browser contexts)
  const copyTextToClipboard = async (textToCopy) => {
    if (!textToCopy || !textToCopy.trim()) return false;
    const cleanText = textToCopy.trim();
    let copied = copySynchronous(cleanText);

    // Also call modern Async Clipboard API
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(cleanText);
        copied = true;
      } catch (err) {
        console.warn("navigator.clipboard failed, relying on synchronous copy", err);
      }
    }

    if (copied) {
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 3000);
    }
    return copied;
  };

  // Industry tags are dynamically configured by the business owner in their dashboard
  const businessCategory = context?.branding?.businessCategory || "general";
  const matchedCategoryObj =
    BUSINESS_CATEGORIES.find((c) => c.id === businessCategory) ||
    BUSINESS_CATEGORIES[0];
  const displayedTags =
    context?.branding?.customTags?.length > 0
      ? context.branding.customTags
      : matchedCategoryObj.tags;

  const displayedNegativeTags =
    context?.branding?.customNegativeTags?.length > 0
      ? context.branding.customNegativeTags
      : matchedCategoryObj?.negativeTags?.length > 0
      ? matchedCategoryObj.negativeTags
      : [
          "Poor Customer Service",
          "Slow Response Time",
          "Unprofessional Staff",
          "Poor Quality Standards",
          "Lack of Communication",
          "Overpriced / Hidden Charges",
          "Delays & Long Wait",
          "Rude Behavior",
          "Unresolved Issue",
          "Did Not Meet Expectations",
        ];

  const currentTagsList = star >= 4 ? displayedTags : displayedNegativeTags;

  // Available staff members (from backend context + default team roles)
  const defaultStaffRoles = [
    "General / Team",
    "Front Desk / Reception",
    "Customer Support",
    "Service Specialist",
    "Billing / Cash Desk",
    "Manager / Supervisor",
  ];
  const contextStaff = Array.isArray(context?.staffMembers) ? context.staffMembers : [];
  const availableStaff = [
    ...contextStaff,
    ...defaultStaffRoles.filter((r) => !contextStaff.includes(r)),
  ];

  useEffect(() => {
    if (!formKey) return;
    setLoading(true);

    // Clean up any previous submission lock keys so user can review anytime
    try {
      localStorage.removeItem(`bizwoke_reviewed_${formKey}`);
    } catch {}

    api.getPublicContext(formKey)
      .then((res) => {
        if (res.success) {
          setContext(res);
          if (res.platforms?.length > 0) {
            setSelectedPlatform(res.platforms[0]);
          }
          if (res.user?.formKey && res.user.formKey !== formKey) {
            window.history.replaceState(null, "", `/wtr/${res.user.formKey}`);
            try {
              localStorage.removeItem(`bizwoke_reviewed_${res.user.formKey}`);
            } catch {}
          }
        }
      })
      .catch((err) => {
        setError(err.message || "Invalid review link");
      })
      .finally(() => setLoading(false));
  }, [formKey]);

  useEffect(() => {
    const qName = searchParams.get("name");
    const qMobile = searchParams.get("mobile");
    const qStaff = searchParams.get("staff");
    const qStar = Number(searchParams.get("star"));
    if (qName) setName(qName);
    if (qMobile) setMobile(qMobile);
    if (qStaff) setStaffMember(qStaff);
    if (qStar >= 1 && qStar <= 5) setStar(qStar);
  }, [searchParams]);

  // Helper to fetch AI review suggestions (all 3 options)
  const fetchReviewSuggestions = (
    currentStar = star,
    currentTags = selectedTags,
    currentSeed = seed,
    currentLang = lang
  ) => {
    if (!context || currentStar < 4) {
      setReviewOptions([]);
      return;
    }
    const bizName = context?.user?.cmpy || context?.branding?.cmpyName || "this business";
    const availableTags = displayedTags;
    const finalTags = currentTags.length > 0 ? currentTags : availableTags.slice(0, 2);

    setGeneratingOptions(true);
    api.generateReviewText({
      star: currentStar,
      title,
      businessName: bizName,
      tags: finalTags,
      seed: currentSeed,
      lang: currentLang,
    })
      .then((res) => {
        if (res.success) {
          if (Array.isArray(res.options) && res.options.length > 0) {
            setReviewOptions(res.options);
            // Sync with current selection or first option
            const currentSelected = res.options.find((o) => o.id === selectedOptionId) || res.options[0];
            setReview((prev) => {
              if (!prev || reviewOptions.some((o) => o.text === prev)) {
                return currentSelected.text;
              }
              return prev;
            });
          } else if (res.review && !review) {
            setReview(res.review);
          }
        }
      })
      .catch(console.error)
      .finally(() => setGeneratingOptions(false));
  };

  // Initial load effect for review suggestions
  useEffect(() => {
    if (context && star >= 4) {
      fetchReviewSuggestions(star, selectedTags, seed, lang);
    }
  }, [context]);

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    if (star >= 4) {
      fetchReviewSuggestions(star, selectedTags, seed, newLang);
    }
  };

  const handleSelectOption = (opt) => {
    setSelectedOptionId(opt.id);
    setReview(opt.text);
    copyTextToClipboard(opt.text);
  };

  // Auto-generate suggested review text using natural human phrasing
  const handleTagToggle = (tag) => {
    const updated = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(updated);

    if (star >= 4) {
      fetchReviewSuggestions(star, updated, seed, lang);
    } else {
      if (updated.length > 0) {
        api.generateReviewText({
          star,
          title,
          businessName: context?.user?.cmpy || context?.branding?.cmpyName || "this business",
          tags: updated,
          seed,
          lang,
        }).then((res) => {
          if (res.success) setReview(res.review);
        }).catch(console.error);
      } else {
        setReview("");
      }
    }
  };

  const handleStarClick = (s) => {
    const isPreviousPositive = star >= 4;
    const isNewPositive = s >= 4;
    setStar(s);

    let tagsToPass = selectedTags;
    // When switching sentiment between positive and negative, reset selected tags
    if (isPreviousPositive !== isNewPositive) {
      tagsToPass = [];
      setSelectedTags([]);
    }

    if (s >= 4) {
      fetchReviewSuggestions(s, tagsToPass, seed, lang);
    } else {
      setReviewOptions([]);
      const availableTags = displayedNegativeTags;
      const finalTags = tagsToPass.length > 0 ? tagsToPass : availableTags.slice(0, 2);
      api.generateReviewText({
        star: s,
        title,
        businessName: context?.user?.cmpy || context?.branding?.cmpyName || "this business",
        tags: finalTags,
        seed,
        lang,
      }).then((res) => {
        if (res.success && res.review) {
          setReview(res.review);
        }
      }).catch(console.error);
    }
  };

  const handleShuffleWording = () => {
    const nextSeed = seed + 1;
    setSeed(nextSeed);
    if (star >= 4) {
      fetchReviewSuggestions(star, selectedTags, nextSeed, lang);
    } else {
      const availableTags = displayedNegativeTags;
      api.generateReviewText({
        star,
        title,
        businessName: context?.user?.cmpy || context?.branding?.cmpyName || "this business",
        tags: selectedTags.length > 0 ? selectedTags : availableTags.slice(0, 2),
        seed: nextSeed,
        lang,
      }).then((res) => {
        if (res.success && res.review) {
          setReview(res.review);
          copyTextToClipboard(res.review);
        }
      }).catch(console.error);
    }
  };


  // Submit Step 1: Neutral Customer Flow (Anti-Gating Compliant)
  const handleSubmitReview = async (e, actionType = "public") => {
    if (e) e.preventDefault();
    setSubmitting(true);
    setError(null);

    const cleanName = name ? name.trim() : "";
    const cleanMobile = mobile ? mobile.replace(/\D/g, "").slice(0, 10) : "";

    if (cleanMobile && cleanMobile.length > 0 && cleanMobile.length !== 10) {
      setError("Mobile number must be exactly 10 digits.");
      setSubmitting(false);
      return;
    }

    // Compute review text
    let finalReview = review ? review.trim() : "";
    if (!finalReview && star >= 4) {
      const bizName = context?.user?.cmpy || context?.branding?.cmpyName || "this business";
      finalReview = `Outstanding experience with ${bizName}! Highly recommend their excellent service, professional staff, and great quality.`;
      setReview(finalReview);
    }

    // Direct clipboard copy on user action
    if (finalReview) {
      await copyTextToClipboard(finalReview);
    }

    const destination = selectedPlatform?.webLink || context?.branding?.googleReviewLink || "https://g.page/r/CewgBPDQRwDXEBM/review";

    try {
      const res = await api.saveRating({
        star,
        title,
        review: finalReview,
        name: cleanName || (star >= 4 ? "Happy Customer" : "Customer"),
        mobile: cleanMobile || "N/A",
        staffMember: (staffMember || "").trim(),
        deviceId: getDeviceId(),
        webId: selectedPlatform?._id,
        webName: selectedPlatform?.webName || "Google Reviews",
        webLink: destination,
        formKey,
      });

      if (actionType === "public") {
        if (finalReview) {
          await copyTextToClipboard(finalReview);
        }
        setRedirectUrl(destination);
        setCompleted(true);
        if (destination) {
          await new Promise((resolve) => setTimeout(resolve, 350));
          window.location.assign(destination);
          return;
        }
      } else {
        // Customer chose to send feedback to management
        setRatingId(res.ratingId);
        setCompleted(true);
      }
    } catch (err) {
      setError(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Step 2 (Private Survey)
  const handleSubmitSurvey = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formattedAnswers = Object.keys(surveyAnswers).map((qId) => ({
        questionId: qId,
        score: surveyAnswers[qId],
      }));

      await api.submitSurvey({
        ratingId,
        answers: formattedAnswers,
      });

      setCompleted(true);
    } catch (err) {
      alert("Failed to submit feedback answers: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid #cbd5e1", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Loading review portal...</p>
        </div>
      </div>
    );
  }

  if (error && !context) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: "20px" }}>
        <div className="card" style={{ maxWidth: "440px", textAlign: "center", padding: "40px" }}>
          <AlertTriangle size={48} color="var(--danger)" style={{ margin: "0 auto 16px" }} />
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "var(--secondary)" }}>Review Link Inactive</h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "8px" }}>
            The review destination you accessed is expired or does not exist.
          </p>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="btn btn-primary btn-sm"
            style={{ marginTop: "16px" }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const brandName = getCleanBrandName(context?.user, context?.branding) || "Our Business";
  const brandLogo = context?.branding?.cmpyLogo || null;
  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      display: "flex",
      flexDirection: "column",
      position: "relative",
    }}>
      {/* Quick Back Navigation */}
      <div style={{ position: "absolute", top: 16, left: 16, zIndex: 10 }}>
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate("/dashboard");
            }
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 12px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            background: "#ffffff",
            color: "#475569",
            fontSize: "12.5px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f1f5f9";
            e.currentTarget.style.color = "#0f172a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ffffff";
            e.currentTarget.style.color = "#475569";
          }}
          title="Back to previous page"
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>
      </div>
      {/* Main Review Form Area */}
      <main style={{
        flex: 1,
        padding: "36px 14px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Compact Card */}
        <div className="card animate-fade-in" style={{
          maxWidth: "460px",
          width: "100%",
          padding: "20px 22px",
          borderRadius: "16px",
          boxShadow: "0 8px 24px -4px rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.04)",
          border: "1px solid #e2e8f0",
          background: "#ffffff",
        }}>
          {/* Streamlined Card Header */}
          {!completed && (
            <div style={{ textAlign: "center", marginBottom: "12px" }}>
              {brandLogo && (
                <div style={{ marginBottom: "10px", display: "flex", justifyContent: "center" }}>
                  <img
                    src={brandLogo}
                    alt={brandName}
                    style={{ maxHeight: "38px", maxWidth: "150px", objectFit: "contain", display: "block" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
              <h1 className="font-outfit" style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.4px", margin: 0 }}>
                {context?.branding?.reviewPrompt || `Rate your experience with ${brandName}`}
              </h1>
              <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                Tap stars below to share your feedback
              </p>
            </div>
          )}

          {/* Submission Error Banner */}
          {error && !completed && (
            <div style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "10px",
              padding: "10px 14px",
              marginBottom: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#b91c1c",
              fontSize: "13px",
            }}>
              <AlertTriangle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* State: Positive Completed / Redirect */}
          {completed && star >= 4 && (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <CheckCircle2 size={56} color="#059669" style={{ margin: "0 auto 16px" }} />
              <h2 className="font-outfit" style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>
                Review Copied &amp; Ready to Post!
              </h2>

              {/* Copied Review Text Card */}
              <div style={{
                background: "#f0fdf4",
                border: "2px solid #bbf7d0",
                borderRadius: "14px",
                padding: "16px",
                margin: "18px 0",
                textAlign: "left",
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.08)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", color: "#166534", fontSize: "14px" }}>
                    <Check size={18} color="#16a34a" strokeWidth={3} /> Review Text Copied to Clipboard
                  </div>
                  <button
                    type="button"
                    onClick={() => copyTextToClipboard(review)}
                    style={{
                      background: copiedSuccess ? "#16a34a" : "#ffffff",
                      color: copiedSuccess ? "#ffffff" : "#166534",
                      border: "1px solid #86efac",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {copiedSuccess ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedSuccess ? "Copied!" : "Copy Again"}</span>
                  </button>
                </div>

                <div style={{
                  background: "#ffffff",
                  border: "1px dashed #86efac",
                  borderRadius: "10px",
                  padding: "12px 14px",
                  fontSize: "13px",
                  color: "#1e293b",
                  lineHeight: "1.6",
                  fontStyle: "italic"
                }}>
                  &ldquo;{review}&rdquo;
                </div>
              </div>

              {/* Clear 3-step guide for Google Reviews */}
              <div style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "16px",
                margin: "16px 0",
                textAlign: "left"
              }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", marginBottom: "10px" }}>
                  📋 How to Post on Google in 5 Seconds:
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "#334155" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#0f172a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700" }}>1</span>
                    <span>Opening Google Reviews window...</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700" }}>2</span>
                    <span>Click the Google review text box and press <strong>Ctrl + V</strong> (or Right-Click &rarr; <strong>Paste</strong>)</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#16a34a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700" }}>3</span>
                    <span>Select <strong>5 Stars</strong> and click <strong>Post</strong> to finish!</span>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: "13px", color: "#64748b", margin: "14px 0 16px" }}>
                Redirecting to Google Reviews...
              </p>

              {redirectUrl && (
                <a
                  href={redirectUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => copyTextToClipboard(review)}
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "#0f172a",
                    color: "#ffffff",
                    borderRadius: "12px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    fontWeight: "700",
                    fontSize: "15px",
                    textDecoration: "none",
                    boxShadow: "0 4px 14px rgba(15, 23, 42, 0.25)",
                  }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Open Google Reviews &amp; Paste</span>
                  <ExternalLink size={16} />
                </a>
              )}
              <div style={{ marginTop: "14px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setCompleted(false);
                    setIsGatedSurveyStep(false);
                    setStar(5);
                    setReview("");
                    setName("");
                    setMobile("");
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#64748b",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  Write another review
                </button>
              </div>
            </div>
          )}

          {/* State: Negative Completed (Private Feedback Handled) */}
          {completed && star < 4 && (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <HeartHandshake size={52} color="#0f172a" style={{ margin: "0 auto 16px" }} />
              <h2 className="font-outfit" style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>
                Thank You for Your Honest Feedback
              </h2>
              <p style={{ fontSize: "14px", color: "#64748b", margin: "10px 0 20px", lineHeight: "1.6" }}>
                Your concerns have been submitted directly to management. We appreciate you letting us know where we can improve.
              </p>
              <div style={{
                display: "inline-block",
                padding: "6px 14px",
                borderRadius: "9999px",
                background: "#f1f5f9",
                color: "#334155",
                fontSize: "12px",
                fontWeight: "600"
              }}>
                Feedback Captured Privately
              </div>
              <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => {
                    setCompleted(false);
                    setIsGatedSurveyStep(false);
                    setStar(5);
                    setReview("");
                    setName("");
                    setMobile("");
                  }}
                  className="btn btn-outline btn-sm"
                  style={{ borderRadius: "8px", fontSize: "12px", color: "#475569" }}
                >
                  Submit Another Feedback
                </button>

                <a
                  href={selectedPlatform?.webLink || context?.branding?.googleReviewLink || "https://g.page/r/CewgBPDQRwDXEBM/review"}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    textDecoration: "underline",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span>Prefer to post a public review? Open on Google</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          )}

          {/* Step 2: Private Gated Survey Form (1-3 Stars) */}
          {!completed && isGatedSurveyStep && (
            <form onSubmit={handleSubmitSurvey}>
              <div style={{
                background: "#fffbeb",
                border: "1px solid #fef3c7",
                padding: "14px",
                borderRadius: "12px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
              }}>
                <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div style={{ fontSize: "13px", color: "#92400e" }}>
                  <strong>We apologize that we did not meet expectations.</strong>
                  <p style={{ marginTop: "2px" }}>Please help us identify what went wrong so we can resolve it directly:</p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
                {surveyQuestions.map((q) => (
                  <div key={q._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#334155", flex: 1, paddingRight: "10px" }}>
                      {q.questionText}
                    </span>
                    <div style={{ display: "flex", gap: "4px" }}>
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setSurveyAnswers({ ...surveyAnswers, [q._id]: val })}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            border: "1px solid #e2e8f0",
                            background: (surveyAnswers[q._id] || 3) >= val ? "#fef3c7" : "#f8fafc",
                            color: (surveyAnswers[q._id] || 3) >= val ? "#d97706" : "#94a3b8",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Star size={14} fill={(surveyAnswers[q._id] || 3) >= val ? "#f59e0b" : "none"} />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "12px",
                  background: "#0f172a",
                  color: "#ffffff",
                  fontWeight: "600",
                  fontSize: "14px",
                  border: "none",
                  cursor: submitting ? "not-allowed" : "pointer"
                }}
              >
                {submitting ? "Submitting..." : "Submit Internal Feedback"}
              </button>

              <div style={{ marginTop: "12px", textAlign: "center" }}>
                <a
                  href={selectedPlatform?.webLink || context?.branding?.googleReviewLink || "https://g.page/r/CewgBPDQRwDXEBM/review"}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    textDecoration: "underline",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span>Prefer to post publicly? Post on Google Reviews</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </form>
          )}

          {/* Step 1: Main Customer Rating Page */}
          {!completed && !isGatedSurveyStep && (
            <form onSubmit={handleSubmitReview}>
              {/* Interactive Stars */}
              <div style={{ textAlign: "center", marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "center", gap: "8px", margin: "4px 0" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => handleStarClick(s)}
                      onMouseEnter={() => setHoverStar(s)}
                      onMouseLeave={() => setHoverStar(0)}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: "4px",
                        transition: "transform 0.15s ease",
                        transform: (hoverStar || star) >= s ? "scale(1.15)" : "scale(1)",
                      }}
                    >
                      <Star
                        size={36}
                        fill={(hoverStar || star) >= s ? "#f59e0b" : "none"}
                        color={(hoverStar || star) >= s ? "#f59e0b" : "#cbd5e1"}
                        strokeWidth={1.5}
                      />
                    </button>
                  ))}
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>
                  <span style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: star >= 4 ? "#10b981" : star === 3 ? "#f59e0b" : "#ef4444"
                  }} />
                  <span>
                    {star === 5
                      ? "Outstanding (5.0 / 5.0)"
                      : star === 4
                      ? "Very Good (4.0 / 5.0)"
                      : star === 3
                      ? "Average (3.0 / 5.0)"
                      : star === 2
                      ? "Below Expectations (2.0 / 5.0)"
                      : "Poor (1.0 / 5.0)"}
                  </span>
                </div>
              </div>

              {/* Highlight Tags (Quick 4-5 chips) */}
              <div style={{ marginBottom: "10px" }}>
                <label className="form-label" style={{ margin: "0 0 5px", fontSize: "12px", fontWeight: "700", color: "#334155", display: "block" }}>
                  {star >= 4 ? "What stood out? (optional)" : "What went wrong? (optional)"}
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {currentTagsList.slice(0, 5).map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    const isPositive = star >= 4;
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "4px 9px",
                          borderRadius: "9999px",
                          fontSize: "11px",
                          fontWeight: isSelected ? "700" : "500",
                          border: isSelected
                            ? (isPositive ? "1px solid #0f172a" : "1px solid #be123c")
                            : (isPositive ? "1px solid #e2e8f0" : "1px solid #fecdd3"),
                          background: isSelected
                            ? (isPositive ? "#0f172a" : "#e11d48")
                            : (isPositive ? "#f8fafc" : "#fff1f2"),
                          color: isSelected
                            ? "#ffffff"
                            : (isPositive ? "#334155" : "#9f1239"),
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {isSelected && <Check size={10} strokeWidth={2.5} />}
                        <span>{tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Private Resolution Notice for 1-3 Stars */}
              {star <= 3 && (
                <div style={{
                  background: "#fff1f2",
                  border: "1px solid #fecdd3",
                  borderRadius: "10px",
                  padding: "8px 12px",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                }}>
                  <AlertTriangle size={15} color="#e11d48" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div style={{ fontSize: "11px", color: "#9f1239", lineHeight: "1.4" }}>
                    <strong>We apologize for not meeting expectations.</strong>
                    <p style={{ margin: "2px 0 0 0", color: "#881337" }}>
                      Your comments go directly to management so we can resolve this.
                    </p>
                  </div>
                </div>
              )}

              {/* Smart AI Review Box (Taller Height for Full Description Visibility) */}
              <div style={{ marginBottom: "12px" }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "6px",
                  flexWrap: "wrap",
                  gap: "6px"
                }}>
                  {star >= 4 && reviewOptions.length > 0 ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#475569" }}>
                        Tone:
                      </span>
                      {reviewOptions.map((opt) => {
                        const isSelected = selectedOptionId === opt.id || review === opt.text;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelectOption(opt)}
                            style={{
                              padding: "2px 8px",
                              borderRadius: "9999px",
                              fontSize: "10px",
                              fontWeight: isSelected ? "700" : "500",
                              background: isSelected ? "#0f172a" : "#f1f5f9",
                              color: isSelected ? "#ffffff" : "#475569",
                              border: isSelected ? "1px solid #0f172a" : "1px solid #cbd5e1",
                              cursor: "pointer",
                            }}
                          >
                            {opt.tone}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <label style={{ margin: 0, fontWeight: "600", fontSize: "12px", color: "#334155" }}>
                      {star <= 3 ? "What went wrong? *" : "Your Review:"}
                    </label>
                  )}

                  {star >= 4 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <div style={{ display: "inline-flex", background: "#f1f5f9", padding: "1px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                        {[
                          { id: "en", label: "EN" },
                          { id: "hi", label: "हिंदी" },
                          { id: "hinglish", label: "Hinglish" },
                        ].map((l) => (
                          <button
                            key={l.id}
                            type="button"
                            onClick={() => handleLanguageChange(l.id)}
                            style={{
                              padding: "1px 5px",
                              borderRadius: "4px",
                              fontSize: "10px",
                              fontWeight: lang === l.id ? "700" : "500",
                              background: lang === l.id ? "#0f172a" : "transparent",
                              color: lang === l.id ? "#ffffff" : "#64748b",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            {l.label}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={handleShuffleWording}
                        disabled={generatingOptions}
                        title="Shuffle Review"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "2px",
                          background: "#ffffff",
                          border: "1px solid #cbd5e1",
                          color: "#334155",
                          fontSize: "10px",
                          fontWeight: "600",
                          cursor: "pointer",
                          padding: "2px 6px",
                          borderRadius: "5px",
                        }}
                      >
                        <RefreshCw size={10} className={generatingOptions ? "animate-spin" : ""} />
                        <span>Shuffle</span>
                      </button>
                    </div>
                  )}
                </div>

                <div style={{
                  borderRadius: "10px",
                  border: "1.5px solid #cbd5e1",
                  background: "#ffffff",
                  overflow: "hidden",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
                }}>
                  <textarea
                    className="form-textarea"
                    rows={5}
                    placeholder={
                      star >= 4
                        ? "Write your experience or choose a tone above..."
                        : "Please tell us what went wrong so we can resolve this for you..."
                    }
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    required={star <= 3}
                    style={{
                      border: "none",
                      outline: "none",
                      width: "100%",
                      boxSizing: "border-box",
                      resize: "none",
                      fontSize: "13px",
                      lineHeight: "1.55",
                      padding: "10px 12px",
                      color: "#1e293b",
                      background: "#ffffff",
                      fontFamily: "inherit",
                      minHeight: "115px",
                    }}
                  />
                  {review && (
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "5px 10px 6px",
                      background: "#f8fafc",
                      borderTop: "1px solid #f1f5f9"
                    }}>
                      <span style={{ fontSize: "11px", color: "#64748b", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                        <Sparkles size={11} color="#6366f1" /> AI Writing Assistant — Please edit to match your genuine experience
                      </span>
                      <button
                        type="button"
                        onClick={() => copyTextToClipboard(review)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          background: copiedSuccess ? "#dcfce7" : "#0f172a",
                          color: copiedSuccess ? "#16a34a" : "#ffffff",
                          fontSize: "11px",
                          fontWeight: "700",
                          cursor: "pointer",
                          padding: "3px 9px",
                          borderRadius: "5px",
                          border: copiedSuccess ? "1px solid #86efac" : "none",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                          transition: "all 0.15s ease"
                        }}
                      >
                        {copiedSuccess ? <Check size={11} strokeWidth={2.5} /> : <Copy size={11} />}
                        <span>{copiedSuccess ? "Copied!" : "Copy Review"}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Name & Mobile Inputs (Compact 1 Line) */}
              <div style={{ marginBottom: "10px" }}>
                <div className="grid-2" style={{ gap: "8px", marginBottom: "6px" }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder={star <= 3 ? "Your Name *" : "Your Name"}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (error) setError(null);
                      }}
                      required={star <= 3}
                      style={{ borderRadius: "8px", padding: "7px 10px", fontSize: "12px" }}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder={star <= 3 ? "10-digit Mobile Number *" : "10-digit Mobile Number (Optional)"}
                      value={mobile}
                      maxLength={10}
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setMobile(digits);
                        if (error) setError(null);
                      }}
                      onKeyDown={(e) => {
                        if (["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(e.key)) return;
                        if (!/^[0-9]$/.test(e.key)) {
                          e.preventDefault();
                          return;
                        }
                        if (mobile.length >= 10 && !window.getSelection()?.toString()) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pasteData = (e.clipboardData || window.clipboardData)?.getData("text") || "";
                        const digits = pasteData.replace(/\D/g, "").slice(0, 10);
                        setMobile(digits);
                        if (error) setError(null);
                      }}
                      required={star <= 3}
                      style={{ borderRadius: "8px", padding: "7px 10px", fontSize: "12px" }}
                    />
                  </div>
                </div>

                {availableStaff.length > 0 && (
                  <div className="form-group" style={{ margin: 0 }}>
                    <select
                      className="form-input"
                      value={staffMember}
                      onChange={(e) => setStaffMember(e.target.value)}
                      style={{
                        width: "100%",
                        borderRadius: "8px",
                        padding: "6px 10px",
                        fontSize: "11px",
                        cursor: "pointer",
                        color: staffMember ? "#0f172a" : "#64748b",
                        background: "#ffffff",
                        border: "1px solid #cbd5e1",
                      }}
                    >
                      <option value="" style={{ color: "#94a3b8" }}>Assisted by (Staff Member - Optional)</option>
                      {availableStaff.map((staff, idx) => (
                        <option key={idx} value={staff} style={{ color: "#0f172a" }}>
                          {staff}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Multi-Platform Destination Selector (Neutral, Available for All Star Ratings) */}
              {context?.platforms?.length > 1 && (
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "8px" }}>
                    Select Where to Post Your Review:
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(context.platforms.length, 3)}, 1fr)`, gap: "8px" }}>
                    {context.platforms.map((p) => {
                      const isSelected = selectedPlatform?._id === p._id;
                      const isGoogle = p.webName?.toLowerCase().includes("google");
                      const isGlassdoor = p.webName?.toLowerCase().includes("glassdoor");
                      return (
                        <button
                          key={p._id}
                          type="button"
                          onClick={() => setSelectedPlatform(p)}
                          style={{
                            padding: "10px 8px",
                            borderRadius: "10px",
                            border: isSelected ? "2px solid #0f172a" : "1.5px solid #e2e8f0",
                            background: isSelected ? "#f8fafc" : "#ffffff",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "6px",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            boxShadow: isSelected ? "0 4px 12px rgba(15, 23, 42, 0.08)" : "none",
                          }}
                        >
                          <div style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "8px",
                            background: isGoogle ? "#eff6ff" : isGlassdoor ? "#f0fdf4" : "#f1f5f9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: "800",
                            color: isGoogle ? "#2563eb" : isGlassdoor ? "#16a34a" : "#475569",
                            border: isSelected ? `1.5px solid ${isGoogle ? "#93c5fd" : isGlassdoor ? "#86efac" : "#cbd5e1"}` : "1px solid #e2e8f0",
                          }}>
                            {isGoogle ? "G" : isGlassdoor ? "GD" : p.webName.slice(0, 2).toUpperCase()}
                          </div>
                          <span style={{ fontSize: "12px", fontWeight: isSelected ? "800" : "600", color: isSelected ? "#0f172a" : "#64748b" }}>
                            {p.webName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Neutral & Compliant Action Choices (Public Review or Direct Management Feedback) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
                {/* 1. Public Review Platform Submission */}
                <button
                  type="button"
                  onClick={(e) => handleSubmitReview(e, "public")}
                  disabled={submitting}
                  style={{
                    width: "100%",
                    padding: "13px",
                    fontSize: "14px",
                    fontWeight: "700",
                    borderRadius: "10px",
                    background: selectedPlatform?.webName?.toLowerCase().includes("glassdoor") ? "#16a34a" : "#0f172a",
                    color: "#ffffff",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    cursor: submitting ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.18)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {selectedPlatform?.webName?.toLowerCase().includes("google") ? (
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  ) : selectedPlatform?.webName?.toLowerCase().includes("glassdoor") ? (
                    <div style={{ width: 18, height: 18, borderRadius: 4, background: "#ffffff", color: "#16a34a", fontSize: 10, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      GD
                    </div>
                  ) : (
                    <ExternalLink size={16} />
                  )}
                  <span>
                    {submitting
                      ? "Preparing..."
                      : `Post Review on ${selectedPlatform?.webName || "Google Reviews"}`}
                  </span>
                  {!submitting && <ArrowRight size={15} />}
                </button>

                {/* 2. Direct Private Line to Management */}
                <button
                  type="button"
                  onClick={(e) => handleSubmitReview(e, "private")}
                  disabled={submitting}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    fontSize: "13px",
                    fontWeight: "600",
                    borderRadius: "10px",
                    background: "#f8fafc",
                    color: "#334155",
                    border: "1.5px solid #cbd5e1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "7px",
                    cursor: submitting ? "not-allowed" : "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <ShieldCheck size={16} color="#059669" />
                  <span>Send Directly to Management for Resolution</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};
