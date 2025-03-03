import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId, coin } = await request.json();
    if (!userId || !coin) {
      return NextResponse.json({ error: "Missing userId or coin" }, { status: 400 });
    }

    const apiKey = process.env.NOWPAYMENTS_API_KEY!;
    const paymentRequest = {
      price_amount: 25.0,            // Subscription cost in USD
      price_currency: "usd",
      pay_currency: coin,            // e.g. "btc", "usdttrc20", etc.
      order_id: userId,              // Use the user ID for correlation
      order_description: "Trading Signals - 1 Month Pro",
      ipn_callback_url: `${process.env.DEV_URL}/api/webhook`
    };

    const res = await fetch("https://api.nowpayments.io/v1/payment", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(paymentRequest)
    });

    // Handle 429 Too Many Requests explicitly.
    if (res.status === 429) {
      const retryAfter = res.headers.get("Retry-After") || "a few seconds";
      console.error("Rate limit exceeded. Retry after:", retryAfter);
      return NextResponse.json(
        { error: `Rate limit exceeded. Please try again after ${retryAfter}.` },
        { status: 429 }
      );
    }

    // Get raw response text for debugging.
    const rawText = await res.text();
    console.log("NowPayments raw response:", rawText);

    // Attempt to parse the JSON.
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (error) {
      console.error("JSON parse error:", error);
      return NextResponse.json(
        { error: "Invalid JSON response from NowPayments", raw: rawText },
        { status: 500 }
      );
    }

    // Check for direct deposit response.
    if (data && data.pay_address) {
      return NextResponse.json({
        success: true,
        paymentData: {
          address: data.pay_address,
          amount: data.pay_amount,
          currency: data.pay_currency,
          paymentId: data.payment_id,
          expiresAt: data.expiration_estimate_date
        }
      });
    } else if (data && data.payment_url) {
      // Fallback for hosted checkout.
      return NextResponse.json({ paymentUrl: data.payment_url });
    } else {
      console.error("NowPayments API error:", data);
      return NextResponse.json({ error: data }, { status: 500 });
    }
  } catch (err: any) {
    console.error("create-payment error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
