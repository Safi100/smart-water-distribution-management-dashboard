import { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import "./newTank.css";

const NewTank = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/customer")
      .then((res) => {
        const customerOptions = res.data.map((customer) => ({
          value: customer.id,
          label: customer.name,
        }));
        setCustomers(customerOptions);
      })
      .catch((error) => console.error("Error fetching customers:", error));

    axios
      .get("http://localhost:8000/api/city")
      .then((res) => {
        const cityOptions = res.data.map((city) => ({
          value: city.id,
          label: city.name,
        }));
        setCities(cityOptions);
      })
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  const handleChange = (selectedOption) => {
    setSelectedCustomer(selectedOption);
    console.log("Selected Customer:", selectedOption);
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

  return (
    <div className="wrapper py-4">
      <form>
        <div className="new_tank_form_row">
          <div className="col span-2">
            <h4>Tank info</h4>
            <div className="inputs">
              <div className="row">
                <div className="input_div col-6">
                  <label className="mb-2">Customer</label>
                  <Select
                    options={customers}
                    value={selectedCustomer}
                    onChange={handleChange}
                    placeholder="Select a customer..."
                    styles={customStyles}
                  />
                </div>
                <div className="input_div col-6">
                  <label className="mb-2">City</label>
                  <input type="text" placeholder="Enter city" />
                </div>
              </div>
              <div className="input_div">
                <label className="mb-3">Coordinates</label>
                <div className="row">
                  <div className="col-6">
                    <label className="mb-2" htmlFor="">
                      Latitude
                    </label>
                    <input type="text" />
                  </div>
                  <div className="col-6">
                    <label className="mb-2" htmlFor="">
                      Longitude
                    </label>
                    <input type="text" />
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
                <input type="number" id="height" placeholder="Enter height" />
              </div>
              <div className="input_div">
                <label className="mb-2" htmlFor="radius">
                  Radius (cm)
                </label>
                <input type="number" id="radius" placeholder="Enter radius" />
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
                  placeholder="Enter GPIO number"
                />
              </div>
              <div className="input_div">
                <label className="mb-2" htmlFor="water_flow">
                  Water flow sensor
                </label>
                <input
                  type="number"
                  id="water_flow"
                  placeholder="Enter GPIO number"
                />
              </div>
              <div className="input_div">
                <label className="mb-4">LCD screen</label>
                <div>
                  <label className="mb-2" htmlFor="scl">
                    SCL
                  </label>
                  <input
                    className="mb-2"
                    type="number"
                    id="scl"
                    placeholder="Enter GPIO number"
                  />
                </div>
                <label className="mb-2" htmlFor="sda">
                  SDA
                </label>
                <input type="number" id="sda" placeholder="Enter GPIO number" />
              </div>
            </div>
          </div>
          <div className="col span-3">
            <h4>Family members</h4>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewTank;
