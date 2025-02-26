// lib/paypal.js
import fetch from "node-fetch";

const PAYPAL_BASE_URL = "https://api-m.sandbox.paypal.com";

// process.env.NODE_ENV === 'production'
//   ? 'https://api-m.paypal.com'
//   : 'https://api-m.sandbox.paypal.com';

// 1. Get PayPal API access token using Client ID/Secret
export async function getPayPalAccessToken() {
  const auth = Buffer.from(
    process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_CLIENT_SECRET,
  ).toString("base64");
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!response.ok) {
    throw new Error("Failed to get PayPal access token");
  }
  const data = await response.json();
  return data.access_token;
}


export async function cancelSubscription(subscriptionId) {
    const accessToken = await getPayPalAccessToken();
    
    const res = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reason: "Customer requested cancellation at end of billing period"
      }),
    });
    
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`PayPal cancel subscription failed: ${err}`);
    }
    
    return true;
  }

// 2. Create a subscription for the given Plan ID
export async function createSubscription(
  planId,
  subscriberEmail = null,
  customId = null,
) {
  const accessToken = await getPayPalAccessToken();
  const body = { plan_id: planId };
  if (customId) body.custom_id = customId; // attach our user ID for reference (appears in webhook events)
  if (subscriberEmail) {
    body.subscriber = { email_address: subscriberEmail };
  }
  const res = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal create subscription failed: ${err}`);
  }
  return res.json(); // returns subscription data (including an 'id')
}

// 3. Verify a webhook signature (to ensure webhook is from PayPal)
export async function verifyWebhookSignature(payload, headers) {
  const accessToken = await getPayPalAccessToken();
  const verifyRes = await fetch(
    `${PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transmission_id: headers.get("paypal-transmission-id"),
        transmission_time: headers.get("paypal-transmission-time"),
        cert_url: headers.get("paypal-cert-url"),
        auth_algo: headers.get("paypal-auth-algo"),
        transmission_sig: headers.get("paypal-transmission-sig"),
        webhook_id: process.env.PAYPAL_WEBHOOK_ID, // webhook ID from your PayPal app settings
        webhook_event: payload, // the JSON body of the webhook event
      }),
    },
  );
  const verifyData = await verifyRes.json();
  return verifyData.verification_status === "SUCCESS";
}
