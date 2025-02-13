"use client";

import { Environments, initializePaddle, Paddle } from "@paddle/paddle-js";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";

function Checkout({ user }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paddle, setPaddle] = useState<Paddle>();

  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN &&
      process.env.NEXT_PUBLIC_PADDLE_ENV
    ) {
      initializePaddle({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
        environment: process.env.NEXT_PUBLIC_PADDLE_ENV as Environments,
      }).then((paddle) => {
        if (paddle) {
          setPaddle(paddle);
        }
      });
    }
  }, []);

  paddle?.Environment.set("sandbox");

  useEffect(() => {
    const priceId = searchParams.get("priceId") as string;
    paddle?.Checkout.open({
      items: [{ priceId, quantity: 1 }],
    });

    // Redirect to the home page if no transactionId or priceId
    router.push("/");
  }, [paddle?.Checkout, searchParams]);

  return <p>Preparing checkout...</p>;
}

export default Checkout;
