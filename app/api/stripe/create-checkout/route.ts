import { NextResponse } from "next/server";
import Stripe from "stripe";
import supabaseClient from "@/database/supabase/supabase";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req) {
  try {
    const { userId, plan, userEmail, locale } = await req.json();

    // Validate inputs
    if (!userId || !plan || !userEmail) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    // Different product IDs for monthly vs lifetime plans
    const priceId =
      plan === "lifetime"
        ? process.env.STRIPE_LIFETIME_PRICE_ID
        : process.env.STRIPE_MONTHLY_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: "Price configuration missing" },
        { status: 500 },
      );
    }

    // Create a Stripe customer if they don't exist yet
    let customerId;
    const { data: existingCustomer } = await supabaseClient
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();

    if (existingCustomer?.stripe_customer_id) {
      customerId = existingCustomer.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          userId: userId,
        },
      });
      customerId = customer.id;

      // Save customer ID for future use
      await supabaseClient.from("stripe_customers").insert({
        user_id: userId,
        stripe_customer_id: customerId,
        email: userEmail,
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: plan === "lifetime" ? "payment" : "subscription",
      success_url: `${process.env.DEV_URL}/${locale}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DEV_URL}/pricing`,
      client_reference_id: userId,
      metadata: {
        userId: userId,
        plan: plan,
      },
    });

    // Save subscription attempt in database
    await supabaseClient.from("subscriptions").insert({
      id: session.id,
      user_id: userId,
      provider: "stripe",
      status: "PENDING",
      plan: plan,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe session creation error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
