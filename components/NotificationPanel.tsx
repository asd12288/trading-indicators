import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BellOff, CheckIcon, Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Notification } from "@/lib/notification-types";
import NotificationItem from "./NotificationItem";
import { useRouter } from "@/i18n/routing";

interface NotificationPanelProps {
  notifications: Notification[];
  loading: boolean;
  onMarkAllRead: () => void;
}

export default function NotificationPanel({
  notifications,
  loading,
  onMarkAllRead,
}: NotificationPanelProps) {
  const t = useTranslations("Notifications");
  const router = useRouter();

  const handleActionClick = (notification: Notification) => {
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const hasUnread = notifications.some((note) => !note.read);

  return (
    <div className="flex max-h-[70vh] flex-col overflow-hidden bg-slate-800">
      <div className="flex items-center justify-between border-b border-slate-700 p-2">
        <h2 className="ml-1 text-sm font-semibold">{t("title")}</h2>
        {hasUnread && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllRead}
            className="h-7 px-2 text-xs"
            disabled={loading}
          >
            <CheckIcon className="mr-1 h-3 w-3" />
            {t("markAllRead")}
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {loading ? (
          <div className="flex h-24 items-center justify-center">
            <Loader2Icon className="h-5 w-5 animate-spin text-slate-300" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="mb-2 rounded-full bg-slate-700 p-2">
              <BellOff className="h-5 w-5 text-slate-300" />
            </div>
            <h3 className="text-xs font-medium text-slate-200">
              {t("empty.title")}
            </h3>
            <p className="mt-1 text-xs text-slate-300">
              {t("empty.description")}
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={() => handleActionClick(notification)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-slate-700 p-1.5">
        <Button
          variant="secondary"
          size="sm"
          className="h-7 w-full bg-slate-700 text-xs text-slate-200 hover:bg-slate-600"
          onClick={() => router.push("/notifications")}
        >
          {t("viewAll")}
        </Button>
      </div>
    </div>
  );
}
