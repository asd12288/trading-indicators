import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Poppins } from "next/font/google";

import { UserProvider } from "@/providers/UserProvider";
import { ThemeProvider } from "@/context/theme-context";
import "./globals.css";
import LazyLoadedComponents from "./LazyLoadedComponents";

export const metadata: Metadata = {
  title: {
    default: "Trader Map",
    template: "%s | Trader Map",
  },
  description: "Get the best Smart Alerts for your trades",
};

// Optimize Poppins font with next/font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Critical background and body styles
const criticalCss = `
  body {
    font-family: ${"poppins"}; /* next/font applied via className */
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
    <html lang={params.locale} className={poppins.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Preload critical styles and fonts handled by next/font */}

        {/* Inline critical CSS */}
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />

        {/* Other preloads or meta */}
      </head>
      <body>
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <ThemeProvider>
            <UserProvider>
              {children}
              <LazyLoadedComponents />
              <Toaster />
            </UserProvider>
          </ThemeProvider>
        </NextIntlClientProvider>

        {/* Load non-critical scripts */}
      </body>
    </html>
  );
}
