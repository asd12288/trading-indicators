import { toast } from "@/hooks/use-toast";

const audioStart = new Audio("/audio/newSignal.mp3");
const audioEnd = new Audio("/audio/endSignal.mp3");

export const notifyUser = (payload) => {
  toast({
    title: `New signal ${payload?.new?.instrument_name}`,
    description: `${
      payload.new.exit_price === null
        ? `A new signal has started. Entry Price: ${payload.new.entry_price}`
        : `A signal has been closed. Exit Price: ${payload.new.exit_price}`
    }`,
  });
};

export const soundNotification = (payload) => {
  if (!audioStart || !audioEnd) {
    console.warn("Audio not initialized. Call initializeAudio() first");
    return;
  }

  try {
    if (payload.new.exit_price === null) {
      audioStart.play();
    } else {
      audioEnd.play();
    }
  } catch (err) {
    console.error("Audio playback error:", err);
  }
};

// telegram is sent on the server ... so we don't need to do anything here
