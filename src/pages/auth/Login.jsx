import React, { useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { Notify } from "../../components/Notify";
import "./auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
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
      .post("http://localhost:8000/api/admin/login", formData)
      .then((res) => {
        window.location.href = "/";
      })
      .catch((err) => {
        console.error("Error logging in:", err);
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
