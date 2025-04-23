"use client";

import { Notification } from "@/types/notifications";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  Info,
  AlertTriangle,
  User,
  LineChart,
  Check,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
}

export default function NotificationItem({
  notification,
  onRead,
}: NotificationItemProps) {
  const router = useRouter();

  // Get icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case "account":
        return <User className="h-4 w-4 text-blue-400" />;
      case "trade":
        return <LineChart className="h-4 w-4 text-green-400" />;
      case "system":
      case "info":
      default:
        return <Info className="h-4 w-4 text-slate-400" />;
    }
  };

  // Handle click on the notification
  const handleClick = () => {
    // Mark as read
    if (!notification.is_read) {
      onRead(notification.id);
    }

    // Navigate to link if available
    if (notification.link) {
      router.push(notification.link);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group flex cursor-pointer items-start gap-3 rounded-md p-3 transition-colors hover:bg-slate-800 ${
        notification.is_read ? "bg-slate-900/40" : "bg-slate-800/80"
      }`}
    >
      {/* Icon */}
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full ${
          notification.is_read ? "bg-slate-800" : "bg-slate-700"
        }`}
      >
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4
            className={`font-medium ${
              notification.is_read ? "text-slate-300" : "text-white"
            }`}
          >
            {notification.title}
          </h4>
          {!notification.is_read && (
            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
          )}
        </div>
        <p className="text-sm text-slate-400">{notification.message}</p>

        {/* Link if available */}
        {notification.link && (
          <div className="flex items-center pt-1 text-xs text-blue-400 group-hover:underline">
            <span>
              {notification.additional_data?.link_text || "View details"}
            </span>
            <ExternalLink className="ml-1 h-3 w-3" />
          </div>
        )}

        {/* Timestamp */}
        <div className="text-xs text-slate-500">
          {formatDistanceToNow(new Date(notification.created_at), {
            addSuffix: true,
          })}
        </div>
      </div>

      {/* Read indicator/button */}
      {notification.is_read ? (
        <div className="flex h-6 w-6 items-center justify-center text-slate-600">
          <Check className="h-4 w-4" />
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRead(notification.id);
          }}
          className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-slate-700 hover:text-white"
          aria-label="Mark as read"
        >
          <Check className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
