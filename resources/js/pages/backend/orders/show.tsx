import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import BackendLayout from "@/layouts/backend/backend-layout";
import { router, usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import { ArrowLeft } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface User {
    id: number;
    name: string;
    email: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
    image?: string;
}

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    product: Product;
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

interface Payment {
    method: string;
    status: string;
    reference: string;
}

interface Order {
    total: number;
    id: number;
    status: string;
    payment_status: string;
    total_amount: number;
    created_at: string;
    user?: User;
    items: OrderItem[];
    shipping_address?: ShippingAddress;
    payment?: Payment;
}

interface PageProps extends InertiaPageProps {
    order: Order;
    flash?: { success?: string };
}

export default function Show() {
    const { order, flash } = usePage<PageProps>().props;

    const [status, setStatus] = useState(order.status);
    const [paymentStatus, setPaymentStatus] = useState(order.payment_status);
    const [loading, setLoading] = useState(false);

    // ✅ Update order statuses
    const handleUpdate = () => {
        setLoading(true);
        router.put(`/backend/orders/${order.id}`, {
            status,
            payment_status: paymentStatus,
        }, {
            onFinish: () => setLoading(false),
        });
    };

    return (
        <div className="p-6 space-y-6">
            {/* ✅ Back button */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={() => history.back()}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                    Order #{order.id}
                </h2>
            </div>

            {/* ✅ Flash message */}
            {flash?.success && (
                <div className="rounded-md bg-green-100 p-3 text-green-700">
                    {flash.success}
                </div>
            )}

            {/* ✅ Order summary */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* 🧾 Customer Info */}
                <div className="rounded-lg border p-4 bg-white dark:bg-gray-900 shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">Customer Info</h3>
                    <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        <p><strong>Name:</strong> {order.user?.name || "Guest"}</p>
                        <p><strong>Email:</strong> {order.user?.email || order.shipping_address?.email}</p>
                        <p><strong>Phone:</strong> {order.shipping_address?.phone || "—"}</p>
                    </div>
                </div>

                {/* 🚚 Shipping Info */}
                <div className="rounded-lg border p-4 bg-white dark:bg-gray-900 shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
                    {order.shipping_address ? (
                        <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                            <p>{order.shipping_address.address_line1}</p>
                            <p>{order.shipping_address.city}, {order.shipping_address.state}</p>
                            <p>{order.shipping_address.country}</p>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No shipping info available.</p>
                    )}
                </div>
            </div>

            {/* ✅ Payment Info */}
            <div className="rounded-lg border p-4 bg-white dark:bg-gray-900 shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
                {order.payment ? (
                    <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        <p><strong>Method:</strong> {order.payment.method}</p>
                        <p><strong>Reference:</strong> {order.payment.reference}</p>
                        <p><strong>Status:</strong> {order.payment.status}</p>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No payment info available.</p>
                )}
            </div>

            {/* ✅ Items List */}
            <div className="rounded-lg border p-4 bg-white dark:bg-gray-900 shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b text-left text-sm text-gray-600 dark:text-gray-400">
                            <th className="py-2">Product</th>
                            <th className="py-2">Price</th>
                            <th className="py-2">Qty</th>
                            <th className="py-2">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item) => (
                            <tr key={item.id} className="border-b last:border-0 text-sm">
                                <td className="py-2 flex items-center gap-2">
                                    {item.product.image && (
                                        <img
                                            src={`/storage/${item.product.image}`}
                                            alt={item.product.name}
                                            className="h-10 w-10 rounded-md object-cover"
                                        />
                                    )}
                                    {item.product.name}
                                </td>
                                <td className="py-2 text-gray-700 dark:text-gray-300">
                                    ₦{item.price.toLocaleString()}
                                </td>
                                <td className="py-2">{item.quantity}</td>
                                <td className="py-2 font-medium text-gray-900 dark:text-gray-100">
                                    ₦{(item.price * item.quantity).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="mt-4 text-right font-semibold text-gray-800 dark:text-gray-100">
                ₦{(order?.total?? 0).toLocaleString()}

                </div>
            </div>

            {/* ✅ Status Controls */}
            <div className="rounded-lg border p-4 bg-white dark:bg-gray-900 shadow-sm space-y-4">
                <h3 className="text-lg font-semibold mb-2">Update Order Status</h3>
                <div className="flex flex-wrap items-center gap-4">
                    {/* Order Status */}
                    <div>
                        <label className="block text-sm mb-1">Order Status</label>
                        <Select
                            value={status}
                            onValueChange={(value) => setStatus(value)}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Payment Status */}
                    <div>
                        <label className="block text-sm mb-1">Payment Status</label>
                        <Select
                            value={paymentStatus}
                            onValueChange={(value) => setPaymentStatus(value)}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="successful">Successful</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                                <SelectItem value="refunded">Refunded</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button onClick={handleUpdate} disabled={loading}>
                        {loading ? "Updating..." : "Save Changes"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

Show.layout = (page: React.ReactNode) => <BackendLayout>{page}</BackendLayout>;
