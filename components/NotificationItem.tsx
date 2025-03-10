import {
  BellIcon,
  CreditCardIcon,
  LineChartIcon,
  InfoIcon,
} from "lucide-react";
import { formatDistanceToNow, differenceInHours } from "date-fns";
import { cn } from "@/lib/utils";
import { Notification } from "@/lib/notification-types";
import { useRouter } from "@/i18n/routing";

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
}

export default function NotificationItem({
  notification,
  onClick,
}: NotificationItemProps) {
  const router = useRouter();

  // Get the appropriate icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case "alert":
        return <BellIcon className="h-3.5 w-3.5 text-orange-400" />;
      case "signal":
        return <LineChartIcon className="h-3.5 w-3.5 text-green-400" />;
      case "account":
        return <CreditCardIcon className="h-3.5 w-3.5 text-blue-400" />;
      case "system":
      default:
        return <InfoIcon className="h-3.5 w-3.5 text-slate-300" />;
    }
  };

  // Format timestamp with more robust handling
  const formatTimeAgo = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();

      // Log for debugging
      console.log(
        `Notification timestamp: ${timestamp}, parsed as: ${date.toISOString()}`,
      );

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn("Invalid timestamp:", timestamp);
        return "recently";
      }

      // Check for timezone or future date issues
      if (date > now || differenceInHours(now, date) > 24) {
        console.warn(`Suspicious timestamp difference: ${timestamp}`);
      }

      return formatDistanceToNow(date, {
        addSuffix: true,
        includeSeconds: true,
      });
    } catch (e) {
      console.error("Error formatting time:", e);
      return "recently";
    }
  };

  // Handle click with proper link navigation
  const handleClick = () => {
    // If there's a valid link, navigate to it
    if (notification.link) {
      router.push(notification.link);
    }

    // Always call the onClick handler (for marking as read, etc.)
    onClick();
  };

  return (
    <button
      className={cn(
        "w-full px-2 py-1.5 text-left transition-colors",
        notification.read
          ? "bg-slate-800/70 hover:bg-slate-700"
          : "bg-slate-700 hover:bg-slate-600",
        notification.link ? "cursor-pointer" : "cursor-default",
      )}
      onClick={handleClick}
      disabled={!notification.link && !onClick}
    >
      <div className="flex items-start gap-2">
        <div className="mt-0.5 rounded-full bg-slate-900 p-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 space-y-0.5">
          <p
            className={cn(
              "text-xs font-medium leading-tight",
              !notification.read ? "text-white" : "text-slate-200",
            )}
          >
            {notification.title}
          </p>
          <p className="text-[10px] leading-tight text-slate-300">
            {notification.message}
          </p>
          <p className="text-[9px] text-slate-400">
            {formatTimeAgo(notification.timestamp)}
          </p>
        </div>
        {!notification.read && (
          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400"></div>
        )}
      </div>
    </button>
  );
}
