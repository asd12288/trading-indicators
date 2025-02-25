import type { Metadata } from "next";
import Header from "@/components/Header";
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "@/app/[locale]/(admin)/global.css";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trader Map",
  description: "Get the best signals for your trades",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="h-screen">{children}</main>
      <Toaster />
    </>
  );
}
