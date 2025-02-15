"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "./ui/toast";

const ManageAccount = ({ profile }) => {
  const [isLoading, setIsLoading] = useState(false);
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
        title: "success",
        description: "Subscription cancelled successfully",
      });

      router.refresh();
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      alert("Failed to cancel subscription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    toast({
      title: "Are you sure?",
      description: "you are about to cancel your subscription",
      action: (
        <ToastAction
          onClick={handleCancelConfirmSubscription}
          altText="Confirm cancellation"
        >
          Yes
        </ToastAction>
      ),
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex flex-col justify-center gap-4">
        <h3>my Plan: Pro</h3>
        <p>
          Plan Status: <span>{profile.subscription_status}</span>
        </p>
        <p>
          Member since:{" "}
          <span>{format(new Date(profile.created_at), "dd/MM/yyyy")}</span>
        </p>

        {profile.scheduled_change && (
          <p>
            End of subscription:{" "}
            {format(new Date(profile.scheduled_change), "dd/MM/yyyy")}
          </p>
        )}

        <div className="flex gap-4">
          <Button
            className="bg-red-900 hover:bg-red-950"
            onClick={handleCancelSubscription}
            disabled={isLoading}
          >
            {isLoading ? "Cancelling..." : "Cancel Plan"}
          </Button>{" "}
        </div>
      </div>
    </div>
  );
};

export default ManageAccount;
