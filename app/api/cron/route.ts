import { createClient } from "@/database/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Verify the request is authorized
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = await createClient();
    const currentDate = new Date().toISOString();

    // Find and update expired subscriptions
    const { data: expiredSubscriptions, error } = await supabase
      .from("profiles")
      .update({
        subscription_status: "INACTIVE",
        plan: "free",
      })
      .eq("subscription_status", "ACTIVE")
      .eq("plan", "pro")
      .lte("subscription_expires_at", currentDate)
      .select("id, email, subscription_expires_at");

    if (error) {
      console.error("Failed to update expired subscriptions:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log the updates
    console.log(
      `Updated ${expiredSubscriptions?.length || 0} expired subscriptions`,
    );
    expiredSubscriptions?.forEach((sub) => {
      console.log(
        `User ${sub.email} subscription expired on ${sub.subscription_expires_at}`,
      );
    });

    return NextResponse.json({
      success: true,
      message: `Updated ${expiredSubscriptions?.length || 0} expired subscriptions`,
      updated: expiredSubscriptions,
    });
  } catch (error: any) {
    console.error("Cron job error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
