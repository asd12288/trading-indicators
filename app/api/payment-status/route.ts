import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get("paymentId");
    if (!paymentId) {
      return NextResponse.json({ error: "Missing paymentId" }, { status: 400 });
    }

    const apiKey = process.env.NOWPAYMENTS_API_KEY!;
    const statusRes = await fetch(`https://api-sandbox.nowpayments.io/v1/payment/${paymentId}`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
    });
    const data = await statusRes.json();

    if (!data.payment_id) {
      return NextResponse.json({ error: "Invalid response from NowPayments", data }, { status: 500 });
    }

    // data.payment_status => "waiting", "confirming", "finished", etc.
    // Return the relevant fields
    return NextResponse.json({
      payment_id: data.payment_id,
      payment_status: data.payment_status,
      pay_address: data.pay_address,
      pay_amount: data.pay_amount,
      pay_currency: data.pay_currency,
      actually_paid: data.price_amount_received,
    });
  } catch (err: any) {
    console.error("Payment status error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
