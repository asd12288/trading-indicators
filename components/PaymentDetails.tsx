"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Copy, CheckCircle, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";

interface PaymentDetailsProps {
  userId: string;
  coin: string;
  paymentId: string;
  amount: string;
  currency: string;
  address: string;
  expiresAt?: string;
  usdAmount?: string;
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
  const [paymentStatus, setPaymentStatus] = useState<string>("waiting");
  const [confirmations, setConfirmations] = useState<number>(0);
  const [requiredConfirmations, setRequiredConfirmations] = useState<number>(1);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

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

  // Poll the payment status every 15 seconds
  useEffect(() => {
    if (!paymentId) return;

    const checkPaymentStatus = async () => {
      try {
        setLastChecked(new Date());
        const res = await fetch(`/api/check-payment?paymentId=${paymentId}`);
        const data = await res.json();

        if (data.payment_status) {
          setPaymentStatus(data.payment_status);

          // Update confirmations if available
          if (data.confirmations !== undefined) {
            setConfirmations(data.confirmations);
          }

          if (data.actually_paid !== undefined && data.actually_paid) {
            setStatus("confirmed");
            // Handle subscription activation here if needed
          } else if (data.payment_status === "waiting") {
            setStatus("waiting");
          } else if (data.payment_status === "confirming") {
            setStatus("confirming");
          } else if (
            data.payment_status === "confirmed" ||
            data.payment_status === "finished"
          ) {
            setStatus("confirmed");
            // Handle subscription activation here if needed
          } else if (data.payment_status === "expired") {
            setStatus("expired");
          } else if (data.payment_status === "failed") {
            setStatus("failed");
          }
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    };

    // Initial check
    checkPaymentStatus();

    // Set up polling
    const interval = setInterval(checkPaymentStatus, 15000);

    return () => clearInterval(interval);
  }, [paymentId]);

  // Format the time left in a readable way
  const formatTimeLeft = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: `${type} copied to clipboard!` });
    setTimeout(() => setCopied(false), 3000);
  };

  const handleRefreshStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/check-payment?paymentId=${paymentId}`);
      const data = await res.json();
      setLastChecked(new Date());

      if (data.payment_status) {
        setPaymentStatus(data.payment_status);
        toast({
          title: "Status updated",
          description: `Payment status: ${data.payment_status}`,
        });
      }
    } catch (error) {
      console.error("Error refreshing payment status:", error);
      toast({
        title: "Error",
        description: "Failed to refresh payment status",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 py-2">
      {/* Status indicator */}
      <div className="text-center">
        <div className="mb-2">
          {status === "waiting" && (
            <div className="flex flex-col items-center">
              <Clock className="h-12 w-12 text-yellow-500" />
              <span className="mt-2 text-lg font-medium text-yellow-500">
                Waiting for Payment
              </span>
            </div>
          )}
          {status === "confirming" && (
            <div className="flex flex-col items-center">
              <RefreshCw className="h-12 w-12 animate-spin text-blue-500" />
              <span className="mt-2 text-lg font-medium text-blue-500">
                Payment Confirming ({confirmations}/{requiredConfirmations})
              </span>
            </div>
          )}
          {status === "confirmed" && (
            <div className="flex flex-col items-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <span className="mt-2 text-lg font-medium text-green-500">
                Payment Confirmed
              </span>
            </div>
          )}
          {status === "expired" && (
            <div className="flex flex-col items-center">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <span className="mt-2 text-lg font-medium text-red-500">
                Payment Expired
              </span>
            </div>
          )}
          {status === "failed" && (
            <div className="flex flex-col items-center">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <span className="mt-2 text-lg font-medium text-red-500">
                Payment Failed
              </span>
            </div>
          )}
        </div>

        {/* Timer display */}
        {status === "waiting" && timeLeft > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-slate-400">Expires in:</span>
              <span className="rounded-md bg-slate-700 px-2 py-1 font-mono text-sm text-white">
                {formatTimeLeft(timeLeft)}
              </span>
            </div>
            <Progress
              value={(timeLeft / totalTime) * 100}
              className="h-1.5 bg-slate-700"
              indicatorClassName={
                timeLeft < totalTime * 0.2
                  ? "bg-red-500"
                  : timeLeft < totalTime * 0.5
                    ? "bg-yellow-500"
                    : "bg-green-500"
              }
            />
          </div>
        )}
      </div>

      {/* QR Code */}
      <div className="flex flex-col items-center space-y-3">
        <div className="rounded-lg bg-white p-3">
          <QRCodeSVG
            size={180}
            value={`${currency.toLowerCase()}:${address}?amount=${amount}`}
          />
        </div>
        <span className="text-xs text-slate-400">
          Scan to pay with compatible wallet
        </span>
      </div>

      {/* Amount Display */}
      <div className="flex flex-col items-center space-y-2 rounded-lg bg-slate-700 p-4">
        <p className="text-sm font-medium text-slate-300">Amount to Send:</p>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">{amount}</span>
          <span className="rounded-full bg-slate-600 px-2 py-1 text-xs font-medium uppercase tracking-wide text-slate-300">
            {currency}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(amount, "Amount")}
            className="ml-1 h-7 px-2 text-xs hover:bg-slate-600"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
        {usdAmount && (
          <div className="mt-1 flex items-center gap-1 text-sm text-slate-400">
            <span>≈</span>
            <span className="font-medium">${usdAmount}</span>
            <span>USD</span>
          </div>
        )}
      </div>

      {/* Address Display */}
      <div className="space-y-2">
        <p className="text-center text-sm font-medium text-slate-300">
          Send to this address:
        </p>
        <div className="flex items-center space-x-2 rounded-lg bg-slate-700 p-3">
          <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap font-mono text-sm text-white">
            {address}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(address, "Address")}
            className={`shrink-0 hover:bg-slate-600 ${
              copied ? "text-green-500" : "text-white"
            }`}
          >
            {copied ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="mt-1 text-center text-xs text-slate-400">
          Only send {currency} to this address
        </div>
      </div>

      {/* Last updated status */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
        <span>Last updated: {lastChecked.toLocaleTimeString()}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefreshStatus}
          disabled={loading}
          className="h-6 rounded-full px-2"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Actions */}
      <div className="flex justify-center space-x-3 pt-4">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        {(status === "confirmed" ||
          status === "expired" ||
          status === "failed") && (
          <Button
            onClick={() => router.push("/dashboard")}
            variant={status === "confirmed" ? "default" : "outline"}
          >
            {status === "confirmed" ? "Go to Dashboard" : "Try Again"}
          </Button>
        )}
      </div>
    </div>
  );
}
