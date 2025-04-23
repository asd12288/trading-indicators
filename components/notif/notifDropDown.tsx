// components/NotificationDropdown.tsx
import { useNotif } from "@/hooks/useNotif";
import { Link } from "@/i18n/routing";

export default function NotificationDropdown({ userId }: { userId: string }) {
  const { items, markAsRead } = useNotif(userId);
  return (
    <div className="max-h-96 space-y-2 overflow-y-auto p-4">
      {items.length === 0 && <p className="text-sm">No notifications.</p>}
      {items.map((n) => (
        <div
          key={n.id}
          className={`cursor-pointer rounded-lg p-2 ${
            n.is_read ? "bg-muted" : "bg-primary/20"
          }`}
          onClick={() => {
            markAsRead(n.id);
          }}
        >
          <Link href={n.url || "#"} className="block">
            <p className="font-medium">{n.title}</p>
            {n.body && <p className="text-sm opacity-80">{n.body}</p>}
            <p className="text-xs opacity-60">
              {new Date(n.created_at).toLocaleString()}
            </p>
          </Link>
        </div>
      ))}
    </div>
  );
}
