"use client";
import supabaseClient from "@/database/supabase/supabase";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useState, useEffect } from "react";

export default function PaypalSubscribeButton({ onSubscribed, user }) {
  const [userId, setUserId] = useState(user.id);

  console.log(userId);

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency: "USD",
        intent: "subscription", // Critical for subscriptions
        vault: true,
      }}
    >
      <PayPalButtons
        style={{
          shape: "rect",
          color: "blue",
          layout: "vertical",
          label: "subscribe",
        }}
        createSubscription={(data, actions) => {
          // Option B: Create subscription via API (More secure, use this)

          return fetch("/api/paypal/create-subscription", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: userId }),
          })
            .then((res) => {
              if (!res.ok) throw new Error("Failed to create subscription");
              return res.json();
            })
            .then((data) => {
              if (data.error) throw new Error(data.error);
              return data.id; // Return subscription ID to PayPal SDK
            });
        }}
        onApprove={(data) => {
          console.log("Subscription approved:", data.subscriptionID);
          if (onSubscribed) {
            onSubscribed(data.subscriptionID);
          }
        }}
        onError={(err) => {
          console.error("PayPal subscription error:", err);
          alert("An error occurred during subscription. Please try again.");
        }}
      />
    </PayPalScriptProvider>
  );
}
