import { useContext } from "react";
import { OnboardingContext } from "../components/onboarding/OnboardingProvider";

export const useOnboarding = () => {
  return useContext(OnboardingContext);
};
