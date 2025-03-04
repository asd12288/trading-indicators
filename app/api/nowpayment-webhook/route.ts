import crypto from "crypto";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  console.log("🔔 Webhook received at:", new Date().toISOString());
  
  try {
    const rawBody = await request.text();
    console.log("📦 Webhook raw body:", rawBody);

    const signature = request.headers.get("x-nowpayments-sig");
    console.log("🔑 Signature received:", signature);
    
    if (!signature) {
      console.error("❌ No signature in request");
      return NextResponse.json({ error: "Signature missing" }, { status: 400 });
    }
    
    const secret = process.env.NOWPAYMENTS_IPN_SECRET;
    if (!secret) {
      console.error("⚠️ NOWPAYMENTS_IPN_SECRET not configured");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }
    
    const hash = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");
      
    console.log("🔐 Calculated hash:", hash);
    console.log("🔍 Signatures match:", hash === signature);
    
    if (hash !== signature) {
      console.error("❌ Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    let data;
    try {
      data = JSON.parse(rawBody);
      console.log("📊 Parsed webhook data:", JSON.stringify(data, null, 2));
    } catch (e) {
      console.error("❌ Failed to parse webhook JSON:", e);
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { payment_id, payment_status, order_id } = data;
    console.log(`📢 Processing payment ${payment_id} with status ${payment_status} for user ${order_id}`);

    if (payment_status === "finished" || payment_status === "confirmed") {
      console.log(`✅ Activating subscription for user ${order_id}`);
      await activateProSubscription(order_id);
      console.log(`✅ User ${order_id} upgraded to Pro successfully`);
    } else {
      console.log(`ℹ️ Payment status is ${payment_status}, not activating subscription yet`);
    }

    return NextResponse.json({ status: "OK" });
  } catch (err: any) {
    console.error("💥 Webhook error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Helper: Update user's subscription
async function activateProSubscription(userId: string) {
  if (!userId) {
    console.error("❌ No userId provided for subscription activation");
    return;
  }
  
  try {
    console.log(`🔄 Starting subscription activation for user ${userId}`);
    const { createClient } = await import("@supabase/supabase-js");
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("❌ Missing Supabase credentials");
      return;
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    
    console.log(`📅 Setting subscription to expire on ${expiresAt.toISOString()}`);
    
    const { error, data } = await supabaseAdmin
      .from("profiles")
      .update({
        plan: "pro",
        current_period_end: expiresAt.toISOString(),
        subscription_status: "ACTIVE",
      })
      .eq("id", userId)
      .select();
    
    if (error) {
      console.error("❌ Supabase update error:", error);
    } else {
      console.log(`✅ Successfully updated profile for user ${userId}`, data);
    }
  } catch (err) {
    console.error("💥 Error in activateProSubscription:", err);
  }
}