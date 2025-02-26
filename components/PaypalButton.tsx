"use client";
import supabaseClient from "@/database/supabase/supabase";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/routing";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useState, useEffect } from "react";

export default function PaypalSubscribeButton({ user }) {
  const [userId, setUserId] = useState(user.id);
  const [sdkReady, setSdkReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const router = useRouter();
  const { toast } = useToast();

  // Handle PayPal SDK loading state
  useEffect(() => {
    // Function to check if the PayPal SDK is properly loaded
    const checkSdkLoaded = () => {
      if (window.paypal) {
        setSdkReady(true);
      } else if (retryCount < 3) {
        // Retry up to 3 times with increasing delays
        const timeout = setTimeout(
          () => {
            setRetryCount((prev) => prev + 1);
          },
          1000 * (retryCount + 1),
        );

        return () => clearTimeout(timeout);
      } else {
        // After 3 retries, show error
        console.error("PayPal SDK failed to load after multiple attempts");
        toast({
          title: "PayPal Error",
          description:
            "Failed to load payment system. Please refresh the page or try again later.",
          variant: "destructive",
        });
      }
    };

    checkSdkLoaded();
  }, [retryCount, toast]);

  // Error boundary for PayPal errors
  const handlePayPalError = (err) => {
    console.error("PayPal error occurred:", err);
    toast({
      title: "Payment System Error",
      description:
        "An error occurred with PayPal. Please try again or contact support.",
      variant: "destructive",
    });
  };

  return (
    <div className="p-4 bg-slate-900 rounded-lg">
      <h2 className="font-semibold text-center mb-2 text-slate-50">Payment by</h2>
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
          currency: "USD",
          intent: "subscription",
          vault: true,
          components: "buttons",
          "data-client-token": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_TOKEN, // Optional but helps
          "enable-funding": "card,venmo,credit", // Enable more payment methods
          "disable-funding": "paylater", // Disable problematic methods if needed
          "data-namespace": "paypal_sdk",
        }}
        onError={handlePayPalError}
      >
        {sdkReady ? (
          <div className="paypal-button-container">
            <PayPalButtons
              forceReRender={[userId, retryCount]} // Force re-render on retry
              style={{
                shape: "rect",
                color: "blue",
                layout: "vertical",
                label: "subscribe",
              }}
              createSubscription={(data, actions) => {
                try {
                  return fetch("/api/paypal/create-subscription", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId: userId }),
                  })
                    .then((res) => {
                      if (!res.ok)
                        throw new Error("Failed to create subscription");
                      return res.json();
                    })
                    .then((data) => {
                      if (data.error) throw new Error(data.error);
                      return data.id;
                    })
                    .catch((err) => {
                      console.error("Create subscription error:", err);
                      toast({
                        title: "Subscription Error",
                        description:
                          "Could not initialize subscription. Please try again.",
                        variant: "destructive",
                      });
                      throw err; // Re-throw to PayPal
                    });
                } catch (err) {
                  console.error("Uncaught error in createSubscription:", err);
                  return Promise.reject(err);
                }
              }}
              onApprove={async (data) => {
                try {
                  console.log("Subscription approved:", data.subscriptionID);

                  // Update user profile directly after PayPal approval
                  await supabaseClient
                    .from("profiles")
                    .update({ plan: "pro" })
                    .eq("id", userId);

                  // Force router refresh to update server components
                  router.refresh();

                  router.push("/success");
                } catch (error) {
                  console.error("Error updating profile:", error);
                  toast({
                    title: "Profile Update Error",
                    description:
                      "Your payment was successful, but we couldn't update your account. Please contact support.",
                    variant: "destructive",
                  });
                }
              }}
              onError={(err) => {
                console.error("PayPal subscription error:", err);
                toast({
                  title: "Subscription Error",
                  description:
                    "An error occurred during subscription. Please try again.",
                  variant: "destructive",
                });
              }}
              onCancel={() => {
                toast({
                  title: "Subscription Cancelled",
                  description: "You've cancelled the subscription process.",
                  variant: "default",
                });
              }}
            />
          </div>
        ) : (
          <div className="py-4 text-center">
            <div className="my-2 animate-pulse rounded-lg bg-slate-700 p-4 text-center text-slate-300">
              Loading payment options...
            </div>
          </div>
        )}
      </PayPalScriptProvider>
    </div>
  );
}
