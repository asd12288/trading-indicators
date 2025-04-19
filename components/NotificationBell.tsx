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
import useSession from "@/hooks/useSession";

export default function NotificationBell() {
  const { session, isLoading } = useSession();
  const userId = session?.user?.id;
  const t = useTranslations("Notifications");
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    loading: notificationsLoading,
    refetch,
    bulkDelete,
  } = useNotifications(userId);
  const [hasPulse, setHasPulse] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Handle clearing all notifications
  const handleClearAll = async () => {
    if (!notifications || notifications.length === 0) return;
    const notificationIds = notifications.map((n) => n.id);
    await bulkDelete(notificationIds);
  };

  // Force refresh notifications when dropdown opens
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && userId) {
      refetch();
    }
  };

  // Animate the bell when new notifications arrive
  useEffect(() => {
    if (unreadCount > 0) {
      setHasPulse(true);
      const timer = setTimeout(() => setHasPulse(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  // Auto-check for new notifications periodically
  useEffect(() => {
    if (!userId) return;

    // Initial fetch
    refetch();

    const intervalId = setInterval(() => {
      if (!isOpen) { // Only auto-refresh when dropdown is closed
        refetch();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(intervalId);
  }, [userId, refetch, isOpen]);

  // Only show if user is authenticated
  if (!userId || isLoading) {
    return null;
  }

  // Always render the bell for authenticated users
  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 p-0"
          aria-label={t("aria.notifications")}
        >
          <BellIcon className={hasPulse ? "text-amber-400 animate-pulse" : "text-slate-400 hover:text-slate-300"} />
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
          loading={notificationsLoading}
          onMarkAllAsRead={markAllAsRead}
          onClearAll={handleClearAll}
          unreadCount={unreadCount}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
