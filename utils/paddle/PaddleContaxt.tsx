// PaddleContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Environments, initializePaddle, Paddle } from "@paddle/paddle-js";

const PaddleContext = createContext();

export const usePaddle = () => useContext(PaddleContext);

export const PaddleProvider = ({ children }) => {
  const [paddle, setPaddle] = useState(null);

  useEffect(() => {
    const initPaddle = async () => {
      if (!paddle && process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN) {
        const paddleInstance = await initializePaddle({
          token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
          environment: process.env.NEXT_PUBLIC_PADDLE_ENV as Environments,
          eventCallback: (event) => {
            console.log("Paddle event:", event);
          },
          checkout: {
            settings: {
              successUrl: "/checkout/success",
              allowLogout: false,
              theme: "dark",
            },
          },
        });
        setPaddle(paddleInstance);
      }
    };

    initPaddle();
  }, [paddle]);

  return (
    <PaddleContext.Provider value={paddle}>{children}</PaddleContext.Provider>
  );
};
