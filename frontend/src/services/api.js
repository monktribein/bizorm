const rawBase = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").trim();
let API_BASE = rawBase.endsWith("/api") ? rawBase : `${rawBase.replace(/\/+$/, "")}/api`;

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    // Automatic fallback to port 5001 if port 5000 is unavailable
    if (API_BASE.includes(":5000") && err.name === "TypeError") {
      try {
        API_BASE = API_BASE.replace(":5000", ":5001");
        const fallbackRes = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
        const fallbackData = await fallbackRes.json().catch(() => ({}));
        if (!fallbackRes.ok) {
          const error = new Error(fallbackData.message || `Request failed with status ${fallbackRes.status}`);
          error.status = fallbackRes.status;
          error.data = fallbackData;
          throw error;
        }
        return fallbackData;
      } catch {
        API_BASE = API_BASE.replace(":5001", ":5000"); // reset
      }
    }
    throw err;
  }
}

export const api = {
  // Auth
  login: (credentials) => request("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  register: (data) => request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  verifyEmail: (data) => request("/auth/verify-email", { method: "POST", body: JSON.stringify(data) }),
  resendCode: (formKey) => request("/auth/resend-code", { method: "POST", body: JSON.stringify({ formKey }) }),
  getMe: () => request("/auth/me"),
  updateProfile: (data) => request("/auth/profile", { method: "PUT", body: JSON.stringify(data) }),

  // Users
  getUsers: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/users${q ? `?${q}` : ""}`);
  },
  createUser: (data) => request("/users", { method: "POST", body: JSON.stringify(data) }),
  updateUser: (id, data) => request(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteUser: (id) => request(`/users/${id}`, { method: "DELETE" }),
  checkDuplicate: (params) => {
    const q = new URLSearchParams(params).toString();
    return request(`/users/check-duplicate?${q}`);
  },

  // Branches
  getBranches: () => request("/branches"),
  getBranchById: (id) => request(`/branches/${id}`),
  getBranchSummary: () => request("/branches/summary"),
  createBranch: (data) => request("/branches", { method: "POST", body: JSON.stringify(data) }),
  updateBranch: (id, data) => request(`/branches/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteBranch: (id) => request(`/branches/${id}`, { method: "DELETE" }),

  // Reviews & Customer Star Gating
  getPublicContext: (formKey, params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/reviews/context/${formKey}${q ? `?${q}` : ""}`);
  },
  getPublicReviews: (formKey) => request(`/reviews/public/${formKey}`),
  getLandingTestimonials: () => request("/reviews/landing-testimonials"),
  saveRating: (data) => request("/reviews/rating", { method: "POST", body: JSON.stringify(data) }),
  generateReviewText: (data) => request("/reviews/generate-text", { method: "POST", body: JSON.stringify(data) }),
  getReviews: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/reviews${q ? `?${q}` : ""}`);
  },
  getReviewStats: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/reviews/stats${q ? `?${q}` : ""}`);
  },
  updateReviewStatus: (id, data) => request(`/reviews/${id}/status`, { method: "PUT", body: JSON.stringify(data) }),

  // Review Invites & Follow-up Booster
  logReviewInvite: (data) => request("/invites", { method: "POST", body: JSON.stringify(data) }),
  getReviewInvites: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/invites${q ? `?${q}` : ""}`);
  },
  recordFollowUp: (id) => request(`/invites/${id}/follow-up`, { method: "POST" }),
  deleteInvite: (id) => request(`/invites/${id}`, { method: "DELETE" }),

  // Platforms
  getPlatforms: () => request("/platforms"),
  createPlatform: (data) => request("/platforms", { method: "POST", body: JSON.stringify(data) }),
  updatePlatform: (id, data) => request(`/platforms/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deletePlatform: (id) => request(`/platforms/${id}`, { method: "DELETE" }),

  // Surveys
  getActiveQuestions: () => request("/surveys/active"),
  getAllQuestions: () => request("/surveys/all"),
  createQuestion: (data) => request("/surveys", { method: "POST", body: JSON.stringify(data) }),
  updateQuestion: (id, data) => request(`/surveys/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  reorderQuestions: (orderedIds) => request("/surveys/reorder", { method: "PUT", body: JSON.stringify({ orderedIds }) }),
  deleteQuestion: (id) => request(`/surveys/${id}`, { method: "DELETE" }),
  submitSurvey: (data) => request("/surveys/submit", { method: "POST", body: JSON.stringify(data) }),
  getSurveyAnalytics: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/surveys/analytics${q ? `?${q}` : ""}`);
  },

  // Plans & Pricing
  getActivePricing: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/plans/pricing/active${q ? `?${q}` : ""}`);
  },
  getPricingPackages: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/plans/pricing${q ? `?${q}` : ""}`);
  },
  createPricingPackage: (data) => request("/plans/pricing", { method: "POST", body: JSON.stringify(data) }),
  updatePricingPackage: (id, data) => request(`/plans/pricing/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deletePricingPackage: (id) => request(`/plans/pricing/${id}`, { method: "DELETE" }),
  selectPlan: (packageId) => request(`/plans/pricing/select/${packageId}`, { method: "POST" }),
  requestCustomQuote: (data) => request("/plans/pricing/custom-quote", { method: "POST", body: JSON.stringify(data) }),
  getPlans: () => request("/plans"),

  // Quota & Activity & Settings
  getUserQuota: (userId) => request(`/quota/user/${userId || ""}`),
  checkQuotaStatus: (formKey) => request(`/quota/status/${formKey}`),
  getActivityLogs: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/activity${q ? `?${q}` : ""}`);
  },
  getSettings: () => request("/settings"),
  updateSettings: (data) => request("/settings", { method: "PUT", body: JSON.stringify(data) }),

  // Marketplace Seller Intelligence
  getSellerProducts: () => request("/seller/products"),
  createSellerProduct: (data) => request("/seller/products", { method: "POST", body: JSON.stringify(data) }),
  updateSellerProduct: (id, data) => request(`/seller/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  archiveSellerProduct: (id) => request(`/seller/products/${id}`, { method: "DELETE" }),
  getSellerAnalytics: () => request("/seller/analytics"),
  getSellerComplaints: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/seller/complaints${q ? `?${q}` : ""}`);
  },
  updateComplaintStatus: (id, data) =>
    request(`/seller/complaints/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  getPublicProductByCode: (code) => request(`/seller/public/product/${code}`),
  submitProductFeedback: (code, data) =>
    request(`/seller/public/feedback/${code}`, { method: "POST", body: JSON.stringify(data) }),
};
