import { NextResponse } from "next/server";

export async function GET() {
  // In production, set LIVE_URL or similar in your environment
  const TELEGRAM_BOT_TOKEN =
    process.env.TELEGRAM_BOT_TOKEN ||
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
  // Use a production URL (ensure it’s HTTPS)
  const WEBHOOK_URL = `${process.env.LIVE_URL || process.env.DEV_URL}/api/telegram-webhook`;
  console.log("WEBHOOK_URL:", WEBHOOK_URL);

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
      },
    );

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error setting webhook:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
