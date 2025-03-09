import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req) {
  const authToken = cookies().get("sb-auth-token")?.value;

  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Set headers for SSE
  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  };

  // Create a new readable stream
  const stream = new ReadableStream({
    start(controller) {
      // Function to send updates
      const sendUpdate = (data) => {
        controller.enqueue(
          new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`),
        );
      };

      // Initial connection message
      sendUpdate({ type: "connected" });

      // Keep connection alive with a heartbeat
      const heartbeat = setInterval(() => {
        sendUpdate({ type: "heartbeat", time: new Date().toISOString() });
      }, 30000);

      // Store the event listener in a variable so we can remove it later
      const eventListener = (event) => {
        if (event.type === "payment-update" && event.userId === userId) {
          sendUpdate({
            type: "payment-update",
            status: event.status,
            details: event.details,
          });
        }
      };

      // Clean up when client disconnects
      req.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
      });
    },
  });

  return new Response(stream, { headers });
}
