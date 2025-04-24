import Header from "@/components/Header";
import Footer from "@/components/layout/Footer";
import { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: {
    default: "Trader Map",
    template: "%s | Trader Map",
  },
  description: "Get the best Smart Alerts for your trades",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
