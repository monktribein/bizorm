import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { Download, Printer, RefreshCw, QrCode, ExternalLink, Check, Copy, Sparkles, Building2, Heart, Image as ImageIcon } from "lucide-react";
import { getCleanBrandName } from "../../utils/brand";
import { EditBusinessModal } from "../common/EditBusinessModal";
import nkTechLogo from "../../assets/nktech-logo.jpg";

// Fallback for older browsers without native roundRect
if (typeof CanvasRenderingContext2D !== "undefined" && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r = 0) {
    const radius = typeof r === "number" ? [r, r, r, r] : r;
    const [tl, tr, br, bl] = radius;
    this.beginPath();
    this.moveTo(x + tl, y);
    this.lineTo(x + w - tr, y);
    this.quadraticCurveTo(x + w, y, x + w, y + tr);
    this.lineTo(x + w, y + h - br);
    this.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
    this.lineTo(x + bl, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - bl);
    this.lineTo(x, y + tl);
    this.quadraticCurveTo(x, y, x + tl, y);
    this.closePath();
    return this;
  };
}

// Friendly Smiley Heart SVG Component
export const SmileyHeart = ({ size = 48, color = "#e11d48", className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ flexShrink: 0, display: "inline-block" }}
  >
    {/* Heart Outline */}
    <path
      d="M50 88 C20 65 5 45 5 28 C5 14 16 5 30 5 C39 5 46 10 50 17 C54 10 61 5 70 5 C84 5 95 14 95 28 C95 45 80 65 50 88 Z"
      stroke={color}
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Left Eye */}
    <circle cx="36" cy="38" r="4.5" fill={color} />
    {/* Right Eye */}
    <circle cx="64" cy="38" r="4.5" fill={color} />
    {/* Smile */}
    <path
      d="M36 52 C40 64 60 64 64 52"
      stroke={color}
      strokeWidth="5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

export const STANDEE_THEMES = [
  {
    id: "classic",
    name: "Classic Acrylic",
    subtitle: "Royal Blue & Clean White",
    tag: "Standard",
    icon: "🏢",
    bg: "#ffffff",
    cardBorder: "#cbd5e1",
    headerColor: "#1d4ed8",
    taglineColor: "#1e3a8a",
    heartColor: "#e11d48",
    ctaColor: "#0f172a",
    qrBorder: "#e2e8f0",
    qrBoxBg: "#ffffff",
    footerTextDark: "#0f172a",
    footerTextMuted: "#475569",
    swatchBg: "#ffffff",
    swatchBorder: "#1d4ed8",
  },
  {
    id: "luxury_dark",
    name: "Luxury Obsidian & Gold",
    subtitle: "Fine Dining, Salons & Lounges",
    tag: "Premium",
    icon: "✨",
    bg: "#090d16",
    cardBorder: "#d97706",
    headerColor: "#fbbf24",
    taglineColor: "#fef08a",
    heartColor: "#f59e0b",
    ctaColor: "#ffffff",
    qrBorder: "#d97706",
    qrBoxBg: "#ffffff",
    footerTextDark: "#f8fafc",
    footerTextMuted: "#94a3b8",
    swatchBg: "#090d16",
    swatchBorder: "#f59e0b",
  },
  {
    id: "medical_teal",
    name: "Clinical Mint & Teal",
    subtitle: "Hospitals, Clinics & Doctors",
    tag: "Healthcare",
    icon: "🩺",
    bg: "#f0fdfa",
    cardBorder: "#14b8a6",
    headerColor: "#0f766e",
    taglineColor: "#115e59",
    heartColor: "#0d9488",
    ctaColor: "#134e4a",
    qrBorder: "#99f6e4",
    qrBoxBg: "#ffffff",
    footerTextDark: "#0f766e",
    footerTextMuted: "#475569",
    swatchBg: "#f0fdfa",
    swatchBorder: "#0d9488",
  },
  {
    id: "vibrant_neon",
    name: "Electric Indigo & Violet",
    subtitle: "Cafes, Gyms & Boutiques",
    tag: "Modern",
    icon: "⚡",
    bg: "#f8fafc",
    cardBorder: "#818cf8",
    headerColor: "#4f46e5",
    taglineColor: "#4338ca",
    heartColor: "#7c3aed",
    ctaColor: "#1e1b4b",
    qrBorder: "#c7d2fe",
    qrBoxBg: "#ffffff",
    footerTextDark: "#1e1b4b",
    footerTextMuted: "#64748b",
    swatchBg: "#eff6ff",
    swatchBorder: "#6366f1",
  },
  {
    id: "table_tent",
    name: "Table-Tent & Bill-Slip",
    subtitle: "Compact fold for dining tables",
    tag: "Compact",
    icon: "🍽️",
    bg: "#fffbeb",
    cardBorder: "#f59e0b",
    headerColor: "#b45309",
    taglineColor: "#92400e",
    heartColor: "#d97706",
    ctaColor: "#78350f",
    qrBorder: "#fde68a",
    qrBoxBg: "#ffffff",
    footerTextDark: "#78350f",
    footerTextMuted: "#92400e",
    swatchBg: "#fffbeb",
    swatchBorder: "#d97706",
  },
];

export const INDUSTRY_PRESETS = [
  {
    id: "general",
    label: "🏢 General Business & Service",
    tagline1: "We would love to",
    tagline2: "hear from you.",
    cta: "Please Scan for Review.",
  },
  {
    id: "medical",
    label: "🩺 Hospital, Clinic & Dentist",
    tagline1: "Your Health & Care",
    tagline2: "Matter Dearly To Us.",
    cta: "Scan to Rate Your Care Experience.",
  },
  {
    id: "dining",
    label: "🍽️ Restaurant, Cafe & Food",
    tagline1: "Enjoyed Your Meal &",
    tagline2: "Our Ambiance Today?",
    cta: "Please Scan to Review Your Dining.",
  },
  {
    id: "salon",
    label: "✂️ Salon, Spa & Beauty Care",
    tagline1: "Loved Your Glow &",
    tagline2: "New Transformation?",
    cta: "Please Scan to Rate Our Stylists.",
  },
  {
    id: "fitness",
    label: "🏋️ Gym, Fitness & Sports",
    tagline1: "Crushing Your Goals",
    tagline2: "With Our Trainers?",
    cta: "Scan to Review Our Energy & Vibe.",
  },
  {
    id: "hotel",
    label: "🏨 Hotel, Resort & Stay",
    tagline1: "How Was Your Stay",
    tagline2: "With Our Team?",
    cta: "Scan to Rate Your Hospitality.",
  },
];

export const ReviewStandee = ({ user, companyDetails }) => {
  // Priority: Clean Business/Hospital name from signup
  const signupBusinessName = getCleanBrandName(user, companyDetails) || "Harsh ENT Hospital";

  const [selectedTheme, setSelectedTheme] = useState("classic");
  const [businessName, setBusinessName] = useState(signupBusinessName);
  const [tagline1, setTagline1] = useState("We would love to");
  const [tagline2, setTagline2] = useState("hear from you.");
  const [ctaText, setCtaText] = useState("Please Scan for Review.");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [embedLogoInQR, setEmbedLogoInQR] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const companyLogo = companyDetails?.cmpyLogo || "";

  // Dynamic review link for this business
  const reviewUrl = user?.formKey
    ? `${window.location.origin}/wtr/${user.formKey}`
    : `${window.location.origin}/wtr/demo`;

  // Sync business name when user or company details load or update
  useEffect(() => {
    const clean = getCleanBrandName(user, companyDetails);
    if (clean) {
      setBusinessName(clean);
    }
  }, [user?.cmpy, companyDetails?.cmpyName, user?.fname]);

  // Helper to generate high-resolution QR with company logo centered in a rounded badge
  const generateBrandedQR = async (url, logoSrc) => {
    if (!url) return "";

    const baseDataUrl = await QRCode.toDataURL(url, {
      width: 800,
      margin: 1,
      errorCorrectionLevel: "H", // 30% error correction headroom allows center logo without losing scan speed
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    if (!logoSrc) {
      return baseDataUrl;
    }

    return new Promise((resolve) => {
      const qrImg = new Image();
      qrImg.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 800;
        const ctx = canvas.getContext("2d");

        // 1. Draw base QR
        ctx.drawImage(qrImg, 0, 0, 800, 800);

        // 2. Draw Center Logo
        const logoImg = new Image();
        logoImg.crossOrigin = "anonymous";
        logoImg.onload = () => {
          try {
            const qrSize = 800;
            // Center badge: 22% of QR width (~176px)
            const badgeSize = Math.round(qrSize * 0.22);
            const badgeX = (qrSize - badgeSize) / 2;
            const badgeY = (qrSize - badgeSize) / 2;
            const radius = Math.round(badgeSize * 0.22); // rounded squircle badge

            // Draw white badge background with soft shadow & crisp border
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(badgeX, badgeY, badgeSize, badgeSize, radius);
            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = "rgba(0, 0, 0, 0.16)";
            ctx.shadowBlur = 14;
            ctx.shadowOffsetY = 3;
            ctx.fill();
            ctx.shadowColor = "transparent";
            ctx.strokeStyle = "#e2e8f0";
            ctx.lineWidth = 4;
            ctx.stroke();

            // Logo padding inside the white badge
            const padding = Math.round(badgeSize * 0.14);
            const maxLogoW = badgeSize - padding * 2;
            const maxLogoH = badgeSize - padding * 2;

            let drawW = maxLogoW;
            let drawH = maxLogoH;
            const aspect = logoImg.width / logoImg.height;

            if (aspect > 1) {
              drawH = maxLogoW / aspect;
            } else {
              drawW = maxLogoH * aspect;
            }

            const drawX = badgeX + (badgeSize - drawW) / 2;
            const drawY = badgeY + (badgeSize - drawH) / 2;

            ctx.drawImage(logoImg, drawX, drawY, drawW, drawH);
            ctx.restore();

            resolve(canvas.toDataURL("image/png"));
          } catch (e) {
            console.warn("Logo overlay error, falling back to base QR:", e);
            resolve(baseDataUrl);
          }
        };

        logoImg.onerror = () => {
          resolve(baseDataUrl);
        };

        logoImg.src = logoSrc;
      };

      qrImg.onerror = () => resolve(baseDataUrl);
      qrImg.src = baseDataUrl;
    });
  };

  // Generate QR code for reviewUrl (with company logo embedded in middle)
  useEffect(() => {
    if (reviewUrl) {
      const activeLogo = embedLogoInQR ? (companyDetails?.cmpyLogo || "") : "";
      generateBrandedQR(reviewUrl, activeLogo)
        .then((url) => setQrDataUrl(url))
        .catch(console.error);
    }
  }, [reviewUrl, companyDetails?.cmpyLogo, embedLogoInQR]);

  // Handle resetting back to original signup name
  const handleResetToSignupName = () => {
    setBusinessName(signupBusinessName);
  };

  // High-Resolution 1200 x 1800 px (300 DPI) Standee PNG Generator
  const handleDownloadHighResPNG = async () => {
    if (!qrDataUrl) return;
    setDownloading(true);

    try {
      const width = 1200;
      const height = 1800;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      const theme = STANDEE_THEMES.find((t) => t.id === selectedTheme) || STANDEE_THEMES[0];

      // 1. Theme-specific background
      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, width, height);

      // Subtle metallic / colored inner borders for luxury & clinical themes
      if (theme.id === "luxury_dark") {
        ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
        ctx.lineWidth = 10;
        ctx.strokeRect(26, 26, width - 52, height - 52);
      } else if (theme.id === "medical_teal") {
        ctx.strokeStyle = "rgba(13, 148, 136, 0.3)";
        ctx.lineWidth = 8;
        ctx.strokeRect(26, 26, width - 52, height - 52);
      } else if (theme.id === "vibrant_neon") {
        ctx.strokeStyle = "rgba(99, 102, 241, 0.35)";
        ctx.lineWidth = 8;
        ctx.strokeRect(26, 26, width - 52, height - 52);
      } else if (theme.id === "table_tent") {
        ctx.strokeStyle = "rgba(217, 119, 6, 0.3)";
        ctx.lineWidth = 8;
        ctx.strokeRect(26, 26, width - 52, height - 52);
      }

      // 2. Business Name at Top
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = theme.headerColor;

      const nameLength = businessName.trim().length;
      let nameFontSize = 76;
      if (nameLength > 20) {
        nameFontSize = Math.max(46, Math.floor((width - 160) / (nameLength * 0.58)));
      }
      ctx.font = `800 ${nameFontSize}px 'Plus Jakarta Sans', Arial, sans-serif`;
      ctx.fillText(businessName.trim() || "Harsh ENT Hospital", width / 2, 170);
      ctx.restore();

      // 3. Heart Smileys & Tagline
      const drawCanvasHeart = (cx, cy, scale) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);
        ctx.translate(-50, -50);

        // Heart path
        const heartPath = new Path2D(
          "M50 88 C20 65 5 45 5 28 C5 14 16 5 30 5 C39 5 46 10 50 17 C54 10 61 5 70 5 C84 5 95 14 95 28 C95 45 80 65 50 88 Z"
        );
        ctx.strokeStyle = theme.heartColor;
        ctx.lineWidth = 6;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke(heartPath);

        // Eyes
        ctx.fillStyle = theme.heartColor;
        ctx.beginPath();
        ctx.arc(36, 38, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(64, 38, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Smile
        const smilePath = new Path2D("M36 52 C40 64 60 64 64 52");
        ctx.lineWidth = 5;
        ctx.strokeStyle = theme.heartColor;
        ctx.stroke(smilePath);

        ctx.restore();
      };

      // Draw left and right hearts
      drawCanvasHeart(width / 2 - 290, 295, 1.2);
      drawCanvasHeart(width / 2 + 290, 295, 1.2);

      // Draw two-line tagline
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = theme.taglineColor;
      ctx.font = "700 44px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText(tagline1, width / 2, 275);
      ctx.fillText(tagline2, width / 2, 330);
      ctx.restore();

      // 4. CTA Prompt: "Please Scan for Review."
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = theme.ctaColor;
      ctx.font = "900 54px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText(ctaText, width / 2, 465);
      ctx.restore();

      // 5. Centered QR Code Card Frame
      const qrBoxSize = 720;
      const qrBoxX = (width - qrBoxSize) / 2;
      const qrBoxY = 540;
      const radius = 28;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, radius);
      ctx.fillStyle = theme.qrBoxBg;
      ctx.shadowColor = "rgba(0, 0, 0, 0.08)";
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 8;
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = theme.qrBorder;
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw QR Image
      const qrImg = new Image();
      await new Promise((resolve, reject) => {
        qrImg.onload = resolve;
        qrImg.onerror = reject;
        qrImg.src = qrDataUrl;
      });

      const qrPadding = 42;
      ctx.drawImage(
        qrImg,
        qrBoxX + qrPadding,
        qrBoxY + qrPadding,
        qrBoxSize - qrPadding * 2,
        qrBoxSize - qrPadding * 2
      );
      ctx.restore();

      // 6. Footer Section (Left: Bizorm, Center: Google Reviews, Right: NK tech)
      const footerY = 1550;

      // --- LEFT COLUMN: BIZORM ---
      ctx.save();
      ctx.textAlign = "left";
      ctx.fillStyle = "#f59e0b";
      ctx.font = "700 28px sans-serif";
      ctx.fillText("★ ★ ★ ★ ★", 110, footerY - 50);

      ctx.fillStyle = theme.id === "luxury_dark" ? "#f8fafc" : theme.footerTextDark;
      ctx.font = "900 44px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText("BIZORM", 110, footerY - 4);

      ctx.fillStyle = theme.footerTextMuted;
      ctx.font = "700 18px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText(".COM", 305, footerY - 18);

      ctx.fillStyle = theme.footerTextMuted;
      ctx.font = "800 18px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText("CUSTOMER REVIEWS", 110, footerY + 30);
      ctx.fillText("MANAGEMENT TOOL", 110, footerY + 56);
      ctx.restore();

      // --- CENTER COLUMN: GOOGLE REVIEWS ---
      ctx.save();
      ctx.textAlign = "center";
      const gY = footerY - 14;
      ctx.font = "800 46px 'Plus Jakarta Sans', Arial, sans-serif";

      // Multi-color Google word
      const letters = [
        { char: "G", color: "#4285F4" },
        { char: "o", color: "#EA4335" },
        { char: "o", color: "#FBBC05" },
        { char: "g", color: "#4285F4" },
        { char: "l", color: "#34A853" },
        { char: "e", color: "#EA4335" },
      ];

      let currentX = width / 2 - 140;
      letters.forEach((item) => {
        ctx.fillStyle = item.color;
        ctx.fillText(item.char, currentX, gY);
        currentX += ctx.measureText(item.char).width;
      });

      ctx.fillStyle = theme.footerTextDark;
      ctx.fillText(" Reviews", currentX + 75, gY);

      // Gold stars below
      ctx.fillStyle = "#f59e0b";
      ctx.font = "700 36px sans-serif";
      ctx.fillText("★★★★★", width / 2, footerY + 38);
      ctx.restore();

      // --- RIGHT COLUMN: DIGITALLY POWERED BY NK TECH ---
      ctx.save();
      const colRightCenterX = width - 110 - 65; // ~1025px
      ctx.textAlign = "center";
      ctx.fillStyle = theme.footerTextMuted;
      ctx.font = "600 16px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText("Digitally Powered By", colRightCenterX, footerY - 55);

      const logoSize = 110;
      const logoX = colRightCenterX - logoSize / 2;
      const logoY = footerY - 42;

      try {
        const nkImg = new Image();
        nkImg.crossOrigin = "anonymous";
        await new Promise((resolve, reject) => {
          nkImg.onload = resolve;
          nkImg.onerror = reject;
          nkImg.src = nkTechLogo;
        });
        ctx.drawImage(nkImg, logoX, logoY, logoSize, logoSize);
      } catch (e) {
        // Fallback drawing if image fails
        ctx.fillStyle = "#204261";
        ctx.fillRect(logoX, logoY, logoSize, logoSize);
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 48px sans-serif";
        ctx.fillText("NK", colRightCenterX, logoY + 54);
        ctx.font = "700 24px sans-serif";
        ctx.fillText("tech", colRightCenterX, logoY + 88);
      }

      // Below the logo box:
      // NKTech.in in bold orange
      ctx.fillStyle = "#ea580c";
      ctx.font = "800 22px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText("NKTech.in", colRightCenterX, logoY + logoSize + 26);

      // SINCE 2012 in dark blue
      ctx.fillStyle = "#1e3a5f";
      ctx.font = "800 16px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText("SINCE 2012", colRightCenterX, logoY + logoSize + 48);
      ctx.restore();

      // Trigger high-res file download
      const cleanFileName = (businessName || "review")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-");

      const link = document.createElement("a");
      link.download = `${cleanFileName}-${selectedTheme}-standee-300dpi.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
    } catch (err) {
      console.error("Failed to generate Standee PNG:", err);
      alert("Error generating download image. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  // Direct Print / Save as PDF
  const handlePrint = () => {
    window.print();
  };

  // Download raw QR code PNG
  const handleDownloadBareQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `review-qr-${(businessName || "bizwoke").toLowerCase().replace(/[^a-z0-9]/g, "-")}.png`;
    a.click();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reviewUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Main Grid: Live Standee Preview (Left) + Customization & Actions (Right) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "24px", alignItems: "start" }}>
        {/* Left Column: Standee Card Preview + Action Deck */}
        <div
          className="standee-left-column"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            className="standee-printable-wrapper"
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
          {(() => {
            const currentTheme = STANDEE_THEMES.find((t) => t.id === selectedTheme) || STANDEE_THEMES[0];
            return (
              <div
                id="printable-standee"
                style={{
                  width: "100%",
                  maxWidth: "430px",
                  aspectRatio: "2 / 3",
                  background: currentTheme.bg,
                  borderRadius: "18px",
                  padding: "36px 26px 26px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: currentTheme.id === "luxury_dark"
                    ? "0 25px 50px -10px rgba(0, 0, 0, 0.6), 0 0 0 2px #d97706"
                    : "0 20px 45px -10px rgba(15, 23, 42, 0.15), 0 0 0 1px rgba(0,0,0,0.06)",
                  border: `2px solid ${currentTheme.cardBorder}`,
                  position: "relative",
                  boxSizing: "border-box",
                  transition: "all 0.3s ease",
                }}
              >
                {/* 1. Header: Business Name */}
                <div style={{ width: "100%", textAlign: "center" }}>
                  <h2
                    style={{
                      fontSize: businessName.length > 22 ? "22px" : "26px",
                      fontWeight: "900",
                      color: currentTheme.headerColor,
                      margin: 0,
                      lineHeight: 1.2,
                      letterSpacing: "-0.5px",
                      wordBreak: "break-word",
                      fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
                    }}
                  >
                    {businessName || "Harsh ENT Hospital"}
                  </h2>
                </div>

                {/* 2. Subheader: Smiley Hearts + Tagline */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    width: "100%",
                    margin: "12px 0 8px",
                  }}
                >
                  <SmileyHeart size={44} color={currentTheme.heartColor} />
                  <div
                    style={{
                      textAlign: "center",
                      color: currentTheme.taglineColor,
                      fontWeight: "800",
                      fontSize: "16px",
                      lineHeight: 1.25,
                      fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
                    }}
                  >
                    <div>{tagline1}</div>
                    <div>{tagline2}</div>
                  </div>
                  <SmileyHeart size={44} color={currentTheme.heartColor} />
                </div>

                {/* 3. CTA: Please Scan for Review. */}
                <div
                  style={{
                    fontSize: "21px",
                    fontWeight: "900",
                    color: currentTheme.ctaColor,
                    textAlign: "center",
                    margin: "4px 0 14px",
                    letterSpacing: "-0.4px",
                    fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
                  }}
                >
                  {ctaText}
                </div>

                {/* 4. Center QR Code Container */}
                <div
                  style={{
                    padding: "14px",
                    background: currentTheme.qrBoxBg,
                    borderRadius: "16px",
                    border: `2px solid ${currentTheme.qrBorder}`,
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Review QR Code"
                      style={{
                        width: "220px",
                        height: "220px",
                        display: "block",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "220px",
                        height: "220px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#94a3b8",
                        fontSize: "13px",
                      }}
                    >
                      Generating QR...
                    </div>
                  )}
                </div>

                {/* 5. Footer: Bizorm + Google Reviews + NK Tech */}
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    paddingTop: "16px",
                    marginTop: "auto",
                  }}
                >
                  {/* Left Column: BIZORM */}
                  <div style={{ textAlign: "left" }}>
                    <div style={{ color: "#f59e0b", fontSize: "13px", letterSpacing: "1px", marginBottom: "2px" }}>
                      ★★★★★
                    </div>
                    <div
                      style={{
                        fontWeight: "900",
                        fontSize: "15px",
                        color: currentTheme.id === "luxury_dark" ? "#f8fafc" : currentTheme.footerTextDark,
                        letterSpacing: "0.5px",
                        display: "flex",
                        alignItems: "baseline",
                        lineHeight: 1,
                      }}
                    >
                      BIZORM
                      <span style={{ fontSize: "8px", color: currentTheme.footerTextMuted, fontWeight: "700", marginLeft: "2px" }}>
                        .COM
                      </span>
                    </div>
                    <div style={{ fontSize: "7px", fontWeight: "800", color: currentTheme.footerTextMuted, letterSpacing: "0.4px", marginTop: "3px" }}>
                      CUSTOMER REVIEWS
                    </div>
                    <div style={{ fontSize: "7px", fontWeight: "800", color: currentTheme.footerTextMuted, letterSpacing: "0.4px" }}>
                      MANAGEMENT TOOL
                    </div>
                  </div>

                  {/* Center Column: Google Reviews */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ display: "inline-flex", alignItems: "baseline", gap: "3px" }}>
                      <span style={{ fontWeight: "900", fontSize: "17px", letterSpacing: "-0.5px" }}>
                        <span style={{ color: "#4285F4" }}>G</span>
                        <span style={{ color: "#EA4335" }}>o</span>
                        <span style={{ color: "#FBBC05" }}>o</span>
                        <span style={{ color: "#4285F4" }}>g</span>
                        <span style={{ color: "#34A853" }}>l</span>
                        <span style={{ color: "#EA4335" }}>e</span>
                      </span>
                      <span style={{ fontWeight: "800", fontSize: "15px", color: currentTheme.footerTextDark }}>
                        Reviews
                      </span>
                    </div>
                    <div style={{ color: "#f59e0b", fontSize: "13px", letterSpacing: "1px", marginTop: "1px" }}>
                      ★★★★★
                    </div>
                  </div>

                  {/* Right Column: Official NK tech logo */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      minWidth: "64px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "7.5px",
                        fontWeight: "600",
                        color: currentTheme.footerTextMuted,
                        marginBottom: "3px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Digitally Powered By
                    </div>
                    <img
                      src={nkTechLogo}
                      alt="NK Tech Logo"
                      style={{
                        width: "48px",
                        height: "48px",
                        objectFit: "contain",
                        display: "block",
                        borderRadius: "1px",
                      }}
                    />
                    <div
                      style={{
                        color: "#ea580c",
                        fontSize: "8.5px",
                        fontWeight: "800",
                        letterSpacing: "0.2px",
                        marginTop: "3px",
                        lineHeight: 1.1,
                      }}
                    >
                      NKTech.in
                    </div>
                    <div
                      style={{
                        color: currentTheme.id === "luxury_dark" ? "#94a3b8" : "#1e3a5f",
                        fontSize: "7px",
                        fontWeight: "800",
                        letterSpacing: "0.6px",
                        marginTop: "1px",
                        lineHeight: 1.1,
                      }}
                    >
                      SINCE 2012
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Download & Print Actions (Directly beneath preview - eliminates empty space) */}
          <div
            className="card no-print"
            style={{
              width: "100%",
              maxWidth: "430px",
              padding: "20px",
              background: "#ffffff",
              border: "1.5px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h4 style={{ fontSize: "15px", fontWeight: "800", color: "var(--secondary)", margin: 0 }}>
                Download &amp; Print Options
              </h4>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#166534", background: "#f0fdf4", padding: "2px 8px", borderRadius: "9999px", border: "1px solid #bbf7d0" }}>
                300 DPI Ultra HD
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                type="button"
                onClick={handleDownloadHighResPNG}
                disabled={downloading}
                className="btn btn-primary"
                style={{
                  width: "100%",
                  padding: "11px",
                  fontSize: "14px",
                  fontWeight: "800",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <Download size={16} />
                <span>{downloading ? "Preparing High-Res Image..." : "Download Standee Poster (High-Res PNG)"}</span>
              </button>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="btn btn-secondary"
                  style={{ fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                >
                  <Printer size={15} />
                  <span>Print / PDF</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadBareQR}
                  className="btn btn-secondary"
                  style={{ fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                >
                  <QrCode size={15} />
                  <span>QR Only</span>
                </button>
              </div>

              <div style={{ marginTop: "8px", paddingTop: "10px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  Resolution: 1200 x 1800 px
                </span>
                <a
                  href={reviewUrl}
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "var(--primary)",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <ExternalLink size={12} />
                  <span>Test Live Link</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Right: Customization Controls & Quick Actions */}
        <div className="no-print" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Customization Settings Card */}
          <div className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--secondary)", margin: 0 }}>
                Standee &amp; Flyer Designer Studio
              </h3>
              <span style={{
                fontSize: "11px",
                fontWeight: "700",
                padding: "2px 8px",
                borderRadius: "9999px",
                background: "#f0fdf4",
                color: "#166534",
                border: "1px solid #bbf7d0"
              }}>
                300 DPI Print Ready
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "18px" }}>
              Choose a design theme matching your interior ambiance and personalize the wording:
            </p>

            {/* Standee Theme Selector */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{ fontSize: "12px", fontWeight: "800", color: "#1e293b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  🎨 Select Standee Theme:
                </label>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--primary)" }}>
                  {STANDEE_THEMES.find((t) => t.id === selectedTheme)?.name}
                </span>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                gap: "8px",
              }}>
                {STANDEE_THEMES.map((th) => {
                  const isSelected = selectedTheme === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => setSelectedTheme(th.id)}
                      style={{
                        padding: "10px 10px",
                        borderRadius: "12px",
                        border: isSelected ? "2.5px solid var(--primary)" : "1.5px solid #e2e8f0",
                        background: isSelected ? "#eff6ff" : "#ffffff",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        position: "relative",
                        boxShadow: isSelected ? "0 4px 12px rgba(37, 99, 235, 0.12)" : "none",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "18px" }}>{th.icon}</span>
                        <div style={{
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          background: th.swatchBg,
                          border: `2px solid ${th.swatchBorder}`,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.15)"
                        }} />
                      </div>
                      <div style={{ fontSize: "12px", fontWeight: "800", color: "#1e293b", lineHeight: 1.2 }}>
                        {th.name}
                      </div>
                      <div style={{ fontSize: "10px", color: "#64748b", lineHeight: 1.2 }}>
                        {th.subtitle}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Industry Tagline Preset Selector */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{ fontSize: "12px", fontWeight: "800", color: "#1e293b", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>
                ⚡ Quick Industry Presets:
              </label>
              <select
                onChange={(e) => {
                  const preset = INDUSTRY_PRESETS.find((p) => p.id === e.target.value);
                  if (preset) {
                    setTagline1(preset.tagline1);
                    setTagline2(preset.tagline2);
                    setCtaText(preset.cta);
                  }
                }}
                className="form-control"
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  fontSize: "13px",
                  fontWeight: "600",
                  borderRadius: "10px",
                  border: "1.5px solid var(--border)",
                  background: "#f8fafc",
                  cursor: "pointer"
                }}
                defaultValue=""
              >
                <option value="" disabled>-- Click to load industry-tailored text --</option>
                {INDUSTRY_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Business / Hospital Name Input */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "700", color: "#334155" }}>
                    Business / Hospital Name (Top Header)
                  </label>
                  {businessName !== signupBusinessName && (
                    <button
                      type="button"
                      onClick={handleResetToSignupName}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--primary)",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <RefreshCw size={12} />
                      <span>Reset to Signup Name</span>
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Harsh ENT Hospital"
                  className="form-control"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    fontSize: "14px",
                    fontWeight: "600",
                    borderRadius: "10px",
                    border: "1.5px solid var(--border)",
                  }}
                />
              </div>

              {/* Tagline 1 & 2 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                    Tagline Line 1
                  </label>
                  <input
                    type="text"
                    value={tagline1}
                    onChange={(e) => setTagline1(e.target.value)}
                    className="form-control"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      fontSize: "13px",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                    Tagline Line 2
                  </label>
                  <input
                    type="text"
                    value={tagline2}
                    onChange={(e) => setTagline2(e.target.value)}
                    className="form-control"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      fontSize: "13px",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                    }}
                  />
                </div>
              </div>

              {/* Call to action text */}
              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                  Call to Action (Under Tagline)
                </label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="form-control"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    fontSize: "13px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                  }}
                />
              </div>

              {/* Company Logo in QR Middle Feature Card */}
              <div
                style={{
                  padding: "14px 16px",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  border: "1.5px solid var(--border)",
                  marginTop: "4px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {companyLogo ? (
                      <img
                        src={companyLogo}
                        alt="Company Logo"
                        style={{
                          width: "36px",
                          height: "36px",
                          objectFit: "contain",
                          borderRadius: "8px",
                          background: "#ffffff",
                          padding: "3px",
                          border: "1px solid var(--border)",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "8px",
                          background: "#e2e8f0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ImageIcon size={18} color="#64748b" />
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "800", color: "#1e293b" }}>
                        Company Logo in QR Center
                      </div>
                      <div style={{ fontSize: "11px", color: companyLogo ? "var(--success)" : "var(--text-muted)", fontWeight: "600" }}>
                        {companyLogo ? "✓ Active • Showing company logo in middle of QR" : "No logo configured yet"}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {companyLogo ? (
                      <label style={{ display: "flex", alignItems: "center", cursor: "pointer", gap: "6px" }}>
                        <input
                          type="checkbox"
                          checked={embedLogoInQR}
                          onChange={(e) => setEmbedLogoInQR(e.target.checked)}
                          style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "var(--primary)" }}
                        />
                        <span style={{ fontSize: "12px", fontWeight: "700", color: embedLogoInQR ? "var(--primary)" : "var(--text-muted)" }}>
                          {embedLogoInQR ? "Enabled" : "Disabled"}
                        </span>
                      </label>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowEditModal(true)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: "12px", padding: "4px 10px", fontWeight: "700" }}
                      >
                        Upload Logo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Business Modal shortcut for uploading/changing logo */}
      <EditBusinessModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </div>
  );
};
