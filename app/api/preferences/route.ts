import { NextRequest, NextResponse } from "next/server";
import { saveSignalPreferences } from "@/app/signals/[id]/actions";

export async function POST(req: NextRequest) {
  try {
    const { userId, signalId, notifications, volume, favorite } =
      await req.json();
    const result = await saveSignalPreferences({
      userId,
      signalId,
      notifications,
      volume,
      favorite,
    });
    return NextResponse.json({ success: !!result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
