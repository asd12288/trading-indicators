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
import { useUser } from "@/providers/UserProvider";
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
  const { user } = useUser();
  const [notificationType, setNotificationType] = useState("signal");
  const [isGenerating, setIsGenerating] = useState(false);

  if (!user) {
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
    setIsGenerating(true);
    try {
      switch (notificationType) {
        case "signal":
          await NotificationService.notifySignal(user.id, {
            instrumentName: "EURUSD",
            direction: "BUY",
            price: 1.0923,
          });
          break;
        case "system":
          await NotificationService.notifySystem(user.id, {
            title: "System Update",
            message: "The system will be updated in 2 hours.",
          });
          break;
        case "account":
          await NotificationService.notifyAccount(user.id, {
            title: "Account Status",
            message: "Your account is in good standing.",
          });
          break;
        case "price":
          await NotificationService.notifyPriceAlert(user.id, {
            instrumentName: "GOLD",
            price: 1923.45,
            condition: "above",
            targetPrice: 1920.0,
          });
          break;
      }
      toast({
        title: "Test notification sent",
        description:
          "Check your notification panel to see the test notification",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate test notification",
        variant: "destructive",
      });
      console.error("Failed to generate notification:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="bg-slate-900 text-white">
      <CardHeader>
        <CardTitle>Test Notification System</CardTitle>
        <CardDescription className="text-slate-300">
          Generate test notifications to verify they're working correctly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="notification-type">Notification Type</Label>
          <Select value={notificationType} onValueChange={setNotificationType}>
            <SelectTrigger
              id="notification-type"
              className="border-slate-700 bg-slate-800 text-slate-200"
            >
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="border-slate-700 bg-slate-800 text-slate-200">
              <SelectItem value="signal">Trade Signal</SelectItem>
              <SelectItem value="system">System Update</SelectItem>
              <SelectItem value="account">Account Status</SelectItem>
              <SelectItem value="price">Price Alert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="w-full"
          onClick={generateNotification}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate Test Notification"}
        </Button>
      </CardContent>
    </Card>
  );
}
