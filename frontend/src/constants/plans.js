/**
 * BizORM Centralized Plans & Entitlements Configuration
 * Specification Version: 1.0 (30 October 2026)
 * Source of Truth for Pricing Tables, Homepage Preview, Sign-up and Checkout
 */

export const PLAN_CONFIG_VERSION = "1.0.20261030";

// Single Business Plans (Display Configuration from Spec Section 7)
export const BUSINESS_PLANS = [
  {
    id: "starter",
    packageName: "Starter",
    tagline: "For small single-counter shops & local practices",
    monthlyPrice: 299,
    annualPrice: 2990,
    validScansPerMonth: 100,
    locations: 1,
    popular: false,
    scansDisplay: "100 valid scans/month",
    locationsDisplay: "1 business location",
    platformsDisplay: "5 review destinations",
    features: [
      "100 valid scans/month (monthly reset)",
      "1 business location included",
      "Neutral multi-platform review links",
      "Branded QR feedback journeys (300 DPI)",
      "Basic feedback logs & response tracking",
      "Email notifications for customer concerns",
    ],
    cta: "Choose Starter",
  },
  {
    id: "growth",
    packageName: "Growth",
    tagline: "For active clinics, cafes & busy retail counters",
    monthlyPrice: 999,
    annualPrice: 9990,
    validScansPerMonth: 1000,
    locations: 1,
    popular: true,
    scansDisplay: "1,000 valid scans/month",
    locationsDisplay: "1 business location",
    platformsDisplay: "10 review destinations",
    features: [
      "1,000 valid scans/month (monthly reset)",
      "1 business location included",
      "Multi-platform public review links",
      "Smart feedback & complaint resolution",
      "Real-time customer trend analytics",
      "Priority email & WhatsApp support",
    ],
    cta: "Choose Growth",
  },
  {
    id: "professional",
    packageName: "Professional",
    tagline: "For established practices, salons & high-footfall venues",
    monthlyPrice: 1499,
    annualPrice: 14990,
    validScansPerMonth: 3000,
    locations: 1,
    popular: false,
    scansDisplay: "3,000 valid scans/month",
    locationsDisplay: "1 business location",
    platformsDisplay: "15 review destinations",
    features: [
      "3,000 valid scans/month (monthly reset)",
      "1 business location included",
      "Staff attribution & operational scoring",
      "Complaint escalation & SLA tracking",
      "Advanced reporting & CSV data export",
      "Multi-channel review invitation links",
    ],
    cta: "Choose Professional",
  },
  {
    id: "business-pro",
    packageName: "Business Pro",
    tagline: "For high-volume flagship outlets & demanding brands",
    monthlyPrice: 2499,
    annualPrice: 24990,
    validScansPerMonth: 10000,
    locations: 1,
    popular: false,
    scansDisplay: "10,000 valid scans/month",
    locationsDisplay: "1 business location",
    platformsDisplay: "20 review destinations",
    features: [
      "10,000 valid scans/month (monthly reset)",
      "1 business location included",
      "Full automation webhooks & alerts",
      "AI sentiment clustering (Coming Soon)",
      "Multi-staff accounts & custom QR tags",
      "Dedicated onboarding consultation",
    ],
    cta: "Choose Business Pro",
  },
];

// Multi-Outlet Franchise Plans (Display Configuration from Spec Section 8)
export const FRANCHISE_PLANS = [
  {
    id: "franchise-10",
    packageName: "Franchise 10",
    tagline: "For regional chains with up to 10 outlets",
    monthlyPrice: 7999,
    annualPrice: 79990,
    outlets: 10,
    pooledScans: 25000,
    popular: false,
    scansDisplay: "25,000 pooled scans/month",
    locationsDisplay: "Up to 10 active outlets",
    features: [
      "Full coverage for up to 10 active outlets",
      "25,000 pooled valid scans/month",
      "Corporate Head-Office Command Center",
      "Individual store manager login & triage",
      "Comparative branch scorecards & CSAT",
      "Printable 300 DPI acrylic standee assets",
    ],
    cta: "Select Franchise 10",
  },
  {
    id: "franchise-25",
    packageName: "Franchise 25",
    tagline: "For growing retail & hospitality franchise networks",
    monthlyPrice: 16999,
    annualPrice: 169990,
    outlets: 25,
    pooledScans: 75000,
    popular: true,
    scansDisplay: "75,000 pooled scans/month",
    locationsDisplay: "Up to 25 active outlets",
    features: [
      "Full coverage for up to 25 active outlets",
      "75,000 pooled valid scans/month",
      "Multi-tier territory roles (Regional & Branch)",
      "Complaint escalation & SLA engine",
      "Branch ranking & performance benchmark",
      "Priority corporate phone & WhatsApp support",
    ],
    cta: "Select Franchise 25",
  },
  {
    id: "franchise-50",
    packageName: "Franchise 50",
    tagline: "For national franchise brands with up to 50 outlets",
    monthlyPrice: 29999,
    annualPrice: 299990,
    outlets: 50,
    pooledScans: 175000,
    popular: false,
    scansDisplay: "175,000 pooled scans/month",
    locationsDisplay: "Up to 50 active outlets",
    features: [
      "Full coverage for up to 50 active outlets",
      "175,000 pooled valid scans/month",
      "Multi-brand governance & audit logging",
      "Automated bulk QR dispatch & standees",
      "Executive quarterly performance review",
      "Dedicated Customer Success Lead",
    ],
    cta: "Select Franchise 50",
  },
  {
    id: "franchise-corporate",
    packageName: "Franchise 100 / Corporate",
    tagline: "For large enterprise chains & multi-brand conglomerates",
    monthlyPrice: "Custom",
    annualPrice: "Custom",
    outlets: "100+",
    pooledScans: "500,000+",
    isCustomQuote: true,
    popular: false,
    scansDisplay: "500,000+ contractual scans/month",
    locationsDisplay: "100+ outlets / contractual",
    features: [
      "100+ outlets with contractual scale",
      "500,000+ pooled monthly scans baseline",
      "Custom ERP, POS, and CRM API integration",
      "Contractual enterprise SLA & compliance",
      "Dedicated Account Director & staff training",
      "Custom security and private cloud options",
    ],
    cta: "Contact Enterprise Sales",
  },
];

// Commercial Disclaimers Required by Audit Spec
export const PRICING_DISCLAIMERS = {
  status: "Proposed configuration pending commercial sign-off.",
  tax: "Prices exclude applicable GST (18%).",
  billingCycle: "Annual plans are billed annually and reflect 17% savings (equivalent to 2 months free).",
  scanReset: "Valid scan allowances reset monthly across both monthly and annual subscription plans. Unused scans do not accumulate indefinitely.",
  messagingCharges: "WhatsApp and SMS message deliveries are charged separately at actual carrier rates (approx. ₹1/message) with explicit customer opt-in.",
  franchisePooling: "Franchise allowances are pooled across active outlets. Outlets may be added or transferred within the purchased tier limit.",
  enterpriseServices: "Custom SLAs, dedicated success managers, and API integrations require approved enterprise delivery contracts.",
};

// Core Feature Taxonomy from Spec Section 6
export const CORE_FEATURES = [
  {
    id: "branded-qr-feedback",
    title: "Branded QR Feedback",
    tag: "Mobile-First Capture",
    desc: "Collect customer experiences through branded, mobile-friendly QR journeys. Generate 300 DPI print-ready acrylic standees with custom branding and logos.",
    status: "deployed",
  },
  {
    id: "multi-platform-links",
    title: "Multi-Platform Review Links",
    tag: "Neutral Destination Routing",
    desc: "Connect customers with configured public-review destinations (Google, Justdial, Facebook, TripAdvisor) without sentiment-based filtering or rating gating.",
    status: "deployed",
  },
  {
    id: "complaint-resolution",
    title: "Complaint Resolution",
    tag: "Service Recovery",
    desc: "Assign, track, escalate and close customer service issues in real time before customer dissatisfaction impacts brand reputation.",
    status: "deployed",
  },
  {
    id: "ai-feedback-intelligence",
    title: "AI Feedback Intelligence",
    tag: "Sentiment Analytics",
    desc: "Identify sentiment and recurring operational themes across customer comments. Deep generative aspect analysis marked as Coming Soon.",
    status: "coming_soon",
  },
  {
    id: "whatsapp-engagement",
    title: "WhatsApp Engagement",
    tag: "Consent-Based Outreach",
    desc: "Consent-based customer invitations and service follow-up; transparent messaging carrier charges (~₹1/msg) and policy constraints disclosed.",
    status: "deployed",
  },
  {
    id: "business-analytics",
    title: "Business Analytics",
    tag: "Operational Command",
    desc: "Monitor feedback volume, rating trends, branch-by-branch comparisons and resolution response performance from a unified dashboard.",
    status: "deployed",
  },
];

// Mandatory Workflow Copy from Spec Section 5
export const FEEDBACK_WORKFLOW = {
  sectionTitle: "How BizORM Turns Feedback Into Action",
  sectionSubtitle: "A neutral, transparent customer journey that respects consumer voice while empowering operations teams to resolve service issues rapidly.",
  steps: [
    {
      stepNumber: "01",
      title: "Collect",
      desc: "Customers scan a branded QR code and share their experience.",
      badge: "Fast & Mobile-Friendly",
    },
    {
      stepNumber: "02",
      title: "Understand",
      desc: "BizORM organizes feedback, service issues and review activity into actionable insights.",
      badge: "Real-Time Organization",
    },
    {
      stepNumber: "03",
      title: "Improve",
      desc: "Teams respond to complaints, monitor trends and improve the customer experience.",
      badge: "Resolution & Advocacy",
    },
  ],
};

