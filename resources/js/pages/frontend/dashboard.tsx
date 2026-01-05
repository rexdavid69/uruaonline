/* eslint-disable @typescript-eslint/no-explicit-any */
import UserLayout from '@/layouts/frontend/user-layout';
import { Head, usePage } from '@inertiajs/react';

interface Order {
    id: number;
    total: string; // Laravel may send as string
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

    // Compute some stats
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, o) => sum + Number(o.total), 0);
    const totalCartItems = cart?.items.length ?? 0;

    return (
        <UserLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6">
                {/* Welcome Banner */}
                <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white shadow-lg">
                    <h2 className="text-2xl font-bold">
                        Welcome back, {user?.name ?? 'Guest'}!
                    </h2>
                    <p className="mt-1">
                        Here's a quick overview of your account and recent
                        activity.
                    </p>
                </div>

                {/* Top Stats Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-xl bg-white p-6 shadow transition-shadow hover:shadow-lg dark:bg-gray-800">
                        <h3 className="text-sm text-gray-500 dark:text-gray-300">
                            Total Orders
                        </h3>
                        <p className="mt-2 text-2xl font-bold">{totalOrders}</p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow transition-shadow hover:shadow-lg dark:bg-gray-800">
                        <h3 className="text-sm text-gray-500 dark:text-gray-300">
                            Total Cart Items
                        </h3>
                        <p className="mt-2 text-2xl font-bold">
                            {totalCartItems}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow transition-shadow hover:shadow-lg dark:bg-gray-800">
                        <h3 className="text-sm text-gray-500 dark:text-gray-300">
                            Total Spend
                        </h3>
                        <p className="mt-2 text-2xl font-bold">
                            ₦{totalSpent.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Recent Orders Table */}
                <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-semibold">
                        Recent Orders
                    </h3>
                    {orders.length ? (
                        <table className="w-full table-auto border-collapse text-left">
                            <thead className="border-b">
                                <tr className="text-gray-500 dark:text-gray-300">
                                    <th className="py-2">Order ID</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="border-b transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        <td className="py-2 font-medium">
                                            #{order.id}
                                        </td>
                                        <td>
                                            {new Date(
                                                order.created_at,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td
                                            className={`font-semibold capitalize ${order.status === 'completed' ? 'text-green-600' : 'text-yellow-500'}`}
                                        >
                                            {order.status}
                                        </td>
                                        <td>
                                            ₦{Number(order.total).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No recent orders.</p>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
