"use client";

import { Notification } from "@/lib/notification-types";
import {
  BellIcon,
  CreditCardIcon,
  LineChartIcon,
  InfoIcon,
  TrashIcon,
  MoreHorizontalIcon,
  CheckIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationCardProps) {
  const t = useTranslations("Notifications");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const getIcon = () => {
    switch (notification.type) {
      case "alert":
        return <BellIcon className="h-5 w-5 text-orange-500" />;
      case "signal":
        return <LineChartIcon className="h-5 w-5 text-green-500" />;
      case "account":
        return <CreditCardIcon className="h-5 w-5 text-blue-500" />;
      case "system":
      default:
        return <InfoIcon className="h-5 w-5 text-slate-400" />;
    }
  };

  const handleClick = () => {
    if (notification.link) {
      router.push(notification.link);
    }

    if (!notification.read) {
      handleMarkAsRead();
    }
  };

  const handleMarkAsRead = async () => {
    if (loading) return;

    setLoading(true);
    try {
      await onMarkAsRead(notification.id);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (loading) return;

    setLoading(true);
    try {
      await onDelete(notification.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "group relative rounded-lg p-4 transition-colors",
        notification.read
          ? "bg-slate-800/50 hover:bg-slate-800"
          : "bg-slate-700 hover:bg-slate-600",
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            notification.type === "alert" && "bg-orange-500/20",
            notification.type === "signal" && "bg-green-500/20",
            notification.type === "account" && "bg-blue-500/20",
            notification.type === "system" && "bg-slate-600/30",
          )}
        >
          {getIcon()}
        </div>

        <div
          className={cn(
            "flex-1 cursor-pointer",
            notification.link && "hover:underline",
          )}
          onClick={handleClick}
        >
          <h3
            className={cn(
              "text-base font-medium",
              !notification.read
                ? "font-semibold text-white"
                : "text-slate-200",
            )}
          >
            {notification.title}
          </h3>
          <p className="mt-1 text-sm text-slate-300">{notification.message}</p>
          <p className="mt-2 text-xs text-slate-400">
            {formatDistanceToNow(new Date(notification.timestamp), {
              addSuffix: true,
            })}
          </p>
        </div>

        <div className="ml-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
              >
                <MoreHorizontalIcon className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!notification.read && (
                <DropdownMenuItem onClick={handleMarkAsRead} disabled={loading}>
                  <CheckIcon className="mr-2 h-4 w-4" />
                  <span>{t("markAsRead")}</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={loading}
                className="text-red-500"
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                <span>{t("delete")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {!notification.read && (
        <div className="absolute right-4 top-4">
          <div className="h-2 w-2 rounded-full bg-blue-400" />
        </div>
      )}
    </div>
  );
}
