import React, { useEffect } from "react";
import { useOnboarding } from "@/hooks/useOnboarding";
import { OnboardingTour } from "../onboarding/OnboardingTour";

interface DashboardLayoutProps {
  children: React.ReactNode;
  isNewUser?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  isNewUser = false,
}) => {
  const { startTour } = useOnboarding();

  useEffect(() => {
    // Check if this is a new user and if they haven't completed the tour
    if (isNewUser && localStorage.getItem("onboardingCompleted") !== "true") {
      // Define the onboarding steps - these IDs must match actual elements in your UI
      const dashboardOnboardingSteps = [
        {
          targetId: "dashboard-overview",
          title: "Dashboard Overview",
          content:
            "This is your central hub for monitoring all your trading activities and alerts.",
          position: "bottom" as const,
        },
        {
          targetId: "market-indicators",
          title: "Market Indicators",
          content:
            "Track key market indicators across multiple instruments in real-time.",
          position: "right" as const,
        },
        {
          targetId: "alerts-panel",
          title: "Smart Alerts",
          content:
            "Set up customizable alerts that notify you when market conditions match your criteria.",
          position: "left" as const,
        },
        {
          targetId: "user-settings",
          title: "Personalize Your Experience",
          content:
            "Configure your notification preferences, display settings, and account information here.",
          position: "top" as const,
        },
        {
          targetId: "help-center",
          title: "Need Help?",
          content:
            "Access tutorials, FAQs, and customer support from this section any time.",
          position: "bottom" as const,
        },
      ];

      // Start the tour with a slight delay to ensure the UI has loaded
      setTimeout(() => {
        startTour(dashboardOnboardingSteps);
      }, 1000);
    }
  }, [isNewUser, startTour]);

  return (
    <>
      {children}
      <OnboardingTour />
    </>
  );
};
