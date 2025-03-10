"use client";

import React, { useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import { OnboardingContext } from "./OnboardingProvider";
import { Tooltip } from "./Tooltip";

export const OnboardingTour: React.FC = () => {
  const {
    isActive,
    steps,
    currentStep,
    nextStep,
    prevStep,
    endTour,
    skipTour,
  } = useContext(OnboardingContext);

  // Add an overlay behind the tooltips
  useEffect(() => {
    if (isActive) {
      const overlay = document.createElement("div");
      overlay.id = "onboarding-overlay";
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      overlay.style.zIndex = "999";
      overlay.style.pointerEvents = "none";
      document.body.appendChild(overlay);

      return () => {
        document.body.removeChild(overlay);
      };
    }
  }, [isActive]);

  if (!isActive || steps.length === 0) {
    return null;
  }

  const currentTooltip = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  return createPortal(
    <Tooltip
      targetId={currentTooltip.targetId}
      title={currentTooltip.title}
      content={currentTooltip.content}
      position={currentTooltip.position}
      onClose={skipTour}
      onNext={nextStep}
      onPrev={prevStep}
      isFirst={isFirst}
      isLast={isLast}
    />,
    document.body,
  );
};
