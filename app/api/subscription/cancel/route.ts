import { NextResponse } from "next/server";
import Stripe from "stripe";
import supabaseClient from "@/database/supabase/supabase";

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
        { status: 400 }
      );
    }

    // Get the user profile to determine payment method
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    const paymentMethod = profile.payment_method?.toLowerCase() || '';

    // Handle based on payment method
    if (paymentMethod === "paypal") {
      // Forward to PayPal service
      const paypalResponse = await fetch(
        `${process.env.DEV_URL}/api/paypal/cancel-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!paypalResponse.ok) {
        const errorData = await paypalResponse.json();
        return NextResponse.json(
          { error: errorData.error || "Failed to cancel PayPal subscription" },
          { status: paypalResponse.status }
        );
      }

      const responseData = await paypalResponse.json();
      return NextResponse.json(responseData);
    } else if (paymentMethod === "stripe") {
      // Handle Stripe subscription cancellation
      const { data: subscriptionData, error: subscriptionError } = await supabaseClient
        .from("subscriptions")
        .select("subscription_id")
        .eq("user_id", userId)
        .eq("provider", "stripe")
        .eq("status", "ACTIVE")
        .single();

      if (subscriptionError || !subscriptionData?.subscription_id) {
        return NextResponse.json(
          { error: "Active Stripe subscription not found" },
          { status: 404 }
        );
      }

      // Cancel the subscription in Stripe
      const subscription = await stripe.subscriptions.update(
        subscriptionData.subscription_id,
        { cancel_at_period_end: true }
      );

      // Update subscription status in database
      await supabaseClient
        .from("subscriptions")
        .update({ status: "CANCELLED" })
        .eq("subscription_id", subscriptionData.subscription_id);

      // Update profile status
      await supabaseClient
        .from("profiles")
        .update({ subscription_status: "CANCELLED" })
        .eq("id", userId);

      return NextResponse.json({
        message: "Stripe subscription scheduled for cancellation at end of billing period",
        cancelDate: subscription.cancel_at
      });
    } else {
      return NextResponse.json(
        { error: "Unsupported payment method or manual intervention required" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Subscription cancellation error:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
