"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import PaymentDetails from "./PaymentDetails";

export default function CryptoPaymentModal({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);

  // Payment data from server
  const [paymentData, setPaymentData] = useState<{
    paymentId: string;
    address: string;
    amount: string;
    currency: string;
    expiresAt: string;
  } | null>(null);

  const currencies = ["usdttrc20", "usdc", "btc", "eth", "tusdtrc20"];

  const handleCreatePayment = async () => {
    if (!selectedCoin) {
      toast({
        title: "Error",
        description: "Please select a currency.",
      });
      return;
    }
    try {
      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, coin: selectedCoin }),
      });
      const data = await res.json();
      if (data.success && data.paymentData) {
        setPaymentData(data.paymentData);
      } else if (data.paymentUrl) {
        // If NowPayments returned a hosted checkout URL, redirect
        window.location.href = data.paymentUrl;
      } else {
        toast({
          title: "Payment Error",
          description: data.error
            ? JSON.stringify(data.error)
            : "Could not create payment. Please try again.",
        });
        setOpen(false);
      }
    } catch (err) {
      console.error("Error creating payment:", err);
      toast({ title: "Error", description: "Failed to initiate crypto payment." });
      setOpen(false);
    }
  };

  const closeModal = () => {
    setSelectedCoin(null);
    setPaymentData(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="btn-primary">Pay with Crypto ($25)</button>
      </DialogTrigger>

      <DialogContent className="max-w-sm bg-slate-800">
        <DialogHeader>
          <DialogTitle>Crypto Payment</DialogTitle>
        </DialogHeader>

        {!paymentData ? (
          <div className="space-y-4 text-gray-100">
            <p>Select your cryptocurrency:</p>
            <Select onValueChange={(val) => setSelectedCoin(val)}>
              <SelectTrigger className="w-full bg-slate-700">
                {selectedCoin ? selectedCoin : "Choose currency"}
              </SelectTrigger>
              <SelectContent className="bg-slate-800 text-gray-100">
                {currencies.map((coin) => (
                  <SelectItem key={coin} value={coin}>
                    {coin}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button onClick={handleCreatePayment} className="btn-secondary w-full">
              Continue
            </button>
          </div>
        ) : (
          <PaymentDetails
            userId={user.id}
            coin={selectedCoin || ""}
            paymentId={paymentData.paymentId}
            address={paymentData.address}
            amount={paymentData.amount}
            currency={paymentData.currency}
            expiresAt={paymentData.expiresAt}
            onClose={closeModal}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
