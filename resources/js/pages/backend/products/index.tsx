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
import { Pencil, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Tag {
    id: number;
    name: string;
}

interface Producer {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    image?: string;
    created_at: string;
    tags: Tag[];
    producer?: Producer;
}

interface PageProps extends InertiaPageProps {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
    tags: Tag[];
    producers: Producer[]; // 👈 added
    selectedTag?: string;
    selectedProducer?: string; // 👈 added
    search?: string;
    flash?: { success?: string };
}

export default function Index() {
    const {
        products,
        tags,
        producers,
        selectedTag: initialTag,
        selectedProducer: initialProducer,
        search: initialSearch,
        flash,
    } = usePage<PageProps>().props;

    const [search, setSearch] = useState(initialSearch || '');
    const [tag, setTag] = useState(initialTag || '__all__');
    const [producer, setProducer] = useState(initialProducer || '__all__'); // 👈 added

    // Debounced live search + filters
    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                '/backend/products',
                {
                    search,
                    tag: tag !== '__all__' ? tag : undefined,
                    producer: producer !== '__all__' ? producer : undefined, // 👈 added
                },
                { preserveState: true, replace: true },
            );
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, tag, producer]);

    // Delete product
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(`/backend/products/${id}`, { preserveState: true });
        }
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header Section */}
            <TableSectionHeader
                title="Products"
                description="Manage all listed products on UruaOnline."
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Search */}
                        <TableSearch
                            value={search}
                            onChange={setSearch}
                            placeholder="Search products or producers..."
                        />

                        {/* Tag Filter */}
                        <Select
                            name="tag"
                            value={tag}
                            onValueChange={setTag}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Filter by tag" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="__all__">All Tags</SelectItem>
                                {tags.map((tag) => (
                                    <SelectItem key={tag.id} value={tag.name}>
                                        {tag.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Producer Filter */}
                        <Select
                            name="producer"
                            value={producer}
                            onValueChange={setProducer}
                        >
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Filter by producer" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="__all__">
                                    All Producers
                                </SelectItem>
                                {producers.map((p) => (
                                    <SelectItem key={p.id} value={String(p.id)}>
                                        {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Add Product */}
                        <Link href="/backend/products/create">
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" /> Add Product
                            </Button>
                        </Link>
                    </div>
                }
            />

            {/* Flash Message */}
            {flash?.success && (
                <div className="rounded-md bg-green-100 p-3 text-green-700">
                    {flash.success}
                </div>
            )}

            {/* Products Table */}
            <Table
                headers={[
                    'Image',
                    'Product',
                    'Producer',
                    'Tags',
                    'Price',
                    'Stock',
                    'Created',
                    'Actions',
                ]}
            >
                {products.data.length > 0 ? (
                    products.data.map((product) => (
                        <TableRow key={product.id}>
                            {/* Image */}
                            <td className="px-4 py-3">
                                {product.image ? (
                                    <img
                                        src={`/storage/${product.image}`}
                                        alt={product.name}
                                        className="h-12 w-12 rounded-md object-cover"
                                    />
                                ) : (
                                    <span className="text-sm text-gray-400">—</span>
                                )}
                            </td>

                            {/* Name */}
                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                                {product.name}
                            </td>

                            {/* Producer */}
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                {product.producer?.name || '—'}
                            </td>

                            {/* Tags */}
                            <td className="px-4 py-3 text-sm">
                                {product.tags.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                        {product.tags.map((tag) => (
                                            <span
                                                key={tag.id}
                                                className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
                                            >
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    '—'
                                )}
                            </td>

                            {/* Price */}
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                ${product.price.toLocaleString()}
                            </td>

                            {/* Stock */}
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                {product.stock}
                            </td>

                            {/* Created */}
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                {new Date(product.created_at).toLocaleDateString()}
                            </td>

                            {/* Actions */}
                            <td className="flex gap-2 px-4 py-3">
                                <Link
                                    href={`/backend/products/${product.id}/edit`}
                                    preserveState
                                    data={{
                                        search,
                                        tag: tag !== '__all__' ? tag : undefined,
                                        producer:
                                            producer !== '__all__'
                                                ? producer
                                                : undefined,
                                        page: products.current_page,
                                    }}
                                >
                                    <Button variant="outline" size="sm">
                                        <Pencil className="mr-1 h-4 w-4" /> Edit
                                    </Button>
                                </Link>

                                <Link
                                    href={`/backend/products/${product.id}/specs`}
                                >
                                    <Button variant="secondary" size="sm">
                                        Specs
                                    </Button>
                                </Link>

                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(product.id)}
                                >
                                    <Trash2 className="mr-1 h-4 w-4" /> Delete
                                </Button>
                            </td>
                        </TableRow>
                    ))
                ) : (
                    <tr>
                        <td
                            colSpan={8}
                            className="px-4 py-6 text-center text-gray-500"
                        >
                            No products found.
                        </td>
                    </tr>
                )}
            </Table>

            {/* Pagination */}
            <TablePagination
                page={products.current_page}
                totalPages={products.last_page}
                onPageChange={(newPage) => {
                    router.get(
                        '/backend/products',
                        {
                            page: newPage,
                            search,
                            tag: tag !== '__all__' ? tag : undefined,
                            producer: producer !== '__all__' ? producer : undefined,
                        },
                        { preserveState: true },
                    );
                }}
            />
        </div>
    );
}

Index.layout = (page: React.ReactNode) => <BackendLayout>{page}</BackendLayout>;
