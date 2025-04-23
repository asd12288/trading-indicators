import { Suspense } from "react";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Trader Map",
    template: "%s | Trader Map",
  },
  description: "Get the best Smart Alerts for your trades",
};

// Import critical CSS in a non-blocking way
const criticalCss = `
  /* Inlining minimal critical CSS here to prevent render blocking */
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  
  body {
    font-family: 'Poppins', system-ui, sans-serif;
    background: linear-gradient(to bottom, rgb(15, 23, 42), rgb(10, 15, 30));
    color: white;
    margin: 0;
    padding: 0;
  }
`;

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages({ locale: params.locale });

  return (
    <html lang={params.locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Inline critical CSS */}
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />

        {/* Preload critical fonts */}
      </head>
      <body>
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          {children}
          <Suspense fallback={null}>
            <LazyLoadedComponents />
          </Suspense>
        </NextIntlClientProvider>
        <Analytics />

        {/* Load non-critical scripts */}
      </body>
    </html>
  );
}

// Lazy load non-critical components
const LazyLoadedComponents = () => {
  return (
    <>
      <div id="maintenance-banner-container" data-load-delay="true" />
      <div id="alerts-container" data-load-delay="true" />
      <div id="toaster-container" data-load-delay="true" />
      {/* Initialize notification system */}
      {/* Add Signal Notification Trigger */}
    </>
  );
};
