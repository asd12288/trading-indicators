// app/api/nowpayments-webhook/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";

// We want the raw request body to verify the signature
export const config = {
  runtime: "node",
  api: {
    bodyParser: false
  }
};

export async function POST(request) {
  try {
    // 1. Read raw body for signature verification
    const rawBody = await request.text();

    // 2. Verify signature
    const signature = request.headers.get("x-nowpayments-sig");
    if (!signature) {
      return NextResponse.json({ error: "Signature missing" }, { status: 400 });
    }
    const secret = process.env.NOWPAYMENTS_IPN_SECRET;
    const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 3. Parse JSON
    const data = JSON.parse(rawBody);
    console.log("NowPayments webhook received:", data);

    // 4. Check payment status
    const { payment_id, payment_status, order_id } = data;

    if (payment_status === "finished" || payment_status === "confirmed") {
      // Payment is fully confirmed
      await activateProSubscription(order_id);
      console.log(`User ${order_id} upgraded to Pro for 30 days. Payment ID: ${payment_id}`);
    } else if (payment_status === "partially_paid") {
      console.warn(`Payment ${payment_id} partially paid. Not upgrading user ${order_id}.`);
    } else if (payment_status === "expired" || payment_status === "failed") {
      console.warn(`Payment ${payment_id} ${payment_status}. Not upgrading user ${order_id}.`);
    }

    return NextResponse.json({ status: "OK" });
  } catch (err) {
    console.error("NowPayments webhook error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 5. Helper function to update user in Supabase
async function activateProSubscription(userId) {
  if (!userId) return;
  
  // Lazy-import supabase so it doesn't slow down route import
  const { createClient } = await import("@supabase/supabase-js");
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Add 30 days
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      plan: "pro",
      current_period_end: expiresAt.toISOString()
    })
    .eq("id", userId);

  if (error) {
    console.error("Supabase update error:", error);
  }
}
