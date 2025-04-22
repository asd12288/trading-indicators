"use client";

import { Bell } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import NotificationPanel from "./NotificationPanel";

interface NotificationBellProps {
  userId: string;
}

export default function NotificationBell({ userId }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const { notifications, counts, loading, markAsRead, markAllAsRead } = useNotifications(userId);

  // Track previous unread count
  const [prevUnreadCount, setPrevUnreadCount] = useState(0);

  useEffect(() => {
    // Just update the previous count
    setPrevUnreadCount(counts.unread);
  }, [counts.unread]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button 
          className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {counts.unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white">
              {counts.unread > 9 ? '9+' : counts.unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        className="p-0"
        sideOffset={10}
      >
        <NotificationPanel 
          notifications={notifications}
          loading={loading}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          unreadCount={counts.unread}
        />
      </PopoverContent>
    </Popover>
  );
}
