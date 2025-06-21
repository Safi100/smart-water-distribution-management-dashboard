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
        Notify(res.data.message);
        setFormData({ name: "", phone: "", email: "" });
      })
      .catch((error) => {
        console.error("Error response:", error.response);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="wrapper py-4">
      <ToastContainer />
      <h2 className="mb-4 text-center">Add New Admin</h2>
      <form className="new_employee_form" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className={`form-control`}
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className={`form-control`}
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Phone</label>
            <input
              type="text"
              name="phone"
              className={`form-control`}
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary mt-3"
            >
              {loading ? "Adding..." : "Add Employee"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewEmployee;
