/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import BackendLayout from "@/layouts/backend/backend-layout";
import { Head, Link, router } from "@inertiajs/react";
import { useMemo, useState } from "react";

type NotificationItem = {
  id: number;
  title: string;
  message: string | null;
  level: "info" | "success" | "warning" | "danger";
  action_url: string | null;
  read_at: string | null;
  created_at: string;
};

export default function NotificationsPage(props: {
  notifications: {
    data: NotificationItem[];
    links: any[];
    meta: any;
  };
  filters: { status?: string; q?: string };
  unreadCount: number;
}) {
  const [q, setQ] = useState(props.filters.q ?? "");
  const status = props.filters.status ?? "all";

  const badgeClass = (level: string) => {
    if (level === "success") return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    if (level === "warning") return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    if (level === "danger") return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
  };

  const applyFilters = () => {
    router.get(
      "/backend/notifications-page",
      { status, q: q || undefined },
      { preserveState: true, replace: true }
    );
  };

  const setStatus = (next: string) => {
    router.get(
      "/backend/notifications-page",
      { status: next, q: q || undefined },
      { preserveState: true, replace: true }
    );
  };

  const markAllRead = () => {
    router.post("/backend/notifications/read-all", {}, { preserveScroll: true });
  };

  return (
    <BackendLayout title="Notifications">
      <Head title="Notifications" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You have <span className="font-semibold">{props.unreadCount}</span> unread notifications.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                placeholder="Search notifications..."
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none ring-gray-200 focus:ring-2 dark:border-gray-800 dark:bg-gray-950"
              />
              <button
                onClick={applyFilters}
                className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 dark:bg-white dark:text-gray-900"
              >
                Search
              </button>
            </div>

            <button
              onClick={markAllRead}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900"
            >
              Mark all read
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {["all", "unread", "read"].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={[
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                status === s
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-gray-900",
              ].join(" ")}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          {props.notifications.data.length === 0 ? (
            <div className="p-8 text-sm text-gray-500 dark:text-gray-400">
              No notifications found.
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {props.notifications.data.map((n) => (
                <Link
                  key={n.id}
                  href={n.action_url || "#"}
                  className={[
                    "block p-5 transition hover:bg-gray-50 dark:hover:bg-gray-800",
                    !n.read_at ? "bg-gray-50 dark:bg-gray-950" : "",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2 py-1 text-xs font-bold ${badgeClass(n.level)}`}>
                          {n.level.toUpperCase()}
                        </span>
                        {!n.read_at && (
                          <span className="rounded-full bg-gray-900 px-2 py-1 text-[10px] font-bold text-white dark:bg-white dark:text-gray-900">
                            NEW
                          </span>
                        )}
                      </div>

                      <div className="mt-2 text-sm font-semibold">{n.title}</div>
                      {n.message && (
                        <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          {n.message}
                        </div>
                      )}
                      <div className="mt-2 text-xs text-gray-400">{n.created_at}</div>
                    </div>

                    {n.action_url && (
                      <span className="shrink-0 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold dark:border-gray-800">
                        View
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap gap-2">
          {props.notifications.links?.map((l: any, i: number) => (
            <Link
              key={i}
              href={l.url || "#"}
              preserveState
              className={[
                "rounded-xl border px-3 py-2 text-sm",
                l.active
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                  : "bg-white hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900",
                !l.url ? "pointer-events-none opacity-50" : "",
              ].join(" ")}
              dangerouslySetInnerHTML={{ __html: l.label }}
            />
          ))}
        </div>
      </div>
    </BackendLayout>
  );
}
