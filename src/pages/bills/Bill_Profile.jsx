// BillProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./bills.css";
import axios from "axios";

const BillProfile = () => {
  const { id } = useParams();
  const [bill, setBill] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/bill/${id}`)
      .then((res) => {
        setBill(res.data);
        console.log(res.data);
      })
      .catch((err) => console.error("Error fetching bill:", err));
  }, [id]);

  if (!bill) return <div className="container">Loading...</div>;

  return (
    <div className="container wrapper py-4">
      <div className="card">
        <div className="header">
          <h1>Water Bill Details</h1>
          <p>Bill ID: {bill._id}</p>
        </div>

        <section>
          <h2>Customer Information</h2>
          <div className="grid">
            <div>
              <label>Name:</label>
              <span>{bill.customer?.name}</span>
            </div>
            <div>
              <label>ID Number:</label>
              <span>{bill.customer?.identity_number}</span>
            </div>
            <div>
              <label>Email:</label>
              <span>{bill.customer?.email}</span>
            </div>
            <div>
              <label>Phone:</label>
              <span>{bill.customer?.phone}</span>
            </div>
          </div>
        </section>

        <section>
          <h2>Tank Information</h2>
          <div className="grid">
            <div>
              <label>City:</label>
              <span>{bill.tank?.city?.name}</span>
            </div>
            <div>
              <label>Family Members:</label>
              <span>{bill.tank?.family_members?.length || 0}</span>
            </div>
            <div>
              <label>Monthly Capacity:</label>
              <span>{bill.tank?.monthly_capacity} liters</span>
            </div>
          </div>
        </section>

        <section>
          <h2>Billing Details</h2>
          <div className="grid">
            <div>
              <label>Bill release date:</label>
              <span>
                {new Date(bill.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div>
              <label>Status:</label>
              <span
                className={bill.status === "Unpaid" ? "text-red" : "text-green"}
              >
                {bill.status}
              </span>
            </div>
            <div>
              <label>Amount:</label>
              <span>{bill.amount} units</span>
            </div>
            <div>
              <label>Price:</label>
              <span>${bill.price_for_letters?.toFixed(2)}</span>
            </div>
            <div>
              <label>Fees:</label>
              <span>{bill.fees.toFixed(2)}%</span>
            </div>
            <div>
              <label>Total:</label>
              <span>${bill.total_price.toFixed(2)}</span>
            </div>
          </div>
        </section>

        <section>
          <h2>Family Members</h2>
          <span>
            This account has {bill.tank?.family_members?.length || 0} registered
            family members.
          </span>
        </section>
      </div>
      <section>
        <button className="print-button" onClick={() => window.print()}>
          🖨️ Print Bill
        </button>
      </section>
    </div>
  );
};

export default BillProfile;
