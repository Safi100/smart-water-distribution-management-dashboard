import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { Notify } from "../../components/Notify";
import { API_BASE_URL } from "../../config/api";
import "./auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // تنظيف localStorage عند تحميل صفحة Login
  useEffect(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("c_user");
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const text = value.trimStart(); // Trims leading spaces
    setFormData((prevData) => ({
      ...prevData,
      [name]: text,
    }));
    console.log(text);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Send form data to server for authentication
    console.log(formData);
    axios
      .post(`${API_BASE_URL}/admin/login`, formData)
      .then((res) => {
        console.log("Login response:", res.data); // للتأكد من شكل الاستجابة

        // حفظ التوكن في localStorage
        if (res.data.token) {
          localStorage.setItem("access_token", res.data.token);

          // حفظ معرف المستخدم إذا كان متوفراً
          if (res.data.admin_id || res.data.user_id || res.data.id) {
            localStorage.setItem(
              "c_user",
              res.data.admin_id || res.data.user_id || res.data.id
            );
          } else {
            localStorage.setItem("c_user", "true"); // fallback
          }

          Notify("Login successful! Redirecting...");
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        } else {
          console.error("No token received from server");
          Notify("Login failed: No token received");
        }
      })
      .catch((err) => {
        console.error("Error logging in:", err);
        // تنظيف localStorage عند فشل تسجيل الدخول
        localStorage.removeItem("access_token");
        localStorage.removeItem("c_user");
        Notify(
          err.response?.data || "Invalid email or password. Please try again."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="login-container">
      <ToastContainer />

      {/* Background Elements */}
      <div className="login-background">
        <div className="water-drop"></div>
        <div className="water-drop"></div>
        <div className="water-drop"></div>
        <div className="water-wave"></div>
      </div>

      {/* Login Card */}
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">
            <div className="logo-icon">💧</div>
            <h1>AquaFlow</h1>
          </div>
          <h2 className="login-title">Sign in to Dashboard</h2>
          <p className="login-subtitle">Access your water management system</p>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="login-form-group">
            <label className="login-form-label">
              <span className="label-icon">📧</span>
              <span className="label-text">Email Address</span>
            </label>
            <div className="login-input-wrapper">
              <input
                type="email"
                name="email"
                id="email"
                className="login-form-input"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <div className="login-input-border"></div>
            </div>
          </div>

          {/* Password Field */}
          <div className="login-form-group">
            <div className="password-label-wrapper">
              <label className="login-form-label">
                <span className="label-icon">🔒</span>
                <span className="label-text">Password</span>
              </label>
              <a href="/forgot-password" className="forgot-password-link">
                Forgot password?
              </a>
            </div>
            <div className="login-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                className="login-form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
              <div className="login-input-border"></div>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="login-submit-btn">
            {loading ? (
              <div className="login-loading-content">
                <div className="login-loading-spinner"></div>
                <span>Signing In...</span>
              </div>
            ) : (
              <>
                <span>🚀</span>
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <p>Secure access to your water management dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
