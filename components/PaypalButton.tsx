"use client";
import supabaseClient from "@/database/supabase/supabase";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/routing";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CircleDollarSignIcon, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden border border-slate-700 bg-slate-900/60 shadow-xl backdrop-blur-sm">
        <CardHeader className="bg-slate-800/50 pb-4">
          <div className="flex items-center gap-2">
            <CircleDollarSignIcon className="h-5 w-5 text-blue-400" />
            <CardTitle className="text-lg font-medium text-slate-50">
              PayPal Subscription
            </CardTitle>
          </div>
          <p className="text-sm text-slate-400">
            Secure monthly billing via PayPal
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <PayPalScriptProvider
            options={{
              clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
              currency: "USD",
              intent: "subscription",
              vault: true,
              components: "buttons",
              "data-client-token": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_TOKEN,
              "enable-funding": "card,venmo,credit",
              "disable-funding": "paylater",
              "data-namespace": "paypal_sdk",
            }}
            onError={handlePayPalError}
          >
            {sdkReady ? (
              <div className="paypal-button-container">
                <PayPalButtons
                  forceReRender={[userId, retryCount]}
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
                          throw err;
                        });
                    } catch (err) {
                      console.error(
                        "Uncaught error in createSubscription:",
                        err,
                      );
                      return Promise.reject(err);
                    }
                  }}
                  onApprove={async (data) => {
                    try {
                      console.log(
                        "Subscription approved:",
                        data.subscriptionID,
                      );

                      toast({
                        title: "Processing Subscription",
                        description:
                          "Please wait while we activate your account...",
                      });

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
              <div className="space-y-4">
                <div className="h-12 w-full animate-pulse rounded-lg bg-slate-800/80"></div>
                <div className="h-12 w-full animate-pulse rounded-lg bg-slate-800/60"></div>
                <p className="text-center text-sm text-slate-400">
                  Loading payment options...
                </p>
              </div>
            )}
          </PayPalScriptProvider>
        </CardContent>
      </Card>
    </motion.div>
  );
}
