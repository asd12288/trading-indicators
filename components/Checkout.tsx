"use client";

import { Environments, initializePaddle, Paddle } from "@paddle/paddle-js";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface PathParams {
  priceId: string;
  [key: string]: string | string[];
}

function Checkout({ userEmail, userId }) {
  // const { priceId } = useParams<PathParams>();
  const [paddle, setPaddle] = useState<Paddle>();
  const [checkoutData, setCheckoutData] = useState();

  const priceId = "pri_01jkxw8zjnvbkr2ehd3h900z8f";

  const handleCheckoutEvents = (event) => {
    setCheckoutData(event);
  };

  useEffect(() => {
    if (
      !paddle?.Initialize &&
      process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN &&
      (process.env.NEXT_PUBLIC_PADDLE_ENV as Environments)
    ) {
      initializePaddle({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
        environment: process.env.NEXT_PUBLIC_PADDLE_ENV as Environments,
        eventCallback: (e) => {
          if (e.data && e.name) {
            handleCheckoutEvents(e.data);
          }
        },
        checkout: {
          settings: { successUrl: "/checkout/success" },
        },
      }).then(async (paddle) => {
        if (paddle && priceId) {
          setPaddle(paddle);
          paddle.Checkout.open({
            items: [{ priceId: priceId, quantity: 1 }],
            customData: { email: userEmail, userId: userId }
          });
        }
      });
    }
  }, [paddle?.Initialize, priceId]);
}

export default Checkout;
