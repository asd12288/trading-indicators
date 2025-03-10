"use client";

import React, { createContext, useState, useEffect, useCallback } from "react";

type Step = {
  targetId: string;
  title: string;
  content: string;
  position: "top" | "right" | "bottom" | "left";
};

type OnboardingContextType = {
  isActive: boolean;
  currentStep: number;
  steps: Step[];
  startTour: (steps: Step[]) => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
};

export const OnboardingContext = createContext<OnboardingContextType>({
  isActive: false,
  currentStep: 0,
  steps: [],
  startTour: () => {},
  endTour: () => {},
  nextStep: () => {},
  prevStep: () => {},
  skipTour: () => {},
});

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Check if user has completed the tour before
  useEffect(() => {
    const hasCompletedTour = localStorage.getItem("onboardingCompleted");
    if (hasCompletedTour !== "true") {
      // Don't auto-start here, we'll trigger it from the registration completion
    }
  }, []);

  const startTour = useCallback((tourSteps: Step[]) => {
    setSteps(tourSteps);
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const endTour = useCallback(() => {
    setIsActive(false);
    localStorage.setItem("onboardingCompleted", "true");
  }, []);

  const skipTour = useCallback(() => {
    endTour();
  }, [endTour]);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      endTour();
    }
  }, [currentStep, steps.length, endTour]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  return (
    <OnboardingContext.Provider
      value={{
        isActive,
        currentStep,
        steps,
        startTour,
        endTour,
        nextStep,
        prevStep,
        skipTour,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
