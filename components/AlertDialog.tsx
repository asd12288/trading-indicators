"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert } from "@/types";

interface HistoricalPrice {
  date: string;
  price: number;
}
import { format } from "date-fns";
import {
  BarChart3,
  Bell,
  Clock,
  TrendingDown,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface AlertDialogProps {
  alert: Alert | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AlertDetailDialog = ({ alert, open, onOpenChange }: AlertDialogProps) => {
  const router = useRouter();
  const [historicalData, setHistoricalData] = useState<HistoricalPrice[]>([]);
  const [relatedAlerts, setRelatedAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    if (alert) {
      // Fetch historical data for this instrument
      // This would normally call an API endpoint
      setHistoricalData([
        { date: new Date().toISOString(), price: alert.price * 0.98 },
        { date: new Date().toISOString(), price: alert.price * 0.99 },
        { date: new Date().toISOString(), price: alert.price },
        { date: new Date().toISOString(), price: alert.price * 1.01 },
        { date: new Date().toISOString(), price: alert.price * 1.02 },
      ]);

      // Fetch related alerts
      setRelatedAlerts([
        // Sample related alerts
        {
          ...alert,
          id: "related-1",
          time_utc: new Date(
            new Date().getTime() - 1000 * 60 * 60,
          ).toISOString(),
        },
        {
          ...alert,
          id: "related-2",
          time_utc: new Date(
            new Date().getTime() - 1000 * 60 * 120,
          ).toISOString(),
          trade_direction: alert.trade_direction === "LONG" ? "SHORT" : "LONG",
        },
      ]);
    }
  }, [alert]);

  if (!alert) return null;

  const isLong = alert.trade_direction === "LONG";
  const actualTime = alert.time_utc || alert.time;

  const handleViewInstrument = () => {
    router.push(`/smart-alerts/${alert.instrument_name}`);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  isLong ? "bg-green-900/30" : "bg-red-900/30"
                }`}
              >
                {isLong ? (
                  <TrendingUp className="h-5 w-5 text-green-400" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-400" />
                )}
              </div>
              <AlertDialogTitle className="text-xl">
                {alert.instrument_name} Alert
              </AlertDialogTitle>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                isLong
                  ? "bg-green-900/30 text-green-400"
                  : "bg-red-900/30 text-red-400"
              }`}
            >
              {isLong ? "Bullish" : "Bearish"}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-slate-400">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                {actualTime &&
                  format(new Date(actualTime), "MMMM d, yyyy HH:mm:ss")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              <span className="text-sm">
                Priority: {alert.priority || "Medium"}
              </span>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="my-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
            <h3 className="mb-2 text-sm font-medium text-slate-400">Price</h3>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-2xl font-bold ${isLong ? "text-green-400" : "text-red-400"}`}
              >
                {typeof alert.price === "number"
                  ? alert.price.toFixed(2)
                  : alert.price}
              </span>
              <span className="text-sm text-slate-400">USD</span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
            <h3 className="mb-2 text-sm font-medium text-slate-400">
              24h Change
            </h3>
            <div className="flex items-baseline gap-1">
              <BarChart3
                className={`h-5 w-5 ${isLong ? "text-green-400" : "text-red-400"}`}
              />
              <span
                className={`text-2xl font-bold ${isLong ? "text-green-400" : "text-red-400"}`}
              >
                {isLong ? "+" : "-"}
                {Math.random().toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <AlertDialogDescription className="space-y-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
            <h3 className="mb-3 font-medium">Signal Details</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-slate-400">Signal Type</span>
                <span>{alert.type || "Price Level"}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-400">Time Frame</span>
                <span>{alert.timeFrame || "4H"}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-400">Confidence</span>
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-16 rounded-full bg-slate-700">
                    <div
                      className={`h-2 rounded-full ${isLong ? "bg-green-500" : "bg-red-500"}`}
                      style={{ width: `${Math.random() * 80 + 20}%` }}
                    ></div>
                  </div>
                  <span>{Math.floor(Math.random() * 30 + 70)}%</span>
                </div>
              </li>
            </ul>
          </div>

          {relatedAlerts.length > 0 && (
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <h3 className="mb-3 font-medium">Previous Signals</h3>
              <div className="space-y-2">
                {relatedAlerts.map((relAlert) => (
                  <div
                    key={relAlert.id}
                    className="flex items-center justify-between rounded-lg bg-slate-800/50 p-2"
                  >
                    <div className="flex items-center gap-2">
                      {relAlert.trade_direction === "LONG" ? (
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-400" />
                      )}
                      <span>
                        {format(new Date(relAlert.time_utc), "MMM d, HH:mm")}
                      </span>
                    </div>
                    <span
                      className={`font-medium ${
                        relAlert.trade_direction === "LONG"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {typeof relAlert.price === "number"
                        ? relAlert.price.toFixed(2)
                        : relAlert.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </AlertDialogDescription>

        <AlertDialogFooter className="mt-6 gap-2">
          <AlertDialogCancel>Close</AlertDialogCancel>
          <Button
            variant="outline"
            onClick={handleViewInstrument}
            className="flex items-center gap-1"
          >
            View {alert.instrument_name}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <AlertDialogAction>
            {isLong ? "Go Long" : "Go Short"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDetailDialog;
