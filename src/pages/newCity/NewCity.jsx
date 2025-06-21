import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { Notify } from "../../components/Notify";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import "./newCity.css";

const NewCity = () => {
  const [cityName, setCityName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setCityName(e.target.value.trimStart());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post(`${API_BASE_URL}/city`, { name: cityName })
      .then((res) => {
        Notify("City added successfully.");
        setCityName("");
        // Redirect to cities page after successful creation
        setTimeout(() => {
          window.location.href = "/cities";
        }, 1500);
      })
      .catch((err) => {
        Notify(err.response.data || "Failed to add city. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="new-city-container">
      <ToastContainer />

      {/* Header Section */}
      <div className="city-form-header">
        <div className="header-content">
          <h1 className="city-form-title">🏙️ Add New City</h1>
          <p className="city-form-subtitle">
            Create a new city to manage water distribution networks
          </p>
        </div>
        <div className="header-illustration">
          <div className="city-building"></div>
          <div className="city-building"></div>
          <div className="city-building"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="city-form-content">
        {/* Form Card */}
        <div className="city-form-card">
          <div className="city-form-card-header">
            <h3>City Information</h3>
            <p>Enter the city name to create a new water management zone</p>
          </div>

          <form className="city-form" onSubmit={handleSubmit}>
            <div className="city-form-group">
              <label className="city-form-label">
                <span className="label-icon">🏢</span>
                <span className="label-text">City Name</span>
                <span className="required-indicator">*</span>
              </label>
              <div className="city-input-wrapper">
                <input
                  type="text"
                  id="cityName"
                  name="cityName"
                  className="city-form-input"
                  placeholder="Enter city name (e.g., Ramallah, Jerusalem)"
                  value={cityName}
                  onChange={handleInputChange}
                  required
                />
                <div className="city-input-border"></div>
              </div>
              <span className="city-input-helper">
                This will be used to identify the water management zone
              </span>
            </div>

            <div className="city-form-actions">
              <button
                type="button"
                className="city-btn-secondary"
                onClick={() => window.history.back()}
              >
                <span>←</span>
                <span>Cancel</span>
              </button>

              <button
                type="submit"
                disabled={loading || !cityName.trim()}
                className="city-btn-primary"
              >
                {loading ? (
                  <div className="city-loading-content">
                    <div className="city-loading-spinner"></div>
                    <span>Creating City...</span>
                  </div>
                ) : (
                  <>
                    <span>✓</span>
                    <span>Create City</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Section */}
        <div className="city-info-section">
          <h3>What happens next?</h3>
          <div className="city-info-steps">
            <div className="city-info-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>City Created</h4>
                <p>Your new city will be added to the system</p>
              </div>
            </div>
            <div className="city-info-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Add Water Tanks</h4>
                <p>Start adding water tanks to this city</p>
              </div>
            </div>
            <div className="city-info-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Manage Distribution</h4>
                <p>Monitor and manage water distribution</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Cards */}
      <div className="city-features">
        <div className="city-feature-card">
          <div className="feature-icon">💧</div>
          <h4>Water Management</h4>
          <p>Comprehensive water distribution tracking and monitoring</p>
        </div>
        <div className="city-feature-card">
          <div className="feature-icon">🏗️</div>
          <h4>Infrastructure</h4>
          <p>Manage tanks, pumps, and distribution networks</p>
        </div>
        <div className="city-feature-card">
          <div className="feature-icon">📊</div>
          <h4>Analytics</h4>
          <p>Detailed reports and usage analytics for the city</p>
        </div>
      </div>
    </div>
  );
};

export default NewCity;
