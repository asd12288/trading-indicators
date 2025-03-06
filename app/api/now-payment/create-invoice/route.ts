import { NextResponse } from "next/server";

const APIKEY = process.env.NOWPAYMENTS_API_KEY!;

const URL = "https://api-sandbox.nowpayments.io/v1/invoice";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const payload = {
      price_amount: "35",
      price_currency: "usd",
      order_id: body.user.id,
      order_description: "Pro Account for 1 month",
      ipn_callback_url: `${process.env.DEV_URL}/api/now-payment/webhook`,
      success_url: `${process.env.DEV_URL}/${body.locale}/success`,
    };

    console.log("sending request to NowPayments API", payload);

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
      console.error("Error creating an invoice", data.message);
      return NextResponse.json({ message: data.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return new NextResponse(err, {
      status: 500,
      message: err.message || "Error creating an invoice",
    });
  }
}
