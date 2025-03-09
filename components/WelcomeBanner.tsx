"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePaymentStatus } from "@/context/payment-status-context";
import { X, ChevronDown, ChevronUp, Gift } from "lucide-react";
import { Button } from "./ui/button";

export default function WelcomeBanner() {
  const { paymentInfo, acknowledgePaymentInfo } = usePaymentStatus();
  const [isExpanded, setIsExpanded] = useState(false);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Show banner if there's unacknowledged payment info
    if (paymentInfo && !paymentInfo.acknowledged) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [paymentInfo]);
  
  const handleClose = () => {
    setVisible(false);
    acknowledgePaymentInfo();
  };

  if (!visible || !paymentInfo) return null;
  
  const planTypeDisplay = paymentInfo.planType === 'lifetime' ? 'Lifetime Access' : 'Monthly Plan';
  
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed bottom-0 left-0 right-0 z-50 mx-auto mb-4 max-w-3xl px-4"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="overflow-hidden rounded-lg border border-emerald-500/30 bg-gradient-to-r from-slate-900/95 to-slate-800/95 shadow-lg backdrop-blur">
          <div className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                  <Gift className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Welcome to Trader Map Pro!</h3>
                  <p className="text-sm text-slate-300">
                    Your {planTypeDisplay} is now active.
                  </p>
                </div>
              </div>
              
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex w-full items-center justify-between text-left text-xs text-slate-400"
              >
                <span>
                  {isExpanded ? "Hide details" : "View subscription details"}
                </span>
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </Button>
              
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-3 overflow-hidden rounded border border-slate-700 bg-slate-800/50"
                >
                  <dl className="divide-y divide-slate-700/50 px-4 py-3 text-sm">
                    <div className="flex justify-between py-2">
                      <dt className="text-slate-400">Payment method</dt>
                      <dd className="font-medium text-slate-200">{paymentInfo.method || "Credit Card"}</dd>
                    </div>
                    <div className="flex justify-between py-2">
                      <dt className="text-slate-400">Amount</dt>
                      <dd className="font-medium text-slate-200">{paymentInfo.amount || "-"}</dd>
                    </div>
                    <div className="flex justify-between py-2">
                      <dt className="text-slate-400">Date</dt>
                      <dd className="font-medium text-slate-200">
                        {paymentInfo.date 
                          ? new Date(paymentInfo.date).toLocaleDateString() 
                          : new Date().toLocaleDateString()}
                      </dd>
                    </div>
                    <div className="flex justify-between py-2">
                      <dt className="text-slate-400">Plan type</dt>
                      <dd className="font-medium text-slate-200">{planTypeDisplay}</dd>
                    </div>
                  </dl>
                </motion.div>
              )}
              
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="flex-1 border-slate-700" asChild>
                  <a href="/tutorial">View Tutorial</a>
                </Button>
                <Button variant="default" size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700" asChild>
                  <a href="/smart-alerts">Go to Dashboard</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
