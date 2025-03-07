import { Client } from "@upstash/qstash";

const qstashClient = new Client({
  token: process.env.UPSTASH_QSTASH_TOKEN!,
});

// Publish a message to Upstash Queue
export async function publishToQueue(url: string, body: any) {
  await qstashClient.publishJSON({
    url,
    body,
  });
}

