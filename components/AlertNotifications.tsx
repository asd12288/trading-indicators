"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import useAlerts from "@/hooks/useAlerts";

import { Alert } from "@/lib/types";
import { ArrowDown, ArrowUp, Bell } from "lucide-react";
import useSession from "@/hooks/useSession";

const AlertNotifications = () => {
  const { toast } = useToast();
  const { session } = useSession();
  const userId = session?.user?.id;

  // We pass the user's ID to get their personalized alerts
  const { onNewAlert } = useAlerts(userId);
  const router = useRouter();

  useEffect(() => {
    // Only set up the notification system if the user is logged in
    if (!userId) return;

    // Subscribe to new alerts
    const unsubscribe = onNewAlert((alert: Alert) => {
      // Show a toast notification for this new alert
      toast({
        title: `New Signal: ${alert.instrument_name}`,
        description: (
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-1">
              <span>
                {alert.trade_side === "BUY" ? (
                  <ArrowUp className="inline h-4 w-4 text-emerald-500" />
                ) : (
                  <ArrowDown className="inline h-4 w-4 text-rose-500" />
                )}
              </span>
              <span>{alert.trade_side}</span>
              <span className="ml-1 text-xs">
                @ {formatPrice(alert.entry_price)}
              </span>
            </div>
            <span
              onClick={() => router.push(`/signals/${alert.instrument_name}`)}
              className="mt-1 cursor-pointer text-sm text-blue-500 hover:underline"
            >
              View signal details
            </span>
          </div>
        ),
        variant: "default",
        duration: 8000, // Show for 8 seconds
      });
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, [toast, onNewAlert, userId, router]);

  // Helper function to format prices consistently
  const formatPrice = (price: number) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 5,
    }).format(price);
  };

  // This component doesn't render anything visually
  return null;
};

export default AlertNotifications;
