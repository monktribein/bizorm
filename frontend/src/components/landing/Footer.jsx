import React from "react";
import { Link } from "react-router-dom";
import { BizormLogo } from "../common/BizormLogo";
import { 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Heart,
  Star 
} from "lucide-react";

export const LandingFooter = () => {
  return (
    <footer
      style={{
        backgroundColor: "#f0f3ff",
        borderTop: "1px solid #dee8ff",
        paddingTop: "64px",
        paddingBottom: "36px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Main 4-Column Equal Balanced Grid */}
        <div className="landing-footer-grid">
          {/* Brand Info Column */}
          <div>
            <BizormLogo size="md" />
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.65,
                color: "#64748b",
                marginTop: "16px",
                marginBottom: "20px",
                maxWidth: "340px",
              }}
            >
              Helping single businesses and franchise enterprises turn customer feedback into operational excellence through dynamic QR standees and real-time intelligence.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#475569" }}>
              <ShieldCheck size={16} color="#004ac6" />
              <span>Multi-Tenant Enterprise Security &amp; RBAC</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4
              style={{
                fontSize: "13.5px",
                fontWeight: "800",
                color: "#0f172a",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "18px",
              }}
            >
              Product
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              <li>
                <a href="/#how-it-works" className="footer-hover-link">
                  How BizORM Works
                </a>
              </li>
              <li>
                <a href="/#features" className="footer-hover-link">
                  Features &amp; Standees
                </a>
              </li>
              <li>
                <a href="/#demo" className="footer-hover-link">
                  Interactive ROI Calculator
                </a>
              </li>
              <li>
                <Link to="/pricing" className="footer-hover-link">
                  Pricing &amp; Plans
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-hover-link">
                  About BizORM
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions by Industry */}
          <div>
            <h4
              style={{
                fontSize: "13.5px",
                fontWeight: "800",
                color: "#0f172a",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "18px",
              }}
            >
              Industries
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              <li>
                <Link to="/solutions/marketplace-sellers" className="footer-hover-link" style={{ color: "#004ac6", fontWeight: "700" }}>
                  Marketplace &amp; E-Commerce
                </Link>
              </li>
              <li>
                <Link to="/franchise" className="footer-hover-link">
                  Franchise &amp; Multi-Outlet
                </Link>
              </li>
              <li>
                <a href="/#solutions" className="footer-hover-link">
                  Dental &amp; Healthcare Clinics
                </a>
              </li>
              <li>
                <a href="/#solutions" className="footer-hover-link">
                  Restaurants &amp; Cafes
                </a>
              </li>
              <li>
                <a href="/#solutions" className="footer-hover-link">
                  Salons &amp; Luxury Spas
                </a>
              </li>
              <li>
                <a href="/#solutions" className="footer-hover-link">
                  Automobile &amp; Service Centers
                </a>
              </li>
            </ul>
          </div>

          {/* Account & Help */}
          <div>
            <h4
              style={{
                fontSize: "13.5px",
                fontWeight: "800",
                color: "#0f172a",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "18px",
              }}
            >
              Account
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              <li>
                <Link to="/login" className="footer-hover-link" style={{ color: "#004ac6", fontWeight: "700" }}>
                  Sign In to Dashboard
                </Link>
              </li>
              <li>
                <Link to="/register" className="footer-hover-link">
                  Start 7-Day Free Trial
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer-hover-link">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/contact?type=enterprise" className="footer-hover-link">
                  Enterprise Consultation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar (Aligned Edge-to-Edge) */}
        <div
          style={{
            borderTop: "1px solid #dee8ff",
            paddingTop: "24px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            fontSize: "13px",
            color: "#64748b",
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} BizORM™. All rights reserved. Enterprise Customer Experience Platform.
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <a href="#privacy" className="footer-hover-link" style={{ fontSize: "13px" }}>Privacy Policy</a>
            <a href="#terms" className="footer-hover-link" style={{ fontSize: "13px" }}>Terms of Service</a>
            <a href="#security" className="footer-hover-link" style={{ fontSize: "13px" }}>Security &amp; GDPR</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
