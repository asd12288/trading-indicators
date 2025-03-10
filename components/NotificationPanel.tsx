import { Notification } from "@/lib/notification-types";
import { useTranslations } from "next-intl";
import { Loader2, BellOff, Check, Trash2 } from "lucide-react";
import NotificationItem from "./NotificationItem";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface NotificationPanelProps {
  notifications: Notification[];
  loading: boolean;
  onMarkAllAsRead: () => Promise<void>;
  unreadCount?: number;
  onClearAll?: () => Promise<void>;
}

export default function NotificationPanel({
  notifications,
  loading,
  onMarkAllAsRead,
  unreadCount = 0,
  onClearAll,
}: NotificationPanelProps) {
  const t = useTranslations("Notifications");
  const [markingRead, setMarkingRead] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Handle mark all as read with proper loading state
  const handleMarkAllAsRead = async () => {
    if (markingRead || unreadCount === 0) return;

    setMarkingRead(true);
    try {
      await onMarkAllAsRead();
    } finally {
      setMarkingRead(false);
    }
  };

  // Handle clearing all notifications
  const handleClearAll = async () => {
    if (clearing || notifications.length === 0 || !onClearAll) return;

    setClearing(true);
    try {
      await onClearAll();
      setShowClearConfirm(false);
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="flex max-h-[70vh] flex-col">
      {/* Confirmation dialog for clearing all notifications */}
      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent className="border-slate-700 bg-slate-800 text-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("clearAllConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              {t("clearAllConfirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600">
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAll}
              className="bg-red-600 hover:bg-red-700"
              disabled={clearing}
            >
              {clearing ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : null}
              {t("clearAll")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center justify-between p-4">
        <h2 className="text-sm font-medium text-slate-100">
          {t("title")}
          {unreadCount > 0 && (
            <span className="ml-1 rounded-full bg-blue-600 px-1.5 py-0.5 text-xs">
              {unreadCount}
            </span>
          )}
        </h2>

        {/* Only keep Mark All as Read button at the top */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2.5 text-xs"
          disabled={loading || markingRead || unreadCount === 0}
          onClick={handleMarkAllAsRead}
        >
          {markingRead ? (
            <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
          ) : (
            <Check className="mr-1.5 h-3 w-3" />
          )}
          {t("markAllRead")}
        </Button>
      </div>

      <Separator />

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <BellOff className="mb-2 h-8 w-8 text-slate-500" />
            <p className="text-sm text-slate-300">{t("empty.title")}</p>
            <p className="mt-1 text-xs text-slate-500">
              {t("empty.description")}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {notifications.slice(0, 5).map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={() => {}}
              />
            ))}
            {notifications.length > 5 && (
              <div className="p-2 text-center">
                <Button
                  variant="ghost"
                  className="text-xs text-slate-400 hover:text-slate-300"
                  asChild
                >
                  <Link href="/notifications">
                    {t("seeAll", { count: notifications.length - 5 })}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <>
          <Separator />
          <div className="flex flex-col gap-2 p-3">
            {/* View All button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full border-slate-700 bg-slate-800/60 text-xs text-slate-300 hover:bg-slate-700"
              asChild
            >
              <Link href="/notifications">{t("viewAll")}</Link>
            </Button>

            {/* Clear All button moved to bottom */}
            {onClearAll && notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-1 w-full text-xs text-rose-400 hover:bg-rose-900/20 hover:text-rose-300"
                disabled={loading || clearing}
                onClick={() => setShowClearConfirm(true)}
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                {t("clearAll")}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
