"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CryptoSubscribeButton({ user }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Example: one-time payment flow
  const handleCryptoPayment = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/create-crypto-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          ipnCallbackUrl: `${process.env.DEV_URL}/api/crypto-payment-webhook`,
        }),
      });
      const data = await res.json();
      if (data.paymentUrl) {
        // Redirect user to NowPayments checkout page
        window.location.href = data.paymentUrl;
      } else {
        alert("Error creating payment: " + JSON.stringify(data.error));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to initiate crypto payment.");
    }
    setLoading(false);
  };

  return (
    <div className="rounded-lg bg-slate-900 p-4">
      <h2 className="mb-2 text-center font-semibold text-slate-50">
        Pay with Crypto
      </h2>
      <button
        onClick={handleCryptoPayment}
        disabled={loading}
        className="w-full rounded bg-blue-600 p-2 text-white"
      >
        {loading ? "Processing..." : "Subscribe for $25"}
      </button>
    </div>
  );
}
