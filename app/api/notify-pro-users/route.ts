import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { renderAsync } from "@react-email/components";
import SignalNotificationEmail from "@/components/emails/SignalNotificationEmail";
import { Signal } from "@/types";

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    console.log("Received POST request for sending signal notification.");

    const signal: Signal = await req.json();
    console.log("Signal received:", signal);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://trader-map.com";
    const previewUrl = ""; // optional preview image

    console.log("Fetching pro users with email notifications enabled...");
    const { data: proUsers, error: userError } = await supabase
      .from("profiles")
      .select("email, id")
      .eq("plan", "pro")
      .eq("email_notification", true);

    if (userError) {
      console.error("Error fetching pro users:", userError.message);
      return NextResponse.json(
        { error: "Failed to fetch pro users" },
        { status: 500 },
      );
    }

    const usersToNotify = proUsers || [];
    console.log(`Found ${usersToNotify.length} pro users to notify.`);

    if (usersToNotify.length === 0) {
      return NextResponse.json({ message: "No pro users to notify" });
    }

    console.log("Rendering email HTML...");
    const html = await renderAsync(
      SignalNotificationEmail({ signal, previewUrl, baseUrl }),
    );

    console.log("Sending emails to users...");
    const emailPromises = usersToNotify.map(async (user) => {
      console.log(`Sending email to ${user.email} (ID: ${user.id})`);
      return resend.emails.send({
        from: "Trader Map <signals@trader-map.com>",
        to: user.email,
        subject: `New Signal Alert: ${signal.instrument_name} ${signal.trade_side}`,
        html: html,
        tags: [
          { name: "signal_id", value: signal.client_trade_id || "" },
          { name: "instrument", value: signal.instrument_name },
          { name: "user_id", value: user.id || "" },
        ],
      });
    });

    const results = await Promise.allSettled(emailPromises);
    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    console.log(
      `Email results: ${successful} successful, ${failed} failed, out of ${usersToNotify.length} total.`,
    );

    return NextResponse.json({
      success: true,
      notified: successful,
      failed,
      total: usersToNotify.length,
    });
  } catch (error) {
    console.error("Unexpected error in sending notifications:", error);
    return NextResponse.json(
      { error: "Failed to send notifications" },
      { status: 500 },
    );
  }
}
