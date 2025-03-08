// lib/paypal.js
import fetch from "node-fetch";

const PAYPAL_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

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

  const res = await fetch(
    `${PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}/cancel`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reason: "Customer requested cancellation at end of billing period",
      }),
    },
  );

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
  try {
    console.log(`Creating PayPal subscription for plan ID: ${planId}`);
    const accessToken = await getPayPalAccessToken();

    const body = { plan_id: planId };
    if (customId) body.custom_id = customId; // attach our user ID for reference (appears in webhook events)
    if (subscriberEmail) {
      body.subscriber = { email_address: subscriberEmail };
    }

    console.log(`PayPal subscription request body:`, JSON.stringify(body));

    const res = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `sub-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
      },
      body: JSON.stringify(body),
    });

    // Get the response as text first to handle it properly
    const responseText = await res.text();

    if (!res.ok) {
      // Try to parse as JSON for better error reporting
      try {
        const errorJson = JSON.parse(responseText);
        console.error("PayPal API error response:", errorJson);

        throw new Error(
          `PayPal subscription creation failed: ${errorJson.name} - ${errorJson.message}` +
            (errorJson.details
              ? ` - ${errorJson.details.map((d) => d.description).join(", ")}`
              : ""),
        );
      } catch (parseError) {
        // If parsing fails, use the raw text
        throw new Error(`PayPal subscription creation failed: ${responseText}`);
      }
    }

    // If we got a successful response, parse it as JSON
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error in createSubscription:", error);
    throw error;
  }
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
