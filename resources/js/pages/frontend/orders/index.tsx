/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Link, usePage } from "@inertiajs/react";
import UserLayout from "@/layouts/frontend/user-layout";

interface Product {
    id: number;
    name: string;
}

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    product: Product;
}

interface Payment {
    method: string;
    status: string;
}

interface Order {
    id: number;
    status: string;
    payment_status: string;
    total: number;
    created_at: string;
    items: OrderItem[];
    payment?: Payment;
}

interface PageProps {
    orders?: Order[];
    order?: Order;
    flash?: { success?: string };
    [key: string]: any; // ✅ Add this line
}


export default function Orders() {
    const { orders = [] } = usePage<PageProps>().props;

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6">My Orders</h1>

            {orders.length === 0 && (
                <p>You haven't placed any orders yet.</p>
            )}

            <div className="space-y-4">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Order #{order.id}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Placed on {new Date(order.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <Link
                                href={`/my-orders/${order.id}`}
                                className="text-blue-600 underline text-sm"
                            >
                                View Details
                            </Link>
                        </div>

                        <div className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-300 mt-2">
                            <span>Status: {order.status}</span>
                            <span>Payment: {order.payment_status}</span>
                            <span>Total: ₦{(order.total ?? 0).toLocaleString()}</span>
                        </div>

                        <div className="mt-2">
                            <p className="text-gray-500 text-sm">Items:</p>
                            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-200">
                                {order.items.map((item) => (
                                    <li key={item.id}>
                                        {item.product.name} × {item.quantity} - ₦{item.price.toLocaleString()}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

Orders.layout = (page: React.ReactNode) => <UserLayout>{page}</UserLayout>;
