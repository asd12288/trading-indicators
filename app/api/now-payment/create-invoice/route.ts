import { NextResponse } from "next/server";

const APIKEY = process.env.NOWPAYMENTS_API_KEY!;
const isDev = process.env.NODE_ENV !== "production";

const URL = isDev
  ? "https://api-sandbox.nowpayments.io/v1/invoice"
  : "https://api.nowpayments.io/v1/invoice";

export async function POST(request: Request) {
  try {
    // Expect user, locale, and plan in the body
    const body = await request.json();
    const { user, locale, plan } = body;

    console.log(`Creating ${plan} invoice for user ${user.id}`);

    // Set price and description based on the plan type
    let price_amount, order_description;
    if (plan === "lifetime") {
      price_amount = "800";
      order_description = "Lifetime Pro Account - Permanent Access";
    } else {
      price_amount = "65"; // monthly plan updated to $65
      order_description = "Pro Account for 1 month - Monthly Subscription";
    }

    const payload = {
      price_amount,
      price_currency: "usd",
      order_id: user.id,
      order_description,
      ipn_callback_url: `${process.env.DEV_URL}/api/now-payment/webhook`,
      success_url: `${process.env.DEV_URL}/${locale}/success`,
    };

    console.log(
      `Sending request to ${isDev ? "Sandbox" : "Production"} NowPayments API`,
      payload,
    );

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
      { status: 500 },
    );
  }
}
