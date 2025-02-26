import { NextResponse } from "next/server";
import { cancelSubscription } from "@/lib/paypal";
import supabaseClient from "@/database/supabase/supabase";

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    console.log("Processing cancellation for user:", userId);

    // 1. Find the active subscription for this user
    // Remove .single() to avoid the error
    const { data: subscriptions, error: fetchError } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "ACTIVE")
      .order("created_at", { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error("Error fetching subscription:", fetchError);
      return NextResponse.json({ 
        error: `Database error: ${fetchError.message}`
      }, { status: 500 });
    }

    // Check if we found any active subscription
    if (!subscriptions || subscriptions.length === 0) {
      console.log("No active subscriptions found for user:", userId);
      return NextResponse.json({ 
        error: "No active subscription found", userId 
      }, { status: 404 });
    }

    // Use the first (most recent) active subscription
    const subscription = subscriptions[0];
    console.log("Found subscription:", subscription);

    // 2. Cancel the subscription with PayPal
    try {
      await cancelSubscription(subscription.id);
    } catch (paypalError) {
      console.error("PayPal cancellation error:", paypalError);
      return NextResponse.json({ 
        error: `PayPal cancellation failed: ${paypalError.message}` 
      }, { status: 500 });
    }

    // 3. Update subscription status in our database
    const now = new Date().toISOString();
    const { error: updateError } = await supabaseClient
      .from("subscriptions")
      .update({
        status: "CANCEL_AT_PERIOD_END",
        updated_at: now
      })
      .eq("id", subscription.id);

    if (updateError) {
      console.error("Database update error:", updateError);
      return NextResponse.json({ 
        error: `Database update failed: ${updateError.message}` 
      }, { status: 500 });
    }

    // 4. Update the user's profile to reflect the pending cancellation
    const { error: profileError } = await supabaseClient
      .from("profiles")
      .update({
        subscription_status: "CANCELED",
        scheduled_change: subscription.current_period_end 
      })
      .eq("id", userId);

    if (profileError) {
      console.error("Profile update error:", profileError);
      // Continue despite profile update error, as the subscription is already cancelled
    }

    return NextResponse.json({ 
      success: true, 
      message: "Subscription will be cancelled at the end of the billing period" 
    });
  } catch (err) {
    console.error("Cancel subscription unexpected error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}