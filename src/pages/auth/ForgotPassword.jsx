import React, { useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { Notify } from "../../components/Notify";
import "./auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value.trimStart());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/api/admin/forgot-password", { email })
      .then((res) => {
        Notify("Email sent successfully. Please check your inbox.");
        setEmail("");
      })
      .catch((err) => {
        console.error("Error logging in:", err);
        Notify(err.response.data);
      });
  };

  return (
    <div className="auth_bg">
      <ToastContainer />
      <div className="form_container">
        <h2 className="auth_heading">Reset your password</h2>
        <form onSubmit={handleSubmit}>
          <div className="input_div">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleEmailChange}
              value={email}
              placeholder="Email"
              required
            />
          </div>
          <a href="/login">Back to login</a>
          <button className="btn btn-sm btn-success  w-100 mt-4" type="submit">
            Send password reset email
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
