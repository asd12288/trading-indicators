"use client";

import { useState } from "react";

export default function CryptoPayButton({ user }) {
  const [loading, setLoading] = useState(false);

  const handleCryptoPayment = async () => {
    if (!user?.id) return alert("User not found");
    setLoading(true);

    try {
      const res = await fetch("/api/create-crypto-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await res.json();
      if (data.paymentUrl) {
        // Redirect to the NowPayments hosted checkout page
        window.location.href = data.paymentUrl;
      } else {
        console.error("Payment creation error:", data);
        alert("Could not create payment. Check console.");
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
      className="bg-blue-600 text-white p-2 rounded"
    >
      {loading ? "Processing..." : "Pay with Crypto ($25)"}
    </button>
  );
}
