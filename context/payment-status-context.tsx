"use client";

import { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "payment_status_info";

export type PaymentInfo = {
  success: boolean;
  method?: string;
  amount?: string;
  date?: string;
  planType?: string;
  acknowledged: boolean;
};

type PaymentStatusContextType = {
  paymentInfo: PaymentInfo | null;
  setPaymentSuccess: (info: Omit<PaymentInfo, "acknowledged">) => void;
  clearPaymentInfo: () => void;
  acknowledgePaymentInfo: () => void;
};

const PaymentStatusContext = createContext<
  PaymentStatusContextType | undefined
>(undefined);

export function PaymentStatusProvider({ children }) {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);

  // Load payment info from storage on mount
  useEffect(() => {
    const storedInfo = localStorage.getItem(STORAGE_KEY);
    if (storedInfo) {
      try {
        const parsedInfo = JSON.parse(storedInfo);
        setPaymentInfo(parsedInfo);
      } catch (e) {
        console.error("Failed to parse payment info", e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const setPaymentSuccess = (info: Omit<PaymentInfo, "acknowledged">) => {
    const newInfo = { ...info, acknowledged: false };
    setPaymentInfo(newInfo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newInfo));
  };

  const clearPaymentInfo = () => {
    setPaymentInfo(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const acknowledgePaymentInfo = () => {
    if (paymentInfo) {
      const updatedInfo = { ...paymentInfo, acknowledged: true };
      setPaymentInfo(updatedInfo);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInfo));
    }
  };

  return (
    <PaymentStatusContext.Provider
      value={{
        paymentInfo,
        setPaymentSuccess,
        clearPaymentInfo,
        acknowledgePaymentInfo,
      }}
    >
      {children}
    </PaymentStatusContext.Provider>
  );
}

export function usePaymentStatus() {
  const context = useContext(PaymentStatusContext);
  if (context === undefined) {
    throw new Error(
      "usePaymentStatus must be used within a PaymentStatusProvider",
    );
  }
  return context;
}
