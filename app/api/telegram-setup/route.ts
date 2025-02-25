import { NextResponse } from "next/server";

export async function GET() {
  const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
  const WEBHOOK_URL = `${process.env.LIVE_URL || process.env.DEV_URL}/api/telegram-webhook`;
  console.log("GET: WEBHOOK_URL:", WEBHOOK_URL);

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: WEBHOOK_URL,
          allowed_updates: ["message"],
        }),
      }
    );

    const data = await response.json();
    console.log("GET: setWebhook response:", data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET: Error setting webhook:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
