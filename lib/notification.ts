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

// export const sendTelegramMessage = async (payload) => {
//   try {
//     // Fetch all users
//     const { data: users, error: usersError } = await supabaseClient
//       .from("profiles")
//       .select("id, telegram_chat_id, preferences");

//     if (usersError) {
//       console.error("Error fetching users:", usersError);
//       return;
//     }

//     if (!users || users.length === 0) {
//       console.log("No users found");
//       return;
//     }

//     const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
//     if (!TELEGRAM_BOT_TOKEN) {
//       console.error("Missing Telegram bot token");
//       return;
//     }

//     const instrumentName = payload.new.instrument_name;
//     const message = `🚀 *New Signal Alert*\n\n📌 *Instrument:* ${instrumentName}\n💰 *Entry Price:* ${payload.new.entry_price}\n🕒 *Time:* ${payload.new.entry_time}`;

//     // Iterate through the list of users and send the Telegram message to each user who has enabled notifications for the instrument
//     for (const user of users) {
//       const preferences = user.preferences || {};
//       const instrumentPreferences = preferences[instrumentName];

//       if (!instrumentPreferences || !instrumentPreferences.notifications) {
//         console.log(
//           `User ${user.id} has not enabled notifications for ${instrumentName}`,
//         );
//         continue;
//       }

//       if (!user.telegram_chat_id) {
//         console.log(`User ${user.id} has not connected Telegram`);
//         continue;
//       }

//       const response = await fetch(
//         `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
//           },
//           body: JSON.stringify({
//             chat_id: user.telegram_chat_id,
//             text: message,
//             parse_mode: "Markdown",
//           }),
//         },
//       );

//       if (!response.ok) {
//         console.error(
//           `Failed to send Telegram message to user ${user.id}:`,
//           response.statusText,
//         );
//       } else {
//         const result = await response.json();
//         if (!result.ok) {
//           console.error(
//             `Failed to send Telegram message to user ${user.id}:`,
//             result.description,
//           );
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Error sending Telegram message:", error);
//   }
// };
