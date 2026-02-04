import BackendLayout from "@/layouts/backend/backend-layout";
import { Head, Link } from "@inertiajs/react";
import { Package, ShoppingCart, Users, CreditCard, FileText } from "lucide-react";

type OrderRow = {
  id: number;
  total: number | string;
  status: string;
  payment_status: string;
  created_at: string;
  user_id: number | null;
};

export default function Dashboard(props: {
  productCount: number;
  userCount: number;
  kpis: {
    orderCount: number;
    pendingOrders: number;
    todayRevenue: number;
    monthRevenue: number;
    quoteCount: number;
  };
  recentOrders: OrderRow[];
  ordersByStatus: Record<string, number>;
  dailyRevenue: Array<{ day: string; revenue: number | string }>;
}) {
  const money = (n: number) =>
    new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);

  const badge = (value: string, kind: "status" | "payment") => {
    const v = (value || "").toLowerCase();

    const base =
      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset";

    if (kind === "payment") {
      if (v === "paid")
        return `${base} bg-green-50 text-green-700 ring-green-200 dark:bg-green-900/20 dark:text-green-300 dark:ring-green-800`;
      if (v === "failed")
        return `${base} bg-red-50 text-red-700 ring-red-200 dark:bg-red-900/20 dark:text-red-300 dark:ring-red-800`;
      return `${base} bg-yellow-50 text-yellow-700 ring-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:ring-yellow-800`;
    }

    if (v === "completed" || v === "delivered")
      return `${base} bg-green-50 text-green-700 ring-green-200 dark:bg-green-900/20 dark:text-green-300 dark:ring-green-800`;
    if (v === "cancelled")
      return `${base} bg-red-50 text-red-700 ring-red-200 dark:bg-red-900/20 dark:text-red-300 dark:ring-red-800`;
    return `${base} bg-gray-50 text-gray-700 ring-gray-200 dark:bg-gray-900/30 dark:text-gray-200 dark:ring-gray-800`;
  };

  const statusEntries = Object.entries(props.ordersByStatus || {}).sort(
    (a, b) => (b[1] || 0) - (a[1] || 0)
  );

  return (
    <BackendLayout title="Dashboard">
      <Head title="Dashboard" />

      <div className="space-y-6">
        {/* KPI row */}
        <div className="grid gap-6 md:grid-cols-4">
          <KpiCard
            title="Revenue (Today)"
            value={`₦ ${money(props.kpis.todayRevenue || 0)}`}
            icon={<CreditCard className="h-5 w-5" />}
            sub="Paid orders only"
          />
          <KpiCard
            title="Revenue (This Month)"
            value={`₦ ${money(props.kpis.monthRevenue || 0)}`}
            icon={<CreditCard className="h-5 w-5" />}
            sub="Paid orders only"
          />
          <KpiCard
            title="Orders"
            value={props.kpis.orderCount}
            icon={<ShoppingCart className="h-5 w-5" />}
            sub={`${props.kpis.pendingOrders} pending`}
          />
          <KpiCard
            title="Users"
            value={props.userCount}
            icon={<Users className="h-5 w-5" />}
            sub={`${props.productCount} products`}
          />
        </div>

        {/* Mid row: orders by status + quick actions */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Panel title="Orders by Status" className="lg:col-span-1">
            <div className="space-y-3">
              {statusEntries.length === 0 ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  No orders yet.
                </div>
              ) : (
                statusEntries.map(([st, count]) => (
                  <div key={st} className="flex items-center justify-between">
                    <span className="text-sm font-semibold capitalize">{st}</span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold dark:bg-gray-950">
                      {count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Panel>

          <Panel title="Quick Actions" className="lg:col-span-1">
            <div className="grid gap-3 sm:grid-cols-2">
              <QuickLink href="/backend/products/create" label="Add Product" icon={<Package className="h-4 w-4" />} />
              <QuickLink href="/backend/orders" label="View Orders" icon={<ShoppingCart className="h-4 w-4" />} />
              <QuickLink href="/backend/users" label="Manage Users" icon={<Users className="h-4 w-4" />} />
              <QuickLink href="/backend/quotes" label="View Quotes" icon={<FileText className="h-4 w-4" />} />
            </div>
          </Panel>

          <Panel title="Revenue (Last 14 days)" className="lg:col-span-1">
            {/* Simple spark list now; we can convert to chart later */}
            <div className="space-y-2">
              {props.dailyRevenue?.length ? (
                props.dailyRevenue.map((d) => (
                  <div key={d.day} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">{d.day}</span>
                    <span className="font-semibold">₦ {money(Number(d.revenue || 0))}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  No paid revenue in this period.
                </div>
              )}
            </div>
          </Panel>
        </div>

        {/* Recent orders table */}
        <Panel
          title="Recent Orders"
          right={
            <Link
              href="/backend/orders"
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
            >
              View all
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <th className="py-3 pr-4">Order</th>
                  <th className="py-3 pr-4">Total</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Payment</th>
                  <th className="py-3 pr-4">Date</th>
                  <th className="py-3 pr-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {props.recentOrders?.length ? (
                  props.recentOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-gray-950">
                      <td className="py-3 pr-4 font-semibold">#{o.id}</td>
                      <td className="py-3 pr-4">₦ {money(Number(o.total || 0))}</td>
                      <td className="py-3 pr-4">
                        <span className={badge(o.status, "status")}>{o.status}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={badge(o.payment_status, "payment")}>{o.payment_status}</span>
                      </td>
                      <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                        {o.created_at}
                      </td>
                      <td className="py-3 pr-2">
                        <Link
                          href={`/backend/orders/${o.id}`}
                          className="rounded-xl bg-gray-900 px-3 py-2 text-xs font-bold text-white hover:opacity-90 dark:bg-white dark:text-gray-900"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-6 text-gray-500 dark:text-gray-400" colSpan={6}>
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </BackendLayout>
  );
}

/* ---------- UI helpers ---------- */

function Panel({
  title,
  children,
  right,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-sm font-bold">{title}</div>
        {right}
      </div>
      {children}
    </div>
  );
}

function KpiCard({
  title,
  value,
  icon,
  sub,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            {title}
          </div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight">
            {value}
          </div>
          {sub ? (
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {sub}
            </div>
          ) : null}
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gray-100 dark:bg-gray-950">
          {icon}
        </div>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900"
    >
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-gray-100 dark:bg-gray-900">
        {icon}
      </span>
      {label}
    </Link>
  );
}
