"use client";
import { useState } from "react";
import PlanSelector from "@/components/PlanSelector";
import PaypalSubscribeButton from "@/components/PaypalButton";
import NowPaymentsButton from "@/components/NowPaymentsButton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function UpgradePage({ user }) {
  const [selectedPlan, setSelectedPlan] = useState("monthly");

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-2xl font-bold mb-6">Upgrade Your Account</h1>
      
      <PlanSelector onPlanChange={setSelectedPlan} />
      
      <Card className="bg-slate-900/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">
            {selectedPlan === "lifetime" ? "One-time Payment" : "Monthly Subscription"}
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <PaypalSubscribeButton user={user} plan={selectedPlan} />
            <div className="flex flex-col items-center justify-center">
              <Separator className="md:hidden mb-6" />
              <p className="text-center text-slate-400 mb-4">or</p>
              <NowPaymentsButton user={user} plan={selectedPlan} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
