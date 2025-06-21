import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Notify } from "../../components/Notify";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import "./adminProfile.css";

const DataForm = ({ admin, setAdmin }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    setFormData({
      name: admin.name,
      phone: admin.phone,
      email: admin.email,
    });
  }, [admin]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    axios
      .put(`${API_BASE_URL}/admin/update-profile`, formData)
      .then((res) => {
        setAdmin(res.data);
        Notify("Profile updated successfully");
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        Notify(
          error.response.data || "Failed to update profile. Please try again."
        );
      });
  };

  return (
    <form className={`updateProfile_form`} onSubmit={handleSubmit}>
      <ToastContainer />
      <h5 className="mb-4">Update Data</h5>
      <div className="row">
        <div className="mb-3 col-12 col-md-6">
          <label className="form-label" htmlFor="name">
            Full name
          </label>
          <input
            onChange={handleChange}
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            required
          />
        </div>
        <div className="mb-3 col-12 col-md-6">
          <label className="form-label" htmlFor="phone">
            Phone number
          </label>
          <input
            onChange={handleChange}
            type="tel"
            className="form-control"
            id="phone"
            name="phone"
            value={formData.phone}
            required
            pattern="[0-9]{10}"
          />
        </div>
        <div className="mb-3 col-12">
          <label className="form-label" htmlFor="email">
            Email address
          </label>
          <input
            onChange={handleChange}
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            required
          />
        </div>
        <div className="col-12">
          <button className="btn btn-primary btn-block" type="submit">
            Update data
          </button>
        </div>
      </div>
    </form>
  );
};

export default DataForm;
