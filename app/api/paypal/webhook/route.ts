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
      // Mark subscription as active
      await supabaseClient
        .from("subscriptions")
        .update({ status: "ACTIVE" })
        .eq("id", subscriptionId);

      await supabaseClient
        .from("profiles")
        .update({ plan: "pro", subscription_status: "Active" })
        .eq("id", userId);

      // Send welcome email
      const { data: user, error: userError } = await supabaseClient
        .from("profiles")
        .select("email")
        .eq("id", userId)
        .single();

      const expirationDate = new Date();

      if (userError) {
        console.error("❌ Error fetching user data:", userError);
      } else {
        expirationDate.setMonth(expirationDate.getMonth() + 1);
      }

      await publishToQueue(`${process.env.DEV_URL}/api/qstash/welcome-pro`, {
        userName: user?.email,
        userEmail: user?.email,
        expirationDate: expirationDate.toISOString(),
      });

      await publishToQueue(`${process.env.DEV_URL}/api/qstash/receipt`, {
        userName: user?.email,
        userEmail: user?.email,
        paymentId: subscriptionId,
        amount: sub.billing_info.last_payment.amount.value,
        paymentMethod: "PayPal",
        date: sub.billing_info.last_payment.time,
      });
    } else if (eventType === "BILLING.SUBSCRIPTION.CANCELLED") {
      // This fires when subscription is fully cancelled (after the period ends)
      await supabaseClient
        .from("subscriptions")
        .update({
          status: "CANCELLED",
          scheduled_change: new Date().toISOString(),
        })
        .eq("id", subscriptionId);

      // Downgrade user plan
      await supabaseClient
        .from("profiles")
        .update({ plan: "free" })
        .eq("id", userId);
    } else if (
      eventType === "BILLING.SUBSCRIPTION.SUSPENDED" ||
      eventType === "BILLING.SUBSCRIPTION.EXPIRED"
    ) {
      await supabaseClient
        .from("subscriptions")
        .update({ status: "EXPIRED" })
        .eq("id", subscriptionId);

      // Downgrade user plan
      await supabaseClient
        .from("profiles")
        .update({ plan: "free" })
        .eq("id", userId);
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
