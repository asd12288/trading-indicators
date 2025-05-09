import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import supabaseClient from "@/database/supabase/supabase";
import { publishToQueue } from "@/lib/upstash";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.client_reference_id || session.metadata?.userId;
        const planType = session.metadata?.plan;
        const isLifetimePlan = planType === "lifetime";

        // Get subscription ID if it's a subscription (not one-time payment)
        let subscriptionId = session.subscription;

        if (!subscriptionId && isLifetimePlan) {
          // For lifetime plans, use the checkout session ID as the "subscription" ID
          subscriptionId = session.id;
        }

        // Mark subscription as active
        await supabaseClient
          .from("subscriptions")
          .update({
            status: "ACTIVE",
            provider_subscription_id: subscriptionId,
            provider: "stripe",
          })
          .eq("id", session.id);

        // Set appropriate expiration for lifetime vs monthly plans
        let expirationDate;
        if (isLifetimePlan) {
          expirationDate = new Date();
          expirationDate.setFullYear(expirationDate.getFullYear() + 100);
        } else {
          expirationDate = new Date();
          expirationDate.setMonth(expirationDate.getMonth() + 1);
        }

        await supabaseClient.from("stripe_customers").insert({
          subscription_id: subscriptionId,
        });

        // Update user profile
        await supabaseClient
          .from("profiles")
          .update({
            plan: "pro",
            email_notification: true,
            payment_method: "Credit Card (Stripe)",
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
          await publishToQueue(
            `${process.env.DEV_URL}/api/qstash/welcome-pro`,
            {
              userName: user?.email,
              userEmail: user?.email,
              expirationDate: isLifetimePlan
                ? "Never (Lifetime Access)"
                : expirationDate.toISOString(),
              isLifetime: isLifetimePlan,
            },
          );

          await publishToQueue(`${process.env.DEV_URL}/api/qstash/receipt`, {
            userName: user?.email,
            userEmail: user?.email,
            paymentId: session.payment_intent || session.id,
            amount: isLifetimePlan ? "800.00" : "65.00",
            paymentMethod: "Credit Card (Stripe)",
            date: new Date().toISOString(),
            planType: isLifetimePlan ? "lifetime" : "monthly",
          });
        }

        // After success processing, store payment info in the user's session
        try {
          // Store payment information in a specialized table for displaying in UI
          await supabaseClient.from("payment_notifications").insert({
            user_id: userId,
            success: true,
            method: "Credit Card (Stripe)",
            amount: isLifetimePlan ? "$800.00" : "$65.00",
            date: new Date().toISOString(),
            plan_type: isLifetimePlan ? "lifetime" : "monthly",
            acknowledged: false,
          });
        } catch (notifyError) {
          console.error("Failed to save payment notification:", notifyError);
        }

        break;
      }

      // Handle other subscription events as needed
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      // Add other event handlers
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`❌ Error processing webhook: ${error.message}`);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}

// Configuration for raw body parsing in Next.js API routes
export const config = {
  api: {
    bodyParser: false,
  },
};
