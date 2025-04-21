"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/use-notifications";
import { BellIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import NotificationPanel from "./NotificationPanel";

export default function NotificationBell({ userId }: { userId?: string }) {
  const t = useTranslations("Notifications");
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    loading,
    refetch,
    bulkDelete,
  } = useNotifications(userId);
  const [hasPulse, setHasPulse] = useState(false);

  // Handle clearing all notifications
  const handleClearAll = async () => {
    if (!notifications || notifications.length === 0) return;

    // Get all notification IDs
    const notificationIds = notifications.map((n) => n.id);
    await bulkDelete(notificationIds);
  };

  // Animate the bell when new notifications arrive
  useEffect(() => {
    if (unreadCount > 0) {
      setHasPulse(true);
      const timer = setTimeout(() => setHasPulse(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount, notifications.length]);

  // Auto-check for new notifications periodically
  useEffect(() => {
    if (!userId) return;

    const intervalId = setInterval(() => {
      refetch();
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [userId, refetch]);

  if (!userId) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 p-0" // More compact button
          aria-label={t("aria.notifications")}
        >
          <BellIcon
            className={`h-4 w-4 ${hasPulse ? "animate-pulse text-amber-400" : ""}`}
          />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-medium text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-72 border-slate-700 bg-slate-800 p-0 md:w-80"
      >
        <NotificationPanel
          notifications={notifications}
          loading={loading}
          onMarkAllAsRead={markAllAsRead}
          onClearAll={handleClearAll}
          unreadCount={unreadCount}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
