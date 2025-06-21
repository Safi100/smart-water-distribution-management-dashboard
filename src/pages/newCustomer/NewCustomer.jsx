import { useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { Notify } from "../../components/Notify";
import { API_BASE_URL } from "../../config/api";
import "./newCustomer.css";

const NewCustomer = () => {
  const [formData, setFormData] = useState({
    identity_number: "",
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(`${API_BASE_URL}/customer`, formData)
      .then((res) => {
        Notify(res.data.message);
        console.log(res.data);
        window.location.href = `/customer/${res.data.customer._id}`;
        setFormData({
          identity_number: "",
          name: "",
          email: "",
          phone: "",
        });
      })
      .catch((error) => {
        console.log(error);
        Notify(error.response.data || "Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="new-customer-container">
      <ToastContainer />

      {/* Header Section */}
      <div className="form-header">
        <div className="header-content">
          <h1 className="form-title">👤 Add New Customer</h1>
          <p className="form-subtitle">
            Create a new customer account for water management services
          </p>
        </div>
        <div className="header-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
        </div>
      </div>

      {/* Form Card */}
      <div className="form-card">
        <div className="form-card-header">
          <h3>Customer Information</h3>
          <p>
            Please fill in all required fields to create a new customer account
          </p>
        </div>

        <form className="customer-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Identity Number */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🆔</span>
                <span className="label-text">Identity Number</span>
                <span className="required-indicator">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="identity_number"
                  className="form-input"
                  placeholder="Enter 9-digit identity number"
                  value={formData.identity_number}
                  onChange={handleChange}
                  maxLength={9}
                  required
                />
                <div className="input-border"></div>
              </div>
              <span className="input-helper">Must be exactly 9 digits</span>
            </div>

            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">👤</span>
                <span className="label-text">Full Name</span>
                <span className="required-indicator">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <div className="input-border"></div>
              </div>
              <span className="input-helper">First and last name</span>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📧</span>
                <span className="label-text">Email Address</span>
                <span className="required-indicator">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <div className="input-border"></div>
              </div>
              <span className="input-helper">
                Used for notifications and billing
              </span>
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📞</span>
                <span className="label-text">Phone Number</span>
                <span className="required-indicator">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <div className="input-border"></div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => window.history.back()}
            >
              <span>←</span>
              <span>Cancel</span>
            </button>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <div className="loading-content">
                  <div className="loading-spinner"></div>
                  <span>Adding Customer...</span>
                </div>
              ) : (
                <>
                  <span>✓</span>
                  <span>Add Customer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Info Cards */}
      <div className="info-cards">
        <div className="info-card">
          <div className="info-icon">💧</div>
          <h4>Water Management</h4>
          <p>Customer will have access to water usage tracking and billing</p>
        </div>
        <div className="info-card">
          <div className="info-icon">📊</div>
          <h4>Usage Analytics</h4>
          <p>Detailed reports and analytics for water consumption patterns</p>
        </div>
        <div className="info-card">
          <div className="info-icon">💳</div>
          <h4>Billing System</h4>
          <p>Automated billing and payment processing for water services</p>
        </div>
      </div>
    </div>
  );
};

export default NewCustomer;
