"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const ManageAccount = ({ profile }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) return;

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

      alert("Subscription cancelled successfully");
      router.refresh();
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      alert("Failed to cancel subscription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col gap-4">
        <h3>my Plan: Pro</h3>
        <p>
          Plan details: <span></span>
        </p>

        <div className="flex gap-4">
          <Button className="bg-green-700 hover:bg-green-800">
            Change Plan
          </Button>
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
