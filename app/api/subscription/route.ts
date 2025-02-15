import { createClient } from "@/database/supabase/server";
import { getPaddleInstance } from "@/utils/paddle/get-paddle-instance";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const paddle = getPaddleInstance();
    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      return Response.json(
        { error: "Missing subscriptionId" },
        { status: 400 },
      );
    }

    const cancelResult = await paddle.subscriptions.cancel(subscriptionId, {
      effectiveFrom: "next_billing_period",
    });

    if (cancelResult) {
      const supabase = await createClient();
      const { error } = await supabase
        .from("profiles")
        .update({
          plan: "free",
          subscription_status: "canceled",
          scheduled_change: null,
        })
        .eq("subscription_id", subscriptionId);

      if (error) {
        console.log("Error updating profile:", error);
        return Response.json({ error }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 },
    );
  }
}
