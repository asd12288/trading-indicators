import { toast } from "@/hooks/use-toast";

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
  toast({
    title: `New Alert ${payload?.new?.instrument_name}`,
    description: `${
      payload.new.exit_price === null
        ? `A new Alert has started. Entry Price: ${payload.new.entry_price}`
        : `A Alert has been closed. Exit Price: ${payload.new.exit_price}`
    }`,
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
