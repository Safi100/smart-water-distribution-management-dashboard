import axios from "axios";
import { useEffect, useState } from "react";
import "./dashboard.css";
import WaterTank from "../../components/WaterTank/WaterTank";
import HardwareInfo from "../../components/HardwareInfo/HardwareInfo";
import { API_BASE_URL } from "../../config/api";

const Dashboard = () => {
  const [data, setData] = useState({
    totalEmployees: 0,
    totalCustomers: 0,
    totalDistributors: 0,
    totalCities: 0,
    totalPaidBills: 0,
    totalUnPaidBills: 0,
  });
  const [mainTank, setMainTank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper functions for tank status
  const getStatusClass = (currentLevel, maxCapacity) => {
    const percentage = (currentLevel / maxCapacity) * 100;
    if (percentage >= 80) return "status-high";
    if (percentage >= 50) return "status-medium";
    if (percentage >= 20) return "status-low";
    return "status-critical";
  };

  const getStatusText = (currentLevel, maxCapacity) => {
    const percentage = (currentLevel / maxCapacity) * 100;
    if (percentage >= 80) return "Optimal";
    if (percentage >= 50) return "Good";
    if (percentage >= 20) return "Low";
    return "Critical";
  };

  useEffect(() => {
    // Fetch dashboard data
    axios
      .get(`${API_BASE_URL}/dashboard`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log("Error fetching dashboard data:", err);
      });

    // Fetch main tank data
    axios
      .get(`${API_BASE_URL}/tank/main-tank/67e457e3df743a76a3483d09`)
      .then((res) => {
        setMainTank(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching main tank data:", err);
        setError("Failed to load main tank data");
        setLoading(false);
      });
  }, []);
  return (
    <div className="wrapper py-4">
      {/* System Overview */}
      <div className="system-overview-section">
        <div className="overview-header">
          <h2 className="overview-title">System Overview</h2>
          <p className="overview-subtitle">
            Monitor your water management system at a glance
          </p>
        </div>

        <div className="overview-grid">
          <div className="overview-category">
            <h3 className="category-title">👥 Users & Management</h3>
            <div className="category-cards">
              <a href="/customers" className="overview-card customers-card">
                <div className="card-icon">👤</div>
                <div className="card-content">
                  <span className="card-label">Customers</span>
                  <span className="card-value">{data.totalCustomers}</span>
                </div>
              </a>
              <a href="/employees" className="overview-card employees-card">
                <div className="card-icon">👨‍💼</div>
                <div className="card-content">
                  <span className="card-label">Employees</span>
                  <span className="card-value">{data.totalEmployees}</span>
                </div>
              </a>
            </div>
          </div>

          <div className="overview-category">
            <h3 className="category-title">🏙️ Infrastructure</h3>
            <div className="category-cards">
              <a href="/cities" className="overview-card cities-card">
                <div className="card-icon">🏢</div>
                <div className="card-content">
                  <span className="card-label">Cities</span>
                  <span className="card-value">{data.totalCities}</span>
                </div>
              </a>
            </div>
          </div>

          <div className="overview-category">
            <h3 className="category-title">💰 Billing Status</h3>
            <div className="category-cards">
              <a
                href="/bills?status=Paid"
                className="overview-card paid-bills-card"
              >
                <div className="card-icon">✅</div>
                <div className="card-content">
                  <span className="card-label">Paid Bills</span>
                  <span className="card-value">{data.totalPaidBills}</span>
                </div>
              </a>
              <a
                href="/bills?status=Unpaid"
                className="overview-card unpaid-bills-card"
              >
                <div className="card-icon">⏳</div>
                <div className="card-content">
                  <span className="card-label">Unpaid Bills</span>
                  <span className="card-value">{data.totalUnPaidBills}</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Main Tank Section */}
      <div className="main-tank-section">
        <div className="section-header">
          <h2 className="section-title m-0">Main Water Tank Status</h2>
          <button
            className="pump-water-btn"
            onClick={() => {
              if (mainTank && !loading) {
                // Show confirmation dialog
                if (
                  window.confirm(
                    "Are you sure you want to pump water to the main tank?"
                  )
                ) {
                  // Set loading state
                  setLoading(true);

                  // Call API to pump water
                  axios
                    .post(`${API_BASE_URL}/pump-water`)
                    .then((res) => {
                      // Update tank data with new values
                      setMainTank(res.data);
                      alert("Water pumped successfully!");
                      setMainTank({
                        ...mainTank,
                        current_level:
                          res.data?.main_tank_level?.estimated_volume_liters,
                      });
                    })
                    .catch((err) => {
                      console.error("Error pumping water:", err);
                      alert("Failed to pump water. Please try again.");
                    })
                    .finally(() => {
                      setLoading(false);
                    });
                }
              }
            }}
            disabled={loading || !mainTank}
          >
            💧 Pump Water
          </button>
        </div>
        <div className="main-tank-container">
          {loading ? (
            <div className="loading-indicator">Loading tank data...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : mainTank ? (
            <div className="tank-dashboard-layout">
              {/* Tank Overview Card */}
              <div className="tank-overview-card">
                <div className="tank-header">
                  <h3>{mainTank.city?.name} Main Tank</h3>
                  <div className="tank-status">
                    <span
                      className={`status-indicator ${getStatusClass(
                        mainTank.current_level,
                        mainTank.max_capacity
                      )}`}
                    >
                      {getStatusText(
                        mainTank.current_level,
                        mainTank.max_capacity
                      )}
                    </span>
                  </div>
                </div>

                <div className="tank-stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Current Level</span>
                    <span className="stat-value">
                      {mainTank.current_level?.toFixed(2)} L
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Max Capacity</span>
                    <span className="stat-value">
                      {mainTank.max_capacity?.toFixed(2)} L
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Fill Percentage</span>
                    <span className="stat-value">
                      {(
                        (mainTank.current_level / mainTank.max_capacity) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Monthly Capacity</span>
                    <span className="stat-value">
                      {mainTank.monthly_capacity || "N/A"} L
                    </span>
                  </div>
                </div>

                <div className="tank-actions">
                  <button
                    className="read-value-btn"
                    onClick={() => {
                      setLoading(true);
                      axios
                        .get(
                          `${API_BASE_URL}/tank/main-tank-value-ultrasonic/${mainTank._id}`
                        )
                        .then((res) => {
                          console.log("Ultrasonic value:", res.data);
                          const updatedTank = {
                            ...mainTank,
                            current_level: res.data.estimated_volume_liters,
                          };
                          setMainTank(updatedTank);
                          alert(
                            `Sensor value read successfully!\nCurrent level: ${res.data.estimated_volume_liters} L`
                          );
                        })
                        .catch((err) => {
                          console.error("Error reading ultrasonic value:", err);
                          alert(
                            "Failed to read sensor value. Please try again."
                          );
                        })
                        .finally(() => {
                          setLoading(false);
                        });
                    }}
                    disabled={loading}
                  >
                    📡 Read Sensor Value
                  </button>
                </div>
              </div>

              {/* Tank Visual */}
              <div className="tank-visual-card">
                <WaterTank
                  maxCapacity={mainTank.max_capacity}
                  currentLevel={mainTank.current_level}
                />
              </div>

              {/* Hardware Info */}
              {mainTank.hardware && (
                <div className="tank-hardware-card">
                  <HardwareInfo
                    hardwareData={mainTank.hardware}
                    tankData={mainTank}
                    title="Main Tank Hardware Status"
                    isMainTank={true}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="no-data-message">No tank data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
