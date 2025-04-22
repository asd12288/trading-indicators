import { toast } from "@/hooks/use-toast";
import React from "react";

interface SignalPayload {
  new: {
    instrument_name: string;
    entry_price: number;
    exit_price: number | null;
  };
}

// Notification functionality removed as requested

export const initializeAudio = () => {
  // Audio initialization removed
};

export const notifyUser = () => {
  // Notification function disabled
};

export const soundNotification = () => {
  // Sound notification disabled
};

// Any event listeners are also removed
if (typeof window !== "undefined") {
  // Removed document event listener
}
