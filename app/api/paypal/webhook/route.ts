// Update the existing webhook handler to handle subscription cancellations

import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/paypal";
import supabaseClient from "@/database/supabase/supabase";
import { publishToQueue } from "@/lib/upstash";

export async function POST(req) {
  let event;
  try {
    const bodyText = await req.text();
    event = JSON.parse(bodyText);

    const isValid = await verifyWebhookSignature(event, req.headers);
    if (!isValid) {
      console.error("Invalid PayPal webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } catch (parseErr) {
    console.error("Error parsing webhook request", parseErr);
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

  const eventType = event.event_type;
  const sub = event.resource;
  const subscriptionId = sub.id;
  const userId = sub.custom_id;

  try {
    if (eventType === "BILLING.SUBSCRIPTION.ACTIVATED") {
      // Get subscription details to determine the plan type
      const { data: subscriptionData } = await supabaseClient
        .from("subscriptions")
        .select("plan")
        .eq("id", subscriptionId)
        .single();

      const isLifetimePlan = subscriptionData?.plan === "lifetime";

      // Mark subscription as active
      await supabaseClient
        .from("subscriptions")
        .update({ status: "ACTIVE" })
        .eq("id", subscriptionId);

      // Set appropriate expiration for lifetime vs monthly plans
      let expirationDate;
      if (isLifetimePlan) {
        expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 100);
      } else {
        expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + 1);
      }

      await supabaseClient
        .from("profiles")
        .update({
          plan: "pro",
          subscription_status: "Active",
          is_lifetime: isLifetimePlan,
          subscription_expires_at: expirationDate.toISOString(),
        })
        .eq("id", userId);

      // Send welcome email
      const { data: user, error: userError } = await supabaseClient
        .from("profiles")
        .select("email")
        .eq("id", userId)
        .single();

      if (userError) {
        console.error("❌ Error fetching user data:", userError);
      } else {
        await publishToQueue(`${process.env.DEV_URL}/api/qstash/welcome-pro`, {
          userName: user?.email,
          userEmail: user?.email,
          expirationDate: isLifetimePlan
            ? "Never (Lifetime Access)"
            : expirationDate.toISOString(),
          isLifetime: isLifetimePlan,
        });

        await publishToQueue(`${process.env.DEV_URL}/api/qstash/receipt`, {
          userName: user?.email,
          userEmail: user?.email,
          paymentId: subscriptionId,
          amount: isLifetimePlan ? "800.00" : "65.00",
          paymentMethod: "PayPal",
          date: sub.billing_info.last_payment.time,
          planType: isLifetimePlan ? "lifetime" : "monthly",
        });
      }
    } else if (eventType === "BILLING.SUBSCRIPTION.CANCELLED") {
      // Check if this is a lifetime plan before downgrading
      const { data: subscriptionData } = await supabaseClient
        .from("subscriptions")
        .select("plan")
        .eq("id", subscriptionId)
        .single();

      // Don't downgrade lifetime plans - they remain "pro" forever
      if (subscriptionData?.plan === "lifetime") {
        console.log("Lifetime plan cancellation - maintaining Pro status");

        await supabaseClient
          .from("subscriptions")
          .update({
            status: "LIFETIME_COMPLETED",
            scheduled_change: new Date().toISOString(),
          })
          .eq("id", subscriptionId);
      } else {
        // Regular monthly plan cancellation
        await supabaseClient
          .from("subscriptions")
          .update({
            status: "CANCELLED",
            scheduled_change: new Date().toISOString(),
          })
          .eq("id", subscriptionId);

        // Downgrade user plan only for non-lifetime plans
        await supabaseClient
          .from("profiles")
          .update({ plan: "free" })
          .eq("id", userId);
      }
    } else if (
      eventType === "BILLING.SUBSCRIPTION.SUSPENDED" ||
      eventType === "BILLING.SUBSCRIPTION.EXPIRED"
    ) {
      // Similar check as above for lifetime plans
      const { data: subscriptionData } = await supabaseClient
        .from("subscriptions")
        .select("plan")
        .eq("id", subscriptionId)
        .single();

      if (subscriptionData?.plan !== "lifetime") {
        await supabaseClient
          .from("subscriptions")
          .update({ status: "EXPIRED" })
          .eq("id", subscriptionId);

        // Downgrade user plan only for non-lifetime plans
        await supabaseClient
          .from("profiles")
          .update({ plan: "free" })
          .eq("id", userId);
      }
    } else if (eventType === "BILLING.SUBSCRIPTION.UPDATED") {
      // Check if the update is related to cancellation
      if (
        sub.status === "ACTIVE" &&
        sub.billing_info &&
        sub.billing_info.cycle_executions &&
        sub.billing_info.cycle_executions[0] &&
        sub.billing_info.cycle_executions[0].cycles_remaining === 1
      ) {
        // This is likely a subscription that will be cancelled after the current cycle
        await supabaseClient
          .from("subscriptions")
          .update({
            status: "CANCEL_AT_PERIOD_END",
            scheduled_change: sub.billing_info.next_billing_time || null,
          })
          .eq("id", subscriptionId);
      }
    } else if (
      eventType === "PAYMENT.SALE.COMPLETED" ||
      eventType === "PAYMENT.CAPTURE.COMPLETED"
    ) {
      // Payment received, update last_payment date
      await supabaseClient
        .from("subscriptions")
        .update({ last_payment: new Date().toISOString() })
        .eq("id", subscriptionId);
    }
  } catch (dbErr) {
    console.error("Database update failed:", dbErr);
  }

  return NextResponse.json({ status: "OK" }, { status: 200 });
}
