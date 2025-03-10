"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "@/i18n/routing";
import { useNotifications } from "@/hooks/use-notifications";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";
import { CheckIcon, Loader2Icon, Trash2Icon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSearchParams } from "next/navigation";
import NotificationFilters from "./NotificationFilters";
import Pagination from "../Pagination";
import NotificationsList from "./NotificationsList";

interface NotificationsClientProps {
  userId: string;
  initialPage: number;
  initialPageSize: number;
  initialFilter: string;
  initialReadStatus: string;
  totalCount: number;
}

export default function NotificationsClient({
  userId,
  initialPage,
  initialPageSize,
  initialFilter,
  initialReadStatus,
  totalCount,
}: NotificationsClientProps) {
  const t = useTranslations("Notifications");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State for pagination and filtering
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [filter, setFilter] = useState(initialFilter);
  const [readStatus, setReadStatus] = useState(initialReadStatus);

  // Custom hook to fetch and manage notifications
  const {
    notifications,
    loading,
    error,
    markAllAsRead,
    markAsRead,
    deleteNotification,
    refetch,
    bulkDelete,
  } = useNotifications(userId);

  // Filter notifications based on current filters
  const filteredNotifications = notifications.filter((notification) => {
    // Filter by type
    if (filter !== "all" && notification.type !== filter) return false;

    // Filter by read status
    if (readStatus === "read" && !notification.read) return false;
    if (readStatus === "unread" && notification.read) return false;

    return true;
  });

  // Calculate pagination
  const paginatedNotifications = filteredNotifications.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page.toString());
    if (pageSize !== 10) params.set("pageSize", pageSize.toString());
    if (filter !== "all") params.set("type", filter);
    if (readStatus !== "all") params.set("read", readStatus);

    const queryString = params.toString();
    router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`);

    // Reset to page 1 when filters change
    if (filter !== initialFilter || readStatus !== initialReadStatus) {
      setPage(1);
    }
  }, [page, pageSize, filter, readStatus, pathname, router]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  // Handle bulk actions
  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    refetch();
  };

  const handleBulkDelete = async () => {
    // Get IDs of visible notifications based on current filters
    const notificationIds = filteredNotifications.map((n) => n.id);
    if (notificationIds.length === 0) return;

    await bulkDelete(notificationIds);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Tabs
          value={filter}
          onValueChange={setFilter}
          className="w-full md:w-auto"
        >
          <TabsList className="grid w-full grid-cols-4 md:w-auto">
            <TabsTrigger value="all">{t("filters.all")}</TabsTrigger>
            <TabsTrigger value="signal">{t("types.signal")}</TabsTrigger>
            <TabsTrigger value="alert">{t("types.alert")}</TabsTrigger>
            <TabsTrigger value="system">{t("types.system")}</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2 self-end">
          <NotificationFilters
            readStatus={readStatus}
            onReadStatusChange={setReadStatus}
          />

          <Button
            size="sm"
            
            className="text-xs"
            onClick={handleMarkAllAsRead}
            disabled={loading || filteredNotifications.every((n) => n.read)}
          >
            <CheckIcon className="mr-1 h-3.5 w-3.5" />
            {t("markAllRead")}
          </Button>

          <Button
            size="sm"
            variant="destructive"
            className="text-xs"
            onClick={handleBulkDelete}
            disabled={loading || filteredNotifications.length === 0}
          >
            <Trash2Icon className="mr-1 h-3.5 w-3.5" />
            {t("clear")}
          </Button>
        </div>
      </div>

      <Separator />

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2Icon className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      ) : paginatedNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-800/30 py-16 text-center">
          <div className="rounded-full bg-slate-700/50 p-3">
            <Trash2Icon className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-slate-200">
            {t("empty.filtered.title")}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-slate-400">
            {t("empty.filtered.description")}
          </p>
        </div>
      ) : (
        <>
          <NotificationsList
            notifications={paginatedNotifications}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
          />

          <Pagination
            currentPage={page}
            pageSize={pageSize}
            totalItems={filteredNotifications.length}
            onPageChange={handlePageChange}
            onPageSizeChange={setPageSize}
          />
        </>
      )}
    </div>
  );
}
