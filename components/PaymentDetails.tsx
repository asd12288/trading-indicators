"use client";

import { useState, useEffect } from "react";

interface PaymentDetailsProps {
  userId: string;
  coin: string;
  onClose: () => void;
}

export default function PaymentDetails({ userId, coin, onClose }: PaymentDetailsProps) {
  const [paymentInfo, setPaymentInfo] = useState<{
    address: string;
    amount: string;
    currency: string;
    paymentId: string;
    expiresAt: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Create payment on mount
  useEffect(() => {
    async function createPayment() {
      setLoading(true);
      try {
        const res = await fetch("/api/create-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, coin })
        });
        const data = await res.json();
        if (data.success && data.paymentData) {
          setPaymentInfo(data.paymentData);
        } else {
          console.error("Error creating payment:", data.error);
          alert("Error creating payment. Please try again.");
          onClose();
        }
      } catch (err) {
        console.error("Payment creation error:", err);
        alert("Failed to initiate crypto payment");
        onClose();
      } finally {
        setLoading(false);
      }
    }
    createPayment();
  }, [userId, coin, onClose]);

  if (loading || !paymentInfo) {
    return <p>Generating payment details...</p>;
  }

  const { address, amount, currency } = paymentInfo;

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      alert("Address copied!");
    } catch (err) {
      console.error("Copy error:", err);
    }
  };

  return (
    <div className="space-y-4">
      <p>
        Please send <strong>{amount} {currency.toUpperCase()}</strong> to the
        following address:
      </p>
      <div className="bg-gray-100 p-2 rounded break-all text-sm">
        {address}
      </div>
      <button onClick={copyAddress} className="btn-secondary">
        Copy Address
      </button>
      <div className="flex justify-center">
        {/* <QrCode value={address} size={128} /> */}
      </div>
      <p className="text-sm text-gray-500">
        Waiting for payment confirmation...
      </p>
      {/* Optionally add a button to cancel/close the modal */}
      <button onClick={onClose} className="btn-tertiary w-full">
        Cancel
      </button>
    </div>
  );
}
