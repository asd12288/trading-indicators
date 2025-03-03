// app/api/get-rate/route.js
import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const fiatAmount = searchParams.get("fiatAmount") || "25";
  const cryptoSymbol = searchParams.get("cryptoSymbol") || "btc";
  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  const url = `https://api.nowpayments.io/v1/estimate?amount=${fiatAmount}&currency_from=usd&currency_to=${cryptoSymbol}`;
  try {
    const response = await fetch(url, { headers: { 'x-api-key': apiKey } });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch rate" }, { status: 500 });
  }
}
