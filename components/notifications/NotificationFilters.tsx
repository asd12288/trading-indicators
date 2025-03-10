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
        <SelectContent className="bg-slate-800">
          <SelectItem value="all" className="cursor-pointer">
            {t("filters.all")}
          </SelectItem>
          <SelectItem value="read" className="cursor-pointer">
            {t("filters.read")}
          </SelectItem>
          <SelectItem value="unread" className="cursor-pointer">
            {t("filters.unread")}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
