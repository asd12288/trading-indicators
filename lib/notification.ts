import { toast } from "@/hooks/use-toast";
import React from "react";

interface SignalPayload {
  new: {
    instrument_name: string;
    entry_price: number;
    exit_price: number | null;
  };
}

let audioStart: HTMLAudioElement | null = null;
let audioEnd: HTMLAudioElement | null = null;

// Initialize audio only after user interaction
export const initializeAudio = () => {
  if (typeof window !== "undefined") {
    audioStart = new Audio("/audio/newSignal.mp3");
    audioEnd = new Audio("/audio/endSignal.mp3");
    console.log("Audio initialized");
  }
};

export const notifyUser = (payload: SignalPayload) => {
  const isNewAlert = payload.new.exit_price === null;
  const instrumentName = payload.new.instrument_name;

  toast({
    title: `New Alert ${instrumentName}`,
    description: isNewAlert
      ? `A new Alert has started. Entry Price: ${payload.new.entry_price}`
      : `A Alert has been closed. Exit Price: ${payload.new.exit_price}`,
    variant: isNewAlert ? "green" : "default",
    // Pass the instrument name in the data object to enable navigation
    data: {
      instrumentName: instrumentName,
    },
  });
};

export const soundNotification = (payload: SignalPayload) => {
  if (!audioStart || !audioEnd) {
    console.warn("Audio not initialized. Call initializeAudio() first");
    return;
  }

  try {
    if (payload.new.exit_price === null) {
      audioStart
        .play()
        .catch((err) => console.warn("Audio playback blocked", err));
    } else {
      audioEnd
        .play()
        .catch((err) => console.warn("Audio playback blocked", err));
    }
  } catch (err) {
    console.error("Audio playback error:", err);
  }
};

// Example usage: Call initializeAudio() after user interaction
if (typeof window !== "undefined") {
  document.addEventListener("click", initializeAudio, { once: true });
}
