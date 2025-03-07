import { sendReceiptEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userName, userEmail, paymentId, amount, paymentMethod, date } =
    await req.json();

  try {
    await sendReceiptEmail({
      userName,
      userEmail,
      paymentId,
      amount,
      paymentMethod,
      date,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error sending receipt email:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
