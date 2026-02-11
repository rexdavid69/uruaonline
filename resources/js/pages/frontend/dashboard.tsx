/* eslint-disable @typescript-eslint/no-explicit-any */
import UserLayout from "@/layouts/frontend/user-layout";
import NotificationBell from "@/components/frontend/notification-bell";
import { Head, Link, usePage } from "@inertiajs/react";
import {
  ShoppingCart,
  Package,
  CreditCard,
  ArrowRight,
} from "lucide-react";

interface Order {
  id: number;
  total: string;
  created_at: string;
  status: string;
}

interface CartItem {
  id: number;
  product: { name: string };
  quantity: number;
}

interface Cart {
  items: CartItem[];
}

interface DashboardProps {
  user: { id: number; name: string };
  orders: Order[];
  cart: Cart | null;
  [key: string]: any;
}

export default function Dashboard() {
  const { user, orders, cart } = usePage<DashboardProps>().props;

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const totalCartItems = cart?.items.length ?? 0;

  return (
    <UserLayout title="Dashboard">
      <Head title="Dashboard" />

      <div className="space-y-10">
        {/* ================= WELCOME ================= */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
  <div className="flex items-start justify-between gap-4">
    <div>
      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
        Welcome back, {user?.name ?? "Guest"} 👋
      </h2>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Here’s a snapshot of your account activity and recent orders.
      </p>
    </div>

    <NotificationBell />
  </div>
</div>


        {/* ================= STATS ================= */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Orders */}
          <div className="flex items-center gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total Orders
              </p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {totalOrders}
              </p>
            </div>
          </div>

          {/* Cart */}
          <div className="flex items-center gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Cart Items
              </p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {totalCartItems}
              </p>
            </div>
          </div>

          {/* Spend */}
          <div className="flex items-center gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total Spent
              </p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                ₦{totalSpent.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* ================= RECENT ORDERS ================= */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Recent Orders
            </h3>
            <Link
              href="/my-orders"
              className="flex items-center gap-1 text-sm font-semibold text-cyan-600 hover:text-cyan-700 dark:text-cyan-300"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {orders.length ? (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 p-4 transition hover:bg-slate-50 dark:border-gray-800 dark:hover:bg-gray-800"
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      Order #{order.id}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        order.status === "completed"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                      }`}
                    >
                      {order.status}
                    </span>

                    <span className="font-bold text-slate-900 dark:text-white">
                      ₦{Number(order.total).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 dark:text-slate-400">
              You don’t have any orders yet.
            </p>
          )}
        </div>
      </div>
    </UserLayout>
  );
}
