import React, { useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { Notify } from "../../components/Notify";
import { API_BASE_URL } from "../../config/api";
import "./auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value.trimStart());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post(`${API_BASE_URL}/admin/forgot-password`, { email })
      .then((res) => {
        Notify(
          "Password reset email sent successfully! Please check your inbox."
        );
        setEmail("");
        setEmailSent(true);
      })
      .catch((err) => {
        console.error("Error sending reset email:", err);
        Notify(
          err.response?.data || "Failed to send reset email. Please try again."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="forgot-password-container">
      <ToastContainer />

      {/* Background Elements */}
      <div className="forgot-password-background">
        <div className="water-drop"></div>
        <div className="water-drop"></div>
        <div className="water-drop"></div>
        <div className="water-wave"></div>
      </div>

      {/* Forgot Password Card */}
      <div className="forgot-password-card">
        {/* Header */}
        <div className="forgot-password-header">
          <div className="forgot-password-logo">
            <div className="logo-icon">🔐</div>
            <h1>Password Recovery</h1>
          </div>
          <h2 className="forgot-password-title">Reset Your Password</h2>
          <p className="forgot-password-subtitle">
            Enter your email address and we'll send you a link to reset your
            password
          </p>
        </div>

        {!emailSent ? (
          <>
            {/* Form */}
            <form className="forgot-password-form" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="forgot-password-form-group">
                <label className="forgot-password-form-label">
                  <span className="label-icon">📧</span>
                  <span className="label-text">Email Address</span>
                </label>
                <div className="forgot-password-input-wrapper">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="forgot-password-form-input"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                  <div className="forgot-password-input-border"></div>
                </div>
                <span className="forgot-password-input-helper">
                  We'll send password reset instructions to this email
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="forgot-password-submit-btn"
              >
                {loading ? (
                  <div className="forgot-password-loading-content">
                    <div className="forgot-password-loading-spinner"></div>
                    <span>Sending Email...</span>
                  </div>
                ) : (
                  <>
                    <span>📤</span>
                    <span>Send Reset Email</span>
                  </>
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="forgot-password-footer">
              <a href="/login" className="back-to-login-link">
                <span>←</span>
                <span>Back to Login</span>
              </a>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="email-sent-success">
            <div className="success-icon">✅</div>
            <h3>Email Sent Successfully!</h3>
            <p>
              We've sent password reset instructions to your email address.
              Please check your inbox and follow the instructions to reset your
              password.
            </p>
            <div className="success-actions">
              <a href="/login" className="back-to-login-btn">
                <span>←</span>
                <span>Back to Login</span>
              </a>
              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                }}
                className="send-again-btn"
              >
                <span>📤</span>
                <span>Send Again</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
