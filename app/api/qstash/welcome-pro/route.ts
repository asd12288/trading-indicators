import { sendWelcomeProEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userName, userEmail, expirationDate } = await req.json();

  try {
    await sendWelcomeProEmail({ userName, userEmail, expirationDate });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error sending welcome email:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
