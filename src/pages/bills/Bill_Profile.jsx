import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ToastContainer } from "react-toastify";
import { Notify } from "../../components/Notify";
import axios from "axios";
import "./bills.css";

const stripePromise = loadStripe(
  "pk_test_51NptvaKDY5agNltgMHRegPmk1DFjJuok4VDi8hdKSjCvqWeUZhRVJadpQJiEO9W8T44wg8vJE1LLme1RNpuvScuv00PoXqXWev"
);

// Payment form component
const PaymentFormContent = ({ onCancel, onPaymentSuccess }) => {
  const { id } = useParams();
  const [isProcessing, setIsProcessing] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: "if_required",
      });

      if (error) {
        console.error(error.message);
        Notify("❌ Payment failed: " + error.message, "error");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        try {
          const response = await axios.put(
            `http://localhost:8000/api/bill/${id}/payment-success`
          );
          Notify("✅ Payment confirmed and status updated.", "success");
          onPaymentSuccess(response.data);
        } catch (updateError) {
          console.error("Error updating bill status:", updateError);
          Notify(
            "⚠️ Payment succeeded, but failed to update status.",
            "warning"
          );
          // Still consider it a success since payment went through
          onPaymentSuccess();
        }
      } else {
        setIsProcessing(false);
      }
    } catch (paymentError) {
      console.error("Payment processing error:", paymentError);
      Notify("❌ Payment processing error", "error");
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-modal">
      <h3>Complete Your Payment</h3>
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <div className="payment-actions">
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="confirm-payment-btn"
          >
            {isProcessing ? "Processing..." : "Confirm Payment"}
          </button>
          <button
            type="button"
            className="cancel-payment-btn"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Main component
const BillProfile = () => {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBillData = () => {
    setIsLoading(true);
    axios
      .get(`http://localhost:8000/api/bill/${id}`)
      .then((res) => setBill(res.data))
      .catch((err) => {
        console.error("Error fetching bill:", err);
        Notify("Could not load bill data", "error");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchBillData();
  }, [id]);

  const pay_bill = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to pay this bill?"
    );
    if (!isConfirmed) return;

    setIsLoading(true);
    axios
      .post(`http://localhost:8000/api/bill/${id}/pay-admin`)
      .then((res) => {
        setClientSecret(res.data.clientSecret);
        setShowPaymentForm(true);
        console.log("Stripe ClientSecret:", res.data.clientSecret);
      })
      .catch((err) => {
        console.error("Error initiating payment:", err);
        Notify("Could not initiate payment process", "error");
      })
      .finally(() => setIsLoading(false));
  };

  const handleCancelPayment = () => {
    setShowPaymentForm(false);
    setClientSecret(null);
  };

  const handlePaymentSuccess = (updatedBillData) => {
    // If we received updated bill data from the server, use it
    if (updatedBillData && updatedBillData.bill) {
      setBill(updatedBillData.bill);
    } else {
      // Otherwise, refresh the bill data from the server
      fetchBillData();
    }

    // Close the payment form
    setShowPaymentForm(false);
    setClientSecret(null);
  };

  if (isLoading && !bill) {
    return (
      <div className="container wrapper py-4 loading-container">
        <div className="loading-spinner"></div>
        <p>Loading bill information...</p>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="container wrapper py-4 error-container">
        <h2>Could not load bill information</h2>
        <button className="retry-button" onClick={fetchBillData}>
          Try Again
        </button>
      </div>
    );
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="container wrapper py-4">
      <ToastContainer />
      <div className="card">
        <div className="header">
          <h1>Water Bill</h1>
          <p>Bill ID: {bill._id}</p>
        </div>

        <section>
          <h2>Customer Information</h2>
          <div className="grid">
            <div>
              <label>Name:</label>
              <span
                role="button"
                className="cursor-pointer"
                onClick={() =>
                  (window.location.href = `/customer/${bill.customer?._id}`)
                }
              >
                {bill.customer?.name}
              </span>
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
          <h2>Billing Details</h2>
          <div className="grid">
            <div>
              <label>Bill date:</label>
              <span>
                {monthNames[bill.month - 1]} {bill.year}
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
              <span>{bill.amount} Liter</span>
            </div>
            <div>
              <label>Price:</label>
              <span>₪ {bill.price_for_letters?.toFixed(2)}</span>
            </div>
            <div>
              <label>Fees:</label>
              <span>{bill.fees.toFixed(2)}%</span>
            </div>
            <div>
              <label>Total:</label>
              <span>₪ {bill.total_price.toFixed(2)}</span>
            </div>
          </div>
        </section>
      </div>

      <section className="btn_section">
        <button className="print-button" onClick={() => window.print()}>
          🖨️ Print Bill
        </button>

        {bill.status === "Unpaid" && !showPaymentForm && (
          <button
            className="pay-button"
            onClick={pay_bill}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "💳 Pay Bill"}
          </button>
        )}
      </section>

      {/* Payment form overlay */}
      {clientSecret && showPaymentForm && (
        <div className="payment-overlay">
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentFormContent
              onCancel={handleCancelPayment}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </Elements>
        </div>
      )}
    </div>
  );
};

export default BillProfile;
