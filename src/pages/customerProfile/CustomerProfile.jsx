import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./customerProfile.css";

const CustomerProfile = () => {
  const { id } = useParams();
  const [customer, setCustomers] = useState({});
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/customer/${id}`)
      .then((res) => {
        setCustomers(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.error("Error fetching customer data:", error);
      });
  }, [id]);
  return (
    <div className="wrapper py-4">
      <div className="customer_info">
        <h2 className="mb-4">{customer.name}</h2>
        <p>
          ID number:{" "}
          <span className="text-info">{customer.identity_number}</span>
        </p>
        <p>
          Email: <span className="text-info">{customer.email}</span>
        </p>
        <p>
          Phone: <span className="text-info">{customer.phone}</span>
        </p>
        <p className="mb-0">
          Joined on{" "}
          <span className="text-info">
            {customer.createdAt
              ? new Date(customer.createdAt)
                  .toLocaleDateString("en-GB")
                  .replace(/\//g, "-")
              : "N/A"}
          </span>
        </p>
      </div>
      <div className="mt-4">
        {customer.tanks?.length > 0 ? (
          <h2>Tanks: {customer.tanks?.length}</h2>
        ) : (
          <h2 className="text-danger">No tanks yet...</h2>
        )}
      </div>
    </div>
  );
};

export default CustomerProfile;
