"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NotificationService } from "@/lib/notification-service";
import useSession from "@/hooks/useSession";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

/**
 * Demo component to test notifications
 * This allows you to generate test notifications of each type
 */
export default function NotificationExample() {
  const { session } = useSession();
  const userId = session?.user?.id;
  const [notificationType, setNotificationType] = useState("signal");
  const [isGenerating, setIsGenerating] = useState(false);

  if (!userId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notification Test</CardTitle>
          <CardDescription>
            You need to be logged in to test notifications
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const generateNotification = async () => {
    if (!userId) return;

    try {
      setIsGenerating(true);

      let result = false;

      switch (notificationType) {
        case "signal":
          result = await NotificationService.notifyNewSignal(
            userId,
            "ES",
            "LONG",
          );
          break;
        case "price":
          result = await NotificationService.notifyPriceBreakout(
            userId,
            "NQ",
            15000,
            "resistance",
            "1H",
          );
          break;
        case "volatility":
          result = await NotificationService.notifyVolatilityChange(
            userId,
            "RTY",
            "increasing",
            15.7,
          );
          break;
        case "pattern":
          result = await NotificationService.notifyPatternDetected(
            userId,
            "ES",
            "Double Bottom",
            "high",
            "4H",
          );
          break;
        case "economic":
          result = await NotificationService.notifyEconomicEvent(
            userId,
            "FOMC Interest Rate Decision",
            "high",
            "1 hour",
            ["ES", "NQ", "RTY"],
          );
          break;
        case "milestone":
          result = await NotificationService.notifyTradingMilestone(
            userId,
            "win-streak",
            5,
          );
          break;
        case "subscription":
          result = await NotificationService.notifySubscriptionReminder(
            userId,
            3,
          );
          break;
        case "risk":
          result = await NotificationService.notifyRiskLevelChange(
            userId,
            "ES",
            "high",
            "medium",
          );
          break;
        default:
          result = await NotificationService.notifySystem(
            userId,
            "System Notification",
            "This is a test system notification",
          );
      }

      if (result) {
        toast({
          title: "Notification created",
          description: `A ${notificationType} notification was created successfully.`,
        });
      } else {
        toast({
          title: "Notification failed",
          description: `The notification wasn't created. Check your preferences or the console for errors.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating test notification:", error);
      toast({
        title: "Error",
        description: "Failed to create notification. See console for details.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full border border-slate-700 bg-slate-800/30">
      <CardHeader>
        <CardTitle className="text-xl text-slate-100">
          Test Notifications
        </CardTitle>
        <CardDescription className="text-slate-400">
          Generate a test notification to see how they work
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="notificationType">Notification Type</Label>
          <Select value={notificationType} onValueChange={setNotificationType}>
            <SelectTrigger id="notificationType">
              <SelectValue placeholder="Select notification type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="signal">Trading Signal</SelectItem>
              <SelectItem value="price">Price Breakout</SelectItem>
              <SelectItem value="volatility">Volatility Alert</SelectItem>
              <SelectItem value="pattern">Chart Pattern</SelectItem>
              <SelectItem value="economic">Economic Event</SelectItem>
              <SelectItem value="milestone">Trading Milestone</SelectItem>
              <SelectItem value="subscription">
                Subscription Reminder
              </SelectItem>
              <SelectItem value="risk">Risk Level Change</SelectItem>
              <SelectItem value="system">System Notification</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={generateNotification}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? "Generating..." : "Generate Test Notification"}
        </Button>

        <div className="rounded-md bg-blue-900/30 p-3 text-sm text-slate-300">
          <p>
            <strong>How notifications work:</strong>
          </p>
          <ol className="mt-2 space-y-1 pl-5">
            <li>1. An event occurs (signal created, price breakout, etc.)</li>
            <li>2. The system checks your notification preferences</li>
            <li>3. If enabled, a notification is created in the database</li>
            <li>4. The notification bell shows your new notification</li>
            <li>
              5. Depending on settings, you may also get Telegram notifications
            </li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
