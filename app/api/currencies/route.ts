import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://api.nowpayments.io/v1/currencies", {
      headers: { "x-api-key": process.env.NOWPAYMENTS_API_KEY! },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch currencies" },
        { status: 500 },
      );
    }
    const data = await res.json();
    // Assuming the API returns an object with a "currencies" array.
    return NextResponse.json({ currencies: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
