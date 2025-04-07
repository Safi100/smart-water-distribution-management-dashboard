import { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import "./newTank.css";

const NewTank = () => {
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
      ultrasonic_sensor: "",
      waterflow_sensor: "",
      solenoid_valve: "",
      lcd_scl: "",
      lcd_sda: "",
    },
    family_members: [],
  });

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

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/customer")
      .then((res) => {
        const customerOptions = res.data.map((customer) => ({
          value: customer._id,
          label: customer.name,
        }));
        setCustomers(customerOptions);
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
      })
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

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
        customer: formData.customer.value,
        city: formData.city.value,
        coordinates: {
          latitude: parseFloat(formData.coordinates.latitude),
          longitude: parseFloat(formData.coordinates.longitude),
        },
        tank_size: {
          height: parseFloat(formData.tank_size.height),
          radius: parseFloat(formData.tank_size.radius),
        },
        hardware: {
          ultrasonic_sensor: parseInt(formData.hardware.ultrasonic_sensor),
          waterflow_sensor: parseInt(formData.hardware.waterflow_sensor),
          solenoid_valve: parseInt(formData.hardware.solenoid_valve),
          lcd_scl: parseInt(formData.hardware.lcd_scl),
          lcd_sda: parseInt(formData.hardware.lcd_sda),
        },
        family_members: formData.family_members,
      };

      console.log("Payload to be sent:", payload);

      axios
        .post("http://localhost:8000/api/tank/", payload)
        .then((res) => {
          console.log("Tank added successfully:", res.data);
          alert("Tank created ✅");
          window.location.href = `/tank/${res.data.tank_id}`;
        })
        .catch((err) => {
          console.error(
            "Error creating tank:",
            err.response?.data || err.message
          );
          alert("❌ Error: " + (err.response?.data?.message || err.message));
        });
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Unexpected error: " + error.message);
    }
  };

  return (
    <div className="wrapper py-4">
      <form onSubmit={handleSubmit}>
        <div className="new_tank_form_row">
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
                />
              </div>
            </div>
          </div>
          <div className="col row_span-2">
            <h4>Tank hardware (GPIO)</h4>
            <div className="inputs">
              <div className="input_div">
                <label className="mb-2" htmlFor="ultrasonic">
                  Ultrasonic sensor
                </label>
                <input
                  type="number"
                  id="ultrasonic"
                  name="hardware.ultrasonic_sensor"
                  placeholder="Enter GPIO number"
                  value={formData.hardware.ultrasonic_sensor || ""}
                  onChange={handleFormChange}
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
              >
                + Add member
              </button>
            </div>
          </div>
        </div>
        <button className="btn btn-primary mt-3">Create tank</button>
      </form>
    </div>
  );
};

export default NewTank;
