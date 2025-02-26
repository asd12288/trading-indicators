// app/api/paypal/create-subscription/route.js
import { NextResponse } from "next/server";
import { createSubscription } from "@/lib/paypal";
import supabaseClient from "@/database/supabase/supabase";

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    // 3. Create PayPal subscription via PayPal API
    const planId = process.env.PAYPAL_PLAN_ID;

    const paypalResponse = await createSubscription(planId, null, userId);
    const subscriptionId = paypalResponse.id; // PayPal subscription ID (e.g., "I-ABC123XYZ")

    // 4. Store subscription initial record in Supabase
    await supabaseClient.from("subscriptions").insert({
      id: subscriptionId,
      user_id: userId,
      plan_id: planId,
      status: paypalResponse.status || "APPROVAL_PENDING", // PayPal might return 'APPROVAL_PENDING'
      start_time: paypalResponse.start_time || new Date().toISOString(),
    });

    // 5. Return the subscription ID to the client
    return NextResponse.json({ id: subscriptionId });
  } catch (err) {
    console.error("Create Subscription error:", err);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 },
    );
  }
}
