/* eslint-disable @typescript-eslint/no-explicit-any */
// resources/js/pages/frontend/orders/show.tsx

import React from "react";
import { usePage, Link } from "@inertiajs/react";
import UserLayout from "@/layouts/frontend/user-layout";

interface Product {
    id: number;
    name: string;
    image?: string;
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
    reference?: string;
}

interface ShippingAddress {
    full_name: string;
    email: string;
    phone: string;
    address_line1: string;
    city: string;
    state: string;
    country: string;
}

interface Order {
    id: number;
    status: string;
    payment_status: string;
    total: number;
    created_at: string;
    items: OrderItem[];
    payment?: Payment;
    shipping_address?: ShippingAddress;
}

interface PageProps {
    order: Order;
    [key: string]: any;
}

export default function OrderShow() {
    const { order } = usePage<PageProps>().props;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
            <Link href="/my-orders" className="text-blue-600 underline text-sm">← Back to Orders</Link>
            <h1 className="text-2xl font-bold mb-2">Order #{order.id}</h1>
            <p className="text-gray-500 mb-4">Placed on {new Date(order.created_at).toLocaleDateString()}</p>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Shipping */}
                <div className="rounded-lg border p-4 bg-white dark:bg-gray-800 shadow-sm">
                    <h2 className="font-semibold mb-2">Shipping Address</h2>
                    {order.shipping_address ? (
                        <div className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
                            <p>{order.shipping_address.full_name}</p>
                            <p>{order.shipping_address.phone}</p>
                            <p>{order.shipping_address.address_line1}</p>
                            <p>{order.shipping_address.city}, {order.shipping_address.state}</p>
                            <p>{order.shipping_address.country}</p>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">No shipping info available.</p>
                    )}
                </div>

                {/* Payment */}
                <div className="rounded-lg border p-4 bg-white dark:bg-gray-800 shadow-sm">
                    <h2 className="font-semibold mb-2">Payment</h2>
                    {order.payment ? (
                        <div className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
                            <p>Method: {order.payment.method}</p>
                            <p>Status: {order.payment.status}</p>
                            {order.payment.reference && <p>Reference: {order.payment.reference}</p>}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">No payment info available.</p>
                    )}
                </div>
            </div>

            {/* Items */}
            <div className="rounded-lg border p-4 bg-white dark:bg-gray-800 shadow-sm">
                <h2 className="font-semibold mb-2">Items</h2>
                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-200">
                    {order.items.map((item) => (
                        <li key={item.id}>
                            {item.product.name} × {item.quantity} - ₦{item.price.toLocaleString()} (Subtotal: ₦{(item.price * item.quantity).toLocaleString()})
                        </li>
                    ))}
                </ul>
                <div className="text-right font-semibold mt-2">
                    Total: ₦{(order.total ?? 0).toLocaleString()}
                </div>
            </div>

            <div className="space-y-2">
                <p>Status: <span className="font-semibold">{order.status}</span></p>
                <p>Payment Status: <span className="font-semibold">{order.payment_status}</span></p>
            </div>
        </div>
    );
}

OrderShow.layout = (page: React.ReactNode) => <UserLayout>{page}</UserLayout>;
