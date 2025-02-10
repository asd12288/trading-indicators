import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { Poppins } from "next/font/google";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

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
      <body className={`${poppins.className} antialiased`}>
        <Header />
        <main>{children}</main>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
