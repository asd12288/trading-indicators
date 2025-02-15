"use client";

import { Environments, initializePaddle, Paddle } from "@paddle/paddle-js";
import { useEffect, useState } from "react";

const Checkout = ({
  userEmail,
  userId,
}: {
  userEmail: string;
  userId: string;
}) => {
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
            customData: { email: userEmail, userId: userId },
          });
        }
      });
    }
  }, [paddle?.Initialize, priceId]);

  return (
    <div>
      <h1>Checkout</h1>
      <pre>{JSON.stringify(checkoutData, null, 2)}</pre>
    </div>
  );
};

export default Checkout;
