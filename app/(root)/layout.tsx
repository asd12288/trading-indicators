import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { Poppins } from "next/font/google";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fast Signals",
  description: "Get the best signals for your trades",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body className={`${poppins.className} antialiased`}>
        <Header />
        <main>{children}</main>
        <Toaster />
        <Footer />
        <script
          async
          src="https://telegram.org/js/telegram-widget.js?22"
          data-telegram-login="World_Trade_Signals_Bot"
          data-size="large"
          data-onauth="onTelegramAuth(user)"
          data-request-access="write"
        ></script>
      </body>
    </html>
  );
}
