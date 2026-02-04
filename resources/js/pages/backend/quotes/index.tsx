import { Button } from '@/components/ui/button';
import {
    Table,
    TablePagination,
    TableRow,
    TableSearch,
    TableSectionHeader,
} from '@/components/ui/data-table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import BackendLayout from '@/layouts/backend/backend-layout';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Link, router, usePage } from '@inertiajs/react';
import { Eye, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

interface QuoteItem {
    id: number;
    product_name_snapshot: string;
    quantity: number;
    unit_price_snapshot: number | null;
    line_total_snapshot: number | null;
}

interface QuoteRequest {
    id: number;
    full_name: string;
    email: string;
    phone?: string | null;
    status: string;
    priced_total_snapshot: number;
    created_at: string;
    items: QuoteItem[];
}

interface PageProps extends InertiaPageProps {
    quotes: {
        data: QuoteRequest[];
        current_page?: number;
        last_page?: number;
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
    const { quotes, filters, flash } = usePage<PageProps>().props;

    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '__all__');
    const [from, setFrom] = useState(filters.from || '');
    const [to, setTo] = useState(filters.to || '');
    const [page, setPage] = useState(quotes.current_page || 1);

    const applyFilters = () => {
        const url = new URL(window.location.href);

        if (search) url.searchParams.set('search', search);
        else url.searchParams.delete('search');

        if (status && status !== '__all__')
            url.searchParams.set('status', status);
        else url.searchParams.delete('status');

        if (from) url.searchParams.set('from', from);
        else url.searchParams.delete('from');

        if (to) url.searchParams.set('to', to);
        else url.searchParams.delete('to');

        window.location.href = url.toString();
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this quote?')) {
            router.delete(`/backend/quotes/${id}`);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <TableSectionHeader
                title="Quote Requests"
                description="View and manage RFQ/mixed quote requests."
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        <TableSearch
                            value={search}
                            onChange={setSearch}
                            placeholder="Search by name, email, phone..."
                        />

                        <Select
                            name="status"
                            defaultValue={status}
                            onValueChange={setStatus}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="__all__">
                                    All Statuses
                                </SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>

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

            {flash?.success && (
                <div className="rounded-md bg-green-100 p-3 text-green-700">
                    {flash.success}
                </div>
            )}

            <Table
                headers={[
                    'Quote ID',
                    'Customer',
                    'Items',
                    'Status',
                    'Priced Total',
                    'Date',
                    'Actions',
                ]}
            >
                {quotes.data.length > 0 ? (
                    quotes.data.map((quote) => (
                        <TableRow key={quote.id}>
                            <td className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
                                #{quote.id}
                            </td>

                            <td className="px-4 py-3">
                                <div className="flex flex-col">
                                    <span className="font-medium">
                                        {quote.full_name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {quote.email}
                                    </span>
                                </div>
                            </td>

                            <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                                {quote.items?.length ?? 0}
                            </td>

                            <td className="px-4 py-3">
                                <span
                                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                                        quote.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : quote.status === 'sent'
                                              ? 'bg-blue-100 text-blue-800'
                                              : quote.status === 'approved'
                                                ? 'bg-green-100 text-green-800'
                                                : quote.status === 'rejected'
                                                  ? 'bg-red-100 text-red-800'
                                                  : 'bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    {quote.status}
                                </span>
                            </td>

                            <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                                ₦
                                {Number(
                                    quote.priced_total_snapshot ?? 0,
                                ).toLocaleString()}
                            </td>

                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                {new Date(
                                    quote.created_at,
                                ).toLocaleDateString()}
                            </td>

                            <td className="flex gap-2 px-4 py-3">
                                <Link href={`/backend/quotes/${quote.id}`}>
                                    <Button variant="outline" size="sm">
                                        <Eye className="mr-1 h-4 w-4" /> View
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(quote.id)}
                                >
                                    <Trash2 className="mr-1 h-4 w-4" /> Delete
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
                            No quote requests found.
                        </td>
                    </tr>
                )}
            </Table>

            <TablePagination
                page={page}
                totalPages={quotes.last_page || 1}
                onPageChange={setPage}
            />
        </div>
    );
}

Index.layout = (page: React.ReactNode) => <BackendLayout>{page}</BackendLayout>;
