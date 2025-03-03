"use client";

import { useState } from "react";

export default function CryptoPayButton({ user }) {
  const [loading, setLoading] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleCryptoPayment = async () => {
    if (!user?.id) return alert("User not found");
    setLoading(true);

    try {
      const res = await fetch("/api/create-crypto-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      if (data.paymentUrl) {
        // Redirect to the NowPayments hosted checkout page
        window.location.href = data.paymentUrl;
      } else if (data.success && data.paymentData) {
        // Show crypto payment details on your own page
        setPaymentInfo(data.paymentData);
        setShowPaymentModal(true);
      } else {
        alert("Error creating payment: " + JSON.stringify(data.error));
      }
    } catch (err) {
      console.error("handleCryptoPayment error:", err);
      alert("Failed to initiate crypto payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCryptoPayment}
      disabled={loading}
      className="rounded bg-blue-600 p-2 text-white"
    >
      {loading ? "Processing..." : "Pay with Crypto ($25)"}
    </button>
  );
}
