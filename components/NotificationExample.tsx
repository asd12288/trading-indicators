"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

/**
 * Demo component to test notifications - DISABLED
 * This component has been disabled as part of removing all notification functionality
 */
export default function NotificationExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Testing</CardTitle>
        <CardDescription>
          Notification functionality has been disabled
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
