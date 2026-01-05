import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import BackendLayout from "@/layouts/backend/backend-layout";
import { Link, router, usePage } from "@inertiajs/react";
import { Eye, Trash2 } from "lucide-react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import {
    Table,
    TableRow,
    TableSectionHeader,
    TableSearch,
    TablePagination,
} from "@/components/ui/data-table";
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
}

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    product: Product;
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
}

interface PageProps extends InertiaPageProps {
    orders: {
        data: Order[];
    };
    filters: {
        status?: string;
        search?: string;
        from?: string;
        to?: string;
    };
    flash?: { success?: string };
}

export default function Index() {
    const { orders, filters, flash } = usePage<PageProps>().props;

    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "__all__");
    const [from, setFrom] = useState(filters.from || "");
    const [to, setTo] = useState(filters.to || "");
    const [page, setPage] = useState(1);

    // ✅ Search & Filter handler
    const applyFilters = () => {
        const url = new URL(window.location.href);
        if (search) url.searchParams.set("search", search);
        else url.searchParams.delete("search");

        if (status && status !== "__all__") url.searchParams.set("status", status);
        else url.searchParams.delete("status");

        if (from) url.searchParams.set("from", from);
        else url.searchParams.delete("from");

        if (to) url.searchParams.set("to", to);
        else url.searchParams.delete("to");

        window.location.href = url.toString();
    };

    // ✅ Delete order
    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this order?")) {
            router.delete(`/backend/orders/${id}`);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* ✅ Header */}
            <TableSectionHeader
                title="Orders"
                description="View and manage customer orders on UruaOnline."
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Search */}
                        <TableSearch
                            value={search}
                            onChange={setSearch}
                            placeholder="Search by customer name or email..."
                        />

                        {/* Status Filter */}
                        <Select
                            name="status"
                            defaultValue={status}
                            onValueChange={setStatus}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="__all__">All Statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Date Range Filter (Optional 1) */}
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                className="rounded-md border px-2 py-1 text-sm"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                                type="date"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                className="rounded-md border px-2 py-1 text-sm"
                            />
                        </div>

                        <Button onClick={applyFilters}>Apply</Button>
                    </div>
                }
            />

            {/* ✅ Flash Message */}
            {flash?.success && (
                <div className="rounded-md bg-green-100 p-3 text-green-700">
                    {flash.success}
                </div>
            )}

            {/* ✅ Orders Table */}
            <Table
                headers={[
                    "Order ID",
                    "Customer",
                    "Total",
                    "Status",
                    "Payment",
                    "Date",
                    "Actions",
                ]}
            >
                {orders.data.length > 0 ? (
                    orders.data.map((order) => (
                        <TableRow key={order.id}>
                            <td className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
                                #{order.id}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex flex-col">
                                    <span className="font-medium">
                                        {order.user?.name || "Guest"}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {order.user?.email || "—"}
                                    </span>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                            ₦{(order.total?? 0).toLocaleString()}
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        order.status === "pending"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : order.status === "paid"
                                            ? "bg-blue-100 text-blue-800"
                                            : order.status === "shipped"
                                            ? "bg-purple-100 text-purple-800"
                                            : order.status === "delivered"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                                >
                                    {order.status}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        order.payment_status === "successful"
                                            ? "bg-green-100 text-green-800"
                                            : order.payment_status === "failed"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-gray-100 text-gray-700"
                                    }`}
                                >
                                    {order.payment_status}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                {new Date(order.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 flex gap-2">
                                <Link href={`/backend/orders/${order.id}`}>
                                    <Button variant="outline" size="sm">
                                        <Eye className="h-4 w-4 mr-1" /> View
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(order.id)}
                                >
                                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                                </Button>
                            </td>
                        </TableRow>
                    ))
                ) : (
                    <tr>
                        <td
                            colSpan={7}
                            className="px-4 py-6 text-center text-gray-500"
                        >
                            No orders found.
                        </td>
                    </tr>
                )}
            </Table>

            <TablePagination page={page} totalPages={1} onPageChange={setPage} />
        </div>
    );
}

Index.layout = (page: React.ReactNode) => <BackendLayout>{page}</BackendLayout>;
