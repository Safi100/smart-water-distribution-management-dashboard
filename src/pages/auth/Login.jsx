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

          window.location.href = "/";
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
        Notify(err.response?.data || "An error occurred while logging in.");
      });
  };
  return (
    <div className="auth_bg">
      <ToastContainer />
      <div className="form_container">
        <h2 className="auth_heading">Sign in to dashboard</h2>
        <form onSubmit={handleSubmit}>
          <div className="input_div">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleInputChange}
              value={formData.email}
              placeholder="Email"
              required
            />
          </div>
          <div className="input_div">
            <div className="d-flex justify-content-between align-items-center">
              <label htmlFor="password">Password</label>
              <a href="/forgot-password">Forgot password?</a>
            </div>
            <input
              type="password"
              name="password"
              id="password"
              onChange={handleInputChange}
              value={formData.password}
              placeholder="Password"
              required
            />
          </div>
          <button className="btn btn-sm btn-success  w-100 mt-4" type="submit">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
