"use client";

import { useState, useEffect } from "react";
import QRCode, { QRCodeSVG } from "qrcode.react"; // Ensure you've installed this package
import { toast } from "@/hooks/use-toast";

interface PaymentDetailsProps {
  userId: string;
  coin: string;
  onClose: () => void;
}

export default function PaymentDetails({
  userId,
  coin,
  onClose,
}: PaymentDetailsProps) {
  const [paymentInfo, setPaymentInfo] = useState<{
    address: string;
    amount: string;
    currency: string;
    paymentId: string;
    expiresAt: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Create the payment when the component mounts.
  useEffect(() => {
    async function createPayment() {
      setLoading(true);
      try {
        const res = await fetch("/api/create-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, coin }),
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

  // Timer logic: update every second until expiration.
  useEffect(() => {
    if (paymentInfo && paymentInfo.expiresAt) {
      const expirationDate = new Date(paymentInfo.expiresAt);
      const interval = setInterval(() => {
        const now = new Date();
        const diff = expirationDate.getTime() - now.getTime();
        if (diff <= 0) {
          clearInterval(interval);
          setTimeLeft(0);
          // Optionally, you can alert the user or automatically close the modal here.
        } else {
          setTimeLeft(diff);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [paymentInfo]);

  // Helper to format milliseconds as mm:ss.
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(paymentInfo?.address || "");
      toast({ title: "Address copied!" });
    } catch (err) {
      console.error("Copy error:", err);
    }
  };

  if (loading || !paymentInfo) {
    return <p>Generating payment details...</p>;
  }

  return (
    <div className="space-y-4">
      <p>
        Please send{" "}
        <strong>
          {paymentInfo.amount} {paymentInfo.currency.toUpperCase()}
        </strong>{" "}
        to:
      </p>
      <div className="break-all rounded bg-gray-100 p-2 text-sm">
        {paymentInfo.address}
      </div>
      <button onClick={copyAddress} className="btn-secondary">
        Copy Address
      </button>
      <div className="flex justify-center">
        <QRCodeSVG value={paymentInfo.address} size={128} />
      </div>
      <p className="text-sm text-gray-500">
        Time remaining: {formatTime(timeLeft)}
      </p>
      <button onClick={onClose} className="btn-tertiary w-full">
        Cancel
      </button>
    </div>
  );
}
