import axios from "axios";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config/api";
import "./cities.css";

const Cities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/city`)
      .then((res) => {
        setCities(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to load cities");
        setLoading(false);
      });
  }, []);

  // Helper function to get tank status summary
  const getTanksSummary = (tanks) => {
    if (!tanks || tanks.length === 0)
      return {
        total: 0,
        goodLevel: 0,
        lowLevel: 0,
        totalCapacity: 0,
        totalCurrent: 0,
      };

    let goodLevel = 0;
    let totalCapacity = 0;
    let totalCurrent = 0;

    tanks.forEach((tank) => {
      // حساب السعة الكلية والمستوى الحالي
      if (tank.max_capacity) totalCapacity += tank.max_capacity;
      if (tank.current_level) totalCurrent += tank.current_level;

      // تحديد حالة الخزان بناءً على مستوى المياه
      if (tank.current_level && tank.max_capacity) {
        const fillPercentage = (tank.current_level / tank.max_capacity) * 100;
        if (fillPercentage >= 50) {
          // خزان بمستوى جيد إذا كان أكثر من 50%
          goodLevel++;
        }
      }
    });

    return {
      total: tanks.length,
      goodLevel: goodLevel, // خزانات بمستوى مياه جيد (أكثر من 50%)
      lowLevel: tanks.length - goodLevel, // خزانات بمستوى مياه منخفض (أقل من 50%)
      totalCapacity: totalCapacity.toFixed(2), // السعة الكلية للمدينة
      totalCurrent: totalCurrent.toFixed(2), // المستوى الحالي الكلي
      averageFill:
        totalCapacity > 0
          ? ((totalCurrent / totalCapacity) * 100).toFixed(1)
          : 0, // متوسط الامتلاء
    };
  };

  // Helper function to get city status color
  const getCityStatusColor = (tanks) => {
    const summary = getTanksSummary(tanks);
    if (summary.total === 0) return "no-tanks";

    const averageFill = parseFloat(summary.averageFill);
    if (averageFill >= 70) return "excellent";
    if (averageFill >= 50) return "good";
    if (averageFill >= 30) return "moderate";
    return "critical";
  };

  if (loading) {
    return (
      <div className="wrapper py-4">
        <div className="cities-loading">
          <div className="loading-spinner"></div>
          <p>Loading cities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wrapper py-4">
        <div className="cities-error">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Cities</h3>
          <p>{error}</p>
          <button
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper py-4">
      {/* Header Section */}
      <div className="cities-header">
        <div className="header-content">
          <h1 className="cities-title">🏙️ Cities Management</h1>
          <p className="cities-subtitle">
            Manage and monitor water distribution across all cities
          </p>
        </div>
        <div className="cities-stats">
          <div className="stat-item">
            <span className="stat-number">{cities.length}</span>
            <span className="stat-label">Total Cities</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {cities.reduce((sum, city) => sum + (city.tanks?.length || 0), 0)}
            </span>
            <span className="stat-label">Total Tanks</span>
          </div>
        </div>
      </div>

      {/* Cities Grid */}
      {cities.length === 0 ? (
        <div className="no-cities">
          <div className="no-cities-icon">🏙️</div>
          <h3>No Cities Found</h3>
          <p>No cities have been added to the system yet.</p>
        </div>
      ) : (
        <div className="cities-grid">
          {cities.map((city) => {
            const tanksSummary = getTanksSummary(city.tanks);
            const statusColor = getCityStatusColor(city.tanks);

            return (
              <a
                href={`/city/${city._id}`}
                key={city._id}
                className={`city-card ${statusColor}`}
              >
                <div className="city-card-header">
                  <div className="city-icon">🏢</div>
                  <div className="city-status-indicator"></div>
                </div>

                <div className="city-info">
                  <h3 className="city-name">{city.name}</h3>
                  <p className="city-description">
                    Water distribution network management
                  </p>
                </div>

                <div className="city-stats-grid">
                  <div className="city-stat">
                    <span className="stat-value">{tanksSummary.total}</span>
                    <span className="stat-label">Total Tanks</span>
                  </div>
                </div>

                <div className="city-card-footer">
                  <span className="view-details">View Details →</span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Cities;
