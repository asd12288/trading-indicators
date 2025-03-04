import crypto from "crypto";
import { sub } from "date-fns";
import { NextResponse } from "next/server";

export const config = {
  runtime: "node",
  api: { bodyParser: false }, // to access raw body for signature verification
};

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-nowpayments-sig");
    if (!signature) {
      return NextResponse.json({ error: "Signature missing" }, { status: 400 });
    }
    const secret = process.env.NOWPAYMENTS_IPN_SECRET!;
    const hash = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");
    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const data = JSON.parse(rawBody);
    console.log("NowPayments webhook received:", data);

    const { payment_id, payment_status, order_id } = data;
    if (payment_status === "finished" || payment_status === "confirmed") {
      // Update your subscription in the database, e.g. via Supabase.
      await activateProSubscription(order_id);
      console.log(
        `User ${order_id} upgraded to Pro. Payment ID: ${payment_id}`,
      );
    } else if (payment_status === "partially_paid") {
      console.warn(
        `Payment ${payment_id} partially paid for user ${order_id}.`,
      );
    } else if (payment_status === "expired" || payment_status === "failed") {
      console.warn(
        `Payment ${payment_id} ${payment_status} for user ${order_id}.`,
      );
    }

    return NextResponse.json({ status: "OK" });
  } catch (err: any) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Helper: Update user's subscription (example using Supabase)
async function activateProSubscription(userId: string) {
  if (!userId) return;
  const { createClient } = await import("@supabase/supabase-js");
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      plan: "pro",
      current_period_end: expiresAt.toISOString(),
      subscription_status: "ACTIVE",
    })
    .eq("id", userId);
  if (error) {
    console.error("Supabase update error:", error);
  }
}
