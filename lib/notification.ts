// Example in /utils/notificationUtils.js (or wherever you keep these)
import supabaseClient from "@/database/supabase/supabase";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

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

export const sendTelegramMessage = async (payload, userId) => {
  try {
    // Fetch the user's Telegram Chat ID from Supabase
    const { data, error } = await supabaseClient
      .from("profiles")
      .select("telegram_chat_id")
      .eq("id", userId)
      .single();

    if (error || !data?.telegram_chat_id) {
      console.error("User has not connected Telegram.");
      return;
    }

    const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = data.telegram_chat_id; // Get user-specific chat ID

    const message = `🚀 *New Signal Alert*\n\n📌 *Instrument:* ${payload.new.instrument_name}\n💰 *Entry Price:* ${payload.new.entry_price}\n🕒 *Time:* ${payload.new.entry_time}`;

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      },
    );

    const result = await response.json();
    if (!result.ok) {
      console.error("Failed to send Telegram message:", result.description);
    }
  } catch (error) {
    console.error("Error sending Telegram message:", error);
  }
};
