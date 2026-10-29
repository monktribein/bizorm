import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import QRCode from "qrcode";
import {
  Package,
  QrCode,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Copy,
  Check,
  ExternalLink,
  Printer,
  Download,
  Filter,
  RefreshCw,
  ShieldCheck,
  Clock,
  Layers,
  ChevronRight,
  Eye,
  Sliders,
  Archive,
} from "lucide-react";

export const SellerIntelligencePage = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("OVERVIEW"); // OVERVIEW, CATALOGUE, STUDIO, COMPLAINTS, COMPLIANCE
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [complaintFilter, setComplaintFilter] = useState("ALL");

  // New Product Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdSku, setNewProdSku] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("Home & Kitchen");
  const [newProdChannel, setNewProdChannel] = useState("AMAZON");
  const [newProdQrType, setNewProdQrType] = useState("SKU");
  const [newProdBatch, setNewProdBatch] = useState("");
  const [newProdWarranty, setNewProdWarranty] = useState(12);
  const [savingProd, setSavingProd] = useState(false);

  // QR Print Studio State
  const [selectedStudioProduct, setSelectedStudioProduct] = useState(null);
  const [insertSize, setInsertSize] = useState("CARD"); // CARD (3.5x2), SQUARE (4x4), STICKER
  const [generatedQrDataUrl, setGeneratedQrDataUrl] = useState("");
  const [copiedLinkKey, setCopiedLinkKey] = useState(null);

  // Complaint Resolution Modal
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState("INVESTIGATING");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, anaRes, compRes] = await Promise.all([
        api.getSellerProducts(),
        api.getSellerAnalytics(),
        api.getSellerComplaints({ status: complaintFilter }),
      ]);

      if (prodRes.success) {
        setProducts(prodRes.products || []);
        if (prodRes.products?.length > 0 && !selectedStudioProduct) {
          setSelectedStudioProduct(prodRes.products[0]);
        }
      }

      if (anaRes.success) {
        setAnalytics(anaRes.analytics);
      }

      if (compRes.success) {
        setComplaints(compRes.complaints || []);
      }
    } catch (err) {
      console.error("Error loading seller data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [complaintFilter]);

  // Generate QR for Print Studio whenever selected product changes
  useEffect(() => {
    const generateQr = async () => {
      if (!selectedStudioProduct) return;
      const url = `${window.location.origin}/product-feedback/${selectedStudioProduct.qrCodeKey}`;
      try {
        const dataUrl = await QRCode.toDataURL(url, {
          width: 600,
          margin: 1,
          color: { dark: "#0f172a", light: "#ffffff" },
        });
        setGeneratedQrDataUrl(dataUrl);
      } catch (err) {
        console.error("Error generating QR:", err);
      }
    };

    generateQr();
  }, [selectedStudioProduct]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProdName || !newProdSku) {
      alert("Product Name and SKU are required");
      return;
    }

    setSavingProd(true);
    try {
      const res = await api.createSellerProduct({
        name: newProdName,
        sku: newProdSku,
        category: newProdCategory,
        channel: newProdChannel,
        qrType: newProdQrType,
        batchNumber: newProdBatch,
        warrantyMonths: Number(newProdWarranty) || 12,
      });

      if (res.success) {
        setShowAddModal(false);
        setNewProdName("");
        setNewProdSku("");
        setNewProdBatch("");
        loadData();
      } else {
        alert(res.message || "Failed to create product");
      }
    } catch (err) {
      alert(err.message || "Failed to create product");
    } finally {
      setSavingProd(false);
    }
  };

  const handleUpdateComplaint = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setUpdatingStatus(true);
    try {
      const res = await api.updateComplaintStatus(selectedComplaint._id, {
        status: newStatus,
        resolutionNotes,
      });

      if (res.success) {
        setSelectedComplaint(null);
        loadData();
      } else {
        alert(res.message || "Failed to update complaint");
      }
    } catch (err) {
      alert(err.message || "Failed to update complaint");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCopyLink = (codeKey) => {
    const url = `${window.location.origin}/product-feedback/${codeKey}`;
    navigator.clipboard.writeText(url);
    setCopiedLinkKey(codeKey);
    setTimeout(() => setCopiedLinkKey(null), 2000);
  };

  const handlePrintInsert = () => {
    window.print();
  };

  return (
    <div style={{ paddingBottom: "40px" }}>
      {/* Top Banner Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ fontSize: "11px", fontWeight: "800", background: "#dbeafe", color: "#1d4ed8", padding: "2px 8px", borderRadius: "999px" }}>
              ENGINE 6
            </span>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>
              FTC &amp; Marketplace Compliant
            </span>
          </div>
          <h1 className="font-outfit" style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
            BizORM Seller Intelligence™
          </h1>
          <p style={{ fontSize: "13.5px", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
            Product Feedback • Post-Purchase Experience • Defect Clustering &amp; SKU Analytics
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={loadData}
            className="btn btn-outline btn-sm"
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
            title="Refresh Data"
          >
            <RefreshCw size={13} className={loading ? "spin" : ""} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary btn-sm"
            style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700" }}
          >
            <Plus size={15} />
            <span>Add Product SKU</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: "flex", gap: "6px", borderBottom: "1px solid var(--border)", marginBottom: "24px", overflowX: "auto", paddingBottom: "2px" }}>
        {[
          { id: "OVERVIEW", label: "Overview & Analytics", icon: TrendingUp },
          { id: "CATALOGUE", label: `Product Catalogue (${products.length})`, icon: Package },
          { id: "STUDIO", label: "QR-in-the-Box Print Studio", icon: QrCode },
          { id: "COMPLAINTS", label: `Complaint Desk (${analytics?.openComplaintsCount || 0})`, icon: AlertTriangle, badge: analytics?.openComplaintsCount },
          { id: "COMPLIANCE", label: "Compliance Profiles™", icon: ShieldCheck },
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                borderRadius: "8px 8px 0 0",
                border: "none",
                background: isActive ? "var(--primary-light)" : "transparent",
                color: isActive ? "var(--primary)" : "var(--text-muted)",
                fontWeight: isActive ? "700" : "600",
                fontSize: "13px",
                cursor: "pointer",
                borderBottom: isActive ? "2px solid var(--primary)" : "2px solid transparent",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              <TabIcon size={15} />
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span style={{ fontSize: "10px", background: "#ef4444", color: "#fff", padding: "1px 6px", borderRadius: "999px", fontWeight: "800" }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === "OVERVIEW" && (
        <div>
          {/* Key Metric Cards */}
          <div className="grid-4" style={{ gap: "16px", marginBottom: "24px" }}>
            <div className="card" style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "12px", fontWeight: "600" }}>
                <span>TOTAL QR SCANS</span>
                <QrCode size={16} color="var(--primary)" />
              </div>
              <div style={{ fontSize: "28px", fontWeight: "900", color: "#0f172a", marginTop: "8px" }}>
                {analytics?.totalScans || 0}
              </div>
              <div style={{ fontSize: "11.5px", color: "#16a34a", marginTop: "4px", fontWeight: "600" }}>
                ✓ Across packaging inserts
              </div>
            </div>

            <div className="card" style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "12px", fontWeight: "600" }}>
                <span>CUSTOMER CSAT SCORE</span>
                <CheckCircle2 size={16} color="#16a34a" />
              </div>
              <div style={{ fontSize: "28px", fontWeight: "900", color: "#0f172a", marginTop: "8px" }}>
                {analytics?.avgScore || "5.0"}★
              </div>
              <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "4px" }}>
                From {analytics?.totalFeedback || 0} customer reviews
              </div>
            </div>

            <div className="card" style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "12px", fontWeight: "600" }}>
                <span>DEFECT RATE</span>
                <AlertTriangle size={16} color={analytics?.defectRate > 5 ? "#ef4444" : "#f59e0b"} />
              </div>
              <div style={{ fontSize: "28px", fontWeight: "900", color: analytics?.defectRate > 5 ? "#dc2626" : "#0f172a", marginTop: "8px" }}>
                {analytics?.defectRate || "0.0"}%
              </div>
              <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "4px" }}>
                {analytics?.totalDefects || 0} defects reported
              </div>
            </div>

            <div className="card" style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "12px", fontWeight: "600" }}>
                <span>OPEN COMPLAINTS</span>
                <Clock size={16} color="#004ac6" />
              </div>
              <div style={{ fontSize: "28px", fontWeight: "900", color: "#0f172a", marginTop: "8px" }}>
                {analytics?.openComplaintsCount || 0}
              </div>
              <div style={{ fontSize: "11.5px", color: "#dc2626", marginTop: "4px", fontWeight: "600" }}>
                Awaiting resolution action
              </div>
            </div>
          </div>

          {/* Defect Clusters & SKU Health */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "20px" }}>
            {/* Defect Clusters */}
            <div className="card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                  Defect Classification Clusters
                </h3>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)" }}>
                  Ground-Truth Quality
                </span>
              </div>

              {analytics?.defectCategories?.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {analytics.defectCategories.map((c, idx) => (
                    <div key={idx} style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                        {c._id?.replace(/_/g, " ") || "General Defect"}
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: "800", background: "#fee2e2", color: "#b91c1c", padding: "2px 8px", borderRadius: "999px" }}>
                        {c.count} cases
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                  <CheckCircle2 size={32} color="#16a34a" style={{ margin: "0 auto 8px" }} />
                  Zero defect clusters recorded! All products performing within quality standards.
                </div>
              )}
            </div>

            {/* Top Active SKUs */}
            <div className="card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                  Active SKU Scorecards
                </h3>
                <Link to="#" onClick={() => setActiveTab("CATALOGUE")} style={{ fontSize: "12px", color: "var(--primary)", fontWeight: "700", textDecoration: "none" }}>
                  View All ({products.length}) →
                </Link>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {products.slice(0, 4).map((p) => (
                  <div key={p._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: "8px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                        SKU: {p.sku} • {p.channel}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "13px", fontWeight: "800", color: "#16a34a" }}>
                        {p.stats?.avgScore || 5.0}★
                      </div>
                      <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
                        {p.stats?.totalScans || 0} scans
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT & SKU CATALOGUE */}
      {activeTab === "CATALOGUE" && (
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h2 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                Product Catalogue &amp; Packaging QR Codes
              </h2>
              <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                Every SKU is automatically mapped to an individual high-resolution QR packaging insert.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary btn-sm"
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Plus size={14} />
              <span>Add New SKU</span>
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left", color: "var(--text-muted)", fontSize: "11.5px" }}>
                  <th style={{ padding: "10px 12px" }}>PRODUCT &amp; SKU</th>
                  <th style={{ padding: "10px 12px" }}>CHANNEL</th>
                  <th style={{ padding: "10px 12px" }}>QR TYPE</th>
                  <th style={{ padding: "10px 12px" }}>SCANS</th>
                  <th style={{ padding: "10px 12px" }}>SCORE</th>
                  <th style={{ padding: "10px 12px" }}>DEFECTS</th>
                  <th style={{ padding: "10px 12px", textAlign: "right" }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px" }}>
                      <div style={{ fontWeight: "700", color: "#0f172a" }}>{p.name}</div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>
                        SKU: <code style={{ color: "#004ac6", fontWeight: "700" }}>{p.sku}</code>
                        {p.batchNumber && <span> • Batch: {p.batchNumber}</span>}
                      </div>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "700", background: "#f1f5f9", padding: "3px 8px", borderRadius: "6px", color: "#334155" }}>
                        {p.channel}
                      </span>
                    </td>
                    <td style={{ padding: "12px", fontSize: "12px", color: "#475569" }}>
                      {p.qrType} QR
                    </td>
                    <td style={{ padding: "12px", fontWeight: "700", color: "#0f172a" }}>
                      {p.stats?.totalScans || 0}
                    </td>
                    <td style={{ padding: "12px", fontWeight: "700", color: "#16a34a" }}>
                      {p.stats?.avgScore || 5.0}★
                    </td>
                    <td style={{ padding: "12px" }}>
                      {p.stats?.defectsReported > 0 ? (
                        <span style={{ fontSize: "11px", fontWeight: "800", color: "#b91c1c", background: "#fee2e2", padding: "2px 8px", borderRadius: "999px" }}>
                          {p.stats.defectsReported}
                        </span>
                      ) : (
                        <span style={{ fontSize: "12px", color: "#16a34a" }}>0</span>
                      )}
                    </td>
                    <td style={{ padding: "12px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px" }}>
                        <button
                          type="button"
                          onClick={() => handleCopyLink(p.qrCodeKey)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: "4px 8px", fontSize: "11.5px" }}
                          title="Copy Customer QR Scan URL"
                        >
                          {copiedLinkKey === p.qrCodeKey ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                          <span>{copiedLinkKey === p.qrCodeKey ? "Copied!" : "Link"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStudioProduct(p);
                            setActiveTab("STUDIO");
                          }}
                          className="btn btn-primary btn-sm"
                          style={{ padding: "4px 9px", fontSize: "11.5px" }}
                          title="Open in QR Print Studio"
                        >
                          <Printer size={12} />
                          <span>Insert</span>
                        </button>

                        <Link
                          to={`/product-feedback/${p.qrCodeKey}`}
                          className="btn btn-outline btn-sm"
                          style={{ padding: "4px 8px", fontSize: "11.5px", textDecoration: "none" }}
                          title="Test Form Live in Same Page"
                        >
                          <Eye size={12} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: QR-IN-THE-BOX PRINT STUDIO */}
      {activeTab === "STUDIO" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          {/* Controls */}
          <div className="card" style={{ padding: "22px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "14px" }}>
              Packaging Insert Designer
            </h3>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                Select Product SKU:
              </label>
              <select
                value={selectedStudioProduct?._id || ""}
                onChange={(e) => {
                  const found = products.find((p) => p._id === e.target.value);
                  if (found) setSelectedStudioProduct(found);
                }}
                style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
              >
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                Insert Dimensions:
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                {[
                  { id: "CARD", label: 'Card 3.5"×2"' },
                  { id: "SQUARE", label: 'Square 4"×4"' },
                  { id: "STICKER", label: "Box Sticker" },
                ].map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setInsertSize(s.id)}
                    style={{
                      padding: "8px",
                      borderRadius: "8px",
                      border: insertSize === s.id ? "2px solid #004ac6" : "1px solid #cbd5e1",
                      background: insertSize === s.id ? "#eff6ff" : "#fff",
                      color: insertSize === s.id ? "#004ac6" : "#475569",
                      fontWeight: "700",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "20px", fontSize: "12px", color: "#475569" }}>
              <div style={{ fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>
                ✓ Marketplace Compliance Enabled
              </div>
              <div>Channel: <strong>{selectedStudioProduct?.channel || "AMAZON"}</strong></div>
              <div>Disclaimer: Neutral review invitation &amp; direct replacement support.</div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={handlePrintInsert}
                className="btn btn-primary"
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontWeight: "700" }}
              >
                <Printer size={15} />
                <span>Print Insert</span>
              </button>

              {generatedQrDataUrl && (
                <a
                  href={generatedQrDataUrl}
                  download={`bizorm_qr_${selectedStudioProduct?.sku || "sku"}.png`}
                  className="btn btn-secondary"
                  style={{ display: "flex", alignItems: "center", gap: "6px", textDecoration: "none" }}
                >
                  <Download size={15} />
                  <span>Download QR PNG</span>
                </a>
              )}
            </div>
          </div>

          {/* Live Printable Preview */}
          <div className="card" style={{ padding: "28px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
            <div style={{ fontSize: "11px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "1px" }}>
              LIVE 300-DPI INSERT PREVIEW
            </div>

            {/* The Print Card Container */}
            <div
              style={{
                width: insertSize === "SQUARE" ? "320px" : "360px",
                minHeight: insertSize === "STICKER" ? "160px" : "200px",
                background: "#ffffff",
                border: "2px dashed #004ac6",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "10.5px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>
                {selectedStudioProduct?.brandName || user?.cmpy || "Verified Brand"}
              </div>

              <div style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", marginTop: "2px" }}>
                {selectedStudioProduct?.name || "Product Name"}
              </div>

              <div style={{ fontSize: "11px", color: "#004ac6", fontWeight: "700", marginTop: "1px" }}>
                SKU: {selectedStudioProduct?.sku || "WB-1001"}
              </div>

              {/* QR Image */}
              {generatedQrDataUrl && (
                <div style={{ margin: "14px auto", width: "110px", height: "110px" }}>
                  <img
                    src={generatedQrDataUrl}
                    alt="Product Packaging QR"
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </div>
              )}

              <div style={{ fontSize: "12.5px", fontWeight: "800", color: "#0f172a" }}>
                Scan For Warranty &amp; Feedback
              </div>

              <div style={{ fontSize: "10.5px", color: "#64748b", marginTop: "4px", lineHeight: 1.3 }}>
                Register your {selectedStudioProduct?.warrantyMonths || 12}-month brand warranty or report any damaged items for immediate replacement.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMPLAINT DESK & RESOLUTION INTELLIGENCE */}
      {activeTab === "COMPLAINTS" && (
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h2 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                Defect Reports &amp; Complaint Intelligence
              </h2>
              <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                Intercept and resolve customer quality issues directly before negative marketplace reviews appear.
              </p>
            </div>

            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Filter size={14} color="var(--text-muted)" />
              <select
                value={complaintFilter}
                onChange={(e) => setComplaintFilter(e.target.value)}
                style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px" }}
              >
                <option value="ALL">All Complaints</option>
                <option value="NEW">New (Unresolved)</option>
                <option value="INVESTIGATING">Under Investigation</option>
                <option value="RESOLVED">Resolved / Closed</option>
              </select>
            </div>
          </div>

          {complaints.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left", color: "var(--text-muted)", fontSize: "11.5px" }}>
                    <th style={{ padding: "10px 12px" }}>SKU &amp; PRODUCT</th>
                    <th style={{ padding: "10px 12px" }}>DEFECT TYPE</th>
                    <th style={{ padding: "10px 12px" }}>CUSTOMER FEEDBACK</th>
                    <th style={{ padding: "10px 12px" }}>CONTACT</th>
                    <th style={{ padding: "10px 12px" }}>STATUS</th>
                    <th style={{ padding: "10px 12px", textAlign: "right" }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c) => (
                    <tr key={c._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "12px" }}>
                        <div style={{ fontWeight: "700", color: "#0f172a" }}>{c.sku}</div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>{c.channel}</div>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "700", background: "#fee2e2", color: "#b91c1c", padding: "2px 8px", borderRadius: "999px" }}>
                          {c.defectCategory?.replace(/_/g, " ") || "DEFECT"}
                        </span>
                      </td>
                      <td style={{ padding: "12px", maxWidth: "280px" }}>
                        <div style={{ fontSize: "12.5px", color: "#334155", lineHeight: 1.4 }}>
                          "{c.comment || "Customer reported product issue on delivery"}"
                        </div>
                        {c.resolutionNotes && (
                          <div style={{ fontSize: "11px", color: "#16a34a", marginTop: "3px" }}>
                            ↳ Resolution: {c.resolutionNotes}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "12px", fontSize: "12px", color: "#475569" }}>
                        <div>{c.customerName || "Customer"}</div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>{c.customerPhone || c.customerEmail || "N/A"}</div>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            padding: "2px 8px",
                            borderRadius: "6px",
                            background:
                              c.status === "RESOLVED" || c.status === "CLOSED"
                                ? "#dcfce7"
                                : c.status === "INVESTIGATING"
                                ? "#fef3c7"
                                : "#fee2e2",
                            color:
                              c.status === "RESOLVED" || c.status === "CLOSED"
                                ? "#15803d"
                                : c.status === "INVESTIGATING"
                                ? "#b45309"
                                : "#b91c1c",
                          }}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px", textAlign: "right" }}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedComplaint(c);
                            setNewStatus(c.status);
                            setResolutionNotes(c.resolutionNotes || "");
                          }}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: "12px" }}
                        >
                          Resolve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: "36px", textAlign: "center", color: "var(--text-muted)" }}>
              <CheckCircle2 size={36} color="#16a34a" style={{ margin: "0 auto 10px" }} />
              <div style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>No Defect Cases Found</div>
              <p style={{ fontSize: "13px", marginTop: "4px" }}>
                All customer deliveries are clear of open defect claims under this filter.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: COMPLIANCE PROFILES */}
      {activeTab === "COMPLIANCE" && (
        <div className="card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>
            Marketplace Compliance Profiles™ Engine
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
            BizORM protects your marketplace merchant account by strictly governing review solicitation and customer communications based on each platform's verified 2026 policies.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {[
              {
                channel: "Amazon FBA / FBM",
                status: "VERIFIED COMPLIANT",
                rules: [
                  "Neutral review requests only (no 5-star selective gating)",
                  "Prohibits incentives, gift cards, or refunds in exchange for reviews",
                  "Direct warranty registration & replacement flow permitted",
                  "Complies with FTC 16 CFR Part 465 regarding consumer reviews",
                ],
              },
              {
                channel: "Flipkart / Shopsy",
                status: "VERIFIED COMPLIANT",
                rules: [
                  "Packaging damage detection to protect seller tier score",
                  "Post-delivery verification and sizing feedback",
                  "Independent manufacturer customer support bridge",
                ],
              },
              {
                channel: "Shopify & D2C",
                status: "FULL PERMISSION",
                rules: [
                  "Direct brand ownership of customer email and WhatsApp",
                  "Automated warranty certificate generation",
                  "Syndication to storefront review widgets",
                ],
              },
              {
                channel: "Swiggy / Zomato",
                status: "QUICK COMMERCE ALIGNED",
                rules: [
                  "Preparation time, food freshness, and spillage tracking",
                  "Kitchen branch SLA escalation before 1-star public reviews",
                ],
              },
            ].map((p, idx) => (
              <div key={idx} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>{p.channel}</div>
                  <span style={{ fontSize: "10.5px", fontWeight: "800", background: "#dcfce7", color: "#166534", padding: "2px 8px", borderRadius: "999px" }}>
                    {p.status}
                  </span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                  {p.rules.map((r, i) => (
                    <li key={i} style={{ fontSize: "12px", color: "#475569", display: "flex", alignItems: "flex-start", gap: "6px" }}>
                      <Check size={13} color="#16a34a" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Product SKU */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 9999 }}>
          <div className="card" style={{ maxWidth: "480px", width: "100%", padding: "24px", borderRadius: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "17px", fontWeight: "800", margin: 0 }}>Register New Product SKU</h3>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ border: "none", background: "none", fontSize: "18px", cursor: "pointer", color: "var(--text-muted)" }}>✕</button>
            </div>

            <form onSubmit={handleCreateProduct}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>Product Title / Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Stainless Steel Water Bottle (1000ml)"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>SKU Code *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. WB-1001"
                    value={newProdSku}
                    onChange={(e) => setNewProdSku(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", textTransform: "uppercase" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>Sales Channel</label>
                  <select
                    value={newProdChannel}
                    onChange={(e) => setNewProdChannel(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                  >
                    <option value="AMAZON">Amazon FBA / FBM</option>
                    <option value="FLIPKART">Flipkart / Shopsy</option>
                    <option value="SHOPIFY_D2C">Shopify / D2C</option>
                    <option value="SWIGGY_ZOMATO">Swiggy / Zomato</option>
                    <option value="MEESHO">Meesho</option>
                    <option value="MANUFACTURER">Manufacturer</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>QR Architecture</label>
                  <select
                    value={newProdQrType}
                    onChange={(e) => setNewProdQrType(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                  >
                    <option value="SKU">SKU QR (Recommended)</option>
                    <option value="BATCH">Batch QR</option>
                    <option value="BRAND">Brand QR</option>
                    <option value="UNIT">Unit Serial QR</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>Warranty (Months)</label>
                  <input
                    type="number"
                    value={newProdWarranty}
                    onChange={(e) => setNewProdWarranty(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" disabled={savingProd} className="btn btn-primary btn-sm" style={{ fontWeight: "700" }}>
                  {savingProd ? "Registering..." : "Generate SKU QR"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Update Complaint Status */}
      {selectedComplaint && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 9999 }}>
          <div className="card" style={{ maxWidth: "460px", width: "100%", padding: "24px", borderRadius: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h3 style={{ fontSize: "17px", fontWeight: "800", margin: 0 }}>Update Defect Case</h3>
              <button type="button" onClick={() => setSelectedComplaint(null)} style={{ border: "none", background: "none", fontSize: "18px", cursor: "pointer", color: "var(--text-muted)" }}>✕</button>
            </div>

            <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "14px", fontSize: "12.5px" }}>
              <div><strong>SKU:</strong> {selectedComplaint.sku}</div>
              <div><strong>Defect Category:</strong> {selectedComplaint.defectCategory}</div>
              <div><strong>Customer Feedback:</strong> "{selectedComplaint.comment || "N/A"}"</div>
            </div>

            <form onSubmit={handleUpdateComplaint}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>Action Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                >
                  <option value="NEW">NEW</option>
                  <option value="INVESTIGATING">INVESTIGATING</option>
                  <option value="REPLACED">REPLACEMENT DISPATCHED</option>
                  <option value="REFUNDED">REFUND PROCESSED</option>
                  <option value="RESOLVED">RESOLVED &amp; CLOSED</option>
                </select>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "4px" }}>Resolution Notes</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Dispatched free replacement part under warranty via BlueDart courier..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12.5px" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setSelectedComplaint(null)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" disabled={updatingStatus} className="btn btn-primary btn-sm" style={{ fontWeight: "700" }}>
                  {updatingStatus ? "Saving..." : "Save Resolution"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerIntelligencePage;
