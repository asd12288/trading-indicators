"use client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { Button } from "./ui/button";
import { useClients } from "@/hooks/useClients";

const ManageAccount = ({ profile }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

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
        title: "Success",
        description: "Subscription cancelled successfully",
      });
      router.refresh();
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription, please contact support",
      });
    } finally {
      setIsLoading(false);
      setAlertOpen(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-lg">
      <div className="flex flex-col justify-center gap-4">
        <h3>My Plan: Pro</h3>
        <p>
          Plan Status:{" "}
          <span className="font-medium">{profile.subscription_status}</span>
        </p>
        <p>
          Member since:{" "}
          <span className="font-medium">
            {format(new Date(profile.created_at), "dd/MM/yyyy")}
          </span>
        </p>

        {profile.scheduled_change && (
          <p>
            End of subscription:{" "}
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
            {isLoading ? "Cancelling..." : "Cancel Plan"}
          </Button>
          <p className="text-sm font-extralight">
            {profile.scheduled_change
              ? "You have canceled your plan already"
              : ""}
          </p>
        </div>
      </div>

      <ConfirmDialog
        open={alertOpen}
        onOpenChange={setAlertOpen}
        title="Cancel Subscription"
        description="Are you sure you want to cancel your subscription?"
        onConfirm={handleCancelConfirmSubscription}
      />
    </div>
  );
};

export default ManageAccount;
