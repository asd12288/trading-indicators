// app/api/paypal/create-subscription/route.js
import { NextResponse } from "next/server";
import { createSubscription } from "@/lib/paypal";
import supabaseClient from "@/database/supabase/supabase";

export async function POST(req) {
  try {
    // Expect both userId and plan in the request payload
    const { userId, plan } = await req.json();
    if (!userId || !plan) {
      return NextResponse.json(
        { error: "Missing user ID or plan" },
        { status: 400 },
      );
    }

    // Validate that we have the required environment variables
    const monthlyPlanId = process.env.PAYPAL_MONTHLY_PLAN_ID;
    const lifetimePlanId = process.env.PAYPAL_LIFETIME_PLAN_ID;

    if (!monthlyPlanId || !lifetimePlanId) {
      console.error("Missing PayPal plan IDs in environment variables:", {
        monthlyPlanId,
        lifetimePlanId,
      });
      return NextResponse.json(
        { error: "PayPal configuration error. Please contact support." },
        { status: 500 },
      );
    }

    // Choose the appropriate PayPal Plan ID based on the plan type
    const planId = plan === "lifetime" ? lifetimePlanId : monthlyPlanId;

    console.log(
      `Creating PayPal subscription: User ${userId}, Plan ${plan}, PayPal Plan ID ${planId}`,
    );

    try {
      const paypalResponse = await createSubscription(planId, null, userId);
      const subscriptionId = paypalResponse.id;

      console.log(
        `PayPal subscription created successfully: ${subscriptionId}`,
      );

      // Store the subscription record in Supabase
      await supabaseClient.from("subscriptions").insert({
        id: subscriptionId,
        user_id: userId,
        plan_id: planId,
        plan,
        status: paypalResponse.status || "APPROVAL_PENDING",
        start_time: paypalResponse.start_time || new Date().toISOString(),
        payment_provider: "paypal",
      });

      return NextResponse.json({ id: subscriptionId });
    } catch (paypalError) {
      console.error("PayPal API error:", paypalError.message);
      return NextResponse.json(
        {
          error: "PayPal subscription creation failed",
          details: paypalError.message,
        },
        { status: 500 },
      );
    }
  } catch (err) {
    console.error("Create Subscription error:", err);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 },
    );
  }
}
