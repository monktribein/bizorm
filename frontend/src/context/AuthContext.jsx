import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [quota, setQuota] = useState(null);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [googleReviewLink, setGoogleReviewLink] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!localStorage.getItem("token")) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await api.getMe();
      if (data.success) {
        setUser(data.user);
        setQuota(data.quota);
        setCompanyDetails(data.companyDetails);
        setGoogleReviewLink(data.googleReviewLink || "");
      }
    } catch (err) {
      console.warn("Auth check failed:", err.message);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const login = async (uname, pwd) => {
    const res = await api.login({ uname, pwd });
    if (res.success && res.token) {
      localStorage.setItem("token", res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (formData) => {
    const res = await api.register(formData);
    if (res.success && res.token) {
      localStorage.setItem("token", res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const updateProfile = async (formData) => {
    const res = await api.updateProfile(formData);
    if (res.success) {
      if (res.user) {
        setUser((prev) => ({ ...prev, ...res.user }));
      }
      if (res.companyDetails) {
        setCompanyDetails((prev) => ({ ...prev, ...res.companyDetails }));
      }
      if (res.googleReviewLink !== undefined) {
        setGoogleReviewLink(res.googleReviewLink);
      }
      // Re-fetch in background to keep all populated subfields fully in sync
      fetchProfile();
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setQuota(null);
    setCompanyDetails(null);
    setGoogleReviewLink("");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        quota,
        companyDetails,
        googleReviewLink,
        token,
        loading,
        login,
        register,
        updateProfile,
        logout,
        reloadProfile: fetchProfile,
        isSuperAdmin: user?.role === "SUPER_ADMIN" || user?.sadmin === 1,
        isBranchAdmin: user?.role === "BRANCH_ADMIN" || user?.admin === 1,
        isStaffOnly: !(user?.role === "SUPER_ADMIN" || user?.sadmin === 1) && !(user?.role === "BRANCH_ADMIN" || user?.admin === 1),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
