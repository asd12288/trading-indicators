"use client";

import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NotificationFiltersProps {
  readStatus: string;
  onReadStatusChange: (status: string) => void;
}

export default function NotificationFilters({
  readStatus,
  onReadStatusChange,
}: NotificationFiltersProps) {
  const t = useTranslations("Notifications");

  return (
    <div className="flex items-center gap-2">
      <Select value={readStatus} onValueChange={onReadStatusChange}>
        <SelectTrigger className="h-8 w-[130px] text-xs">
          <SelectValue placeholder={t("filters.readStatus")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("filters.all")}</SelectItem>
          <SelectItem value="read">{t("filters.read")}</SelectItem>
          <SelectItem value="unread">{t("filters.unread")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
