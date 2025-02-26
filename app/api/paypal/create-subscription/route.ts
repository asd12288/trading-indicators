// app/api/paypal/create-subscription/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSubscription } from "@/lib/paypal";

export async function POST(req) {
  // 1. Authenticate the request (Supabase Auth)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  // We assume the user's access token is sent in an Authorization header (Bearer token)
  //   const authHeader = req.headers.get('authorization');
  //   if (!authHeader) {
  //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  //   }
  //   const token = authHeader.replace('Bearer ', '');
  //   // Set the user's JWT so Supabase knows who's calling
  //   supabase.auth.getUser(token);
  //   const { data: user, error: authError } = await supabase.auth.getUser();
  //   if (authError || !user) {
  //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  //   }
  const userId = "0e4aab79-6b31-4917-88a8-0e1cb02a6f9f";

  try {
    // 2. Create PayPal subscription via PayPal API
    const planId = "P-00B99537067828937M67P23A"; // Ensure it's not undefined

    console.log("Using PayPal Plan ID:", planId);

    const paypalResponse = await createSubscription(
      "P-00B99537067828937M67P23A",
      null,
      userId,
    );
    const subscriptionId = paypalResponse.id; // PayPal subscription ID (e.g. "I-ABC123XYZ")

    // 3. Store subscription initial record in Supabase (status will be updated via webhook)
    await supabase.from("subscriptions").insert({
      id: subscriptionId,
      user_id: userId,
      plan_id: planId,
      status: paypalResponse.status || "APPROVAL_PENDING", // PayPal might return 'APPROVAL_PENDING'
      start_time: paypalResponse.start_time || new Date().toISOString(),
    });

    // 4. Return the subscription ID to the client
    return NextResponse.json({ id: subscriptionId });
  } catch (err) {
    console.error("Create Subscription error:", err);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 },
    );
  }
}
