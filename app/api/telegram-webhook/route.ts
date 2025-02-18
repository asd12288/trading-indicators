// app/api/telegram-webhook/route.js
import { NextResponse } from "next/server";
import supabaseClient from "@/database/supabase/supabase"; 

export async function POST(request) {
  try {
    // 1. Parse the incoming Telegram update from the request body
    const update = await request.json();
    console.log("Received Telegram update:", update);

    // The "message" object contains user commands, text, etc.
    const message = update.message;
    if (!message) {
      return NextResponse.json({ status: "no_message" }, { status: 200 });
    }

    const chatId = message.chat.id;
    const text = message.text || "";

    // 2. Check if this is a "/start" command with a userId param
    // e.g., user might send "/start 12345" if they clicked t.me/YourBot?start=12345
    if (text.startsWith("/start")) {
      const parts = text.split(" ");
      const userId = parts[1]; // second token in "/start userId"

      if (!userId) {
        // no userId param
        // Possibly just reply or do nothing
        return NextResponse.json({ status: "no_user_param" }, { status: 200 });
      }

      // 3. Store the chatId in Supabase: link this Telegram chat to the user
      const { data, error } = await supabaseClient
        .from("profiles")
        .update({ telegram_chat_id: chatId })
        .eq("id", userId);

      if (error) {
        console.error("Error updating supabase:", error);
        // Optional: call sendMessage to Telegram user with an error
        return NextResponse.json({ status: "error_updating" }, { status: 200 });
      }

      // 4. Optionally send a "Connected!" message back to the user
      //    We'll use the direct Telegram API fetch
      const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
      await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "Your Telegram is now connected! You will receive notifications.",
          }),
        },
      );

      // 5. Return 200 OK to Telegram
      return NextResponse.json({ status: "ok" }, { status: 200 });
    }

    // If it's some other command or text:
    // You could handle other commands or just do nothing
    return NextResponse.json({ status: "ignored" }, { status: 200 });
  } catch (error) {
    console.error("Error handling update:", error);
    // Return a 200 so Telegram doesn't keep retrying
    return NextResponse.json({ status: "error" }, { status: 200 });
  }
}
