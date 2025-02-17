import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { Notify } from "../../components/Notify";
import axios from "axios";
import "./newCity.css";

const NewCity = () => {
  const [cityName, setCityName] = useState("");
  const handleInputChange = (e) => {
    setCityName(e.target.value.trimStart());
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/api/city", { name: cityName })
      .then((res) => {
        Notify("City added successfully.");
        setCityName("");
      })
      .catch((err) => {
        Notify(err.response.data || "Failed to add city. Please try again.");
      });
  };
  return (
    <div className="wrapper py-4">
      <ToastContainer />
      <div className="new_city_row">
        <div className="form_container">
          <h2 className="auth_heading">Add new city</h2>
          <form onSubmit={handleSubmit}>
            <div className="input_div">
              <label htmlFor="cityName">City name</label>
              <input
                type="text"
                id="cityName"
                name="cityName"
                onChange={handleInputChange}
                value={cityName}
                placeholder="City name..."
                required
              />
            </div>
            <button className="btn btn-sm btn-success w-100 mt-4" type="submit">
              Add city
            </button>
          </form>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default NewCity;
