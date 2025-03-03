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
import { toast } from "@/hooks/use-toast";

export default function CryptoPaymentModal({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);

  const currencies = ["usdttrc20", "usdc", "btc", "eth", "tusdtrc20"];

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
              <SelectContent className="bg-slate-800">
                {currencies.map((coin) => (
                  <SelectItem
                    key={coin}
                    value={coin}
                    className="cursor-pointer hover:bg-slate-700"
                  >
                    {coin}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              onClick={() => {
                if (!selectedCoin) {
                  toast({
                    title: "Error",
                    description: "Please select a currency",
                  });
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
