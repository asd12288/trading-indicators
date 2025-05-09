import { createClient } from "@/database/supabase/server";
import { publishToQueue } from "@/lib/upstash";
import crypto from "crypto";
import { NextResponse } from "next/server";

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

    // Extract the signature from headers
    const signature = request.headers.get("x-nowpayments-sig");

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
    const {
      payment_id,
      payment_status,
      order_id,
      order_description,
      price_amount,
    } = paymentData;

    console.log("💰 Payment details:", {
      payment_id,
      payment_status,
      order_id,
      order_description,
      price_amount,
      price_currency: paymentData.price_currency,
    });

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

      // Improved lifetime plan detection - check both description and amount
      // Check multiple ways since the data could come in different formats
      const isLifetimePlan =
        order_description?.toLowerCase().includes("lifetime") ||
        price_amount === 800 ||
        price_amount === "800" ||
        parseFloat(price_amount) === 800 ||
        parseFloat(price_amount) >= 700; // Rough check for lifetime price

      console.log(
        `🔍 Plan detection: isLifetimePlan=${isLifetimePlan}, amount=${price_amount}, description=${order_description}`,
      );

      // Set appropriate expiration date based on plan
      let expirationDate;
      if (isLifetimePlan) {
        // Set a far future date for lifetime subscriptions (e.g., +100 years)
        expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 100);
        console.log(
          "🔄 Setting LIFETIME access with expiration:",
          expirationDate.toISOString(),
        );
      } else {
        // Regular monthly plan - 30 days
        expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        console.log(
          "🔄 Setting MONTHLY access with expiration:",
          expirationDate.toISOString(),
        );
      }

      // Update the user's subscription status
      const { error: userError } = await supabase
        .from("profiles")
        .update({
          subscription_status: "ACTIVE",
          email_notification: true,
          plan: "pro",
          subscription_expires_at: expirationDate.toISOString(),
          is_lifetime: isLifetimePlan, // Important flag to mark lifetime subscriptions
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      // Also record this in the subscriptions table for better tracking
      await supabase.from("subscriptions").insert({
        id: payment_id,
        user_id: user.id,
        plan: isLifetimePlan ? "lifetime" : "monthly",
        status: "ACTIVE",
        payment_provider: "nowpayments",
        start_time: new Date().toISOString(),
        last_payment: new Date().toISOString(),
      });

      if (userError) {
        console.error("❌ Error updating user profile:", userError.message);
        return NextResponse.json(
          { error: "Error updating user profile" },
          { status: 500 },
        );
      }

      // After successful crypto payment
      await publishToQueue(`${process.env.DEV_URL}/api/qstash/welcome-pro`, {
        userName: user.email,
        userEmail: user.email,
        expirationDate: isLifetimePlan
          ? "Never (Lifetime Access)"
          : expirationDate.toISOString(),
        isLifetime: isLifetimePlan,
      });

      await publishToQueue(`${process.env.DEV_URL}/api/qstash/receipt`, {
        userName: user.email,
        userEmail: user.email,
        paymentId: payment_id,
        amount: price_amount,
        paymentMethod: paymentData.pay_currency,
        date: new Date().toISOString(),
        planType: isLifetimePlan ? "lifetime" : "monthly",
      });

      console.log(
        `📝 Updated subscription for user ${order_id}. Is lifetime: ${isLifetimePlan}`,
      );
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
