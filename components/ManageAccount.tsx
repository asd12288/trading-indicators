"use client";

import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";
import SignalToolTooltip from "./SignalCard/SignalToolTooltip";
import { CalendarIcon, CreditCardIcon, AlertTriangleIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

const ManageAccount = ({ profile }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations("ManageAccount");

  // Status styling helper
  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return "bg-green-600 hover:bg-green-700";
      case "CANCELLED":
        return "bg-amber-600 hover:bg-amber-700";
      case "SUSPENDED":
        return "bg-red-600 hover:bg-red-700";
      default:
        return "bg-slate-600 hover:bg-slate-700";
    }
  };

  const handleCancelConfirmSubscription = async () => {
    setIsLoading(true);
    try {
      // Determine which endpoint to call based on payment method
      const endpoint =
        profile.payment_method === "Credit Card (Stripe)"
          ? "/api/stripe/cancel-sub"
          : "/api/paypal/cancel-subscription";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: profile.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to cancel subscription");
      }

      toast({
        title: t("toast.success.title"),
        description: t("toast.success.description"),
        data: { instrumentName: null }, // Prevent navigation when clicking this toast
      });
      router.refresh();
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast({
        title: t("toast.error.title"),
        description: error.message || t("toast.error.description"),
        data: { instrumentName: null }, // Prevent navigation when clicking this toast
      });
    } finally {
      setIsLoading(false);
      setAlertOpen(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto w-full max-w-md"
    >
      <Card className="border border-slate-700 bg-slate-900/50 shadow-lg backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-50">
              {t("plan.title")} {profile.plan || t("plan.type")}
            </CardTitle>
            <Badge className={getStatusStyle(profile.subscription_status)}>
              {profile.subscription_status || "Unknown"}
            </Badge>
          </div>
          <p className="flex items-center gap-1 text-sm text-slate-400">
            <CalendarIcon size={14} />
            {t("plan.memberSince")}{" "}
            <span className="ml-1 font-medium">
              {format(new Date(profile.created_at), "dd/MM/yyyy")}
            </span>
          </p>
        </CardHeader>

        <CardContent className="space-y-4 p-8 pt-2">
          <div className="space-y-2 rounded-md bg-slate-800/50 p-8">
            <h4 className="text-sm font-medium text-slate-300">
              Subscription Details
            </h4>

            <div className="flex items-center justify-between gap-10">
              <p className="text-sm text-slate-400">Payment Method</p>
              <div className="flex items-center gap-1">
                <span className="font-medium text-slate-100">
                  {profile.payment_method || "Not specified"}
                </span>
              </div>
            </div>

            {profile.payment_method === "crypto" && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">Expires:</p>
                <div className="flex items-center gap-1">
                  <CalendarIcon size={14} className="text-slate-100" />
                  <span className="font-medium text-slate-100">
                    {format(profile.subscription_expires_at, "dd/MM/yyyy")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 pt-1">
          <div className="flex w-full items-center gap-3">
            <SignalToolTooltip text="Canceling the plan is for PayPal and Stripe subscription only. Your subscription will be cancelled at the end of the billing period.">
              <div className="w-full">
                <Button
                  className="w-full bg-red-900 transition-colors hover:bg-red-800"
                  onClick={() => setAlertOpen(true)}
                  disabled={
                    isLoading || profile.subscription_status === "CANCELLED"
                  }
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                      {t("buttons.cancelling")}
                    </span>
                  ) : profile.subscription_status === "CANCELLED" ? (
                    t("buttons.cancelPending")
                  ) : (
                    t("buttons.cancel")
                  )}
                </Button>
              </div>
            </SignalToolTooltip>
          </div>

          {profile.subscription_status === "CANCELLED" && (
            <div className="flex items-center gap-2 text-sm text-amber-400">
              <AlertTriangleIcon size={16} />
              <p>{t("messages.alreadyCanceled")}</p>
            </div>
          )}
        </CardFooter>
      </Card>

      <ConfirmDialog
        open={alertOpen}
        onOpenChange={setAlertOpen}
        title={t("dialog.title")}
        description={t("dialog.description")}
        onConfirm={handleCancelConfirmSubscription}
      />
    </motion.div>
  );
};

export default ManageAccount;
