import { useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { Notify } from "../../components/Notify";
import "./newCustomer.css";

const NewCustomer = () => {
  const [formData, setFormData] = useState({
    identity_number: "",
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("http://localhost:8000/api/customer", formData)
      .then((res) => {
        Notify(res.data.message);
        console.log(res.data);
        window.location.href = `/customer/${res.data.customer._id}`;
        setFormData({
          identity_number: "",
          name: "",
          email: "",
          phone: "",
        });
      })
      .catch((error) => {
        console.log(error);
        Notify(error.response.data || "Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="wrapper py-4">
      <ToastContainer />
      <h2 className="mb-4 text-center">Add New Customer</h2>
      <form className="new_customer_form" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Identity Number</label>
            <input
              type="text"
              name="identity_number"
              className={`form-control`}
              placeholder="Enter 9-digit identity number"
              value={formData.identity_number}
              onChange={handleChange}
              maxLength={9}
              required
            />
          </div>

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
              {loading ? "Adding..." : "Add Customer"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewCustomer;
