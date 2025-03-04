"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react"; // Make sure you have this package
import { toast } from "@/hooks/use-toast";

interface PaymentDetailsProps {
  userId: string;
  coin: string;
  paymentId: string; // We'll pass the paymentId out here for easier status polling
  amount: string;
  currency: string;
  address: string;
  expiresAt?: string;
  onClose: () => void;
}

export default function PaymentDetails({
  userId,
  coin,
  paymentId,
  amount,
  currency,
  address,
  expiresAt,
  onClose,
}: PaymentDetailsProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [status, setStatus] = useState<string>("waiting"); // or "created" initially

  // Timer logic: update every second until expiration.
  useEffect(() => {
    if (expiresAt) {
      const expirationDate = new Date(expiresAt);
      const interval = setInterval(() => {
        const now = new Date();
        const diff = expirationDate.getTime() - now.getTime();
        if (diff <= 0) {
          clearInterval(interval);
          setTimeLeft(0);
          // Optionally, you can alert the user or automatically close the modal
        } else {
          setTimeLeft(diff);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [expiresAt]);

  // Poll the payment status every 10 seconds
  useEffect(() => {
    const pollInterval = setInterval(() => {
      checkPaymentStatus();
    }, 10000);

    // Immediately check once on mount
    checkPaymentStatus();

    return () => clearInterval(pollInterval);
  }, [paymentId]);

  // Helper to format milliseconds as mm:ss.
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      toast({ title: "Address copied!" });
    } catch (err) {
      console.error("Copy error:", err);
    }
  };

  const checkPaymentStatus = async () => {
    try {
      if (!paymentId) return;
      setLoading(true);
      const res = await fetch(`/api/payment-status?paymentId=${paymentId}`);
      const data = await res.json();
      if (data.error) {
        console.error("Error fetching payment status:", data.error);
        return;
      }
      // data.payment_status might be 'waiting', 'confirming', 'finished', 'failed', etc.
      setStatus(data.payment_status || "unknown");
    } catch (err) {
      console.error("checkPaymentStatus error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Decide UI text based on status
  const renderStatus = () => {
    switch (status) {
      case "waiting":
        return "Waiting for payment...";
      case "confirming":
        return "Payment received. Confirming on blockchain...";
      case "finished":
        return "Payment confirmed! Your subscription is now active.";
      case "failed":
        return "Payment failed. Please try again.";
      case "expired":
        return "Payment window expired.";
      default:
        return `Status: ${status}`;
    }
  };

  // If status is finished, you can optionally auto-close the modal after a short delay
  useEffect(() => {
    if (status === "finished") {
      const timer = setTimeout(() => {
        // Refresh or close
        onClose();
      }, 3000); // close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [status, onClose]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-300">Please send:</p>
      <p className="font-bold">
        {amount} {currency.toUpperCase()}
      </p>

      <div className="break-all rounded bg-gray-800 p-2 text-sm">
        {address}
      </div>
      <button onClick={copyAddress} className="btn-secondary">
        Copy Address
      </button>

      <div className="flex justify-center py-2">
        <QRCodeSVG value={address} size={128} />
      </div>

      {expiresAt && (
        <p className="text-sm text-gray-400">
          Expires in: {formatTime(timeLeft)}
        </p>
      )}

      <div className="mt-2 text-sm">
        {loading ? (
          <p className="text-blue-400">Checking status...</p>
        ) : (
          <p className="text-blue-200">{renderStatus()}</p>
        )}
      </div>

      {status === "failed" || status === "expired" ? (
        <p className="text-red-400 mt-2">
          Your payment session is no longer valid. Please try again.
        </p>
      ) : null}

      <button onClick={onClose} className="btn-tertiary w-full mt-4">
        Close
      </button>
    </div>
  );
}
