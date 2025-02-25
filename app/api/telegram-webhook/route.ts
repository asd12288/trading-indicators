import { NextResponse } from "next/server";
import supabaseClient from "@/database/supabase/supabase";

export async function POST(request: Request) {
  const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;

  if (!TELEGRAM_BOT_TOKEN) {
    console.error("POST: TELEGRAM_BOT_TOKEN is not set");
    return NextResponse.json({ error: "Configuration error" }, { status: 500 });
  }

  try {
    const update = await request.json();
    console.log("POST: Webhook received update:", JSON.stringify(update, null, 2));

    const message = update.message;
    if (!message) {
      console.log("POST: No message in update");
      return NextResponse.json({ status: "no_message" }, { status: 200 });
    }

    const chatId = message.chat.id;
    const text = message.text || "";
    console.log(`POST: Received message: "${text}" from chat ID: ${chatId}`);

    if (text.startsWith("/start")) {
      const userId = text.split(" ")[1];
      if (!userId) {
        console.log("POST: No user ID provided with /start command");
        await sendTelegramMessage(chatId, "Error: No user ID provided", TELEGRAM_BOT_TOKEN);
        return NextResponse.json({ status: "no_user_id" }, { status: 200 });
      }

      console.log(`POST: Linking chat ID ${chatId} to user ID ${userId}`);
      const { error: dbError } = await supabaseClient
        .from("profiles")
        .update({ telegram_chat_id: chatId.toString() })
        .eq("id", userId);

      if (dbError) {
        console.error("POST: Database error:", dbError);
        await sendTelegramMessage(chatId, "Error connecting account. Please try again.", TELEGRAM_BOT_TOKEN);
        return NextResponse.json({ error: dbError }, { status: 200 });
      }

      await sendTelegramMessage(
        chatId,
        "Successfully connected! You will now receive trading signals.",
        TELEGRAM_BOT_TOKEN
      );

      return NextResponse.json({ status: "success" }, { status: 200 });
    }

    console.log("POST: Command not handled");
    return NextResponse.json({ status: "command_not_handled" }, { status: 200 });
  } catch (error) {
    console.error("POST: Webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 200 });
  }
}

async function sendTelegramMessage(chatId: number, text: string, token: string) {
  try {
    console.log(`sendTelegramMessage: Sending message to chat ID ${chatId} with text: "${text}"`);
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch (error) {
    console.error("sendTelegramMessage: Error sending Telegram message:", error);
  }
}
