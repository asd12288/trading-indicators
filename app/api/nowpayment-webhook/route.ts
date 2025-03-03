// app/api/nowpayments-webhook/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";

// Disable body parsing to access raw body
export const config = {
  runtime: "node",
  api: { bodyParser: false },
};

export async function POST(request) {
  // Read raw request body
  const rawBody = await request.text();

  // Verify signature from NowPayments using the header 'x-nowpayments-sig'
  const signature = request.headers.get("x-nowpayments-sig");
  if (!signature) {
    return NextResponse.json({ error: "Signature missing" }, { status: 400 });
  }
  const secret = process.env.NOWPAYMENTS_IPN_SECRET;
  const hash = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");
  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Parse the JSON body now that we’ve verified the signature
  let data;
  try {
    data = JSON.parse(rawBody);
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  console.log("NowPayments IPN received:", data);

  // Extract necessary fields (adjust based on one-time vs recurring)
  const { payment_id, payment_status, order_id } = data;

  // Example: if finished, update user subscription in Supabase
  if (payment_status === "finished" || payment_status === "confirmed") {
    // Call your function to update the user’s subscription using order_id
    await activateUserSubscription(order_id);
    console.log(`User ${order_id} activated due to payment ${payment_id}`);
  } else if (payment_status === "partially_paid") {
    console.warn(`Payment ${payment_id} partially paid.`);
  } else if (payment_status === "expired" || payment_status === "failed") {
    console.warn(`Payment ${payment_id} ${payment_status}.`);
  }

  return NextResponse.json({ status: "OK" });
}

// Example Supabase update function (you can adjust based on your DB structure)
async function activateUserSubscription(userId: string) {
  // Import your Supabase client configured for server side (e.g. from /lib/supabase)
  const { createClient } = await import("@supabase/supabase-js");
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      plan: "pro",
      subscription_status: "active",
      current_period_end: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    })
    .eq("id", userId);
  if (error) console.error("Supabase update error:", error);
}
