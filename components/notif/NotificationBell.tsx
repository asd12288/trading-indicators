import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import useNotification from "../../hooks/useNotification";

const NotificationBell = ({ userId }: { userId: string }) => {
  const { notification } = useNotification();
  const userNotifications = notification.filter(n => n.user_id === userId);
  const unreadCount = userNotifications.filter(n => !n.is_read).length;
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setOpen(!open)} className="relative">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          {userNotifications.length > 0 ? (
            <ul className="max-h-60 overflow-y-auto">
              {userNotifications.map(notif => (
                <li key={notif.id} className="px-4 py-2 hover:bg-gray-100 flex justify-between items-start">
                  <div className="flex-1">
                    <span className={notif.is_read ? 'text-gray-600' : 'font-medium'}>
                      {notif.title}
                    </span>
                    {(notif.body || (notif as any).message) && (
                      <div className="text-xs text-gray-500 truncate">
                        {notif.body ?? (notif as any).message}
                      </div>
                    )}
                  </div>
                  <span className="ml-2 text-xs text-gray-400 whitespace-nowrap">
                    {new Date(notif.created_at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">No notifications</div>
          )}
        </div>
      )}
    </div>
  );
};
export default NotificationBell;
