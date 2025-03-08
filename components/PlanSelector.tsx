"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Infinity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

type PlanType = "monthly" | "lifetime";

interface PlanSelectorProps {
  onPlanChange: (plan: PlanType) => void;
}

export default function PlanSelector({ onPlanChange }: PlanSelectorProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("monthly");

  const handlePlanChange = (plan: PlanType) => {
    setSelectedPlan(plan);
    onPlanChange(plan);
  };

  return (
    <div className="mb-8 space-y-6">
      <h2 className="text-xl font-semibold text-center">Select Your Plan</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        {/* Monthly Plan */}
        <PlanCard
          title="Monthly Plan"
          price="$65"
          period="per month"
          features={[
            "Access to all smart alerts",
            "Analysis of all instruments",
            "Telegram notifications",
            "Custom smart alert preferences",
            "Cancel anytime"
          ]}
          isSelected={selectedPlan === "monthly"}
          onClick={() => handlePlanChange("monthly")}
        />
        
        {/* Lifetime Plan */}
        <PlanCard
          title="Lifetime Access"
          price="$800"
          period="one-time payment"
          features={[
            "All Monthly Plan features",
            "Never pay again",
            "All future updates included",
            "VIP priority support",
            "Best value for serious traders"
          ]}
          isSelected={selectedPlan === "lifetime"}
          onClick={() => handlePlanChange("lifetime")}
          isRecommended={true}
        />
      </div>
    </div>
  );
}

interface PlanCardProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  isSelected: boolean;
  onClick: () => void;
  isRecommended?: boolean;
}

function PlanCard({ title, price, period, features, isSelected, onClick, isRecommended = false }: PlanCardProps) {
  return (
    <motion.div
      whileHover={{ scale: isSelected ? 1 : 1.02 }}
      onClick={onClick}
    >
      <Card className={cn(
        "border-2 cursor-pointer transition-all relative",
        isSelected 
          ? "border-blue-500 shadow-lg shadow-blue-500/20" 
          : "border-slate-700"
      )}>
        {isRecommended && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            BEST VALUE
          </div>
        )}
        
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-center">{title}</CardTitle>
          <div className="text-center">
            <span className="text-3xl font-bold">{price}</span>
            <span className="text-slate-400 text-sm ml-1">
              {period}
            </span>
          </div>
        </CardHeader>
        
        <CardContent>
          <ul className="space-y-2">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          
          {isSelected && (
            <div className="mt-4 text-center bg-blue-500/10 py-2 rounded-md text-blue-400 text-sm font-medium">
              Selected
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
