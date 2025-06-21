import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Notify } from "../../components/Notify";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import "./adminProfile.css";
import DataForm from "./DataForm";
import PasswordForm from "./PasswordForm";

const AdminProfilePage = ({ currentUser }) => {
  const { id } = useParams();
  const [admin, setAdmin] = useState({});
  const [error, setError] = useState("");
  const [updateProfileShow, setUpdateProfileShow] = useState(false);

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

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/admin/${id}`)
      .then((res) => {
        setAdmin(res.data);
      })
      .catch((error) => {
        setError(error.response.data);
        console.error("Error fetching admin data:", error);
      });
  }, [id]);

  return (
    <div className="wrapper py-4">
      <div>
        {error ? (
          <h2 className="text-danger">{error}</h2>
        ) : (
          <>
            <div className="admin_info">
              <h2 className="mb-4">
                {admin.name} {currentUser?._id === admin._id && "(You)"}
              </h2>
              <p>
                Email: <span className="text-info">{admin.email}</span>
              </p>
              <p>
                Phone: <span className="text-info">{admin.phone}</span>
              </p>
              <p>
                Role: <span className="text-info">{admin.role}</span>
              </p>
              <p className="mb-0">
                Joined on{" "}
                <span className="text-info">
                  {admin.createdAt
                    ? new Date(admin.createdAt)
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, "-")
                    : "N/A"}
                </span>
              </p>
            </div>
            {currentUser?._id === admin._id && (
              <button
                className={`btn ${
                  updateProfileShow ? "btn-danger" : "btn-warning"
                }`}
                onClick={() => setUpdateProfileShow(!updateProfileShow)}
              >
                {!updateProfileShow
                  ? "Show Update profile"
                  : "Hide Update profile"}
              </button>
            )}
            {updateProfileShow && (
              <div className="mt-4">
                <DataForm admin={admin} setAdmin={setAdmin} />
                <PasswordForm />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProfilePage;
