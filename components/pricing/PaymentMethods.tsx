"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { 
  Bitcoin, 
  CreditCard, 
  DollarSign,
  ShieldCheck 
} from "lucide-react";
import Image from "next/image";

const PaymentMethods = () => {
  const t = useTranslations("PricingPage.payments");

  // Payment method logos
  const cryptoMethods = [
    { name: "Bitcoin", logo: "public/images/coins/btc.svg" },
    { name: "Ethereum", logo: "public/images/coins/eth.svg" },
    { name: "USDC", logo: "public/images/coins/usdc.svg" },
    { name: "USDT", logo: "public/images/coins/udst.svg" },
  ];

  const traditionalMethods = [
    { name: "Visa", logo: "/images/payment/visa.svg" },
    { name: "Mastercard", logo: "/images/payment/mastercard.svg" },
    { name: "PayPal", logo: "/images/payment/paypal.svg" },
    { name: "ApplePay", logo: "/images/payment/apple-pay.svg" },
  ];

  return (
    <section className="py-16 bg-slate-900/40">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-white">{t("title")}</h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Traditional Payment Methods */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-slate-700/50 p-3 rounded-full">
                <CreditCard className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">{t("traditional.title")}</h3>
            </div>
            
            <p className="text-slate-300 mb-6">{t("traditional.description")}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {traditionalMethods.map((method) => (
                <div key={method.name} className="flex flex-col items-center bg-slate-700/30 p-3 rounded-lg">
                  <div className="h-12 w-12 relative mb-2">
                    <div className="h-12 w-12 bg-slate-600/50 rounded-md"></div>
                  </div>
                  <span className="text-sm text-slate-300">{method.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Crypto Payment Methods */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-blue-700/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-900/30 p-3 rounded-full">
                <Bitcoin className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">{t("crypto.title")}</h3>
            </div>
            
            <p className="text-slate-300 mb-6">{t("crypto.description")}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cryptoMethods.map((crypto) => (
                <div key={crypto.name} className="flex flex-col items-center bg-slate-700/30 p-3 rounded-lg">
                  <div className="h-12 w-12 relative mb-2">
                    <div className="h-12 w-12 bg-slate-600/50 rounded-md"></div>
                  </div>
                  <span className="text-sm text-slate-300">{crypto.name}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 bg-blue-900/20 p-3 rounded-lg border border-blue-700/20">
              <div className="flex items-center gap-2 text-blue-400">
                <ShieldCheck className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">{t("crypto.discount")}</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-8 text-center text-sm text-slate-400">
          {t("securePayment")}
        </div>
      </div>
    </section>
  );
};

export default PaymentMethods;
