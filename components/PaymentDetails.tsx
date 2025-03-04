"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/routing";
import { Copy, Check, Clock, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface PaymentDetailsProps {
  userId: string;
  coin: string;
  paymentId: string;
  amount: string;
  currency: string;
  address: string;
  expiresAt?: string;
  usdAmount?: string; // Add this new prop for USD amount
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
  usdAmount,
}: PaymentDetailsProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("waiting");

  const router = useRouter();

  // Timer logic: update every second until expiration
  useEffect(() => {
    if (expiresAt) {
      const expirationDate = new Date(expiresAt);
      const now = new Date();
      const total = expirationDate.getTime() - now.getTime();
      setTotalTime(total);

      const interval = setInterval(() => {
        const currentTime = new Date();
        const diff = expirationDate.getTime() - currentTime.getTime();
        if (diff <= 0) {
          clearInterval(interval);
          setTimeLeft(0);
          if (status === "waiting") {
            setStatus("expired");
          }
        } else {
          setTimeLeft(diff);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [expiresAt, status]);

  // Poll the payment status every 10 seconds
  useEffect(() => {
    const pollInterval = setInterval(() => {
      checkPaymentStatus();
    }, 10000);

    checkPaymentStatus();

    return () => clearInterval(pollInterval);
  }, [paymentId]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast({ title: "Address copied!" });
      setTimeout(() => setCopied(false), 3000);
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
      setStatus(data.payment_status || "unknown");
    } catch (err) {
      console.error("checkPaymentStatus error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get status details (icon, text, color)
  const getStatusDetails = () => {
    switch (status) {
      case "waiting":
        return {
          icon: <Clock className="h-4 w-4 text-amber-400" />,
          text: "Waiting for payment...",
          color: "text-amber-400",
        };
      case "confirming":
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin text-blue-400" />,
          text: "Payment received. Confirming on blockchain...",
          color: "text-blue-400",
        };
      case "finished":
        return {
          icon: <Check className="h-4 w-4 text-green-400" />,
          text: "Payment confirmed! Your subscription is now active.",
          color: "text-green-400",
        };
      case "failed":
        return {
          icon: <AlertCircle className="h-4 w-4 text-red-400" />,
          text: "Payment failed. Please try again.",
          color: "text-red-400",
        };
      case "expired":
        return {
          icon: <AlertCircle className="h-4 w-4 text-red-400" />,
          text: "Payment window expired.",
          color: "text-red-400",
        };
      default:
        return {
          icon: <Clock className="h-4 w-4 text-gray-400" />,
          text: `Status: ${status}`,
          color: "text-gray-400",
        };
    }
  };

  // Calculate timer progress percentage
  const timerProgress = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;
  const statusDetails = getStatusDetails();

  // Redirect on success
  useEffect(() => {
    if (status === "finished") {
      const timer = setTimeout(() => {
        router.push("/success");
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, onClose, router]);

  return (
    <div className="h-full space-y-4 overflow-y-auto p-1">
      {/* Payment Header */}
      <div className="text-center">
        <h3 className="text-lg font-medium text-slate-200">
          Complete Your Payment
        </h3>
        <p className="text-sm text-slate-400">
          Send the exact amount to the address below
        </p>
      </div>

      {/* Amount Display */}
      {/* Amount Display */}
      <div className="flex flex-col items-center space-y-2 rounded-lg bg-slate-700 p-4">
        <p className="text-sm font-medium text-slate-300">Amount to Send:</p>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">{amount}</span>
          <span className="rounded-full bg-slate-600 px-2 py-1 text-xs font-medium uppercase tracking-wide text-slate-300">
            {currency}
          </span>
        </div>
        {usdAmount && (
          <div className="mt-1 flex items-center gap-1 text-sm text-slate-400">
            <span>≈</span>
            <span className="font-medium">${usdAmount}</span>
            <span>USD</span>
          </div>
        )}
      </div>

      {/* QR Code */}
      <div className="flex justify-center">
        <div className="rounded-xl bg-white p-3">
          <QRCodeSVG value={address} size={160} />
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-slate-400">
            Send to this address:
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyAddress}
            className="h-7 px-2 text-xs hover:bg-slate-700"
          >
            {copied ? (
              <Check className="mr-1 h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="mr-1 h-3.5 w-3.5" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
        <div className="break-all rounded-md bg-slate-700 p-2.5 font-mono text-xs text-slate-300">
          {address}
        </div>
      </div>

      {/* Timer */}
      {expiresAt && timeLeft > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-400">Time remaining:</span>
            <span className="font-mono text-slate-300">
              {formatTime(timeLeft)}
            </span>
          </div>
          <Progress value={timerProgress} className="h-1.5 bg-slate-700">
            <div
              className={`h-full ${timerProgress < 30 ? "bg-red-500" : timerProgress < 70 ? "bg-amber-500" : "bg-emerald-500"}`}
              style={{ width: `${timerProgress}%` }}
            ></div>
          </Progress>
        </div>
      )}

      {/* Status */}
      <div className="flex items-center gap-2 rounded-md bg-slate-700 p-3">
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
            <p className="text-sm text-blue-400">Checking status...</p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {statusDetails.icon}
            <p className={`text-sm ${statusDetails.color}`}>
              {statusDetails.text}
            </p>
          </div>
        )}
      </div>

      {/* Error message */}
      {(status === "failed" || status === "expired") && (
        <div className="rounded-md bg-red-900/20 p-3 text-sm text-red-400">
          Your payment session is no longer valid. Please try again with a new
          payment.
        </div>
      )}

      {/* Close Button */}
      <Button
        onClick={onClose}
        variant="outline"
        className="w-full border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600 hover:text-white"
      >
        Close
      </Button>
    </div>
  );
}
