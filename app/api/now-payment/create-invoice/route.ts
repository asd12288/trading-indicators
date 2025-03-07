import { NextResponse } from "next/server";

const APIKEY = process.env.NOWPAYMENTS_API_KEY!;
const isDev = process.env.NODE_ENV !== "production";

const URL = isDev
  ? "https://api-sandbox.nowpayments.io/v1/invoice"
  : "https://api.nowpayments.io/v1/invoice";

const BASE_URL = isDev ? process.env.DEV_URL : process.env.PROD_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const payload = {
      price_amount: "11",
      price_currency: "usd",
      order_id: body.user.id,
      order_description: "Pro Account for 1 month",
      ipn_callback_url: `${BASE_URL}/api/now-payment/webhook`,
      success_url: `${BASE_URL}/${body.locale}/success`,
    };

    console.log(`Sending request to ${isDev ? "Sandbox" : "Production"} NowPayments API`, payload);

    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "x-api-key": APIKEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Error creating an invoice:", data.message);
      return NextResponse.json({ message: data.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { message: err.message || "Error creating an invoice" },
      { status: 500 }
    );
  }
}
