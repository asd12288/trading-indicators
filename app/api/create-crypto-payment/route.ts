// app/api/create-crypto-payment/route.js
import { NextResponse } from "next/server";
import fetch from "node-fetch";

export async function POST(request) {
  try {
    const { userId } = await request.json(); // from client request
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const apiKey = process.env.NOWPAYMENTS_API_KEY!;
    
    // This request body triggers a "hosted checkout" (standard flow) so user gets a payment_url
    const paymentRequest = {
      price_amount: 25.0,                 // the subscription cost in USD
      price_currency: "usd",             // your base currency
      // Omit pay_currency or set "flow": "standard" so we get a hosted payment_url
      flow: "standard",
      order_id: userId,                  // track user in the webhook
      order_description: "Trading Signals - 1 Month Pro",
      ipn_callback_url: `${process.env.DEV_URL}/api/nowpayments-webhook`,
      success_url: `${process.env.DEV_URL}/success`,
      cancel_url: `${process.env.DEV_URL}/payment-cancel`
    };

    const response = await fetch("https://api.nowpayments.io/v1/payment", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(paymentRequest)
    });

    const data = await response.json();

    // NowPayments should return a payment_url in "standard" flow
    if (data && data.payment_url) {
      return NextResponse.json({ paymentUrl: data.payment_url });
    } else {
      console.error("NowPayments API error:", data);
      return NextResponse.json({ error: data }, { status: 500 });
    }
  } catch (err) {
    console.error("create-crypto-payment error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
