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
        paddingTop: "72px",
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "40px",
            marginBottom: "56px",
          }}
        >
          {/* Brand Info Column */}
          <div style={{ gridColumn: "span 2", maxWidth: "380px" }}>
            <BizormLogo size="md" className="mb-4" />
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.6,
                color: "#64748b",
                marginTop: "14px",
                marginBottom: "20px",
              }}
            >
              Helping modern businesses turn real customer feedback into their greatest growth asset through smart Google review routing and private star-shield protection.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#475569" }}>
              <ShieldCheck size={16} color="#004ac6" />
              <span>Multi-Tenant Enterprise Security & RBAC</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4
              style={{
                fontSize: "14px",
                fontWeight: "700",
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
                  How Smart Routing Works
                </a>
              </li>
              <li>
                <a href="/#features" className="footer-hover-link">
                  Features & Tools
                </a>
              </li>
              <li>
                <a href="/#demo" className="footer-hover-link">
                  Interactive ROI Calculator
                </a>
              </li>
              <li>
                <a href="/#pricing" className="footer-hover-link">
                  Pricing & Plans
                </a>
              </li>
              <li>
                <a href="/#about" className="footer-hover-link">
                  About Bizorm
                </a>
              </li>
            </ul>
          </div>

          {/* Solutions by Industry */}
          <div>
            <h4
              style={{
                fontSize: "14px",
                fontWeight: "700",
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
                <a href="/#features" className="footer-hover-link">Dental & Healthcare Clinics</a>
              </li>
              <li>
                <a href="/#features" className="footer-hover-link">Restaurants & Cafes</a>
              </li>
              <li>
                <a href="/#features" className="footer-hover-link">Salons & Luxury Spas</a>
              </li>
              <li>
                <a href="/#features" className="footer-hover-link">Automobile & Service Centers</a>
              </li>
              <li>
                <a href="/#features" className="footer-hover-link">Multi-Location Franchises</a>
              </li>
            </ul>
          </div>

          {/* Account & Help */}
          <div>
            <h4
              style={{
                fontSize: "14px",
                fontWeight: "700",
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
                <Link to="/login" className="footer-hover-link" style={{ color: "#004ac6", fontWeight: "600" }}>
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
                <Link to="/pricing" className="footer-hover-link">
                  Enterprise Pricing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid #dee8ff",
            paddingTop: "28px",
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
            &copy; {new Date().getFullYear()} Bizorm. All rights reserved. Reputation Management CRM.
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <a href="#privacy" className="footer-hover-link" style={{ fontSize: "13px" }}>Privacy Policy</a>
            <a href="#terms" className="footer-hover-link" style={{ fontSize: "13px" }}>Terms of Service</a>
            <a href="#security" className="footer-hover-link" style={{ fontSize: "13px" }}>Security & GDPR</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default LandingFooter;
