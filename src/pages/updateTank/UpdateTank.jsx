import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import "./updateTank.css";

const UpdateTank = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    customer: "",
    city: "",
    coordinates: {
      latitude: 0,
      longitude: 0,
    },
    tank_size: {
      height: "",
      radius: "",
    },
    hardware: {
      ultrasonic_sensor_trig: "",
      ultrasonic_sensor_echo: "",
      waterflow_sensor: "",
      solenoid_valve: "",
      lcd_scl: "",
      lcd_sda: "",
    },
    family_members: [],
  });

  // Fetch tank data
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:8000/api/tank/${id}`)
      .then((res) => {
        const tankData = res.data;

        // Format the data for the form
        setFormData({
          customer: "", // Will be set after customers are loaded
          city: "", // Will be set after cities are loaded
          coordinates: {
            latitude: tankData.coordinates?.latitude || 0,
            longitude: tankData.coordinates?.longitude || 0,
          },
          tank_size: {
            height: tankData.height || "",
            radius: tankData.radius || "",
          },
          hardware: {
            ultrasonic_sensor_trig:
              tankData.hardware?.ultrasonic_sensor_trig || "",
            ultrasonic_sensor_echo:
              tankData.hardware?.ultrasonic_sensor_echo || "",
            waterflow_sensor: tankData.hardware?.waterflow_sensor || "",
            solenoid_valve: tankData.hardware?.solenoid_valve || "",
            lcd_scl: tankData.hardware?.lcd_scl || "",
            lcd_sda: tankData.hardware?.lcd_sda || "",
          },
          family_members:
            tankData.family_members?.map((member) => ({
              identity_id: member.identity_id || "",
              name: member.name || "",
              dob: member.dob
                ? new Date(member.dob).toISOString().split("T")[0]
                : "",
              gender: member.gender || "",
              _id: member._id || null,
            })) || [],
          customerId: tankData.owner?._id || "",
          cityId: tankData.city?._id || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tank data:", err);
        setError("Failed to load tank data. Please try again.");
        setLoading(false);
      });
  }, [id]);

  // Fetch customers and cities
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/customer")
      .then((res) => {
        const customerOptions = res.data.map((customer) => ({
          value: customer._id,
          label: customer.name,
        }));
        setCustomers(customerOptions);

        // Set the selected customer if we have the customerId
        if (formData.customerId) {
          const selectedCustomer = customerOptions.find(
            (option) => option.value === formData.customerId
          );
          if (selectedCustomer) {
            setFormData((prev) => ({ ...prev, customer: selectedCustomer }));
          }
        }
      })
      .catch((error) => console.error("Error fetching customers:", error));

    axios
      .get("http://localhost:8000/api/city")
      .then((res) => {
        const cityOptions = res.data.map((city) => ({
          value: city._id,
          label: city.name,
        }));
        setCities(cityOptions);

        // Set the selected city if we have the cityId
        if (formData.cityId) {
          const selectedCity = cityOptions.find(
            (option) => option.value === formData.cityId
          );
          if (selectedCity) {
            setFormData((prev) => ({ ...prev, city: selectedCity }));
          }
        }
      })
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  const addFamilyMember = () => {
    setFormData((prev) => ({
      ...prev,
      family_members: [
        ...prev.family_members,
        { identity_id: "", name: "", dob: "", gender: "" },
      ],
    }));
  };

  const deleteFamilyMember = (index) => {
    const updated = formData.family_members.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      family_members: updated,
    }));
  };

  const handleFamilyChange = (index, field, value) => {
    const updated = [...formData.family_members];
    updated[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      family_members: updated,
    }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCustomerChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, customer: selectedOption }));
  };

  const handleCityChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, city: selectedOption }));
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#3a3b3c",
      border: "none",
      borderRadius: "5px",
      padding: "5px",
      color: "#fff",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#3a3b3c",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#5a5b5c" : "#3a3b3c",
      color: "#fff",
      cursor: "pointer",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#fff",
    }),
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const payload = {
        customer: formData.customer?.value,
        city: formData.city?.value,
        coordinates: {
          latitude: parseFloat(formData.coordinates.latitude),
          longitude: parseFloat(formData.coordinates.longitude),
        },
        tank_size: {
          height: parseFloat(formData.tank_size.height),
          radius: parseFloat(formData.tank_size.radius),
        },
        hardware: {
          ultrasonic_sensor_trig: parseInt(
            formData.hardware.ultrasonic_sensor_trig
          ),
          ultrasonic_sensor_echo: parseInt(
            formData.hardware.ultrasonic_sensor_echo
          ),
          waterflow_sensor: parseInt(formData.hardware.waterflow_sensor),
          solenoid_valve: parseInt(formData.hardware.solenoid_valve),
          lcd_scl: parseInt(formData.hardware.lcd_scl),
          lcd_sda: parseInt(formData.hardware.lcd_sda),
        },
        family_members: formData.family_members.map((member) => {
          // Remove _id if it's null to avoid issues with the API
          const { _id, ...rest } = member;
          return _id ? member : rest;
        }),
      };

      console.log("Payload to be sent:", payload);

      setLoading(true);
      axios
        .put(`http://localhost:8000/api/tank/${id}`, payload)
        .then((res) => {
          console.log("Tank updated successfully:", res.data);
          alert("Tank updated ✅");
          navigate(`/tank/${id}`);
        })
        .catch((err) => {
          console.error(
            "Error updating tank:",
            err.response?.data || err.message
          );
          alert("❌ Error: " + (err.response?.data?.message || err.message));
          setLoading(false);
        });
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Unexpected error: " + error.message);
      setLoading(false);
    }
  };

  if (loading && !formData.customer) {
    return (
      <div className="wrapper py-4">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading tank data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wrapper py-4">
        <div className="error-container">
          <h3>Error</h3>
          <p>{error}</p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/tanks")}
          >
            Back to Tanks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper py-4">
      <div className="update-tank-header">
        <h2>Update Tank</h2>
        <button
          className="btn btn-secondary"
          onClick={() => navigate(`/tank/${id}`)}
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="update_tank_form_row">
          <div className="col span-2">
            <h4>Tank info</h4>
            <div className="inputs">
              <div className="row gy-4">
                <div className="input_div col-12 col-md-6">
                  <label className="mb-2">Customer</label>
                  <Select
                    options={customers}
                    value={formData.customer}
                    onChange={handleCustomerChange}
                    placeholder="Select a customer..."
                    styles={customStyles}
                    required
                    isDisabled={loading}
                  />
                </div>
                <div className="input_div col-12 col-md-6">
                  <label className="mb-2">City</label>
                  <Select
                    options={cities}
                    value={formData.city}
                    onChange={handleCityChange}
                    placeholder="Select a city..."
                    styles={customStyles}
                    required
                    isDisabled={loading}
                  />
                </div>
              </div>
              <div className="input_div">
                <label className="mb-3">Coordinates</label>
                <div className="row gy-4">
                  <div className="col-12 col-md-6">
                    <label className="mb-2" htmlFor="latitude">
                      Latitude
                    </label>
                    <input
                      id="latitude"
                      name="coordinates.latitude"
                      type="number"
                      placeholder="31.92138...."
                      value={formData.coordinates.latitude || ""}
                      onChange={handleFormChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="mb-2" htmlFor="longitude">
                      Longitude
                    </label>
                    <input
                      id="longitude"
                      name="coordinates.longitude"
                      type="number"
                      placeholder="35.92138...."
                      value={formData.coordinates.longitude || ""}
                      onChange={handleFormChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <h4>Tank Size</h4>
            <div className="inputs">
              <div className="input_div">
                <label className="mb-2" htmlFor="height">
                  Height (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  name="tank_size.height"
                  placeholder="Enter height"
                  value={formData.tank_size.height || ""}
                  onChange={handleFormChange}
                  disabled={loading}
                />
              </div>
              <div className="input_div">
                <label className="mb-2" htmlFor="radius">
                  Radius (cm)
                </label>
                <input
                  type="number"
                  id="radius"
                  name="tank_size.radius"
                  placeholder="Enter radius"
                  value={formData.tank_size.radius || ""}
                  onChange={handleFormChange}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
          <div className="col row_span-2">
            <h4>Tank hardware (GPIO)</h4>
            <div className="inputs">
              <div className="input_div">
                <label className="mb-4">Ultrasonic sensor</label>
                <div className="mb-3">
                  <label className="mb-2" htmlFor="ultrasonic_trig">
                    TRIG Pin
                  </label>
                  <input
                    className="mb-2"
                    type="number"
                    id="ultrasonic_trig"
                    name="hardware.ultrasonic_sensor_trig"
                    placeholder="Enter GPIO number"
                    value={formData.hardware.ultrasonic_sensor_trig || ""}
                    onChange={handleFormChange}
                    disabled={loading}
                  />
                </div>
                <label className="mb-2" htmlFor="ultrasonic_echo">
                  ECHO Pin
                </label>
                <input
                  type="number"
                  id="ultrasonic_echo"
                  name="hardware.ultrasonic_sensor_echo"
                  placeholder="Enter GPIO number"
                  value={formData.hardware.ultrasonic_sensor_echo || ""}
                  onChange={handleFormChange}
                  disabled={loading}
                />
              </div>
              <div className="input_div">
                <label className="mb-2" htmlFor="water_flow">
                  Water flow sensor
                </label>
                <input
                  type="number"
                  id="water_flow"
                  name="hardware.waterflow_sensor"
                  placeholder="Enter GPIO number"
                  value={formData.hardware.waterflow_sensor || ""}
                  onChange={handleFormChange}
                  disabled={loading}
                />
              </div>
              <div className="input_div">
                <label className="mb-2" htmlFor="solenoid_valve">
                  Solenoid valve
                </label>
                <input
                  type="number"
                  id="solenoid_valve"
                  name="hardware.solenoid_valve"
                  placeholder="Enter GPIO number"
                  value={formData.hardware.solenoid_valve || ""}
                  onChange={handleFormChange}
                  disabled={loading}
                />
              </div>
              <div className="input_div">
                <label className="mb-4">LCD screen</label>
                <div className="mb-3">
                  <label className="mb-2" htmlFor="scl">
                    SCL
                  </label>
                  <input
                    className="mb-2"
                    type="number"
                    id="scl"
                    name="hardware.lcd_scl"
                    placeholder="Enter GPIO number"
                    value={formData.hardware.lcd_scl || ""}
                    onChange={handleFormChange}
                    disabled={loading}
                  />
                </div>
                <label className="mb-2" htmlFor="sda">
                  SDA
                </label>
                <input
                  type="number"
                  id="sda"
                  name="hardware.lcd_sda"
                  placeholder="Enter GPIO number"
                  value={formData.hardware.lcd_sda || ""}
                  onChange={handleFormChange}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
          <div className="col span-3">
            <h4>Family Members</h4>
            <div className="inputs">
              {formData.family_members.map((member, index) => (
                <div
                  key={index}
                  className="row gx-3 gy-4 gy-lg-0 align-items-end mb-3"
                >
                  <div className="input_div col-lg-2 col-md-6 col-12">
                    <label className="mb-2">Identity ID</label>
                    <input
                      type="text"
                      placeholder="4075..."
                      maxLength={9}
                      value={member.identity_id}
                      onChange={(e) =>
                        handleFamilyChange(index, "identity_id", e.target.value)
                      }
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="input_div col-lg-3 col-md-6 col-12">
                    <label className="mb-2">Name</label>
                    <input
                      type="text"
                      placeholder="Name"
                      value={member.name}
                      onChange={(e) =>
                        handleFamilyChange(index, "name", e.target.value)
                      }
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="input_div col-lg-3 col-md-6 col-12">
                    <label className="mb-2">Date of birth</label>
                    <input
                      type="date"
                      placeholder="dob"
                      value={member.dob}
                      onChange={(e) =>
                        handleFamilyChange(index, "dob", e.target.value)
                      }
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="input_div col-lg-2 col-md-6 col-12">
                    <label className="mb-2">Gender</label>
                    <select
                      name="gender"
                      value={member.gender}
                      onChange={(e) =>
                        handleFamilyChange(index, "gender", e.target.value)
                      }
                      required
                      disabled={loading}
                    >
                      <option value=""></option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="input_div col-lg-2 col-md-6 col-12">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => deleteFamilyMember(index)}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={addFamilyMember}
                disabled={loading}
              >
                + Add member
              </button>
            </div>
          </div>
        </div>
        <button
          className="btn btn-primary mt-3"
          type="submit"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Tank"}
        </button>
      </form>
    </div>
  );
};

export default UpdateTank;
