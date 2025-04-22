"use client";

import { SignalProvider as CoreSignalProvider } from "@/context/signal-context";
import { useUser } from "@/providers/UserProvider";
import usePreferences from "@/hooks/usePreferences";
import { ReactNode } from "react";

interface SignalProviderProps {
  children: ReactNode;
  allSignals?: boolean;
}

export function SignalProvider({ children, allSignals = false }: SignalProviderProps) {
  const { user } = useUser();
  const { preferences } = usePreferences(user?.id);

  return (
    <CoreSignalProvider 
      preferences={preferences}
      allSignals={allSignals}
      userId={user?.id}
    >
      {children}
    </CoreSignalProvider>
  );
}