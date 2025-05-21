import { NextResponse } from "next/server";
import Stripe from "stripe";
import supabaseClient from "@/database/supabase/client";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required user ID" },
        { status: 400 },
      );
    }

    // Get the active Stripe subscription for this user
    const { data: subscriptionData, error: subscriptionError } =
      await supabaseClient
        .from("stripe_customers")
        .select("subscription_id")
        .eq("user_id", userId)
        .single();

    const id = subscriptionData?.subscription_id;

    console.log(id);

    if (subscriptionError || !subscriptionData?.subscription_id) {
      return NextResponse.json(
        { error: "Active Stripe subscription not found" },
        { status: 404 },
      );
    }

    // Cancel the subscription in Stripe (at period end)
    const subscription = await stripe.subscriptions.update(id, {
      cancel_at_period_end: true,
    });

    console.log(subscription);

    // Update profile status
    await supabaseClient
      .from("profiles")
      .update({ subscription_status: "CANCELLED" })
      .eq("id", userId);

    return NextResponse.json({
      message:
        "Stripe subscription scheduled for cancellation at end of billing period",
      cancelDate: subscription.cancel_at,
    });
  } catch (error) {
    console.error("Stripe subscription cancellation error:", error);
    return NextResponse.json(
      { error: "Failed to cancel Stripe subscription" },
      { status: 500 },
    );
  }
}
