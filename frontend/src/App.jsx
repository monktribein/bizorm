import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";

// Auto Scroll to Top on route navigation
function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname, search]);

  return null;
}

// Landing Marketing Pages
import { HomePage } from "./pages/landing/HomePage";
import { AboutPage } from "./pages/landing/AboutPage";
import { ContactPage } from "./pages/landing/ContactPage";
import { PricingPublicPage } from "./pages/landing/PricingPublicPage";
import { FranchisePage } from "./pages/landing/FranchisePage";
import { MarketplaceSellersPage } from "./pages/landing/MarketplaceSellersPage";
import { useAuth } from "./context/AuthContext";

// Dedicated Auth & Verification Pages
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { EmailVerifyPage } from "./pages/auth/EmailVerifyPage";

// Dashboard Pages
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { PlatformsPage } from "./pages/dashboard/PlatformsPage";
import { SharePage } from "./pages/dashboard/SharePage";
import { ReportsPage } from "./pages/dashboard/ReportsPage";
import { AccountPage } from "./pages/dashboard/AccountPage";
import { SellerIntelligencePage } from "./pages/dashboard/SellerIntelligencePage";

// Admin Pages
import { BranchesPage } from "./pages/admin/BranchesPage";
import { UsersPage } from "./pages/admin/UsersPage";
import { PricingPage } from "./pages/admin/PricingPage";
import { LogsPage } from "./pages/admin/LogsPage";
import { SettingsPage } from "./pages/admin/SettingsPage";

// Public Customer Facing & Embed Widgets
import { CustomerReviewPage } from "./pages/public/CustomerReviewPage";
import { ProductFeedbackPage } from "./pages/public/ProductFeedbackPage";
import { ReviewWidgetPage } from "./pages/public/ReviewWidgetPage";
import { ReviewBadgeWidgetPage } from "./pages/public/ReviewBadgeWidgetPage";

function SmartPricingRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) {
    return (
      <AppLayout>
        <PricingPage />
      </AppLayout>
    );
  }
  return <PricingPublicPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Landing Marketing Website */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/pricing" element={<PricingPublicPage />} />
          <Route path="/franchise" element={<FranchisePage />} />
          <Route path="/solutions/franchise" element={<FranchisePage />} />
          <Route path="/solutions/marketplace-sellers" element={<MarketplaceSellersPage />} />
          <Route path="/solutions/sellers" element={<MarketplaceSellersPage />} />

          {/* Public customer review page, product feedback & embed widgets */}
          <Route path="/wtr/:formKey" element={<CustomerReviewPage />} />
          <Route path="/product-feedback/:code" element={<ProductFeedbackPage />} />
          <Route path="/pfe/:code" element={<ProductFeedbackPage />} />
          <Route path="/embed/reviews/:formKey" element={<ReviewWidgetPage />} />
          <Route path="/embed/badge/:formKey" element={<ReviewBadgeWidgetPage />} />

          {/* Dedicated Auth routes */}
          <Route path="/auth" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/emailverify" element={<EmailVerifyPage />} />

          {/* Protected routes (Opens review dashboard after login) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/seller-intelligence" element={<SellerIntelligencePage />} />
              <Route path="/platform" element={<PlatformsPage />} />
              <Route path="/share" element={<SharePage />} />
              <Route path="/report" element={<ReportsPage />} />
              <Route path="/account" element={<AccountPage />} />

              {/* Business & Client Management routes */}
              <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "BRANCH_ADMIN"]} />}>
                <Route path="/branches" element={<BranchesPage />} />
                <Route path="/team" element={<UsersPage />} />
                <Route path="/subscription" element={<PricingPage />} />
                <Route path="/admin/branches" element={<BranchesPage />} />
                <Route path="/admin/users" element={<UsersPage />} />
                <Route path="/admin/pricing" element={<PricingPage />} />
              </Route>

              {/* Super Admin Exclusive routes */}
              <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />}>
                <Route path="/admin/logs" element={<LogsPage />} />
                <Route path="/admin/settings" element={<SettingsPage />} />
              </Route>
            </Route>
          </Route>

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

