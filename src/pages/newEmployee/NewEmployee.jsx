import { useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { Notify } from "../../components/Notify";
import { API_BASE_URL } from "../../config/api";
import "./newEmployee.css";

const NewEmployee = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(`${API_BASE_URL}/admin`, formData)
      .then((res) => {
        Notify(res.data.message || "Employee added successfully!");
        setFormData({ name: "", phone: "", email: "" });
        // Redirect to employees page after successful creation
        setTimeout(() => {
          window.location.href = "/employees";
        }, 1500);
      })
      .catch((error) => {
        console.error("Error response:", error.response);
        Notify(
          error.response?.data?.message ||
            "Failed to add employee. Please try again."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="new-employee-container">
      <ToastContainer />

      {/* Header Section */}
      <div className="employee-form-header">
        <div className="header-content">
          <h1 className="employee-form-title">👨‍💼 Add New Employee</h1>
          <p className="employee-form-subtitle">
            Create a new employee account for water management system
            administration
          </p>
        </div>
        <div className="header-decoration">
          <div className="employee-avatar"></div>
          <div className="employee-avatar"></div>
          <div className="employee-avatar"></div>
        </div>
      </div>

      {/* Form Card */}
      <div className="employee-form-card">
        <div className="employee-form-card-header">
          <h3>Employee Information</h3>
          <p>
            Please fill in all required fields to create a new employee account
          </p>
        </div>

        <form className="employee-form" onSubmit={handleSubmit}>
          <div className="employee-form-grid">
            {/* Full Name */}
            <div className="employee-form-group">
              <label className="employee-form-label">
                <span className="label-icon">👤</span>
                <span className="label-text">Full Name</span>
                <span className="required-indicator">*</span>
              </label>
              <div className="employee-input-wrapper">
                <input
                  type="text"
                  name="name"
                  className="employee-form-input"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <div className="employee-input-border"></div>
              </div>
              <span className="employee-input-helper">First and last name</span>
            </div>

            {/* Email */}
            <div className="employee-form-group">
              <label className="employee-form-label">
                <span className="label-icon">📧</span>
                <span className="label-text">Email Address</span>
                <span className="required-indicator">*</span>
              </label>
              <div className="employee-input-wrapper">
                <input
                  type="email"
                  name="email"
                  className="employee-form-input"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <div className="employee-input-border"></div>
              </div>
              <span className="employee-input-helper">
                Used for system login and notifications
              </span>
            </div>

            {/* Phone */}
            <div className="employee-form-group">
              <label className="employee-form-label">
                <span className="label-icon">📞</span>
                <span className="label-text">Phone Number</span>
                <span className="required-indicator">*</span>
              </label>
              <div className="employee-input-wrapper">
                <input
                  type="tel"
                  name="phone"
                  className="employee-form-input"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <div className="employee-input-border"></div>
              </div>
              <span className="employee-input-helper">
                Include country code (e.g., +970)
              </span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="employee-form-actions">
            <button
              type="button"
              className="employee-btn-secondary"
              onClick={() => window.history.back()}
            >
              <span>←</span>
              <span>Cancel</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="employee-btn-primary"
            >
              {loading ? (
                <div className="employee-loading-content">
                  <div className="employee-loading-spinner"></div>
                  <span>Adding Employee...</span>
                </div>
              ) : (
                <>
                  <span>✓</span>
                  <span>Add Employee</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Info Cards */}
      <div className="employee-info-cards">
        <div className="employee-info-card">
          <div className="info-icon">🔐</div>
          <h4>System Access</h4>
          <p>
            Employee will have administrative access to the water management
            system
          </p>
        </div>
        <div className="employee-info-card">
          <div className="info-icon">📊</div>
          <h4>Dashboard Access</h4>
          <p>Full access to analytics, reports, and system monitoring tools</p>
        </div>
        <div className="employee-info-card">
          <div className="info-icon">👥</div>
          <h4>User Management</h4>
          <p>Ability to manage customers, billing, and water distribution</p>
        </div>
      </div>
    </div>
  );
};

export default NewEmployee;
