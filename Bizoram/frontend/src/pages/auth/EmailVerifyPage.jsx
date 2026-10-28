import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../services/api";
import { MailCheck, CheckCircle2, AlertCircle } from "lucide-react";

export const EmailVerifyPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formKey = searchParams.get("key") || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.verifyEmail({ formKey, sentCode: code });
      if (res.success) {
        setSuccess(true);
        if (res.token) {
          localStorage.setItem("token", res.token);
        }
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError(null);
    try {
      await api.resendCode(formKey);
      alert("A new verification code has been dispatched!");
    } catch (err) {
      setError(err.message || "Could not resend code");
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      padding: "20px",
    }}>
      <div className="card animate-fade-in" style={{
        maxWidth: "420px",
        width: "100%",
        padding: "36px",
        textAlign: "center",
        borderRadius: "20px",
      }}>
        <div style={{
          display: "inline-flex",
          padding: "16px",
          borderRadius: "50%",
          background: "var(--primary-light)",
          color: "var(--primary)",
          marginBottom: "16px",
        }}>
          <MailCheck size={36} />
        </div>

        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "var(--secondary)" }}>
          Verify Your Account
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "6px", marginBottom: "24px" }}>
          Enter the 6-digit verification code sent to your email.
        </p>

        {error && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "var(--danger-light)",
            color: "var(--danger)",
            padding: "10px",
            borderRadius: "var(--radius-md)",
            fontSize: "13px",
            marginBottom: "16px",
            textAlign: "left"
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "var(--success-light)",
            color: "var(--success)",
            padding: "10px",
            borderRadius: "var(--radius-md)",
            fontSize: "13px",
            marginBottom: "16px",
          }}>
            <CheckCircle2 size={16} />
            <span>Verification successful! Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              maxLength={6}
              className="form-input"
              style={{
                fontSize: "24px",
                letterSpacing: "6px",
                textAlign: "center",
                fontWeight: "700",
                padding: "12px",
              }}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || code.length < 6}
            style={{ width: "100%", padding: "12px" }}
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>

        <div style={{ marginTop: "20px" }}>
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--primary)",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {resending ? "Resending..." : "Didn't receive code? Resend"}
          </button>
        </div>
      </div>
    </div>
  );
};
