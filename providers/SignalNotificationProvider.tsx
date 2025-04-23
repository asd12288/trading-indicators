"use client";

import React, { createContext, useContext, useEffect } from "react";
import SoundService from "@/lib/services/soundService";
import { useUser } from "@/providers/UserProvider";
import usePreferences from "@/hooks/usePreferences";
import { toast } from "sonner";

// Notification types
export type SignalAction = "started" | "completed";

// Context type definitions
type SignalNotificationContextType = {
  notifySignal: (
    signalId: string,
    action: SignalAction,
    details?: Record<string, any>,
  ) => void;
};

// Create context
const SignalNotificationContext = createContext<SignalNotificationContextType>({
  notifySignal: () => {}, // Default no-op implementation
});

// Provider props
interface SignalNotificationProviderProps {
  children: React.ReactNode;
}

/**
 * Provider that handles signal notifications and sounds
 */
export function SignalNotificationProvider({
  children,
}: SignalNotificationProviderProps) {
  const { user } = useUser();
  const { preferences, notificationsOn, volumeOn } = usePreferences(user?.id);

  // Add some debug logs when provider initializes
  useEffect(() => {
    SoundService.initializeAudio();
  }, [user?.id, volumeOn, notificationsOn]);

  /**
   * Notify user about signal events
   * @param signalId - The ID of the signal
   * @param action - The action that occurred (started, completed)
   * @param details - Optional details about the signal
   */
  const notifySignal = (
    signalId: string,
    action: SignalAction,
    details: Record<string, any> = {},
  ) => {
    // Check if user has notification preferences for this signal
    const hasNotificationEnabled = user?.id
      ? notificationsOn.includes(signalId)
      : true;
    const hasSoundEnabled = user?.id ? volumeOn.includes(signalId) : true;

    // Determine notification content
    let title = "";
    let description = "";
    const signalPrice = details.price ? ` at ${details.price}` : "";

    if (action === "started") {
      title = `New Signal: ${signalId}`;
      description = `A new signal has started for ${signalId}${signalPrice}`;

      // Play sound if enabled for this signal
      if (hasSoundEnabled) {
        SoundService.playNewSignal();
      }
    } else if (action === "completed") {
      title = `Signal Completed: ${signalId}`;
      description = `The signal for ${signalId} has completed${signalPrice}`;

      // Play sound if enabled for this signal
      if (hasSoundEnabled) {
        console.log(
          `[SignalNotificationProvider] Playing sound for completed signal: ${signalId}`,
        );
        SoundService.playCompletedSignal();
      }
    }

    // Show toast notification if enabled
    if (hasNotificationEnabled) {
      console.log(
        `[SignalNotificationProvider] Showing toast notification: ${title}`,
      );
      toast(description);
    }
  };

  const contextValue = {
    notifySignal,
  };

  return (
    <SignalNotificationContext.Provider value={contextValue}>
      {children}
    </SignalNotificationContext.Provider>
  );
}

/**
 * Hook to use signal notifications
 */
export function useSignalNotification() {
  const context = useContext(SignalNotificationContext);

  if (!context) {
    console.error(
      "[useSignalNotification] Hook used outside of SignalNotificationProvider!",
    );
    throw new Error(
      "useSignalNotification must be used within a SignalNotificationProvider",
    );
  }

  return context;
}
