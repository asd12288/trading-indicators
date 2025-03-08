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
import { useEffect } from "react";
import NotificationPanel from "./NotificationPanel";

export default function NotificationBell({ userId }: { userId?: string }) {
  const t = useTranslations("Notifications");
  const { notifications, unreadCount, markAllAsRead, loading } =
    useNotifications(userId);

  // Auto-check for new notifications
  useEffect(() => {
    const intervalId = setInterval(() => {
      // This would be implemented in your hook if needed
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

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
          <BellIcon className="h-4 w-4" /> {/* Smaller icon */}
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
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
