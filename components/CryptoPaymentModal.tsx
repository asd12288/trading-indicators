"use client";

import { useState, useEffect } from "react";
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
import PaymentDetails from "./PaymentDetails";

export default function CryptoPaymentModal({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);

  const currencies = ["usdttrc20", "usdc", "btc", "eth"];


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="btn-primary">Pay with Crypto ($25)</button>
      </DialogTrigger>
      <DialogContent className="max-w-sm bg-slate-800">
        <DialogHeader>
          <DialogTitle>Crypto Payment</DialogTitle>
        </DialogHeader>
        {!selectedCoin ? (
          <div className="space-y-4">
            <p>Select your cryptocurrency:</p>
            <Select onValueChange={(val) => setSelectedCoin(val)}>
              <SelectTrigger className="w-full">
                {selectedCoin ? selectedCoin : "Choose currency"}
              </SelectTrigger>
              <SelectContent>
                {currencies.map((coin) => (
                  <SelectItem key={coin} value={coin}>
                    {coin}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              onClick={() => {
                if (!selectedCoin) {
                  alert("Please select a cryptocurrency");
                }
              }}
              className="btn-secondary w-full"
            >
              Continue
            </button>
          </div>
        ) : (
          // Once a coin is selected, show the payment details
          <PaymentDetails
            userId={user.id}
            coin={selectedCoin}
            onClose={() => {
              setSelectedCoin(null);
              setOpen(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
