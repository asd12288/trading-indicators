import { Badge, Bell } from "lucide-react";
import React from "react";

const NotifBell = ({ userId }: { userId: string }) => {
  return (
    <button>
      <Bell className="h-5 w-5" />
    </button>
  );
};
export default NotifBell;
