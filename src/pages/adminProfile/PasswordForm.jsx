import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Notify } from "../../components/Notify";
import axios from "axios";
import "./adminProfile.css";

const PasswordForm = () => {
  const [passwordFormData, setPasswordFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  // handle password form input changes
  const handlePasswordChange = (e) => {
    setPasswordFormData({
      ...passwordFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .patch(
        `http://localhost:8000/api/admin/update-password`,
        passwordFormData
      )
      .then((res) => {
        Notify("Password updated successfully.");
        e.target.reset();
        setPasswordFormData({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
      })
      .catch((err) => {
        Notify(err.response.data || "Failed to update password.");
        console.error(err);
      });
  };

  return (
    <form noValidate className={`updateProfile_form`} onSubmit={handleSubmit}>
      <h5 className="mb-4">Update password</h5>
      <div className="mb-3">
        <label className="form-label" htmlFor="current_password">
          Current password
        </label>
        <input
          onChange={handlePasswordChange}
          type="password"
          className="form-control"
          id="current_password"
          name="current_password"
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="new_password">
          New password
        </label>
        <input
          onChange={handlePasswordChange}
          type="password"
          className="form-control"
          id="new_password"
          name="new_password"
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="confirm_password">
          Confirm new password
        </label>
        <input
          onChange={handlePasswordChange}
          type="password"
          className="form-control"
          id="confirm_password"
          name="confirm_password"
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Change password
      </button>
    </form>
  );
};

export default PasswordForm;
