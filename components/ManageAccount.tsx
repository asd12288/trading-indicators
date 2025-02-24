"use client";

import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { Button } from "./ui/button";
import { useClients } from "@/hooks/useClients";
import { useTranslations } from "next-intl";

const ManageAccount = ({ profile }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("ManageAccount");

  const handleCancelConfirmSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId: profile.subscription_id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel subscription");
      }
      toast({
        title: t("toast.success.title"),
        description: t("toast.success.description"),
      });
      router.refresh();
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast({
        title: t("toast.error.title"),
        description: t("toast.error.description"),
      });
    } finally {
      setIsLoading(false);
      setAlertOpen(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-lg">
      <div className="flex flex-col justify-center gap-4">
        <h3>
          {t("plan.title")} {t("plan.type")}
        </h3>
        <p>
          {t("plan.status")}{" "}
          <span className="font-medium">{profile.subscription_status}</span>
        </p>
        <p>
          {t("plan.memberSince")}{" "}
          <span className="font-medium">
            {format(new Date(profile.created_at), "dd/MM/yyyy")}
          </span>
        </p>

        {profile.scheduled_change && (
          <p>
            {t("plan.endDate")}{" "}
            <span className="font-medium">
              {format(new Date(profile.scheduled_change), "dd/MM/yyyy")}
            </span>
          </p>
        )}

        <div className="flex items-center gap-4">
          <Button
            className="bg-red-900 hover:bg-red-950"
            onClick={() => setAlertOpen(true)}
            disabled={isLoading || profile.scheduled_change}
          >
            {isLoading ? t("buttons.cancelling") : t("buttons.cancel")}
          </Button>
          <p className="text-sm font-extralight">
            {profile.scheduled_change ? t("messages.alreadyCanceled") : ""}
          </p>
        </div>
      </div>

      <ConfirmDialog
        open={alertOpen}
        onOpenChange={setAlertOpen}
        title={t("dialog.title")}
        description={t("dialog.description")}
        onConfirm={handleCancelConfirmSubscription}
      />
    </div>
  );
};

export default ManageAccount;
