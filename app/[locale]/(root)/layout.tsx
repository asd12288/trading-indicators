import "./globals.css";
import { Metadata } from "next";
import { getMessages } from "next-intl/server";
import { Poppins } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/layout/Footer";

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
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
