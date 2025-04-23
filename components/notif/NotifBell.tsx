import { useNotif } from "@/hooks/useNotif";
import { Badge, Bell } from "lucide-react";
import React from "react";

const NotifBell = ({ userId }: { userId: string }) => {
  const { unread } = useNotif(userId);

  return (
    <button>
      <Bell className="h-5 w-5" />
      {unread > 0 && (
        <Badge className="absolute -right-1 -top-1 text-sm">{unread}</Badge>
      )}
    </button>
  );
};
export default NotifBell;
