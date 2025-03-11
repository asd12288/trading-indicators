"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { motion } from "framer-motion";
import { CheckCircle2, Infinity, StarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";
import NowPaymentsButton from "./NowPaymentsButton";
import PaypalSubscribeButton from "./PaypalButton";
import StripeButton from "./StripeButton";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const UpgradeAccount = ({ user }) => {
  const t = useTranslations("UpgradeAccount");
  const params = useParams();
  const locale = params.locale || "en";
  // Add state for plan selection
  const [selectedPlan, setSelectedPlan] = useState("monthly");

  // Define plan-specific details
  const plans = {
    monthly: {
      price: "$65",
      period: t("plan.period"), // "per month"
      billing: t("plan.billing"), // "Billed monthly"
      features: [
        t("benefits.signals"),
        t("benefits.analysis"),
        t("benefits.telegram"),
        t("benefits.alerts"),
        t("benefits.preferences"),
      ],
    },
    lifetime: {
      price: "$800",
      period: "one-time payment",
      billing: "No recurring charges",
      features: [
        t("benefits.signals"),
        t("benefits.analysis"),
        t("benefits.telegram"),
        t("benefits.alerts"),
        t("benefits.preferences"),
        "Lifetime access - never pay again",
        "All future updates included",
      ],
    },
  };

  // Get the current plan details
  const currentPlan = plans[selectedPlan];

  // Animate the benefits list items sequentially
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        intent: "subscription",
        vault: true,
      }}
    >
      <div className="mx-auto my-auto flex h-full w-full max-w-5xl flex-col justify-center gap-8 py-4 md:flex-row md:items-start md:gap-6">
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-6">
            <h1 className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-slate-300">{t("subtitle")}</p>
          </div>

          {/* Plan selection tabs */}
          <div className="mb-6">
            <Tabs
              defaultValue="monthly"
              value={selectedPlan}
              onValueChange={setSelectedPlan}
              className="w-full"
            >
              <TabsList className="mb-6 grid w-full grid-cols-2">
                <TabsTrigger value="monthly" className="text-sm">
                  Monthly Plan
                </TabsTrigger>
                <TabsTrigger value="lifetime" className="text-sm">
                  Lifetime Access
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Card className="overflow-hidden border border-slate-700 bg-slate-900/50 shadow-lg backdrop-blur-sm">
            <div className="absolute right-4 top-4">
              <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500">
                {selectedPlan === "lifetime"
                  ? "BEST VALUE"
                  : t("plan.recommended")}
              </Badge>
            </div>

            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                {selectedPlan === "lifetime" ? (
                  <Infinity className="h-5 w-5 text-yellow-400" />
                ) : (
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                )}
                <CardTitle className="text-xl font-semibold">
                  {selectedPlan === "lifetime"
                    ? "Lifetime Access"
                    : t("plan.name")}
                </CardTitle>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-50">
                  {currentPlan.price}
                </span>
                <span className="text-sm text-slate-400">
                  {currentPlan.period}
                </span>
              </div>
              <p className="text-sm text-slate-400">{currentPlan.billing}</p>
            </CardHeader>

            <CardContent>
              <motion.ul
                className="mt-6 space-y-3"
                variants={container}
                initial="hidden"
                animate="show"
                key={selectedPlan} // Re-run animation when plan changes
              >
                {currentPlan.features.map((benefit, index) => (
                  <motion.li
                    key={index}
                    variants={item}
                    className="flex items-start gap-2 text-slate-200"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                    <span className="text-sm">{benefit}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border border-slate-700 bg-slate-800/30 p-6 shadow-lg backdrop-blur-sm">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-xl font-semibold text-slate-100">
                Payment Method
              </CardTitle>
              <p className="text-sm text-slate-300">
                {selectedPlan === "lifetime"
                  ? "Pay once, use forever - no recurring fees"
                  : "Choose your preferred payment option"}
              </p>
            </CardHeader>

            <CardContent className="p-0">
              <Tabs defaultValue="card" className="w-full">
                <TabsList className="mb-4 grid w-full grid-cols-3 bg-slate-800/40">
                  <TabsTrigger value="card">Stripe</TabsTrigger>
                  <TabsTrigger value="paypal">PayPal</TabsTrigger>
                  <TabsTrigger value="crypto">Crypto</TabsTrigger>
                </TabsList>
                <TabsContent value="card" className="mt-0">
                  <StripeButton user={user} plan={selectedPlan} />
                </TabsContent>
                <TabsContent value="paypal" className="mt-0">
                  <PaypalSubscribeButton user={user} plan={selectedPlan} />
                </TabsContent>
                <TabsContent value="crypto" className="mt-0">
                  <NowPaymentsButton user={user} plan={selectedPlan} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="mt-4 rounded-lg bg-blue-950/40 p-4 text-xs text-slate-300">
            <p>
              Need help with your subscription? Contact our support team at{" "}
              <a
                href="mailto:support@trader-map.com"
                className="text-blue-400 hover:underline"
              >
                support@trader-map.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </PayPalScriptProvider>
  );
};

export default UpgradeAccount;
