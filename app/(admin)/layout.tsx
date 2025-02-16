import type { Metadata } from "next";
import Header from "@/components/Header";
import { Poppins } from "next/font/google";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import "@/app/(admin)/global.css";

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
        <main className="h-screen">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
