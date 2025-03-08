"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  popular?: boolean;
  tier: string;
  billingPeriod: 'monthly' | 'oneTime';
}

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  description,
  features,
  cta,
  href,
  popular = false,
  tier,
  billingPeriod,
}) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-xl border ${
        popular
          ? "border-blue-500/50 bg-gradient-to-b from-blue-900/20 to-slate-900/90"
          : "border-slate-700/50 bg-slate-800/50"
      } shadow-lg backdrop-blur-sm`}
    >
      {popular && (
        <div className="absolute -right-12 top-6 rotate-45 bg-blue-600 px-12 py-1 text-sm font-medium text-white">
          Best Value
        </div>
      )}

      <div className="p-6 md:p-8">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <div className="mt-4 flex items-baseline">
          <span className="text-4xl font-extrabold text-white">${price}</span>
          {billingPeriod === 'monthly' && (
            <span className="ml-1 text-xl text-slate-400">/mo</span>
          )}
          {billingPeriod === 'oneTime' && (
            <span className="ml-1 text-xl text-slate-400">
              <span className="text-emerald-400 font-medium">one-time</span>
            </span>
          )}
        </div>
        <p className="mt-6 text-slate-300">{description}</p>

        <ul className="mt-6 space-y-4 text-sm">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0">
                <Check className="h-5 w-5 text-emerald-400" />
              </div>
              <p className="ml-3 text-slate-300">{feature}</p>
            </li>
          ))}
        </ul>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push(href)}
          className={`mt-8 block w-full rounded-lg ${
            popular
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              : tier === "free" 
                ? "bg-slate-700 hover:bg-slate-600" 
                : "bg-blue-600 hover:bg-blue-700"
          } px-4 py-3 text-center font-semibold text-white shadow-md transition-colors`}
        >
          {cta}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PricingCard;
