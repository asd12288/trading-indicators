import { toast } from "@/hooks/use-toast";

export const notifyUser = (payload: any) => {
  toast({
    title: `New signal ${payload?.new?.instrument_name}`,
    description: `${
      payload.new.exit_price === null
        ? `A new signal has Started added, Entry Price: ${payload.new.entry_price}`
        : `A signal has been closed with Exit Price: ${payload.new.exit_price}`
    }`,
  });
};

export const soundNotification = (paylaod) => {
  const audioStart = new Audio("audio/newSignal.mp3");
  const audioEnd = new Audio("audio/endSignal.mp3");

  if (paylaod.new.exit_price === null) {
    audioStart.play();
  } else {
    audioEnd.play();
  }
};
