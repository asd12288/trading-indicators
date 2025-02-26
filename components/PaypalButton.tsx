// components/PaypalSubscribeButton.js
"use client";
import { PayPalButtons } from "@paypal/react-paypal-js";

export default function PaypalSubscribeButton({ onSubscribed }) {
  // You could fetch the planId from props or use a constant from env
  const planId = process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID;  // if you expose it, or pass as prop
  // Alternatively, for security, not expose planId and call server to create subscription (which uses secret Plan ID)

  return (
    <PayPalButtons
      style={{ shape: "rect", color: "blue", layout: "vertical", label: "subscribe" }}
      // 1. Create Subscription on click
      createSubscription={(data, actions) => {
        // Option A: Use PayPal JS SDK to create subscription directly
        return actions.subscription.create({
          plan_id: planId
        });
        /* 
        // Option B: Create subscription via our API route for more control
        return fetch("/api/paypal/create-subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // include auth token if required
            "Authorization": `Bearer ${localStorage.getItem("supabaseToken")}` 
          }
        })
        .then(res => res.json())
        .then(data => {
          if (data.error) throw new Error(data.error);
          return data.id; // return the subscription ID to PayPal SDK
        });
        */
      }}

      // 2. On Approve callback – the subscription is approved by the user
      onApprove={(data, actions) => {
        // data.subscriptionID contains the new subscription ID
        console.log("Subscription approved: ", data.subscriptionID);
        // You might call your backend to confirm or update UI immediately:
        if (onSubscribed) {
          onSubscribed(data.subscriptionID);
        }
        // (The webhook will also capture the activation on the backend)
      }}

      // 3. Error handling (optional)
      onError={(err) => {
        console.error("PayPal subscription error: ", err);
        alert("An error occurred during subscription. Please try again.");
      }}
    />
  );
}
