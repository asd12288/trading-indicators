// app/api/create-crypto-payment/route.js
import { NextResponse } from "next/server";
import fetch from "node-fetch";

export async function POST(request) {
  const { userId } = await request.json();
  const apiKey = process.env.NOWPAYMENTS_API_KEY!;
  const paymentRequest = {
    price_amount: 25.0, // Price in USD
    price_currency: "usd",
    pay_currency: "btc", // Change based on user selection (e.g., "btc" or "eth")
    ipn_callback_url: `${process.env.DEV_URL}/api/nowpayments-webhook`,
    order_id: userId,
    order_description: "Trading Signals Subscription - 1 Month",
  };

  const response = await fetch("https://api.nowpayments.io/v1/payment", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentRequest),
  });
  const data = await response.json();

  if (data.payment_url) {
    return NextResponse.json({ paymentUrl: data.payment_url });
  } else {
    return NextResponse.json({ error: data }, { status: 500 });
  }
}
