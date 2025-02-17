import supabaseClient from "@/database/supabase/supabase";
import { toast } from "@/hooks/use-toast";

let audioStart: HTMLAudioElement;
let audioEnd: HTMLAudioElement;

// Initialize audio only after user interaction
export const initializeAudio = () => {
  audioStart = new Audio("/audio/newSignal.mp3");
  audioEnd = new Audio("/audio/endSignal.mp3");
};

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

export const sendTelegramMessage = async (payload, userId?: string) => {
  try {
    // If no userId provided, try to get current user
    if (!userId) {
      const {
        data: { user },
        error: userError,
      } = await supabaseClient.auth.getUser();
      if (userError || !user) {
        console.error("No authenticated user found");
        return;
      }
      userId = user.id;
    }

    console.log("user", userId);
    console.log("payload", payload);

    // Fetch the user's Telegram Chat ID from Supabase
    const { data, error } = await supabaseClient
      .from("profiles")
      .select("telegram_chat_id")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return;
    }

    if (!data?.telegram_chat_id) {
      console.log("User has not connected Telegram yet");
      return;
    }

    const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    if (!TELEGRAM_BOT_TOKEN) {
      console.error("Missing Telegram bot token");
      return;
    }

    const TELEGRAM_CHAT_ID = data.telegram_chat_id; // Get user-specific chat ID

    const message = `🚀 *New Signal Alert*\n\n📌 *Instrument:* ${payload.new.instrument_name}\n💰 *Entry Price:* ${payload.new.entry_price}\n🕒 *Time:* ${payload.new.entry_time}`;

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.ok) {
      console.error("Failed to send Telegram message:", result.description);
    }
  } catch (error) {
    console.error("Error sending Telegram message:", error);
  }
};
