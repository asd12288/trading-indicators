"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CreditCardIcon, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useParams } from "next/navigation";

// Initialize Stripe outside of component to avoid recreating the object on each render
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

// The inner component that contains the checkout form
function CheckoutForm({ user, plan }) {
  const params = useParams();
  const locale = params.locale || "en";
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, processing, redirecting, error
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const handleStripeCheckout = async () => {
    try {
      setIsLoading(true);
      setPaymentStatus("processing");

      if (!stripe || !elements) {
        throw new Error("Stripe has not been properly initialized");
      }

      // Create checkout session on the server
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          plan,
          userEmail: user.email,
          locale,
        }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        setPaymentStatus("error");
        throw new Error(error);
      }

      // Visual feedback before redirect
      toast.success("Redirecting to payment page...");

      setPaymentStatus("redirecting");

      // Brief delay for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Redirect to Stripe Checkout
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        setPaymentStatus("error");
        throw new Error(stripeError.message);
      }
    } catch (err) {
      console.error("Stripe checkout error:", err);
      setPaymentStatus("error");
      toast.error(
        "An error occurred while processing your payment. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleStripeCheckout}
      disabled={isLoading || !stripe || paymentStatus === "redirecting"}
      className={`w-full transition-all duration-300 ${
        paymentStatus === "redirecting"
          ? "bg-emerald-600 hover:bg-emerald-700"
          : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
      }`}
      size="lg"
    >
      {paymentStatus === "idle" && "Pay with Card"}
      {paymentStatus === "processing" && "Processing..."}
      {paymentStatus === "redirecting" && (
        <span className="flex items-center">
          <CheckCircle2 className="mr-2 h-4 w-4" /> Redirecting...
        </span>
      )}
      {paymentStatus === "error" && "Try Again"}
    </Button>
  );
}

// The main container component that provides the Stripe context
export default function StripeButton({ user, plan = "monthly" }) {
  // Dynamic title and description based on plan
  const planTitle =
    plan === "lifetime" ? "Lifetime Access" : "Monthly Subscription";
  const planPrice =
    plan === "lifetime" ? "$800 one-time payment" : "$65 per month";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden border border-slate-700 bg-slate-900/60 shadow-xl backdrop-blur-sm">
        <CardHeader className="bg-slate-800/50 pb-4">
          <div className="flex items-center gap-2">
            <CreditCardIcon className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-lg font-medium text-slate-50">
              Credit Card {planTitle}
            </CardTitle>
          </div>
          <p className="text-sm text-slate-400">
            {plan === "lifetime"
              ? "One-time payment for lifetime access"
              : "Secure monthly billing via Stripe"}{" "}
            ({planPrice})
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <Elements stripe={stripePromise}>
            <CheckoutForm user={user} plan={plan} />
          </Elements>
          <p className="mt-4 text-center text-xs text-slate-400">
            Secured by Stripe. We never store your card details.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
