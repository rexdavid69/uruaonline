/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "@inertiajs/react";
import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Item = {
  id: number;
  title: string;
  message?: string | null;
  level: string;
  action_url?: string | null;
  read_at: string | null;
  created_at: string; // diffForHumans
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  async function load() {
    const res = await fetch("/api/notifications", { credentials: "same-origin" });
    if (!res.ok) return;
    const data = await res.json();
    setItems(data.items ?? []);
    setUnreadCount(data.unreadCount ?? 0);
  }

  async function markRead(id: number) {
    await fetch(`/api/notifications/${id}/read`, {
      method: "POST",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as any)?.content,
      },
      credentials: "same-origin",
    });
    load();
  }

  async function markAllRead() {
    await fetch(`/api/notifications/read-all`, {
      method: "POST",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as any)?.content,
      },
      credentials: "same-origin",
    });
    load();
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 20000); // refresh every 20s
    return () => clearInterval(t);
  }, []);

  // close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) load();
        }}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-slate-700 dark:text-slate-200" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-3 w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-gray-800">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              Notifications
            </p>
            <button
              onClick={markAllRead}
              className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 dark:text-cyan-300"
              type="button"
            >
              Mark all read
            </button>
          </div>

          <div className="max-h-[380px] overflow-auto">
            {items.length ? (
              <div className="divide-y divide-slate-100 dark:divide-gray-800">
                {items.map((n) => {
                  const isUnread = !n.read_at;
                  const content = (
                    <div
                      className={`px-4 py-3 transition ${
                        isUnread
                          ? "bg-slate-50 dark:bg-gray-800/60"
                          : "bg-white dark:bg-gray-900"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {n.title}
                          </p>
                          {n.message ? (
                            <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">
                              {n.message}
                            </p>
                          ) : null}
                          <p className="mt-2 text-[11px] text-slate-400">
                            {n.created_at}
                          </p>
                        </div>

                        {isUnread ? (
                          <button
                            type="button"
                            onClick={() => markRead(n.id)}
                            className="shrink-0 rounded-full border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 dark:border-gray-700 dark:text-slate-200 dark:hover:bg-gray-800"
                          >
                            Read
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );

                  return n.action_url ? (
                    <Link key={n.id} href={n.action_url}>
                      {content}
                    </Link>
                  ) : (
                    <div key={n.id}>{content}</div>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 py-6 text-sm text-slate-500 dark:text-slate-400">
                No notifications yet.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
