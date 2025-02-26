// /lib/paypal.js
import fetch from "node-fetch";

// Get PayPal access token
async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(
    "https://api-m.sandbox.paypal.com/v1/oauth2/token",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    },
  );

  const data = await response.json();
  return data.access_token;
}

// Create a subscription
export async function createSubscription(planId, returnUrl, userId) {
  if (!planId) throw new Error("Plan ID is required");

  const accessToken = await getAccessToken();

  const apiUrl = "https://api-m.sandbox.paypal.com";

  const response = await fetch(`${apiUrl}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      plan_id: planId,
      custom_id: userId, // This will be accessible in the webhook
      application_context: {
        brand_name: "Your Company",
        shipping_preference: "NO_SHIPPING",
        user_action: "SUBSCRIBE_NOW",
        return_url:
          returnUrl ||
          process.env.PAYPAL_RETURN_URL ||
          "https://trader-map.com/success",
        cancel_url:
          process.env.PAYPAL_CANCEL_URL || "https://trader-map.com/cancel",
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("PayPal API Error:", data);
    throw new Error(data.message || "Failed to create subscription");
  }

  return data;
}

// Verify webhook signature
export async function verifyWebhookSignature(event, headers) {
  // In a real app, implement proper signature verification using PayPal's API
  // https://developer.paypal.com/api/webhooks/v1/verify-webhook-signature/

  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) {
    console.warn("PAYPAL_WEBHOOK_ID not set, skipping verification");
    return true; // Skip verification if webhook ID not set
  }

  // For now, we'll just return true to pass verification during development
  return true;
}
