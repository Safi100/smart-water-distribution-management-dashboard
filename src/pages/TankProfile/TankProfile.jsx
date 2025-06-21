import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";
import "./tankProfile.css"; // Import CSS for styling
import WaterTank from "../../components/WaterTank/WaterTank";
import HardwareInfo from "../../components/HardwareInfo/HardwareInfo";
import HardwareDetailedView from "../../components/HardwareInfo/HardwareDetailedView";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TankProfile = () => {
  const [tank, setTank] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/tank/${id}`)
      .then((res) => {
        setTank(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.error("Error fetching tank data:", error);
      });
  }, [id]);

  if (!tank) {
    return <p className="loading">Loading...</p>;
  }

  const latitude = tank.coordinates?.latitude;
  const longitude = tank.coordinates?.longitude;

  if (!latitude || !longitude) {
    return <p className="error">Coordinates not available.</p>;
  }

  const mapSrc = `https://www.google.com/maps?q=${latitude},${longitude}&hl=en&z=14&output=embed`;

  return (
    <div className="wrapper tank_profile py-4">
      <div className="tank-profile-header">
        <h1>Tank Details</h1>
        <a href={`/update-tank/${id}`} className="edit-tank-btn">
          ✏️ Edit Tank
        </a>
      </div>

      <div className="tank_profile_info">
        <div className="tank_details">
          <h2 className="title">Tank Information</h2>
          <p className="">
            <strong>Owner:</strong>{" "}
            <a className="text-info" href={`/customer/${tank.owner?._id}`}>
              {tank.owner?.name}
            </a>
          </p>
          <p className="">
            <strong>City:</strong>{" "}
            <a className="text-info" href={`/city/${tank.city?._id}`}>
              {tank.city?.name}
            </a>
          </p>
          <p className="">
            <strong>Current Level:</strong> {tank.current_level} liters
          </p>
          <p className="">
            <strong>Max Capacity:</strong> {tank.max_capacity} liters
          </p>
          <p className="">
            <strong>Monthly Capacity:</strong> {tank.monthly_capacity} liters
          </p>
          <p className="mb-0">
            <strong>Family members:</strong> {tank.family_members?.length}
          </p>
        </div>
        <div className="map-container">
          <h2 className="title">Tank Location</h2>
          <iframe
            src={mapSrc}
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      {/* Hardware Information Section */}
      {tank.hardware && (
        <div className="hardware_section">
          <HardwareInfo
            hardwareData={tank.hardware}
            title="Tank Hardware Configuration"
          />
        </div>
      )}

      <div className="tank_profile_tank_info">
        <div className="tank-visual-container">
          <WaterTank
            maxCapacity={tank.max_capacity}
            currentLevel={tank.current_level}
          />
          <div className="tank-stats">
            <h3>Current Status</h3>
            <p>
              <strong>Current Level:</strong> {tank.current_level} liters
            </p>
            <p>
              <strong>Max Capacity:</strong> {tank.max_capacity} liters
            </p>
            <p>
              <strong>Fill Percentage:</strong>{" "}
              {(tank.max_capacity > 0
                ? ((tank.current_level / tank.max_capacity) * 100).toFixed(1)
                : "0.") + "%"}{" "}
            </p>
            {tank.last_water_usage && (
              <>
                <p>
                  <strong>Last Usage:</strong> {tank.last_water_usage} liters
                </p>
                <p>
                  <strong>Last Usage Date:</strong>{" "}
                  {new Date(tank.last_water_usage_date).toLocaleString()}
                </p>
              </>
            )}
          </div>
        </div>
        <div className="chart-container">
          <h2 className="title">Water Usage</h2>
          {tank.amount_per_month && (
            <div className="water-usage-charts">
              <div className="chart-wrapper">
                <h3>Daily Water Consumption (Liters)</h3>
                <Line
                  data={{
                    labels: Object.keys(tank.amount_per_month.days).map(
                      (day) => `Day ${day}`
                    ),
                    datasets: [
                      {
                        label: "Water Usage",
                        data: Object.values(tank.amount_per_month.days),
                        borderColor: "rgba(0, 123, 255, 1)",
                        backgroundColor: "rgba(0, 123, 255, 0.1)",
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: "rgba(0, 123, 255, 1)",
                        pointBorderColor: "#fff",
                        pointRadius: 4,
                        pointHoverRadius: 6,
                      },
                      {
                        label: "Monthly Average",
                        data: Array(
                          Object.keys(tank.amount_per_month.days).length
                        ).fill(
                          Object.values(tank.amount_per_month.days).reduce(
                            (sum, value) => sum + value,
                            0
                          ) / Object.keys(tank.amount_per_month.days).length
                        ),
                        borderColor: "rgba(255, 193, 7, 1)",
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 0,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top",
                        labels: {
                          color: "#fff",
                          usePointStyle: true,
                          padding: 20,
                          font: {
                            size: 12,
                          },
                        },
                      },
                      title: {
                        display: false,
                      },
                      tooltip: {
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        titleFont: {
                          size: 14,
                        },
                        bodyFont: {
                          size: 13,
                        },
                        padding: 10,
                        caretSize: 6,
                        displayColors: true,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: "rgba(255, 255, 255, 0.1)",
                        },
                        ticks: {
                          color: "#fff",
                          font: {
                            size: 11,
                          },
                        },
                        title: {
                          display: true,
                          text: "Liters",
                          color: "#fff",
                          font: {
                            size: 12,
                            weight: "bold",
                          },
                          padding: { top: 10, bottom: 10 },
                        },
                      },
                      x: {
                        grid: {
                          color: "rgba(255, 255, 255, 0.1)",
                          drawOnChartArea: true,
                        },
                        ticks: {
                          color: "#fff",
                          maxRotation: 45,
                          minRotation: 45,
                          autoSkip: true,
                          maxTicksLimit: 15,
                          font: {
                            size: 10,
                          },
                        },
                      },
                    },
                    elements: {
                      line: {
                        tension: 0.4,
                      },
                      point: {
                        radius: 4,
                        hitRadius: 10,
                        hoverRadius: 6,
                      },
                    },
                  }}
                  height={300}
                />
              </div>

              <div className="usage-stats">
                <div className="stat-item">
                  <h4>Total Usage This Month</h4>
                  <p className="stat-value">
                    {Object.values(tank.amount_per_month.days).reduce(
                      (sum, value) => sum + value,
                      0
                    )}
                    <span className="stat-unit"> liters</span>
                  </p>
                </div>
                <div className="stat-item">
                  <h4>Monthly Capacity</h4>
                  <p className="stat-value">
                    {tank.monthly_capacity}
                    <span className="stat-unit"> liters</span>
                  </p>
                </div>
                <div className="stat-item">
                  <h4>Average Daily Usage</h4>
                  <p className="stat-value">
                    {(
                      Object.values(tank.amount_per_month.days).reduce(
                        (sum, value) => sum + value,
                        0
                      ) / Object.keys(tank.amount_per_month.days).length
                    ).toFixed(2)}
                    <span className="stat-unit"> liters</span>
                  </p>
                </div>
              </div>
            </div>
          )}
          {!tank.amount_per_month && (
            <div className="no-data-message">
              <p>No water usage data available for this month.</p>
            </div>
          )}
        </div>
      </div>
      <div className="tank_profile_tank_family">
        <h2 className="title">
          Family Members ({tank.family_members?.length})
        </h2>
        <div className="family_members_div">
          {tank.family_members?.map((member) => {
            // Function to calculate age
            const calculateAge = (dob) => {
              const birthDate = new Date(dob);
              const today = new Date();
              let age = today.getFullYear() - birthDate.getFullYear();
              const monthDiff = today.getMonth() - birthDate.getMonth();
              if (
                monthDiff < 0 ||
                (monthDiff === 0 && today.getDate() < birthDate.getDate())
              ) {
                age--;
              }
              return age;
            };

            return (
              <div key={member._id} className="family_member_div">
                <h5 className="mb-2">ID: {member.identity_id}</h5>
                <h5 className="mb-3">Name: {member.name}</h5>
                <p className="mb-2">Gender: {member.gender}</p>
                <p className="mb-2">Age: {calculateAge(member.dob)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Hardware View Section */}
      {tank.hardware && (
        <div className="hardware_detailed_section">
          <HardwareDetailedView
            tankData={tank}
            title="Detailed Hardware Configuration"
          />
        </div>
      )}
    </div>
  );
};

export default TankProfile;
