import * as React from "react";
import {
  Html,
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Img,
  Preview,
  Section,
  Text,
  Link,
  Tailwind,
} from "@react-email/components";
import { Signal } from "@/types";

interface SignalNotificationEmailProps {
  signal: Signal;
  previewUrl: string;
  baseUrl: string;
}

export const SignalNotificationEmail: React.FC<
  SignalNotificationEmailProps
> = ({ signal, previewUrl, baseUrl }) => {
  const isBuy = ["BUY", "LONG", "Buy", "Long"].includes(signal.trade_side);
  const signalUrl = `${baseUrl}/en/smart-alerts/${signal.instrument_name}`;

  return (
    <Html>
      <Head />
      <Preview>
        New Trading Signal: {signal.instrument_name} {isBuy ? "BUY" : "SELL"}
      </Preview>
      <Tailwind>
        <Body className="bg-slate-900 font-sans text-white">
          <Container className="mx-auto my-10 max-w-xl rounded-lg border border-slate-700 p-8">
            <h1 className="text-center text-2xl font-bold tracking-tight text-white">
              Trader<span className="text-blue-400">Map</span>
            </h1>

            <Heading className="mb-6 text-center text-xl font-bold text-blue-400">
              New Trading Signal Alert
            </Heading>

            <Section className="mb-6 rounded-lg border border-slate-700 bg-slate-800 p-4">
              <Heading className="text-center text-2xl font-bold">
                {signal.instrument_name}
              </Heading>

              <Text
                className={`text-center text-lg font-bold ${isBuy ? "text-emerald-500" : "text-rose-500"}`}
              >
                {isBuy ? "▲ BUY" : "▼ SELL"}
              </Text>

              <Hr className="my-4 border-slate-700" />

              <Text className="text-slate-300">
                <strong>Entry Price:</strong> {signal.entry_price}
              </Text>

              <Text className="text-emerald-400">
                <strong>Take Profit:</strong> {signal.take_profit_price}
              </Text>

              <Text className="text-rose-400">
                <strong>Stop Loss:</strong> {signal.stop_loss_price}
              </Text>

              {signal.entry_time && (
                <Text className="text-slate-300">
                  <strong>Entry Time:</strong>{" "}
                  {new Date(signal.entry_time).toLocaleString()}
                </Text>
              )}
            </Section>

            {previewUrl && (
              <Section className="mb-6">
                <Img
                  src={previewUrl}
                  width="500"
                  height="300"
                  alt={`${signal.instrument_name} Chart`}
                  className="rounded-lg border border-slate-700"
                />
              </Section>
            )}

            <Section className="text-center">
              <Link
                href={signalUrl}
                className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-bold text-white no-underline hover:bg-blue-700"
              >
                View Signal Details
              </Link>
            </Section>

            <Hr className="my-6 border-slate-700" />

            <Text className="text-center text-sm text-slate-400">
              You`&apos;`re receiving this email because you`&apos;`re a Pro
              subscriber to Trader Map.
              <br />
              <Link
                href={`${baseUrl}/en/profile?tab=notifications`}
                className="text-blue-400"
              >
                Manage notification preferences
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default SignalNotificationEmail;
