import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { BizormLogo } from "../../components/common/BizormLogo";
import { BUSINESS_CATEGORIES } from "../../constants/categories";
import {
  Lock,
  User,
  Mail,
  Phone,
  Building2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  KeyRound,
  Globe,
  Upload,
  X,
  Layers,
  Check,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Ticket,
  Tag,
  Gift,
  Scissors,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const AVAILABLE_PLATFORMS = [
  {
    id: "google",
    name: "Google Reviews",
    icon: "google",
    placeholder: "https://g.page/r/CewgBPDQRwDXEBM/review",
    hint: "Official Google Business profile review URL (4-5★ happy ratings redirect here)",
  },
  {
    id: "justdial",
    name: "Justdial",
    icon: "justdial",
    placeholder: "https://www.justdial.com/city/business-name",
    hint: "Justdial local business rating & review profile URL",
  },
  {
    id: "facebook",
    name: "Facebook Reviews",
    icon: "facebook",
    placeholder: "https://www.facebook.com/your-business-page/reviews",
    hint: "Facebook page reviews & recommendations link",
  },
  {
    id: "tripadvisor",
    name: "TripAdvisor",
    icon: "tripadvisor",
    placeholder: "https://www.tripadvisor.in/UserReviewEdit-g...",
    hint: "TripAdvisor traveler ratings & dining reviews link",
  },
  {
    id: "trustpilot",
    name: "Trustpilot",
    icon: "trustpilot",
    placeholder: "https://www.trustpilot.com/evaluate/yourdomain.com",
    hint: "Trustpilot verified ratings profile link",
  },
  {
    id: "zomato",
    name: "Zomato",
    icon: "zomato",
    placeholder: "https://www.zomato.com/restaurant-link",
    hint: "Zomato dining & delivery reviews link",
  },
  {
    id: "practo",
    name: "Practo Healthcare",
    icon: "practo",
    placeholder: "https://www.practo.com/clinic-doctor-link",
    hint: "Practo patient recommendations & feedback link",
  },
  {
    id: "glassdoor",
    name: "Glassdoor",
    icon: "glassdoor",
    placeholder: "https://www.glassdoor.co.in/Reviews/company-reviews",
    hint: "Glassdoor employer & workplace review link",
  },
  {
    id: "ambitionbox",
    name: "AmbitionBox",
    icon: "ambitionbox",
    placeholder: "https://www.ambitionbox.com/reviews/company",
    hint: "AmbitionBox ratings & workplace review link",
  },
  {
    id: "custom",
    name: "Other / Custom Platform",
    icon: "globe",
    placeholder: "https://your-custom-review-platform.com",
    hint: "Any custom review website or redirect link",
  },
];

export const AuthPage = ({ defaultTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Determine initial active tab: "login" or "register"
  const isRegisterRoute =
    defaultTab === "register" ||
    location.pathname.includes("register") ||
    searchParams.get("tab") === "register" ||
    Boolean(searchParams.get("plan"));

  const [activeTab, setActiveTab] = useState(isRegisterRoute ? "register" : "login");

  // Keep activeTab in sync if route changes
  useEffect(() => {
    if (location.pathname.includes("register") || searchParams.get("plan")) {
      setActiveTab("register");
    } else if (location.pathname.includes("login")) {
      setActiveTab("login");
    }
  }, [location.pathname, searchParams]);

  // Always start at top of page on load
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const { login, register } = useAuth();
  const fileInputRef = React.useRef(null);

  // Login form state
  const [loginUname, setLoginUname] = useState("");
  const [loginPwd, setLoginPwd] = useState("");
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // Register form state
  const urlPlanId = searchParams.get("plan");
  const urlBusinessType = searchParams.get("businessType");

  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [regUname, setRegUname] = useState("");
  const [regPwd, setRegPwd] = useState("");
  const [showRegPwd, setShowRegPwd] = useState(false);

  const [cmpy, setCmpy] = useState("");
  const [cmpyLogo, setCmpyLogo] = useState("");
  const [logoInputType, setLogoInputType] = useState("file");
  const [businessCategory, setBusinessCategory] = useState("general");

  const [platforms, setPlatforms] = useState([
    {
      id: "platform-1",
      platform: "Google Reviews",
      customName: "",
      link: "https://g.page/r/CewgBPDQRwDXEBM/review",
    },
  ]);

  const [planBusinessType, setPlanBusinessType] = useState(
    urlBusinessType === "multiple"
      ? "multiple"
      : urlBusinessType === "marketplace"
      ? "marketplace"
      : "single"
  );
  const [selectedPlanId, setSelectedPlanId] = useState(urlPlanId || "");
  const [packages, setPackages] = useState([]);

  // Promotional Coupon State
  const urlCoupon = searchParams.get("coupon") || "";
  const [couponInput, setCouponInput] = useState(urlCoupon);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponValidating, setCouponValidating] = useState(false);
  const [couponFeedback, setCouponFeedback] = useState(null);

  const selectedPackage = packages.find((p) => p._id === selectedPlanId) || null;

  const handleApplyCoupon = async (codeToValidate) => {
    const code = (codeToValidate || couponInput || "").trim().toUpperCase();
    if (!code) {
      setCouponFeedback({ type: "error", message: "Please enter a valid coupon code." });
      return;
    }
    setCouponValidating(true);
    setCouponFeedback(null);
    try {
      const price = selectedPackage?.price || 999;
      const res = await api.validatePlatformOffer({
        code,
        price,
        businessType: planBusinessType,
      });
      if (res?.success && res.offer) {
        setAppliedCoupon(res.offer);
        setCouponInput(res.offer.code);
        setCouponFeedback({
          type: "success",
          message: res.message || `Coupon '${res.offer.code}' applied!`,
        });
      } else {
        setAppliedCoupon(null);
        setCouponFeedback({
          type: "error",
          message: res?.message || "Invalid or expired promo code.",
        });
      }
    } catch (err) {
      setAppliedCoupon(null);
      setCouponFeedback({
        type: "error",
        message: err.message || "Failed to validate coupon.",
      });
    } finally {
      setCouponValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponFeedback(null);
  };

  // Re-calculate coupon discount if package selection changes
  useEffect(() => {
    if (appliedCoupon && selectedPackage) {
      const price = selectedPackage.price || 0;
      let discountAmount = 0;
      if (appliedCoupon.discountPercent > 0) {
        discountAmount = Math.round(price * (appliedCoupon.discountPercent / 100));
      } else if (appliedCoupon.discountFlat > 0) {
        discountAmount = Math.min(price, appliedCoupon.discountFlat);
      }
      setAppliedCoupon((prev) => ({
        ...prev,
        originalPrice: price,
        discountAmount,
        finalPrice: Math.max(0, price - discountAmount),
      }));
    }
  }, [selectedPlanId]);

  // Auto-apply coupon from URL query param if present
  useEffect(() => {
    if (urlCoupon && packages.length > 0 && !appliedCoupon) {
      handleApplyCoupon(urlCoupon);
    }
  }, [urlCoupon, packages.length]);

  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState(null);

  // Load available packages
  useEffect(() => {
    api.getActivePricing()
      .then((res) => {
        if (res.success && res.packages?.length > 0) {
          // Exclude free trial packages so subscription plan selection shows the 4 paid plans
          const paidPackages = res.packages.filter(
            (p) => p.price > 0 && !p.packageName.toLowerCase().includes("trial")
          );
          const availablePackages = paidPackages.length > 0 ? paidPackages : res.packages;
          setPackages(availablePackages);
          const matched = availablePackages.find((p) => p._id === urlPlanId);
          if (matched) {
            setSelectedPlanId(matched._id);
            if (matched.businessType) setPlanBusinessType(matched.businessType);
          } else {
            const firstOfType = availablePackages.find(
              (p) => (p.businessType || "single") === (urlBusinessType || "single")
            );
            setSelectedPlanId(firstOfType ? firstOfType._id : availablePackages[0]._id);
          }
        }
      })
      .catch(() => {});
  }, [urlPlanId, urlBusinessType]);

  // Logo upload optimizer
  const handleLogoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setRegError("Please select a valid image file (PNG, JPG, SVG, WebP)");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setRegError("Image size should be less than 8MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 400;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const format = file.type === "image/png" ? "image/png" : "image/jpeg";
        const compressed = canvas.toDataURL(format, 0.9);
        setCmpyLogo(compressed);
      };
      img.onerror = () => setCmpyLogo(event.target.result);
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setCmpyLogo("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Multi-platform link actions
  const handleAddPlatform = () => {
    const existingNames = platforms.map((p) => p.platform);
    const nextPreset =
      AVAILABLE_PLATFORMS.find(
        (p) => p.name !== "Other / Custom Platform" && !existingNames.includes(p.name)
      ) || AVAILABLE_PLATFORMS[0];

    setPlatforms((prev) => [
      ...prev,
      {
        id: "platform-" + Date.now(),
        platform: nextPreset.name,
        customName: "",
        link: "",
      },
    ]);
  };

  const handleRemovePlatform = (index) => {
    if (platforms.length === 1) {
      setPlatforms([{ ...platforms[0], link: "" }]);
      return;
    }
    setPlatforms((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePlatformChange = (index, field, value) => {
    setPlatforms((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await login(loginUname, loginPwd);
      if (res.status === "unverified") {
        navigate(`/emailverify?key=${res.formKey}`);
      } else if (res.success) {
        navigate("/dashboard");
      }
    } catch (err) {
      setLoginError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Registration submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError(null);

    const cleanMobile = mobile.replace(/[^0-9]/g, "").slice(-10);
    if (cleanMobile.length !== 10) {
      setRegError("Mobile number must be exactly 10 digits");
      return;
    }
    if (regPwd.length < 6) {
      setRegError("Password must be at least 6 characters");
      return;
    }
    if (!cmpy.trim()) {
      setRegError("Please provide your Company / Business name");
      return;
    }

    const validPlatforms = platforms
      .filter((p) => p.link && p.link.trim())
      .map((p) => {
        const isCustom = p.platform === "Other / Custom Platform";
        const finalName = isCustom && p.customName?.trim() ? p.customName.trim() : p.platform;
        const matchedPreset = AVAILABLE_PLATFORMS.find((preset) => preset.name === p.platform);
        return {
          name: finalName,
          link: p.link.trim(),
          icon: matchedPreset ? matchedPreset.icon : "globe",
        };
      });

    const primaryGoogle =
      validPlatforms.find((p) => p.name.toLowerCase().includes("google")) || validPlatforms[0];
    const finalGoogleReviewLink = primaryGoogle
      ? primaryGoogle.link
      : platforms[0]?.link?.trim() || "https://g.page/r/CewgBPDQRwDXEBM/review";

    setRegLoading(true);

    try {
      const res = await register({
        fname: fname.trim(),
        lname: lname.trim(),
        email: email.trim(),
        mobile: cleanMobile,
        uname: regUname.trim(),
        password: regPwd,
        isCompanyAdmin: true,
        cmpy: cmpy.trim(),
        cmpyLogo: cmpyLogo.trim(),
        businessCategory,
        googleReviewLink: finalGoogleReviewLink,
        platforms: validPlatforms,
        pricingPackageId: selectedPlanId,
        appliedCouponCode: appliedCoupon?.code || couponInput.trim().toUpperCase() || "",
      });

      if (res.success) {
        if (res.user?.active === 1) {
          navigate("/dashboard");
        } else {
          navigate(`/emailverify?key=${res.user.formKey}`);
        }
      }
    } catch (err) {
      setRegError(err.message || "Registration failed");
    } finally {
      setRegLoading(false);
    }
  };

  const selectedCategoryObj =
    BUSINESS_CATEGORIES.find((c) => c.id === businessCategory) || BUSINESS_CATEGORIES[0];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "32px 16px 64px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        position: "relative",
        overflowX: "hidden",
        width: "100%",
        maxWidth: "100vw",
        boxSizing: "border-box",
      }}
    >
      {/* Background Soft Glow */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(700px, 90vw)",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(0, 74, 198, 0.08) 0%, rgba(248, 250, 252, 0) 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        layout
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{
          maxWidth: activeTab === "login" ? "480px" : "780px",
          width: "100%",
          position: "relative",
          zIndex: 1,
          boxSizing: "border-box",
        }}
      >
        {/* Brand Logo & Back to Home */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ display: "inline-block", marginBottom: "8px" }}>
            <BizormLogo size="lg" to="/" />
          </div>
        </div>

        {/* Unified Auth Card */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
            boxShadow:
              "0 15px 40px -10px rgba(0, 74, 198, 0.08), 0 4px 12px rgba(15, 23, 42, 0.03)",
            padding: activeTab === "login" ? "32px 30px" : "36px 32px",
          }}
        >
          {/* Segmented Mode Switcher (Hidden when on dedicated register route) */}
          {!location.pathname.includes("register") && defaultTab !== "register" && (
            <div
              style={{
                display: "flex",
                backgroundColor: "#f1f5f9",
                borderRadius: "12px",
                padding: "4px",
                marginBottom: "24px",
                border: "1px solid #e2e8f0",
              }}
            >
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setLoginError(null);
                setRegError(null);
              }}
              style={{
                flex: 1,
                padding: "9px 12px",
                borderRadius: "9px",
                border: "none",
                fontSize: "13.5px",
                fontWeight: "700",
                cursor: "pointer",
                backgroundColor: activeTab === "login" ? "#ffffff" : "transparent",
                color: activeTab === "login" ? "#004ac6" : "#64748b",
                boxShadow:
                  activeTab === "login" ? "0 2px 8px rgba(0, 74, 198, 0.12)" : "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "7px",
                transition: "all 0.18s ease",
              }}
            >
              <Lock size={15} />
              <span>Sign In to Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("register");
                setLoginError(null);
                setRegError(null);
              }}
              style={{
                flex: 1,
                padding: "9px 12px",
                borderRadius: "9px",
                border: "none",
                fontSize: "13.5px",
                fontWeight: "700",
                cursor: "pointer",
                backgroundColor: activeTab === "register" ? "#ffffff" : "transparent",
                color: activeTab === "register" ? "#004ac6" : "#64748b",
                boxShadow:
                  activeTab === "register" ? "0 2px 8px rgba(0, 74, 198, 0.12)" : "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "7px",
                transition: "all 0.18s ease",
              }}
            >
              <Sparkles size={15} color={activeTab === "register" ? "#004ac6" : "#64748b"} />
              <span>Start 7-Day Free Trial</span>
            </button>
          </div>
          )}

          {/* TAB 1: SIGN IN */}
          {activeTab === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div style={{ textAlign: "center", marginBottom: "22px" }}>
                <h1
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "22px",
                    fontWeight: "800",
                    color: "#0f172a",
                    marginBottom: "4px",
                  }}
                >
                  Welcome Back to Bizoram
                </h1>
                <p style={{ fontSize: "13.5px", color: "#64748b" }}>
                  Sign in to manage your branch reviews, QR standees &amp; ratings.
                </p>
              </div>

              {loginError && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    color: "#991b1b",
                    fontSize: "13.5px",
                    marginBottom: "18px",
                  }}
                >
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#334155",
                      marginBottom: "6px",
                    }}
                  >
                    Username or Email
                  </label>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#94a3b8",
                      }}
                    >
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder="Username (e.g. nktech or your email)"
                      value={loginUname}
                      onChange={(e) => setLoginUname(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "12px 14px 12px 42px",
                        borderRadius: "10px",
                        border: "1px solid #cbd5e1",
                        fontSize: "14px",
                        outline: "none",
                        backgroundColor: "#ffffff",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#334155",
                      marginBottom: "6px",
                    }}
                  >
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#94a3b8",
                      }}
                    >
                      <Lock size={16} />
                    </div>
                    <input
                      type={showLoginPwd ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginPwd}
                      onChange={(e) => setLoginPwd(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "12px 42px 12px 42px",
                        borderRadius: "10px",
                        border: "1px solid #cbd5e1",
                        fontSize: "14px",
                        outline: "none",
                        backgroundColor: "#ffffff",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPwd(!showLoginPwd)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "#94a3b8",
                        cursor: "pointer",
                        padding: "4px",
                      }}
                    >
                      {showLoginPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  style={{
                    width: "100%",
                    padding: "13px",
                    borderRadius: "11px",
                    backgroundColor: "#004ac6",
                    color: "#ffffff",
                    fontSize: "14.5px",
                    fontWeight: "700",
                    border: "none",
                    cursor: loginLoading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 8px 20px rgba(0, 74, 198, 0.22)",
                    marginTop: "6px",
                  }}
                >
                  {loginLoading ? (
                    <span>Signing in...</span>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Switch to Register link */}
              <p
                style={{
                  textAlign: "center",
                  fontSize: "13.5px",
                  color: "#64748b",
                  marginTop: "18px",
                  marginBottom: 0,
                }}
              >
                New business owner?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("register")}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    fontWeight: "700",
                    color: "#004ac6",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Start 7-Day Free Trial
                </button>
              </p>
            </motion.div>
          )}

          {/* TAB 2: REGISTER / 7-DAY FREE TRIAL */}
          {activeTab === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <h1
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "22px",
                    fontWeight: "800",
                    color: "#0f172a",
                    marginBottom: "4px",
                  }}
                >
                  Start Your 7-Day Free Trial
                </h1>
                <p style={{ fontSize: "13.5px", color: "#64748b" }}>
                  Connect your business, setup smart review routing, and collect genuine 5-star Google reviews.
                </p>
              </div>

              {regError && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#fef2f2",
                    color: "#991b1b",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    marginBottom: "18px",
                    border: "1px solid #fecaca",
                  }}
                >
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{regError}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit}>
                {/* Step 1: Business Branding & Industry Category */}
                <div
                  style={{
                    background: "#f8fafc",
                    padding: "18px",
                    borderRadius: "14px",
                    border: "1px solid #e2e8f0",
                    marginBottom: "18px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "12px",
                    }}
                  >
                    <Building2 size={18} color="#004ac6" />
                    <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                      1. Business Branding &amp; Industry Setup
                    </h3>
                  </div>

                  <div className="grid-2" style={{ marginBottom: "12px" }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontWeight: "700", fontSize: "13px" }}>
                        Company / Business Name <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Apex Healthcare, Grand Bistro, Glow Salon"
                        value={cmpy}
                        onChange={(e) => setCmpy(e.target.value)}
                        required
                        style={{ fontSize: "13.5px", padding: "9px 12px" }}
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontWeight: "700", fontSize: "13px" }}>
                        Business Category / Sector <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <select
                        className="form-input"
                        value={businessCategory}
                        onChange={(e) => setBusinessCategory(e.target.value)}
                        style={{ cursor: "pointer", fontWeight: "600", fontSize: "13.5px", padding: "9px 12px" }}
                      >
                        {BUSINESS_CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Multi-Platform Destination Links Section */}
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "12px",
                      padding: "14px",
                      marginBottom: "14px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                        flexWrap: "wrap",
                        gap: "6px",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            fontSize: "13px",
                            fontWeight: "700",
                            color: "#0f172a",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            margin: 0,
                          }}
                        >
                          <Globe size={14} color="#004ac6" />
                          Review Destination Platforms ({platforms.length})
                        </label>
                        <span style={{ fontSize: "11.5px", color: "#64748b", marginTop: "2px", display: "block" }}>
                          Happy customers are routed here. All added platforms will be saved to your dashboard!
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddPlatform}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "5px 10px",
                          borderRadius: "7px",
                          backgroundColor: "#eff6ff",
                          color: "#004ac6",
                          border: "1px solid #bfdbfe",
                          fontSize: "11.5px",
                          fontWeight: "700",
                          cursor: "pointer",
                        }}
                      >
                        <Plus size={13} />
                        <span>Add Platform</span>
                      </button>
                    </div>

                    {/* Platform Rows */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                      {platforms.map((p, idx) => {
                        const isCustom = p.platform === "Other / Custom Platform";
                        const matchedPreset =
                          AVAILABLE_PLATFORMS.find((preset) => preset.name === p.platform) ||
                          AVAILABLE_PLATFORMS[0];

                        return (
                          <div
                            key={p.id || idx}
                            style={{
                              padding: "10px 12px",
                              borderRadius: "9px",
                              backgroundColor: "#f8fafc",
                              border: "1px solid #e2e8f0",
                              display: "flex",
                              flexDirection: "column",
                              gap: "7px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "8px",
                                flexWrap: "wrap",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: "1 1 180px" }}>
                                <span
                                  style={{
                                    fontSize: "10.5px",
                                    fontWeight: "800",
                                    color: "#004ac6",
                                    backgroundColor: "#e7eeff",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                  }}
                                >
                                  #{idx + 1}
                                </span>
                                <select
                                  className="form-input"
                                  value={p.platform}
                                  onChange={(e) => handlePlatformChange(idx, "platform", e.target.value)}
                                  style={{
                                    margin: 0,
                                    fontWeight: "600",
                                    fontSize: "12.5px",
                                    padding: "5px 8px",
                                    cursor: "pointer",
                                    backgroundColor: "#ffffff",
                                  }}
                                >
                                  {AVAILABLE_PLATFORMS.map((preset) => (
                                    <option key={preset.id} value={preset.name}>
                                      {preset.name}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {platforms.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemovePlatform(idx)}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    color: "#ef4444",
                                    fontSize: "11.5px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "3px",
                                    padding: "2px 5px",
                                  }}
                                >
                                  <Trash2 size={12} />
                                  <span>Remove</span>
                                </button>
                              )}
                            </div>

                            {isCustom && (
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Platform Name (e.g. Swiggy, 1mg, Yelp, Practo)"
                                value={p.customName || ""}
                                onChange={(e) => handlePlatformChange(idx, "customName", e.target.value)}
                                style={{ fontSize: "12px", padding: "6px 8px", margin: 0, backgroundColor: "#ffffff" }}
                                required
                              />
                            )}

                            <div>
                              <input
                                type="url"
                                className="form-input"
                                placeholder={matchedPreset.placeholder}
                                value={p.link}
                                onChange={(e) => handlePlatformChange(idx, "link", e.target.value)}
                                style={{
                                  fontSize: "12.5px",
                                  padding: "7px 10px",
                                  margin: 0,
                                  backgroundColor: "#ffffff",
                                }}
                                required={idx === 0}
                              />
                              <span style={{ fontSize: "11px", color: "#64748b", marginTop: "3px", display: "block" }}>
                                {matchedPreset.hint}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Brand Logo Upload */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <label className="form-label" style={{ fontWeight: "700", margin: 0, fontSize: "13px" }}>
                        Brand Logo / Photo (Optional)
                      </label>
                      <div style={{ display: "flex", gap: "8px", fontSize: "11.5px" }}>
                        <button
                          type="button"
                          onClick={() => setLogoInputType("file")}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: logoInputType === "file" ? "700" : "500",
                            color: logoInputType === "file" ? "#004ac6" : "#64748b",
                            textDecoration: logoInputType === "file" ? "underline" : "none",
                          }}
                        >
                          📁 Upload File
                        </button>
                        <span style={{ color: "#cbd5e1" }}>|</span>
                        <button
                          type="button"
                          onClick={() => setLogoInputType("url")}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: logoInputType === "url" ? "700" : "500",
                            color: logoInputType === "url" ? "#004ac6" : "#64748b",
                            textDecoration: logoInputType === "url" ? "underline" : "none",
                          }}
                        >
                          🔗 Image URL
                        </button>
                      </div>
                    </div>

                    <input
                      ref={fileInputRef}
                      id="company-logo-file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileChange}
                      style={{ display: "none" }}
                    />

                    {logoInputType === "file" ? (
                      <div>
                        {cmpyLogo ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              padding: "10px 14px",
                              borderRadius: "10px",
                              background: "#ffffff",
                              border: "1px solid #cbd5e1",
                            }}
                          >
                            <img
                              src={cmpyLogo}
                              alt="Logo preview"
                              style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "contain",
                                borderRadius: "6px",
                              }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#16a34a" }}>
                                ✓ Logo ready for counter standee
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={handleRemoveLogo}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#ef4444",
                                fontSize: "11.5px",
                                fontWeight: "600",
                                cursor: "pointer",
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <label
                            htmlFor="company-logo-file-input"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "8px",
                              padding: "12px",
                              border: "1.5px dashed #cbd5e1",
                              borderRadius: "10px",
                              background: "#ffffff",
                              cursor: "pointer",
                              fontSize: "12.5px",
                              fontWeight: "600",
                              color: "#475569",
                            }}
                          >
                            <Upload size={16} color="#004ac6" />
                            <span>Click to upload logo photo for QR counter standee</span>
                          </label>
                        )}
                      </div>
                    ) : (
                      <input
                        type="url"
                        className="form-input"
                        placeholder="https://example.com/logo.png"
                        value={cmpyLogo}
                        onChange={(e) => setCmpyLogo(e.target.value)}
                        style={{ fontSize: "13px", padding: "8px 12px" }}
                      />
                    )}
                  </div>
                </div>

                {/* Step 2: Account Owner & Login Details */}
                <div style={{ marginBottom: "18px" }}>
                  <h3 style={{ fontSize: "14.5px", fontWeight: "700", color: "#0f172a", marginBottom: "10px" }}>
                    2. Account Owner &amp; Login Details
                  </h3>

                  <div className="grid-2" style={{ marginBottom: "10px" }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: "12.5px" }}>First Name</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="John"
                        value={fname}
                        onChange={(e) => setFname(e.target.value)}
                        required
                        style={{ fontSize: "13px", padding: "8px 12px" }}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: "12.5px" }}>Last Name</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Doe"
                        value={lname}
                        onChange={(e) => setLname(e.target.value)}
                        required
                        style={{ fontSize: "13px", padding: "8px 12px" }}
                      />
                    </div>
                  </div>

                  <div className="grid-2" style={{ marginBottom: "10px" }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: "12.5px" }}>Username</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="johndoe"
                        value={regUname}
                        onChange={(e) => setRegUname(e.target.value)}
                        required
                        style={{ fontSize: "13px", padding: "8px 12px" }}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: "12.5px" }}>Mobile Number (10 digits)</label>
                      <input
                        type="tel"
                        maxLength={10}
                        className="form-input"
                        placeholder="9876543210"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
                        required
                        style={{ fontSize: "13px", padding: "8px 12px" }}
                      />
                    </div>
                  </div>

                  <div className="grid-2" style={{ margin: 0 }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: "12.5px" }}>Business Email</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="john@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ fontSize: "13px", padding: "8px 12px" }}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: "12.5px" }}>Password</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showRegPwd ? "text" : "password"}
                          className="form-input"
                          placeholder="Min 6 characters"
                          value={regPwd}
                          onChange={(e) => setRegPwd(e.target.value)}
                          required
                          style={{ fontSize: "13px", padding: "8px 36px 8px 12px" }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPwd(!showRegPwd)}
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            color: "#94a3b8",
                            cursor: "pointer",
                            padding: "2px",
                          }}
                        >
                          {showRegPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Subscription Plan Selector */}
                {packages.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      <label className="form-label" style={{ fontWeight: "700", margin: 0, fontSize: "13.5px" }}>
                        Select Subscription Plan
                      </label>

                      {/* Single vs Multiple vs Marketplace Toggle */}
                      <div
                        style={{
                          display: "inline-flex",
                          background: "#e2e8f0",
                          padding: "2px",
                          borderRadius: "8px",
                          gap: "2px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setPlanBusinessType("single");
                            const firstSingle = packages.find(
                              (p) =>
                                (p.businessType || "single") === "single" &&
                                p.price > 0 &&
                                !p.packageName.toLowerCase().includes("trial")
                            );
                            if (firstSingle) setSelectedPlanId(firstSingle._id);
                          }}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "6px",
                            border: "none",
                            fontSize: "11.5px",
                            fontWeight: "700",
                            cursor: "pointer",
                            background: planBusinessType === "single" ? "#ffffff" : "transparent",
                            color: planBusinessType === "single" ? "#004ac6" : "#64748b",
                          }}
                        >
                          Single Business
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPlanBusinessType("multiple");
                            const firstMulti = packages.find(
                              (p) =>
                                (p.businessType || "single") === "multiple" &&
                                p.price > 0 &&
                                !p.packageName.toLowerCase().includes("trial")
                            );
                            if (firstMulti) setSelectedPlanId(firstMulti._id);
                          }}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "6px",
                            border: "none",
                            fontSize: "11.5px",
                            fontWeight: "700",
                            cursor: "pointer",
                            background: planBusinessType === "multiple" ? "#ffffff" : "transparent",
                            color: planBusinessType === "multiple" ? "#004ac6" : "#64748b",
                          }}
                        >
                          Multiple Business
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPlanBusinessType("marketplace");
                            const firstMarketplace = packages.find(
                              (p) =>
                                (p.businessType || "single") === "marketplace" &&
                                p.price > 0 &&
                                !p.packageName.toLowerCase().includes("trial")
                            );
                            if (firstMarketplace) setSelectedPlanId(firstMarketplace._id);
                          }}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "6px",
                            border: "none",
                            fontSize: "11.5px",
                            fontWeight: "700",
                            cursor: "pointer",
                            background: planBusinessType === "marketplace" ? "#ffffff" : "transparent",
                            color: planBusinessType === "marketplace" ? "#004ac6" : "#64748b",
                          }}
                        >
                          Marketplace
                        </button>
                      </div>
                    </div>

                    {/* Plan Cards Grid - 4 cards */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))",
                        gap: "10px",
                      }}
                    >
                      {packages
                        .filter(
                          (p) =>
                            (p.businessType || "single").toLowerCase() ===
                              planBusinessType.toLowerCase() &&
                            p.price > 0 &&
                            !p.packageName.toLowerCase().includes("trial")
                        )
                        .map((pkg) => {
                          const isSelected = selectedPlanId === pkg._id;
                          return (
                            <div
                              key={pkg._id}
                              onClick={() => setSelectedPlanId(pkg._id)}
                              style={{
                                padding: "12px 14px",
                                borderRadius: "12px",
                                border: isSelected
                                  ? "2px solid #004ac6"
                                  : "1px solid #cbd5e1",
                                backgroundColor: isSelected ? "#eff6ff" : "#ffffff",
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "12.5px",
                                  fontWeight: "700",
                                  color: "#0f172a",
                                }}
                              >
                                {pkg.packageName}
                              </div>
                              <div
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "800",
                                  color: isSelected ? "#004ac6" : "#0f172a",
                                  marginTop: "2px",
                                }}
                              >
                                {pkg.price === 0 || pkg.isCustomQuote
                                  ? "Custom Quote"
                                  : `₹${pkg.price}/mo`}
                              </div>
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: "#64748b",
                                  marginTop: "4px",
                                }}
                              >
                                {pkg.businessType === "marketplace"
                                  ? `${pkg.productsLimit ? `${pkg.productsLimit} SKUs · ` : ""}${pkg.reviewLimit} Reviews/mo`
                                  : pkg.businessType === "multiple"
                                  ? `${pkg.maxBusinesses ? `${pkg.maxBusinesses} Outlets · ` : ""}${pkg.reviewLimit} Scans/mo`
                                  : `${pkg.reviewLimit} Reviews / month`}
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {/* Promo Coupon / Referral Code Box */}
                    <div
                      style={{
                        marginTop: "16px",
                        padding: "14px",
                        borderRadius: "12px",
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Ticket size={16} color="#004ac6" />
                          <span
                            style={{
                              fontSize: "12.5px",
                              fontWeight: "700",
                              color: "#0f172a",
                            }}
                          >
                            Have a Promo Coupon or SaaS Voucher?
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: "10.5px",
                            fontWeight: "600",
                            color: "#64748b",
                          }}
                        >
                          Rate discount · Free branch · Quota boost
                        </span>
                      </div>

                      {!appliedCoupon ? (
                        <div>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <input
                              type="text"
                              value={couponInput}
                              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                              placeholder="e.g. EXTRAFREE, BIZ20, BOOSTWSP"
                              style={{
                                flex: 1,
                                padding: "9px 12px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                fontSize: "13px",
                                fontFamily: "monospace",
                                fontWeight: "700",
                                letterSpacing: "0.05em",
                                textTransform: "uppercase",
                                backgroundColor: "#ffffff",
                                outline: "none",
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleApplyCoupon()}
                              disabled={couponValidating}
                              style={{
                                padding: "9px 18px",
                                borderRadius: "8px",
                                border: "none",
                                backgroundColor: "#004ac6",
                                color: "#ffffff",
                                fontSize: "12.5px",
                                fontWeight: "700",
                                cursor: couponValidating ? "not-allowed" : "pointer",
                                transition: "all 0.15s ease",
                              }}
                            >
                              {couponValidating ? "Verifying..." : "Apply"}
                            </button>
                          </div>

                          {couponFeedback && (
                            <p
                              style={{
                                margin: "6px 0 0",
                                fontSize: "11.5px",
                                fontWeight: "600",
                                color: couponFeedback.type === "error" ? "#dc2626" : "#059669",
                              }}
                            >
                              {couponFeedback.message}
                            </p>
                          )}
                        </div>
                      ) : (
                        /* Authentic Physical Ticket Applied Coupon Card */
                        <div
                          style={{
                            position: "relative",
                            display: "flex",
                            backgroundColor: "#f0fdf4",
                            borderRadius: "12px",
                            border: "1.5px dashed #10b981",
                            boxShadow: "0 2px 10px rgba(16, 185, 129, 0.08)",
                            overflow: "hidden",
                          }}
                        >
                          {/* Top Punch Hole Notch */}
                          <div
                            style={{
                              position: "absolute",
                              top: "-7px",
                              left: "95px",
                              width: "14px",
                              height: "14px",
                              borderRadius: "50%",
                              backgroundColor: "#f8fafc",
                              border: "1px solid #10b981",
                              zIndex: 2,
                            }}
                          />
                          {/* Bottom Punch Hole Notch */}
                          <div
                            style={{
                              position: "absolute",
                              bottom: "-7px",
                              left: "95px",
                              width: "14px",
                              height: "14px",
                              borderRadius: "50%",
                              backgroundColor: "#f8fafc",
                              border: "1px solid #10b981",
                              zIndex: 2,
                            }}
                          />

                          {/* Ticket Left Stub */}
                          <div
                            style={{
                              width: "102px",
                              flexShrink: 0,
                              background: "linear-gradient(135deg, #059669, #10b981)",
                              color: "#ffffff",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "10px 6px",
                              textAlign: "center",
                              borderRight: "2px dashed rgba(255, 255, 255, 0.4)",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "8.5px",
                                fontWeight: "800",
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                opacity: 0.9,
                              }}
                            >
                              COUPON
                            </span>
                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: "900",
                                margin: "2px 0",
                              }}
                            >
                              {appliedCoupon.offerType === "FREE_BRANCH"
                                ? `+${appliedCoupon.extraBranches || 1} FREE`
                                : appliedCoupon.offerType === "WSP_QUOTA_BOOST"
                                ? `+${(appliedCoupon.extraWspQuota || 1000).toLocaleString()}`
                                : appliedCoupon.discountPercent
                                ? `${appliedCoupon.discountPercent}% OFF`
                                : `₹${appliedCoupon.discountFlat} OFF`}
                            </span>
                            <span
                              style={{
                                fontSize: "9px",
                                fontWeight: "800",
                                letterSpacing: "0.05em",
                                opacity: 0.95,
                              }}
                            >
                              {appliedCoupon.offerType === "FREE_BRANCH"
                                ? "BRANCH"
                                : appliedCoupon.offerType === "WSP_QUOTA_BOOST"
                                ? "WSP SCANS"
                                : "SAVINGS"}
                            </span>
                          </div>

                          {/* Ticket Right Body */}
                          <div
                            style={{
                              flex: 1,
                              padding: "10px 14px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "8px",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <CheckCircle2 size={15} color="#059669" />
                                <span
                                  style={{
                                    fontSize: "12.5px",
                                    fontWeight: "800",
                                    color: "#065f46",
                                  }}
                                >
                                  {appliedCoupon.title}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={handleRemoveCoupon}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: "#991b1b",
                                  fontSize: "11px",
                                  fontWeight: "700",
                                  cursor: "pointer",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  textDecoration: "underline",
                                }}
                              >
                                Remove
                              </button>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginTop: "6px",
                                flexWrap: "wrap",
                                gap: "6px",
                              }}
                            >
                              <div style={{ fontSize: "11.5px", color: "#047857", fontWeight: "600" }}>
                                {appliedCoupon.discountAmount > 0 && (
                                  <span>
                                    Rate Discount: <strong>₹{appliedCoupon.discountAmount} OFF</strong>{" "}
                                    (Payable: ₹{appliedCoupon.finalPrice}/mo) ·{" "}
                                  </span>
                                )}
                                {appliedCoupon.extraBranches > 0 && (
                                  <span>
                                    🎉 <strong>+{appliedCoupon.extraBranches} Free Multi-Branch</strong> included ·{" "}
                                  </span>
                                )}
                                {appliedCoupon.extraWspQuota > 0 && (
                                  <span>
                                    💬 <strong>+{(appliedCoupon.extraWspQuota).toLocaleString()} Bonus WhatsApp Scans</strong> included
                                  </span>
                                )}
                              </div>
                              <span
                                style={{
                                  padding: "2px 8px",
                                  backgroundColor: "#dcfce7",
                                  border: "1px solid #86efac",
                                  borderRadius: "6px",
                                  fontFamily: "monospace",
                                  fontSize: "11px",
                                  fontWeight: "800",
                                  color: "#166534",
                                }}
                              >
                                {appliedCoupon.code}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={regLoading}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "11px",
                    backgroundColor: "#004ac6",
                    color: "#ffffff",
                    fontSize: "15px",
                    fontWeight: "700",
                    border: "none",
                    cursor: regLoading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 8px 20px rgba(0, 74, 198, 0.22)",
                  }}
                >
                  {regLoading ? (
                    <span>Launching your portal...</span>
                  ) : (
                    <>
                      <span>Launch Business Review Portal</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <p
                  style={{
                    textAlign: "center",
                    fontSize: "13.5px",
                    color: "#64748b",
                    marginTop: "16px",
                    marginBottom: 0,
                  }}
                >
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    style={{
                      fontWeight: "700",
                      color: "#004ac6",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                    onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                  >
                    Sign In
                  </Link>
                </p>
              </form>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export const LoginPage = (props) => <AuthPage {...props} defaultTab="login" />;
export const RegisterPage = (props) => <AuthPage {...props} defaultTab="register" />;

export default AuthPage;
