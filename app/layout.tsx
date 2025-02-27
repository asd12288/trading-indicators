import Footer from "@/components/Footer";
import "./globals.css";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Trader Map",
    template: "%s | Trader Map",
  },
  description: "Get the best Smart Alerts for your trades",
};

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
      <body className={`${poppins.className} antialiased`}>
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <Header />
          <main>{children}</main>
          <Toaster />
          <Footer />{" "}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
