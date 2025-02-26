"use client";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

export default function PaypalSubscribeButton({ onSubscribed }) {
  const [token, setToken] = useState(null);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Get auth token on mount
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setToken(data.session.access_token);
      }
    };
    getSession();
  }, []);

  return (
    <PayPalScriptProvider
      options={{
        "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
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
          if (!token) {
            console.error("No auth token available");
            return Promise.reject(new Error("Authentication required"));
          }

          return fetch("/api/paypal/create-subscription", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
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
