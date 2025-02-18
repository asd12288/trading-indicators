"use client";

import { useEffect } from "react";
import { usePaddle } from "@/utils/paddle/PaddleContaxt";

interface CheckoutProps {
  userEmail: string;
  userId: string;
}

const Checkout = ({ userEmail, userId }: CheckoutProps) => {
  const paddle = usePaddle();
  // Replace with your actual priceId or retrieve it dynamically if needed
  const priceId = "pri_01jkxw8zjnvbkr2ehd3h900z8f";

  useEffect(() => {
    if (paddle && priceId) {
      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customData: { email: userEmail, userId },
      });
    }
  }, [paddle, priceId, userEmail, userId]);

  return (
    <div className="min-h-min">
      <h1 className="text-4xl">Redirecting to Checkout...</h1>
    </div>
  );
};

export default Checkout;
