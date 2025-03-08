import { NextResponse } from "next/server";
import { createClient } from "@/database/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, type, title, message, entityId, link, additionalData } =
      body;

    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        type,
        title,
        message,
        entity_id: entityId,
        link,
        additional_data: additionalData || {},
      })
      .select();

    if (error) {
      console.error("Error creating notification:", error);
      return NextResponse.json(
        { error: "Failed to create notification" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, notification: data[0] });
  } catch (err) {
    console.error("Error in notification API:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
