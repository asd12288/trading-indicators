"use client";

import React, { useEffect } from "react";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useNewUserCheck } from "@/hooks/useNewUserCheck";
import { OnboardingTour } from "./OnboardingTour";

interface OnboardingWrapperProps {
  userId: string;
  children: React.ReactNode;
}

export const OnboardingWrapper: React.FC<OnboardingWrapperProps> = ({
  userId,
  children,
}) => {
  const { startTour } = useOnboarding();
  const { isNewUser, isLoading } = useNewUserCheck(userId);

  useEffect(() => {
    // Wait until we've confirmed this is a new user
    if (isLoading || !isNewUser) return;

    // Only start the tour if it hasn't been completed
    if (localStorage.getItem("onboardingCompleted") !== "true") {
      // Define the onboarding steps based on your actual UI elements
      const smartAlertsOnboardingSteps = [
        {
          targetId: "signals-header",
          title: "Smart Alerts Dashboard",
          content:
            "Welcome to Trader Map! This is where you can monitor all your trading signals and alerts.",
          position: "bottom" as const,
        },
        {
          targetId: "signal-filters",
          title: "Filter Your Alerts",
          content:
            "Use these filters to focus on specific markets or alert types.",
          position: "bottom" as const,
        },
        {
          targetId: "signal-cards",
          title: "Trading Signals",
          content:
            "These cards show active and completed trading signals with key price levels.",
          position: "right" as const,
        },
        {
          targetId: "user-settings",
          title: "Your Settings",
          content:
            "Configure your notification preferences and account details here.",
          position: "left" as const,
        },
      ];

      // Start the tour with a delay to ensure the UI has loaded
      setTimeout(() => {
        startTour(smartAlertsOnboardingSteps);
      }, 1500);
    }
  }, [isNewUser, isLoading, startTour]);

  return (
    <>
      {children}
      <OnboardingTour />
    </>
  );
};
