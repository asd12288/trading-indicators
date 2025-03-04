import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get("paymentId");
    
    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID is required" }, { status: 400 });
    }

    const apiKey = process.env.NOWPAYMENTS_API_KEY!;
    const res = await fetch(`https://api.nowpayments.io/v1/payment/${paymentId}`, {
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Error checking payment status:", errorData);
      return NextResponse.json(
        { error: "Failed to check payment status", details: errorData },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("Payment status data:", data);

    return NextResponse.json({
      payment_status: data.payment_status,
      actually_paid: data.actually_paid,
      pay_amount: data.pay_amount,
      purchase_amount: data.price_amount,
      confirmations: data.confirmations,
      payin_hash: data.payin_hash
    });
  } catch (error: any) {
    console.error("check-payment error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to check payment" },
      { status: 500 }
    );
  }
}