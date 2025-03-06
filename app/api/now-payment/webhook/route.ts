import { NextResponse } from "next/server";
import crypto from "crypto";
import supabaseClient from "@/database/supabase/supabase";
import { createClient } from "@/database/supabase/server";
import { Resend } from "resend";
import { NewSubscriptionEmail } from "@/content/emails-templates/welcomeEmail";
import { sendWelcomeEmail } from "@/lib/email";

// Helper function to sort object keys recursively for consistent signature generation
function sortObject(obj: any): any {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  return Object.keys(obj)
    .sort()
    .reduce((result: any, key: string) => {
      result[key] =
        obj[key] && typeof obj[key] === "object"
          ? sortObject(obj[key])
          : obj[key];
      return result;
    }, {});
}

export async function POST(request: Request) {
  console.log("📣 Webhook received at:", new Date().toISOString());

  try {
    // Get the raw body text
    const rawBody = await request.text();
    console.log("📦 Raw webhook payload:", rawBody);

    // Extract the signature from headers
    const signature = request.headers.get("x-nowpayments-sig");
    console.log("🔐 Received signature:", signature);

    if (!signature) {
      console.error("❌ Missing signature in webhook request");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Get your IPN secret key from environment variables
    const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;
    if (!ipnSecret) {
      console.error(
        "❌ NOWPAYMENTS_IPN_SECRET not configured in environment variables",
      );
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // Parse the JSON body
    let paymentData;
    try {
      paymentData = JSON.parse(rawBody);
      console.log(
        "📊 Parsed payment data:",
        JSON.stringify(paymentData, null, 2),
      );
    } catch (error) {
      console.error("❌ Invalid JSON in webhook body:", error);
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // Sort the object and generate a signature for validation
    const sortedData = sortObject(paymentData);
    const hmac = crypto.createHmac("sha512", ipnSecret);
    hmac.update(JSON.stringify(sortedData));
    const calculatedSignature = hmac.digest("hex");

    console.log("🔍 Calculated signature:", calculatedSignature);
    console.log("✅ Signatures match:", calculatedSignature === signature);

    // Verify the signature
    if (calculatedSignature !== signature) {
      console.error("❌ Invalid signature in webhook request");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Process the payment data
    const { payment_id, payment_status, order_id } = paymentData;

    // Handle different payment statuses
    if (payment_status === "finished" || payment_status === "confirmed") {
      console.log(`✅ Payment ${payment_id} confirmed for order ${order_id}`);

      const supabase = await createClient();

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", order_id);

      if (profileError) {
        console.error("❌ Error fetching user profile:", profileError.message);
        return NextResponse.json(
          { error: "Error fetching user profile" },
          { status: 500 },
        );
      }

      if (!profile || !profile.length) {
        console.error("❌ User profile not found for order ID:", order_id);
        return NextResponse.json(
          { error: "User profile not found" },
          { status: 404 },
        );
      }

      const user = profile[0];

      // Update the user's subscription status
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30); // Add 30 days

      const { error: userError } = await supabase
        .from("profiles")
        .update({
          subscription_status: "ACTIVE",
          plan: "pro",
          subscription_expires_at: expirationDate.toISOString(), // Convert to ISO string for database storage
        })
        .eq("id", user.id);

      if (userError) {
        console.error("❌ Error updating user profile:", userError.message);
        return NextResponse.json(
          { error: "Error updating user profile" },
          { status: 500 },
        );
      }

      // Send welcome email
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "Trader Map <noreply@trader-map.com>",
          to: user.email,
          subject: "🎉 Welcome to Trader Map Pro!",
          react: NewSubscriptionEmail({
            userName: user.full_name || user.email,
            userEmail: user.email,
            plan: "Pro",
            expirationDate: expirationDate.toISOString(),
          }),
        });
      } catch (emailError) {
        console.error("❌ Error sending welcome email:", emailError);
        // Continue with webhook processing
      }

      // For debugging purposes, let's log this
      console.log(`📝 Would update subscription for user with ID: ${order_id}`);
    } else {
      console.log(
        `Payment status is ${payment_status}, not activating subscription yet`,
      );
    }

    // Always return 200 OK to acknowledge receipt
    return NextResponse.json({
      status: "success",
      message: "Webhook received and processed",
    });
  } catch (error: any) {
    console.error("💥 Webhook processing error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
