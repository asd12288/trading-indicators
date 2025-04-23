import Footer from "@/components/Footer";
import { Metadata } from "next";
\import { Poppins } from "next/font/google";
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

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />{" "}
    </>
  );
}
