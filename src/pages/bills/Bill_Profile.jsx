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
import { API_BASE_URL } from "../../config/api";
import "./bills.css";

const stripePromise = loadStripe(
  "pk_test_51NptvaKDY5agNltgMHRegPmk1DFjJuok4VDi8hdKSjCvqWeUZhRVJadpQJiEO9W8T44wg8vJE1LLme1RNpuvScuv00PoXqXWev"
);

// Payment form component
const PaymentFormContent = ({ onCancel, onPaymentSuccess, billAmount }) => {
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
            `${API_BASE_URL}/bill/${id}/payment-success`
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
      {/* Payment Modal Header */}
      <div className="payment-modal-header">
        <h3>💳 Complete Your Payment</h3>
        <p className="payment-modal-subtitle">
          Secure payment powered by Stripe
        </p>
      </div>

      {/* Payment Modal Body */}
      <div className="payment-modal-body">
        {/* Payment Summary */}
        <div className="payment-summary-card">
          <h4 className="payment-summary-title">Payment Summary</h4>
          <div className="payment-amount">
            <span className="payment-amount-label">Total Amount:</span>
            <span className="payment-amount-value">₪ {billAmount}</span>
          </div>
        </div>

        {/* Security Note */}
        <div className="payment-security-note">
          <span>🔒</span>
          <span>Your payment information is secure and encrypted</span>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit}>
          <PaymentElement />

          <div className="payment-actions">
            <button
              type="submit"
              disabled={!stripe || isProcessing}
              className="confirm-payment-btn"
            >
              {isProcessing ? (
                <div className="payment-processing">
                  <div className="payment-spinner"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <>
                  <span>💳</span>
                  <span>Pay ₪ {billAmount}</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="cancel-payment-btn"
              onClick={onCancel}
              disabled={isProcessing}
            >
              <span>✕</span>
              <span>Cancel</span>
            </button>
          </div>
        </form>
      </div>
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
      .get(`${API_BASE_URL}/bill/${id}`)
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
      .post(`${API_BASE_URL}/bill/${id}/pay-admin`)
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
    <div className="bill-container">
      <ToastContainer />

      {/* Invoice Header */}
      <div className="invoice-wrapper">
        <div className="invoice-header">
          <div className="company-info">
            <h1 className="company-name">💧 AquaFlow Systems</h1>
            <p className="company-tagline">Water Management Solutions</p>
            <div className="company-details">
              <p>📍 123 Water Street, Ramallah, Palestine</p>
              <p>📞 +970-59-248-1601 | 📧 safinafi12@gmail.com</p>
            </div>
          </div>
          <div className="invoice-meta">
            <div className="invoice-title">
              <h2>WATER BILL</h2>
              <div className={`status-badge ${bill.status.toLowerCase()}`}>
                {bill.status}
              </div>
            </div>
            <div className="invoice-details">
              <div className="detail-row">
                <span className="label">Invoice #:</span>
                <span className="value">
                  {bill._id.slice(-8).toUpperCase()}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Issue Date:</span>
                <span className="value">
                  {new Date(bill.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Due Date:</span>
                <span className="value">
                  {new Date(
                    new Date(bill.createdAt).getTime() +
                      30 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Period:</span>
                <span className="value">
                  {monthNames[bill.month - 1]} {bill.year}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To Section */}
        <div className="bill-to-section">
          <div className="bill-to">
            <h3>Bill To:</h3>
            <div className="customer-info">
              <p className="customer-name">{bill.customer?.name}</p>
              <p>ID: {bill.customer?.identity_number}</p>
              <p>📧 {bill.customer?.email}</p>
              <p>📞 {bill.customer?.phone}</p>
            </div>
          </div>
        </div>

        {/* Usage Summary */}
        <div className="usage-summary">
          <h3>💧 Water Usage Summary</h3>
          <div className="usage-table">
            <div className="usage-row header">
              <span>Description</span>
              <span>Quantity</span>
              <span>Rate</span>
              <span>Amount</span>
            </div>
            <div className="usage-row">
              <span>Water Consumption</span>
              <span>{bill.amount} Liters</span>
              <span>
                ₪ {(bill.price_for_letters / bill.amount).toFixed(3)}/L
              </span>
              <span>₪ {bill.price_for_letters?.toFixed(2)}</span>
            </div>
            <div className="usage-row">
              <span>Service Fee ({bill.fees.toFixed(1)}%)</span>
              <span>-</span>
              <span>-</span>
              <span>
                ₪ {(bill.total_price - bill.price_for_letters).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="payment-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₪ {bill.price_for_letters?.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Service Fee:</span>
            <span>
              ₪ {(bill.total_price - bill.price_for_letters).toFixed(2)}
            </span>
          </div>
          <div className="summary-row total">
            <span>Total Amount Due:</span>
            <span>₪ {bill.total_price.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="invoice-footer">
          <div className="footer-note">
            <p>
              <strong>Note:</strong> Please pay by the due date to avoid service
              interruption.
            </p>
            <p>
              For questions about this bill, contact us at safinafi12@gmail.com
              or call +970-59-248-1601
            </p>
          </div>
          <div className="footer-legal">
            <p>
              Thank you for choosing AquaFlow Systems for your water management
              needs.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="invoice-actions">
        <button className="action-btn print-btn" onClick={() => window.print()}>
          🖨️ Print Invoice
        </button>

        <button
          className="action-btn download-btn"
          onClick={() => window.print()}
        >
          📄 Download PDF
        </button>

        {bill.status === "Unpaid" && !showPaymentForm && (
          <button
            className="action-btn pay-btn"
            onClick={pay_bill}
            disabled={isLoading}
          >
            {isLoading ? "⏳ Processing..." : "💳 Pay Now"}
          </button>
        )}

        {bill.status === "Paid" && (
          <div className="paid-indicator">✅ Payment Completed</div>
        )}
      </div>

      {/* Payment form overlay */}
      {clientSecret && showPaymentForm && (
        <div className="payment-overlay">
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentFormContent
              onCancel={handleCancelPayment}
              onPaymentSuccess={handlePaymentSuccess}
              billAmount={bill.total_price.toFixed(2)}
            />
          </Elements>
        </div>
      )}
    </div>
  );
};

export default BillProfile;
