import { getPaddleInstance } from "@/utils/paddle/get-paddle-instance";
import { ProcessWebhook } from "@/utils/paddle/process-webhook";
import { NextRequest } from "next/server";

const webhookProcessor = new ProcessWebhook();

export async function POST(request: NextRequest) {
  const signature = request.headers.get("paddle-signature") || "";
  const rawRequestBody = await request.text();
  const privateKey = process.env.WEBHOOK_PADDLE_SECRET_KEY || "";

  let status, eventName;

  try {
    if (signature && rawRequestBody) {
      const paddle = getPaddleInstance();
      const eventData = await paddle.webhooks.unmarshal(
        rawRequestBody,
        privateKey,
        signature,
      );
      status = 200;
      eventName = eventData?.eventType ?? "Unknown event";
      if (eventData) {
        await webhookProcessor.processEvent(eventData);
        console.log("Processed event:", eventName);
      }
    } else {
      status = 400;
      console.log(
        "Missing signature or request body. Signature:",
        signature,
        "Request Body:",
        rawRequestBody,
      );
    }
  } catch (e) {
    status = 500;
    console.error("Error processing webhook:", e);
  }
  return Response.json({ status, eventName });
}
