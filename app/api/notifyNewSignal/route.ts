import supabaseClient from "@/database/supabase/supabase";
import { format } from "date-fns";
import { NextResponse } from "next/server";
// IMPORTANT: use a "server-side" Supabase client instance.
// If you’ve set this up differently in your project, import accordingly.

export async function POST(request) {
  try {
    // 1. Read the payload (the "NEW" row) from Supabase
    const row = await request.json();

    // 2. Fetch all users from "profiles"
    const { data: users, error: usersError } = await supabaseClient
      .from("profiles")
      .select("id, telegram_chat_id, preferences");

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return NextResponse.json(
        { success: false, error: usersError },
        { status: 500 },
      );
    }

    if (!users || users.length === 0) {
      console.log("No users found");
      return NextResponse.json({
        success: true,
        message: "No users to notify",
      });
    }

    // 3. Prepare your Telegram bot token
    //    Make sure you have TELEGRAM_BOT_TOKEN in your .env (NOT NEXT_PUBLIC_)
    const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    if (!TELEGRAM_BOT_TOKEN) {
      console.error("Missing Telegram bot token");
      return NextResponse.json(
        { success: false, error: "Missing token" },
        { status: 500 },
      );
    }

    // 4. Construct message text
    //    Adapt this logic based on whether exit_price is null or not
    const instrumentName = row.instrument_name;
    const entryPrice = row.entry_price;
    const takeProfit = row.take_profit_price;
    const exitPrice = row.exit_price;
    const tradeType = row.trade_side === "long" ? "Buy" : "Sell";
    const entryTime = format(row.entry_time, "MM-dd HH:mm");
    const exitTime = format(row.exit_time, "MM-dd HH:mm");
    const duration = row.trade_duration;

    // Example message
    const message =
      exitPrice === null
        ? `🚀 *New Signal Alert*
  
  📌 *Type:* ${tradeType}
  📈 *Instrument:* ${instrumentName}
  💰 *Entry Price:* ${entryPrice}
  🕒 *Entry Time:* ${entryTime}
  🎯 *Take Profit:* ${takeProfit}`
        : `📌 *Instrument:* ${instrumentName}
  ✅ *Signal Closed*
  💸 *Exit Price:* ${exitPrice}
  🕒 *Exit Time:* ${exitTime}
  ⏱ *Trade Duration:* ${duration}`;
    // 5. Iterate through the list of users and send Telegram messages
    for (const user of users) {
      const userPreferences = user.preferences || {};
      const instrumentPrefs = userPreferences[instrumentName] || {};

      // Only notify if user has turned on notifications for this instrument
      if (!instrumentPrefs.notifications) {
        continue;
      }

      if (!user.telegram_chat_id) {
        console.log(`User ${user.id} has not connected Telegram`);
        continue;
      }

      // 6. Send the message to Telegram
      const telegramURL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

      const response = await fetch(telegramURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: user.telegram_chat_id,
          text: message,
          parse_mode: "Markdown",
        }),
      });

      if (!response.ok) {
        console.error(
          `Failed to send Telegram message to user ${user.id}`,
          response.statusText,
        );
      } else {
        const result = await response.json();
        if (!result.ok) {
          console.error(
            `Telegram API error for user ${user.id}:`,
            result.description,
          );
        }
      }
    }

    // 7. Return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in notifyNewSignal route:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
