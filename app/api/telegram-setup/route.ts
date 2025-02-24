import { NextResponse } from "next/server";

export async function GET() {
  const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
  const WEBHOOK_URL = `${process.env.DEV_URL}/api/telegram-webhook`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: WEBHOOK_URL,
          allowed_updates: ['message']
        }),
      }
    );

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error setting webhook:', error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}