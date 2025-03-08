"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";

const NowPaymentsButton = ({ user, plan = "monthly" }) => {
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();
  const { locale } = useParams();

  // Display different text based on plan type
  const planText =
    plan === "lifetime" ? "Pay $800 with Crypto" : "Pay $65 with Crypto";

  async function handleClick() {
    try {
      setIsLoading(true);

      // Include plan in the payload
      const res = await fetch("/api/now-payment/create-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, locale, plan }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error creating an invoice", data.message);
        return;
      }

      router.push(data.invoice_url);
    } catch (error) {
      console.error("Error creating an invoice", error);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={handleClick}
        disabled={loading}
        className="relative flex items-center gap-2 px-6 py-4"
      >
        <div className="p mr-2 flex -space-x-2">
          <div className="h-6 w-6 rounded-full p-0.5 shadow-sm">
            <Image
              src="/images/coins/btc.svg"
              alt="Bitcoin"
              width={20}
              height={20}
            />
          </div>
          <div className="h-6 w-6 rounded-full p-0.5 shadow-sm">
            <Image
              src="/images/coins/eth.svg"
              alt="Ethereum"
              width={20}
              height={20}
            />
          </div>
          <div className="h-6 w-6 rounded-full p-0.5 shadow-sm">
            <Image
              src="/images/coins/usdt.svg"
              alt="Tether"
              width={20}
              height={20}
            />
          </div>
        </div>
        {planText}
      </Button>
      {loading && <p className="animate-pulse text-sm">Processing...</p>}
      <p className="text-sm">Powered by NowPayments</p>
    </div>
  );
};

export default NowPaymentsButton;
