import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LandingNavbar } from "../../components/landing/Navbar";
import { LandingFooter } from "../../components/landing/Footer";
import {
  Package,
  QrCode,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Sliders,
  Award,
  Truck,
  RotateCcw,
  Check,
  ShoppingBag,
  Store,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const MarketplaceSellersPage = () => {
  const [annualBilling, setAnnualBilling] = useState(true);
  const [activeChannelTab, setActiveChannelTab] = useState("AMAZON");
  const [activeQrType, setActiveQrType] = useState("SKU");
  const [openFaq, setOpenFaq] = useState(null);
  const [showTrialModal, setShowTrialModal] = useState(false);

  // Channels & Compliance Profiles
  const channels = [
    {
      id: "AMAZON",
      name: "Amazon Sellers",
      badge: "FTC & Amazon Policy Compliant",
      badgeColor: "#f59e0b",
      useCase: "Product information, warranty support, permitted neutral review invitations",
      consideration: "Strict packaging and communication policies. Zero manipulative gating.",
      features: [
        "Neutral review invitations permitted by Amazon Seller Central guidelines",
        "Direct warranty registration & replacement flow outside marketplace disputes",
        "Prevents account suspension by eliminating incentivized review tactics",
        "SKU-level QR inserts printable in bulk for FBA and FBM fulfillment",
      ],
      disclaimer: "Fully aligned with 2026 Amazon Customer Review Creation Guidelines and FTC 16 CFR Part 465.",
    },
    {
      id: "FLIPKART",
      name: "Flipkart Sellers",
      badge: "Seller Score Protection",
      badgeColor: "#2563eb",
      useCase: "Product feedback, packaging quality, seller analytics",
      consideration: "Validate current seller tier and insert policies for express fulfillment.",
      features: [
        "Detect packaging & courier damage before negative marketplace reviews arrive",
        "Collect customer feedback on product sizing, finish, and durability",
        "SKU comparative scorecards to identify defect-prone factory batches",
        "Compliant customer care contact point for instant problem resolution",
      ],
      disclaimer: "Compliant with Flipkart Seller Protection Fund and customer satisfaction metrics.",
    },
    {
      id: "SHOPIFY_D2C",
      name: "Shopify & D2C Brands",
      badge: "Full Post-Purchase CRM",
      badgeColor: "#10b981",
      useCase: "Full post-purchase feedback, customer support, and repeat purchase loyalty",
      consideration: "Brand owns 100% of customer relationship and post-purchase communication.",
      features: [
        "Instant VIP WhatsApp customer support integration",
        "Automated warranty certificate generation on QR scan",
        "Product defect reporting with direct courier pickup initiation",
        "Review syndication to Shopify storefront widgets and Google Shopping",
      ],
      disclaimer: "Ideal for fast-scaling direct-to-consumer lifestyle, electronics, and beauty brands.",
    },
    {
      id: "SWIGGY_ZOMATO",
      name: "Quick Commerce & Food Delivery",
      badge: "Order Experience Intelligence",
      badgeColor: "#ef4444",
      useCase: "Food quality, packaging integrity, temperature, preparation feedback",
      consideration: "Validate platform terms before deploying external packaging inserts.",
      features: [
        "QR printed on food takeaway containers, tape, and delivery bags",
        "Track packaging spillage and temperature complaints by branch kitchen",
        "Direct chef/manager escalation before 1-star platform reviews get posted",
        "Real-time alerts when preparation quality drops during peak hours",
      ],
      disclaimer: "Designed for cloud kitchens, restaurant chains, and quick-commerce food brands.",
    },
    {
      id: "MEESHO",
      name: "Meesho Merchants",
      badge: "Return Mitigation",
      badgeColor: "#ec4899",
      useCase: "Product quality, defect classification, return prevention and seller intelligence",
      consideration: "Eliminate high RTO (Return to Origin) caused by customer confusion or sizing.",
      features: [
        "Defect classification: identifies manufacturing vs courier transit damage",
        "Step-by-step user manuals and sizing guides accessible via QR",
        "Reduces return shipping costs through direct customer assistance",
        "Batch traceability for apparel and manufacturing suppliers",
      ],
      disclaimer: "Targeted at high-volume value e-commerce sellers and manufacturers.",
    },
    {
      id: "MANUFACTURERS",
      name: "Manufacturers & Brands",
      badge: "Batch Traceability",
      badgeColor: "#8b5cf6",
      useCase: "Batch quality, warranty management, defects, and supply-chain customer experience",
      consideration: "Strongest fit for direct QR-in-the-box and serialization feedback.",
      features: [
        "Batch QR code links feedback directly to factory production run & shift",
        "Detect defective raw material lots before wider market recall",
        "Serialized unit warranty registration with proof-of-purchase capture",
        "Direct B2B feedback for contract manufacturers and distributors",
      ],
      disclaimer: "Empowers OEM/ODM manufacturers with ground-truth consumer quality data.",
    },
  ];

  // 4 QR Types
  const qrTypes = [
    {
      id: "BRAND",
      title: "Brand QR",
      example: "One QR for the entire brand catalog",
      useCase: "Best for small sellers with limited products (1–5 items)",
      details: "Single universal packaging insert. Customers scan and choose their product from a clean digital catalog.",
    },
    {
      id: "SKU",
      title: "SKU QR (Most Popular)",
      example: "One unique QR for each product SKU",
      useCase: "Standard for Amazon, Flipkart & D2C marketplace sellers",
      details: "Pre-printed on product packaging or labels in bulk (10,000+ units). Scans open the exact product feedback page with zero typing required.",
    },
    {
      id: "BATCH",
      title: "Batch QR",
      example: "One QR per manufacturing lot / expiry batch",
      useCase: "Essential for FMCG, food, cosmetics, and packaged goods",
      details: "Connects customer feedback to the specific manufacturing date, factory line, and raw material supplier to spot batch-level defect spikes.",
    },
    {
      id: "UNIT",
      title: "Unit QR",
      example: "Unique serial QR for every individual shipped item",
      useCase: "Luxury goods, consumer electronics, warranty registration",
      details: "Enables anti-counterfeit verification, 1-to-1 warranty tracking, and serial number registration directly from the packaging insert.",
    },
  ];

  // Pricing Packages (From Spec Page 5-6)
  const pricingPlans = [
    {
      id: "starter",
      name: "Seller Starter",
      tagline: "For emerging sellers validating new product lines",
      skus: "10 SKUs",
      scans: "200 Valid scans/mo",
      monthly: 299,
      annual: 2990,
      features: [
        "10 Product SKU QRs",
        "200 Customer scans / month",
        "Standard packaging insert templates (PDF)",
        "Amazon & Flipkart compliance profiles",
        "Defect classification & alert emails",
        "Basic Seller Dashboard",
      ],
      cta: "Start Starter Pilot",
      popular: false,
    },
    {
      id: "growth",
      name: "Seller Growth",
      tagline: "For scaling Amazon, Flipkart & D2C merchants",
      skus: "50 SKUs",
      scans: "1,000 Valid scans/mo",
      monthly: 799,
      annual: 7990,
      features: [
        "50 Product SKU & Batch QRs",
        "1,000 Customer scans / month",
        "Custom branded packaging inserts (300 DPI)",
        "Amazon, Flipkart, Shopify & Swiggy profiles",
        "Complaint Intelligence & SLA tracking",
        "Defect cluster analytics & SKU rankings",
        "Direct customer support dispatch",
        "Priority email & WhatsApp support",
      ],
      cta: "Start 7-Day Free Trial",
      popular: true,
    },
    {
      id: "pro",
      name: "Seller Pro",
      tagline: "For high-volume multi-brand e-commerce enterprises",
      skus: "200 SKUs",
      scans: "5,000 Valid scans/mo",
      monthly: 1999,
      annual: 19990,
      features: [
        "200 Product SKUs & Batch tracking",
        "5,000 Customer scans / month",
        "Bulk QR Generator & CSV uploads",
        "All 6 Marketplace Compliance Profiles",
        "Full Complaint Management & case assignment",
        "SKU defect comparative scorecards",
        "API access & webhook notifications",
        "Dedicated account manager",
      ],
      cta: "Choose Seller Pro",
      popular: false,
    },
    {
      id: "enterprise",
      name: "Seller Enterprise",
      tagline: "For manufacturers, distributors & high-volume FMCG",
      skus: "Unlimited* SKUs",
      scans: "Custom High-Volume",
      monthly: "Custom",
      annual: "Custom",
      features: [
        "Unlimited Product SKUs & Serialized Unit QRs",
        "Pooled enterprise scan quotas",
        "ERP / Shopify / Warehouse API integrations",
        "Factory batch quality traceability",
        "Custom insert design studio & print production",
        "Custom SLA & enterprise compliance governance",
      ],
      cta: "Talk to Enterprise Sales",
      popular: false,
    },
  ];

  // FAQs
  const faqs = [
    {
      q: "Does Amazon allow QR codes inside product packaging?",
      a: "Yes, Amazon permits product inserts and QR codes for product information, user guides, customer support, and warranty registration. However, Amazon strictly prohibits review manipulation, incentivized reviews (e.g., offering gift cards or discounts for 5-star reviews), and selectively asking only happy customers for reviews. BizORM Seller Intelligence includes verified Marketplace Compliance Profiles™ that ensure neutral review invitations and authentic product support in full compliance with Amazon guidelines.",
    },
    {
      q: "How does the 'QR-in-the-box' system work operationally?",
      a: "You generate print-ready SKU QR inserts or sticker labels directly from the BizORM dashboard. Place the printed insert inside your product box or apply the QR sticker on the product packaging. When the customer opens the delivered package, they scan the QR code with their phone camera to access your branded product experience page, register their warranty, or report any quality defects.",
    },
    {
      q: "Can I use one SKU QR code across thousands of shipped boxes?",
      a: "Yes! With SKU-level QR codes, you print the exact same QR code on 1,000, 10,000, or 100,000 units of that product. Every scan dynamically loads the real-time product feedback experience for that specific SKU, eliminating operational complexity in your packaging line.",
    },
    {
      q: "How does this prevent 1-star negative reviews on Amazon or Flipkart?",
      a: "Most 1-star reviews result from packaging damage in transit, missing parts, or product confusion where the buyer has no immediate direct way to get help. By providing an instant 'Report Defect & Free Replacement' channel right inside the box, customers resolve their issues directly with your brand support before venting on public marketplace listings.",
    },
    {
      q: "What is the difference between BizORM Business and BizORM Seller Intelligence?",
      a: "BizORM Business is designed for physical local locations (clinics, restaurants, salons) using counter QR standees. BizORM Seller Intelligence is purpose-built for marketplace and e-commerce sellers, featuring SKU-level QR codes, product defect clustering, batch traceability, and marketplace-specific policy compliance.",
    },
  ];

  const currentChannel = channels.find((c) => c.id === activeChannelTab) || channels[0];
  const currentQr = qrTypes.find((q) => q.id === activeQrType) || qrTypes[1];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc", fontFamily: "var(--font-sans, sans-serif)" }}>
      <LandingNavbar />

      {/* 1. Hero Section */}
      <section
        style={{
          position: "relative",
          paddingTop: "180px",
          paddingBottom: "80px",
          overflow: "hidden",
          background: "radial-gradient(circle at 50% 10%, rgba(0, 74, 198, 0.22) 0%, rgba(15, 23, 42, 0.98) 65%)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", maxWidth: "860px", margin: "0 auto" }}>
            {/* Top Pill */}
           

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-outfit"
              style={{
                fontSize: "clamp(32px, 5.5vw, 56px)",
                fontWeight: "900",
                lineHeight: 1.15,
                letterSpacing: "-1px",
                color: "#ffffff",
                marginBottom: "20px",
              }}
            >
              Every Product Delivered. <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #60a5fa 0%, #38bdf8 50%, #818cf8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Every Customer Experience Understood.
              </span>
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                fontSize: "clamp(15px, 2vw, 18px)",
                lineHeight: 1.6,
                color: "#94a3b8",
                marginBottom: "36px",
              }}
            >
              Turn product packaging into a source of customer insight with branded QR codes, product-level feedback, quality analytics and complaint management—adapted to the policies of each marketplace.
            </motion.p>

            {/* CTA Actions */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", marginBottom: "40px" }}
            >
              <button
                type="button"
                onClick={() => setShowTrialModal(true)}
                className="btn btn-primary"
                style={{
                  padding: "14px 28px",
                  fontSize: "15px",
                  fontWeight: "700",
                  borderRadius: "12px",
                  boxShadow: "0 8px 24px rgba(0, 74, 198, 0.4)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>Start 7-Day Seller Trial</span>
                <ArrowRight size={17} />
              </button>

              <Link
                to="/product-feedback/demo"
                className="btn btn-outline"
                style={{
                  padding: "14px 24px",
                  fontSize: "15px",
                  fontWeight: "700",
                  borderRadius: "12px",
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  textDecoration: "none",
                }}
              >
                <Package size={17} color="#38bdf8" />
                <span>Interactive Mobile Demo</span>
              </Link>
            </motion.div>

            {/* Platform Badges */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", flexWrap: "wrap", opacity: 0.85, fontSize: "12.5px", color: "#cbd5e1" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={15} color="#10b981" />
                <span>Amazon Packaging Compliant</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={15} color="#10b981" />
                <span>Flipkart Seller Score Protection</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={15} color="#10b981" />
                <span>Shopify &amp; D2C CRM Ready</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={15} color="#10b981" />
                <span>FTC 16 CFR Part 465 Aligned</span>
              </div>
            </div>
          </div>

          {/* Interactive Packaging Insert & Phone Graphic */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{
              marginTop: "56px",
              background: "rgba(30, 41, 59, 0.7)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "24px",
              padding: "36px 30px",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "32px", alignItems: "center" }}>
              {/* Left: The Packaging Insert Card */}
              <div
                style={{
                  background: "#ffffff",
                  color: "#0f172a",
                  borderRadius: "18px",
                  padding: "28px",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
                  border: "2px dashed #cbd5e1",
                  position: "relative",
                }}
              >
                <div style={{ position: "absolute", top: "-12px", right: "20px", background: "#004ac6", color: "#ffffff", padding: "3px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: "800", letterSpacing: "0.5px" }}>
                  PRINTABLE INSERT PREVIEW
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>
                      AquaPure Gear · Official Packaging Insert
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a" }}>
                      Stainless Steel Water Bottle
                    </div>
                  </div>
                  <span style={{ fontSize: "11px", background: "#f1f5f9", padding: "3px 8px", borderRadius: "6px", fontWeight: "700", color: "#475569" }}>
                    SKU: WB-1001
                  </span>
                </div>

                <div style={{ display: "flex", gap: "20px", alignItems: "center", background: "#f8fafc", padding: "16px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                  {/* Mock QR */}
                  <div style={{ width: "96px", height: "96px", background: "#0f172a", padding: "6px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
                    <QrCode size={80} color="#ffffff" />
                  </div>
                  <div>
                    <div style={{ fontSize: "13.5px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>
                      Scan For Warranty &amp; Feedback
                    </div>
                    <p style={{ fontSize: "11.5px", color: "#64748b", margin: 0, lineHeight: 1.4 }}>
                      Activate 24-Month Brand Warranty, register product or request direct replacement for any transit damage.
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "#94a3b8" }}>
                  <span>✓ 300 DPI High-Resolution Ready</span>
                  <span>✓ Compliant Neutral Review Invitation</span>
                </div>
              </div>

              {/* Right: The Mobile Experience Preview */}
              <div style={{ color: "#ffffff" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#38bdf8", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", marginBottom: "8px" }}>
                  <Package size={15} />
                  <span>The QR-In-The-Box Workflow</span>
                </div>
                <h3 className="font-outfit" style={{ fontSize: "24px", fontWeight: "800", marginBottom: "14px", lineHeight: 1.3 }}>
                  Direct Customer Experience Without Marketplace Intermediaries
                </h3>
                <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.6, marginBottom: "20px" }}>
                  Sellers typically only hear from customers through 1-star seller ratings or account-damaging returns. With BizORM QR-in-the-box, you establish a direct, policy-compliant support bridge the moment the box is opened.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div style={{ background: "rgba(255,255,255,0.05)", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ fontSize: "18px", fontWeight: "800", color: "#60a5fa" }}>94%</div>
                    <div style={{ fontSize: "12px", color: "#94a3b8" }}>Resolution before public negative reviews</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.05)", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ fontSize: "18px", fontWeight: "800", color: "#34d399" }}>10x</div>
                    <div style={{ fontSize: "12px", color: "#94a3b8" }}>Higher scan rate than warranty URLs</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. How the QR-in-the-box System Works */}
      <section style={{ padding: "80px 24px", backgroundColor: "#0b1120", borderTop: "1px solid #1e293b", borderBottom: "1px solid #1e293b" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 56px" }}>
            <h2 className="font-outfit" style={{ fontSize: "32px", fontWeight: "800", color: "#ffffff", marginBottom: "12px" }}>
              How the QR-in-the-Box System Works
            </h2>
            <p style={{ fontSize: "15px", color: "#94a3b8", lineHeight: 1.6 }}>
              A seamless 4-step feedback and complaint resolution loop engineered specifically for e-commerce packaging.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "24px" }}>
            {[
              {
                step: "01",
                title: "Package Insert Printed",
                desc: "Generate SKU-level QR codes directly in BizORM. Print packaging inserts, box tape, or warranty cards in bulk.",
                icon: QrCode,
              },
              {
                step: "02",
                title: "Customer Scans QR",
                desc: "Customer opens their Amazon, Flipkart, or D2C parcel and scans the branded card with their mobile camera.",
                icon: Package,
              },
              {
                step: "03",
                title: "Mobile Feedback Experience",
                desc: "Rates Quality, Packaging, Delivery, and Value. If a defect is present, customer files an instant direct support ticket.",
                icon: Sliders,
              },
              {
                step: "04",
                title: "Seller Intelligence Dashboard",
                desc: "Live analytics reveal defective production batches, courier crushing trends, and SKU comparison scores.",
                icon: TrendingUp,
              },
            ].map((s, idx) => {
              const StepIcon = s.icon;
              return (
                <div
                  key={idx}
                  style={{
                    background: "rgba(30, 41, 59, 0.5)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "16px",
                    padding: "28px 22px",
                    position: "relative",
                  }}
                >
                  <div style={{ fontSize: "12px", fontWeight: "900", color: "#38bdf8", marginBottom: "16px", letterSpacing: "1px" }}>
                    STEP {s.step}
                  </div>
                  <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "rgba(0, 74, 198, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                    <StepIcon size={22} color="#60a5fa" />
                  </div>
                  <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#ffffff", marginBottom: "8px" }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: "13.5px", color: "#94a3b8", lineHeight: 1.5, margin: 0 }}>
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Product QR Architecture (4 Types) */}
      <section style={{ padding: "80px 24px", backgroundColor: "#0f172a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 48px" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Scalable Architecture
            </span>
            <h2 className="font-outfit" style={{ fontSize: "32px", fontWeight: "800", color: "#ffffff", marginTop: "6px", marginBottom: "12px" }}>
              4 Flexible QR Deployment Modes
            </h2>
            <p style={{ fontSize: "15px", color: "#94a3b8", lineHeight: 1.6 }}>
              Choose the QR granularity that matches your operational scale—from single brand cards to serialized item verification.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "20px" }}>
            {qrTypes.map((q) => {
              const isSelected = activeQrType === q.id;
              return (
                <div
                  key={q.id}
                  onClick={() => setActiveQrType(q.id)}
                  style={{
                    background: isSelected ? "rgba(0, 74, 198, 0.15)" : "rgba(30, 41, 59, 0.5)",
                    border: isSelected ? "2px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "16px",
                    padding: "24px 20px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div style={{ fontSize: "18px", fontWeight: "800", color: "#ffffff" }}>
                      {q.title}
                    </div>
                    {q.id === "SKU" && (
                      <span style={{ fontSize: "10px", fontWeight: "800", background: "#059669", color: "#fff", padding: "2px 7px", borderRadius: "999px" }}>
                        RECOMMENDED
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "600", marginBottom: "8px" }}>
                    {q.example}
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#cbd5e1", marginBottom: "12px", lineHeight: 1.4 }}>
                    <strong>Best for:</strong> {q.useCase}
                  </div>
                  <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.5, margin: 0 }}>
                    {q.details}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Marketplace Compliance Profiles™ */}
      <section style={{ padding: "80px 24px", backgroundColor: "#0b1120", borderTop: "1px solid #1e293b" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 48px" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Policy Governance
            </span>
            <h2 className="font-outfit" style={{ fontSize: "32px", fontWeight: "800", color: "#ffffff", marginTop: "6px", marginBottom: "12px" }}>
              Marketplace Compliance Profiles™
            </h2>
            <p style={{ fontSize: "15px", color: "#94a3b8", lineHeight: 1.6 }}>
              Not every marketplace should use the same customer journey. BizORM automatically adapts QR workflows to respect each channel's specific terms of service.
            </p>
          </div>

          {/* Channel Selector Tabs */}
          <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "12px", marginBottom: "32px", justifyContent: "center", flexWrap: "wrap" }}>
            {channels.map((c) => {
              const active = activeChannelTab === c.id;
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setActiveChannelTab(c.id)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "10px",
                    border: active ? "1px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.1)",
                    background: active ? "rgba(0, 74, 198, 0.3)" : "rgba(30, 41, 59, 0.6)",
                    color: active ? "#ffffff" : "#94a3b8",
                    fontWeight: "700",
                    fontSize: "13.5px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {c.name}
                </button>
              );
            })}
          </div>

          {/* Active Channel Details Card */}
          <div
            style={{
              background: "rgba(30, 41, 59, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              padding: "32px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: "800", background: currentChannel.badgeColor, color: "#fff", padding: "3px 10px", borderRadius: "999px" }}>
                  {currentChannel.badge}
                </span>
                <h3 className="font-outfit" style={{ fontSize: "24px", fontWeight: "800", color: "#ffffff", marginTop: "8px" }}>
                  {currentChannel.name} Compliance Workflow
                </h3>
              </div>
              <div style={{ maxWidth: "380px", textAlign: "right" }}>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>Primary Channel Policy Focus:</div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc" }}>{currentChannel.consideration}</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "16px", marginBottom: "24px" }}>
              {currentChannel.features.map((f, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px", background: "rgba(15, 23, 42, 0.4)", padding: "12px 14px", borderRadius: "10px" }}>
                  <Check size={16} color="#10b981" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: 1.4 }}>{f}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "10px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px", fontSize: "12.5px", color: "#fbbf24" }}>
              <ShieldCheck size={18} color="#f59e0b" style={{ flexShrink: 0 }} />
              <span>{currentChannel.disclaimer}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Seller Pricing Plans (From Spec Page 5-6) */}
      <section style={{ padding: "80px 24px", backgroundColor: "#0f172a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 40px" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Introductory Tariffs
            </span>
            <h2 className="font-outfit" style={{ fontSize: "32px", fontWeight: "800", color: "#ffffff", marginTop: "6px", marginBottom: "12px" }}>
              Dedicated Marketplace Seller Pricing
            </h2>
            <p style={{ fontSize: "15px", color: "#94a3b8", lineHeight: 1.6 }}>
              Marketplace sellers need a dedicated SKU matrix based on product count, QR scans, and complaint analytics.
            </p>

            {/* Monthly / Annual Toggle */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", background: "rgba(30, 41, 59, 0.8)", padding: "4px", borderRadius: "999px", marginTop: "16px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <button
                type="button"
                onClick={() => setAnnualBilling(false)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "999px",
                  border: "none",
                  background: !annualBilling ? "#004ac6" : "transparent",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setAnnualBilling(true)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "999px",
                  border: "none",
                  background: annualBilling ? "#004ac6" : "transparent",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>Annual (2 Months Free)</span>
                <span style={{ fontSize: "10px", background: "#10b981", color: "#fff", padding: "1px 6px", borderRadius: "999px" }}>
                  SAVE 17%
                </span>
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "24px" }}>
            {pricingPlans.map((plan) => {
              const priceDisplay =
                typeof plan.monthly === "number"
                  ? annualBilling
                    ? `₹${plan.annual.toLocaleString("en-IN")}`
                    : `₹${plan.monthly.toLocaleString("en-IN")}`
                  : "Custom";

              const cycleLabel =
                typeof plan.monthly === "number" ? (annualBilling ? "/year" : "/month") : "";

              return (
                <div
                  key={plan.id}
                  style={{
                    background: plan.popular ? "rgba(0, 74, 198, 0.15)" : "rgba(30, 41, 59, 0.5)",
                    border: plan.popular ? "2px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "20px",
                    padding: "32px 24px",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {plan.popular && (
                    <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "#004ac6", color: "#fff", fontSize: "11px", fontWeight: "800", padding: "3px 12px", borderRadius: "999px", letterSpacing: "0.5px" }}>
                      MOST POPULAR
                    </div>
                  )}

                  <div style={{ fontSize: "20px", fontWeight: "800", color: "#ffffff", marginBottom: "4px" }}>
                    {plan.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", minHeight: "32px", marginBottom: "16px" }}>
                    {plan.tagline}
                  </div>

                  <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "16px" }}>
                    <span style={{ fontSize: "36px", fontWeight: "900", color: "#ffffff" }}>
                      {priceDisplay}
                    </span>
                    <span style={{ fontSize: "13px", color: "#94a3b8" }}>{cycleLabel}</span>
                  </div>

                  {/* Quota Highlights */}
                  <div style={{ background: "rgba(15, 23, 42, 0.6)", borderRadius: "10px", padding: "10px 14px", marginBottom: "20px" }}>
                    <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#38bdf8" }}>
                      📦 {plan.skus}
                    </div>
                    <div style={{ fontSize: "12px", color: "#cbd5e1", marginTop: "2px" }}>
                      🔍 {plan.scans}
                    </div>
                  </div>

                  {/* Feature List */}
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px 0", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
                    {plan.features.map((f, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "12.5px", color: "#cbd5e1" }}>
                        <Check size={14} color="#10b981" style={{ flexShrink: 0, marginTop: "2px" }} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => setShowTrialModal(true)}
                    className={plan.popular ? "btn btn-primary" : "btn btn-outline"}
                    style={{
                      width: "100%",
                      padding: "11px",
                      borderRadius: "10px",
                      fontWeight: "700",
                      fontSize: "13.5px",
                    }}
                  >
                    {plan.cta}
                  </button>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginTop: "24px", fontSize: "12px", color: "#64748b" }}>
            *Prices exclude 18% GST. Pilot accounts include full onboarding assistance and 300 DPI packaging insert design files.
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section style={{ padding: "80px 24px", backgroundColor: "#0b1120", borderTop: "1px solid #1e293b" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#38bdf8", textTransform: "uppercase" }}>
              Everything You Need to Know
            </span>
            <h2 className="font-outfit" style={{ fontSize: "32px", fontWeight: "800", color: "#ffffff", marginTop: "6px" }}>
              Marketplace Compliance &amp; Setup FAQs
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {faqs.map((f, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: "rgba(30, 41, 59, 0.5)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{
                      width: "100%",
                      padding: "18px 20px",
                      background: "transparent",
                      border: "none",
                      color: "#ffffff",
                      fontSize: "15px",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <span>{f.q}</span>
                    <ChevronDown
                      size={18}
                      color="#94a3b8"
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                        flexShrink: 0,
                        marginLeft: "12px",
                      }}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div style={{ padding: "0 20px 20px", fontSize: "14px", color: "#94a3b8", lineHeight: 1.6, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px" }}>
                          {f.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Bottom CTA */}
      <section style={{ padding: "90px 24px", background: "radial-gradient(circle at 50% 50%, rgba(0, 74, 198, 0.3) 0%, rgba(15, 23, 42, 1) 70%)", textAlign: "center" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <h2 className="font-outfit" style={{ fontSize: "36px", fontWeight: "900", color: "#ffffff", marginBottom: "16px" }}>
            Ready to Turn Every Delivered Parcel Into a Customer Experience Opportunity?
          </h2>
          <p style={{ fontSize: "16px", color: "#94a3b8", lineHeight: 1.6, marginBottom: "32px" }}>
            Join forward-thinking Amazon, Flipkart, and Shopify merchants resolving product issues before they turn into 1-star reviews.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setShowTrialModal(true)}
              className="btn btn-primary"
              style={{ padding: "14px 32px", fontSize: "15px", fontWeight: "700", borderRadius: "12px" }}
            >
              Start 7-Day Free Seller Pilot
            </button>
            <Link
              to="/login"
              className="btn btn-outline"
              style={{ padding: "14px 28px", fontSize: "15px", fontWeight: "700", borderRadius: "12px", color: "#fff", textDecoration: "none" }}
            >
              Sign In to Seller Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Start Seller Trial Modal */}
      {showTrialModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.8)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 9999,
          }}
          onClick={() => setShowTrialModal(false)}
        >
          <div
            style={{
              background: "#ffffff",
              color: "#0f172a",
              maxWidth: "460px",
              width: "100%",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Package size={20} color="#004ac6" />
                <h3 style={{ fontSize: "18px", fontWeight: "800", margin: 0 }}>Start BizORM Seller Pilot</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTrialModal(false)}
                style={{ border: "none", background: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 18px 0" }}>
              Get instant access to SKU QR generation, printable packaging insert templates, and compliance profiles.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowTrialModal(false);
                window.location.href = "/register";
              }}
            >
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>
                  Brand / Company Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. AquaPure Gear"
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>
                  Primary Marketplace Channel
                </label>
                <select
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                >
                  <option>Amazon India (FBA / FBM)</option>
                  <option>Flipkart / Shopsy</option>
                  <option>Shopify / D2C Brand Website</option>
                  <option>Quick Commerce (Swiggy / Zomato / Blinkit)</option>
                  <option>Meesho Supplier</option>
                  <option>Manufacturer / Batch Exporter</option>
                </select>
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>
                  Estimated Active SKUs
                </label>
                <select
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                >
                  <option>1 – 10 SKUs (Seller Starter)</option>
                  <option>11 – 50 SKUs (Seller Growth)</option>
                  <option>51 – 200 SKUs (Seller Pro)</option>
                  <option>200+ SKUs (Seller Enterprise)</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", padding: "12px", borderRadius: "10px", fontWeight: "700", fontSize: "14px" }}
              >
                Continue to Create Account →
              </button>
            </form>
          </div>
        </div>
      )}

      <LandingFooter />
    </div>
  );
};

export default MarketplaceSellersPage;
