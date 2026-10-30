import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../context/AuthContext";
import { BUSINESS_CATEGORIES } from "../../constants/categories";
import { getCleanBrandName } from "../../utils/brand";
import {
  X,
  Building,
  Upload,
  Globe,
  Tag,
  CheckCircle2,
  Sparkles,
  User,
  Phone,
  Camera,
  AlertCircle,
  Plus,
  Trash2,
  RotateCcw,
  ThumbsUp,
  AlertTriangle,
  HelpCircle,
  MessageSquare,
} from "lucide-react";

export const EditBusinessModal = ({ isOpen, onClose, onSuccess, initialTab = "general" }) => {
  const { user, companyDetails, googleReviewLink, updateProfile } = useAuth();
  const fileInputRef = useRef(null);

  const cleanCurrentName = getCleanBrandName(user, companyDetails);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [cmpy, setCmpy] = useState("");
  const [cmpyLogo, setCmpyLogo] = useState("");
  const [businessCategory, setBusinessCategory] = useState("general");
  const [gReviewLink, setGReviewLink] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [mobile, setMobile] = useState("");

  // Review Prompts & Tags State
  const [reviewPrompt, setReviewPrompt] = useState("");
  const [customTags, setCustomTags] = useState([]);
  const [customNegativeTags, setCustomNegativeTags] = useState([]);
  const [newPositiveTagInput, setNewPositiveTagInput] = useState("");
  const [newNegativeTagInput, setNewNegativeTagInput] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Populate state when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setCmpy(user?.cmpy && user.cmpy.toLowerCase() !== "na" ? user.cmpy : cleanCurrentName);
      setCmpyLogo(companyDetails?.cmpyLogo || "");
      const cat = companyDetails?.businessCategory || "general";
      setBusinessCategory(cat);
      setGReviewLink(googleReviewLink || "");
      setFname(user?.fname || "");
      setLname(user?.lname || "");
      setMobile(user?.mobile || "");
      setReviewPrompt(companyDetails?.reviewPrompt || "");

      const defaultCatObj = BUSINESS_CATEGORIES.find((c) => c.id === cat) || BUSINESS_CATEGORIES[0];
      setCustomTags(
        Array.isArray(companyDetails?.customTags) && companyDetails.customTags.length > 0
          ? companyDetails.customTags
          : defaultCatObj.tags
      );
      setCustomNegativeTags(
        Array.isArray(companyDetails?.customNegativeTags) && companyDetails.customNegativeTags.length > 0
          ? companyDetails.customNegativeTags
          : (defaultCatObj.negativeTags || [])
      );
      setError(null);
      setSuccessMsg(null);
    }
  }, [isOpen, initialTab, user, companyDetails, googleReviewLink]);

  // Lock body scroll when modal is open so background doesn't move
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, SVG, WebP)");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("Image size should be less than 8MB");
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
      img.onerror = () => {
        setCmpyLogo(event.target.result);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setCmpyLogo("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const selectedCategoryObj =
    BUSINESS_CATEGORIES.find((c) => c.id === businessCategory) || BUSINESS_CATEGORIES[0];

  const handleCategoryChange = (newCatId) => {
    setBusinessCategory(newCatId);
    const catObj = BUSINESS_CATEGORIES.find((c) => c.id === newCatId) || BUSINESS_CATEGORIES[0];
    setCustomTags(catObj.tags);
    setCustomNegativeTags(catObj.negativeTags || []);
  };

  const handleResetTags = () => {
    const catObj = BUSINESS_CATEGORIES.find((c) => c.id === businessCategory) || BUSINESS_CATEGORIES[0];
    setCustomTags(catObj.tags);
    setCustomNegativeTags(catObj.negativeTags || []);
    setSuccessMsg("Tags reset to industry defaults!");
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const handleAddPositiveTag = (e) => {
    if (e) e.preventDefault();
    const tag = newPositiveTagInput.trim();
    if (!tag) return;
    if (customTags.includes(tag)) {
      setNewPositiveTagInput("");
      return;
    }
    setCustomTags([...customTags, tag]);
    setNewPositiveTagInput("");
  };

  const handleRemovePositiveTag = (tagToRemove) => {
    setCustomTags(customTags.filter((t) => t !== tagToRemove));
  };

  const handleAddNegativeTag = (e) => {
    if (e) e.preventDefault();
    const tag = newNegativeTagInput.trim();
    if (!tag) return;
    if (customNegativeTags.includes(tag)) {
      setNewNegativeTagInput("");
      return;
    }
    setCustomNegativeTags([...customNegativeTags, tag]);
    setNewNegativeTagInput("");
  };

  const handleRemoveNegativeTag = (tagToRemove) => {
    setCustomNegativeTags(customNegativeTags.filter((t) => t !== tagToRemove));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const trimmedCmpy = cmpy.trim();
    if (!trimmedCmpy) {
      setError("Please provide a valid Business / Brand Name");
      return;
    }

    setSaving(true);
    try {
      const res = await updateProfile({
        cmpy: trimmedCmpy,
        cmpyLogo: cmpyLogo.trim(),
        businessCategory,
        reviewPrompt: reviewPrompt.trim(),
        customTags,
        customNegativeTags,
        googleReviewLink: gReviewLink.trim(),
        fname: fname.trim(),
        lname: lname.trim(),
        mobile: mobile.trim(),
      });

      if (res.success) {
        setSuccessMsg("Business details, category & review tags updated across the platform!");
        if (onSuccess) onSuccess(res);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setError(res.message || "Failed to update business details");
      }
    } catch (err) {
      setError(err.message || "Failed to update business details");
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999999,
        padding: "16px",
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "640px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          padding: 0,
          background: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#ffffff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "var(--primary-light)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Building size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                Business Settings &amp; Tag Studio
              </h3>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
                Manage industry category, branding logo, and customer review prompts
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "8px",
              display: "flex",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--border)",
            background: "#f8fafc",
            padding: "0 24px",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            style={{
              padding: "12px 18px",
              fontSize: "13px",
              fontWeight: "700",
              color: activeTab === "general" ? "var(--primary)" : "#64748b",
              borderBottom: activeTab === "general" ? "2.5px solid var(--primary)" : "2.5px solid transparent",
              background: "none",
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Building size={15} />
            <span>Brand &amp; Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("tags")}
            style={{
              padding: "12px 18px",
              fontSize: "13px",
              fontWeight: "700",
              color: activeTab === "tags" ? "var(--primary)" : "#64748b",
              borderBottom: activeTab === "tags" ? "2.5px solid var(--primary)" : "2.5px solid transparent",
              background: "none",
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Tag size={15} />
            <span>Smart Tags &amp; Prompts</span>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", overflow: "hidden", flex: 1 }}>
          <div style={{ padding: "20px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "18px", flex: 1 }}>
            {error && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: "var(--danger-light)",
                  color: "var(--danger)",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: "var(--success-light)",
                  color: "var(--success)",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <CheckCircle2 size={16} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* TAB 1: General Brand & Profile */}
            {activeTab === "general" && (
              <>
                {/* 1. Business / Brand Name */}
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#1e293b", marginBottom: "6px" }}>
                    Brand / Business Name <span style={{ color: "var(--danger)" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={cmpy}
                    onChange={(e) => setCmpy(e.target.value)}
                    placeholder="e.g. Harsh ENT Hospital or Kashish Business"
                    required
                    className="form-control"
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      fontSize: "14px",
                      fontWeight: "700",
                      borderRadius: "10px",
                      border: "1.5px solid var(--border)",
                      color: "var(--primary)",
                    }}
                  />
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                    Appears on your Dashboard Banner, Counter Standee, Top Navbar, and Review Invitations.
                  </span>
                </div>

                {/* 2. Brand Logo */}
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#1e293b", marginBottom: "6px" }}>
                    Brand Logo
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                    <div
                      style={{
                        width: "74px",
                        height: "74px",
                        borderRadius: "12px",
                        border: "2px dashed var(--border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#f8fafc",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      {cmpyLogo ? (
                        <img
                          src={cmpyLogo}
                          alt="Preview"
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <Camera size={24} color="#94a3b8" />
                      )}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleLogoFileChange}
                        accept="image/*"
                        style={{ display: "none" }}
                      />
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="btn btn-secondary btn-sm"
                          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                        >
                          <Upload size={14} />
                          <span>{cmpyLogo ? "Change Logo" : "Upload Logo"}</span>
                        </button>
                        {cmpyLogo && (
                          <button
                            type="button"
                            onClick={handleRemoveLogo}
                            className="btn btn-sm"
                            style={{ background: "#fee2e2", color: "#ef4444", border: "none" }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                        Supported: PNG, JPG, WebP, SVG (Max 8MB)
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Google Reviews Link */}
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#1e293b", marginBottom: "6px" }}>
                    Google Reviews Direct Link
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "#f8fafc",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      border: "1.5px solid var(--border)",
                    }}
                  >
                    <Globe size={18} color="#4285F4" />
                    <input
                      type="url"
                      value={gReviewLink}
                      onChange={(e) => setGReviewLink(e.target.value)}
                      placeholder="https://g.page/r/.../review or Google maps review link"
                      style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        fontSize: "13px",
                        fontWeight: "600",
                        outline: "none",
                        color: "#0f172a",
                      }}
                    />
                  </div>
                </div>

                {/* 4. Owner & Profile Details */}
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "14px" }}>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "800",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      display: "block",
                      marginBottom: "10px",
                    }}
                  >
                    Owner &amp; Profile Details
                  </span>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                        First Name
                      </label>
                      <input
                        type="text"
                        value={fname}
                        onChange={(e) => setFname(e.target.value)}
                        className="form-control"
                        style={{ width: "100%", padding: "8px 12px", fontSize: "13px", borderRadius: "8px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={lname}
                        onChange={(e) => setLname(e.target.value)}
                        className="form-control"
                        style={{ width: "100%", padding: "8px 12px", fontSize: "13px", borderRadius: "8px" }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: "10px" }}>
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>
                      Mobile Phone Number
                    </label>
                    <input
                      type="text"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="form-control"
                      style={{ width: "100%", padding: "8px 12px", fontSize: "13px", borderRadius: "8px" }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: Smart Category & Review Tags Studio */}
            {activeTab === "tags" && (
              <>
                {/* Industry Category Selector */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "800", color: "#1e293b", margin: 0 }}>
                      Industry / Sector
                    </label>
                    <button
                      type="button"
                      onClick={handleResetTags}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--primary)",
                        fontSize: "12px",
                        fontWeight: "700",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        cursor: "pointer",
                      }}
                    >
                      <RotateCcw size={13} />
                      <span>Reset to Industry Defaults</span>
                    </button>
                  </div>
                  <select
                    value={businessCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="form-select"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      fontSize: "14px",
                      fontWeight: "700",
                      borderRadius: "10px",
                      border: "1.5px solid var(--border)",
                      color: "#1e293b",
                    }}
                  >
                    {BUSINESS_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                    {selectedCategoryObj.description}
                  </p>
                </div>

                {/* Custom Review Prompt Headline */}
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#1e293b", marginBottom: "6px" }}>
                    Custom Review Headline Question
                  </label>
                  <div style={{ position: "relative" }}>
                    <MessageSquare size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#9ca3af" }} />
                    <input
                      type="text"
                      value={reviewPrompt}
                      onChange={(e) => setReviewPrompt(e.target.value)}
                      placeholder={`e.g. Rate your visit at ${cleanCurrentName}`}
                      className="form-control"
                      style={{
                        width: "100%",
                        padding: "10px 14px 10px 36px",
                        fontSize: "13px",
                        fontWeight: "600",
                        borderRadius: "10px",
                        border: "1.5px solid var(--border)",
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                    Shown at the top of your review page. Leave blank to use default.
                  </span>
                </div>

                {/* Positive 4-5★ Review Highlights */}
                <div
                  style={{
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "12px",
                    padding: "14px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <ThumbsUp size={16} color="#16a34a" />
                      <span style={{ fontSize: "13px", fontWeight: "800", color: "#166534" }}>
                        Positive Review Highlights (4★ &amp; 5★ Public)
                      </span>
                    </div>
                    <span style={{ fontSize: "11px", color: "#15803d", fontWeight: "700" }}>
                      {customTags.length} active
                    </span>
                  </div>

                  {/* Active tags badges */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                    {customTags.map((t, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "4px 10px",
                          borderRadius: "9999px",
                          background: "#ffffff",
                          border: "1px solid #86efac",
                          color: "#166534",
                          fontSize: "12px",
                          fontWeight: "700",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                        }}
                      >
                        <span>{t}</span>
                        <button
                          type="button"
                          onClick={() => handleRemovePositiveTag(t)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#94a3b8",
                            cursor: "pointer",
                            padding: 0,
                            display: "flex",
                          }}
                        >
                          <X size={13} color="#ef4444" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add positive tag inline */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      placeholder="Add custom positive tag (e.g. Signature Biryani)"
                      value={newPositiveTagInput}
                      onChange={(e) => setNewPositiveTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddPositiveTag();
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid #86efac",
                        fontSize: "12px",
                        background: "#ffffff",
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddPositiveTag}
                      className="btn btn-sm"
                      style={{
                        background: "#16a34a",
                        color: "#ffffff",
                        fontWeight: "700",
                        fontSize: "12px",
                        padding: "8px 14px",
                        borderRadius: "8px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Plus size={14} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Negative 1-3★ Gated Complaint Tags */}
                <div
                  style={{
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "12px",
                    padding: "14px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <AlertTriangle size={16} color="#ef4444" />
                      <span style={{ fontSize: "13px", fontWeight: "800", color: "#991b1b" }}>
                        Customer Service Concern Tags (1★-3★ Resolution)
                      </span>
                    </div>
                    <span style={{ fontSize: "11px", color: "#b91c1c", fontWeight: "700" }}>
                      {customNegativeTags.length} active
                    </span>
                  </div>

                  {/* Active negative tags badges */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                    {customNegativeTags.map((t, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "4px 10px",
                          borderRadius: "9999px",
                          background: "#ffffff",
                          border: "1px solid #fca5a5",
                          color: "#991b1b",
                          fontSize: "12px",
                          fontWeight: "700",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                        }}
                      >
                        <span>{t}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveNegativeTag(t)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#94a3b8",
                            cursor: "pointer",
                            padding: 0,
                            display: "flex",
                          }}
                        >
                          <X size={13} color="#ef4444" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add negative tag inline */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      placeholder="Add custom issue tag (e.g. Valet Parking Delay)"
                      value={newNegativeTagInput}
                      onChange={(e) => setNewNegativeTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddNegativeTag();
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid #fca5a5",
                        fontSize: "12px",
                        background: "#ffffff",
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddNegativeTag}
                      className="btn btn-sm"
                      style={{
                        background: "#dc2626",
                        color: "#ffffff",
                        fontWeight: "700",
                        fontSize: "12px",
                        padding: "8px 14px",
                        borderRadius: "8px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Plus size={14} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Modal Footer */}
          <div
            style={{
              padding: "16px 24px",
              borderTop: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#f8fafc",
            }}
          >
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              {activeTab === "general" ? "Step 1: Brand & Profile Info" : "Step 2: Smart Review Prompts & Tags"}
            </span>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="btn btn-secondary"
                style={{ padding: "8px 16px" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
                style={{ padding: "8px 20px", fontWeight: "800" }}
              >
                {saving ? "Saving Changes..." : "Save & Apply Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
