// Example in /utils/notificationUtils.js (or wherever you keep these)
import { toast } from "@/hooks/use-toast";

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
  const audioStart = new Audio("/audio/newSignal.mp3");
  const audioEnd = new Audio("/audio/endSignal.mp3");

  if (payload.new.exit_price === null) {
    audioStart.play();
  } else {
    audioEnd.play();
  }
};
