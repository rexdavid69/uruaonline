import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import BackendLayout from "@/layouts/backend/backend-layout";
import { Link, router, usePage } from "@inertiajs/react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import {
    Table,
    TableRow,
    TableSectionHeader,
    TableSearch,
    TablePagination,
} from "@/components/ui/data-table";

interface Producer {
    id: number;
    name: string;
    description?: string;
    logo?: string | null;
    created_at: string;
}

interface PageProps extends InertiaPageProps {
    producers: Producer[];
    flash?: { success?: string };
}

export default function Index() {
    const { producers, flash } = usePage<PageProps>().props;
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const filtered = producers.filter((producer) =>
        producer.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this producer?")) {
            router.delete(`/backend/producers/${id}`);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <TableSectionHeader
                title="Producers"
                description="Manage all registered producers on UruaOnline."
                action={
                    <div className="flex items-center gap-2">
                        <TableSearch
                            value={search}
                            onChange={setSearch}
                            placeholder="Search producers..."
                        />
                        <Link href="/backend/producers/create">
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" /> Add Producer
                            </Button>
                        </Link>
                    </div>
                }
            />

            {flash?.success && (
                <div className="rounded-md bg-green-100 p-3 text-green-700">
                    {flash.success}
                </div>
            )}

            <Table headers={["Logo", "Name", "Description", "Created At", "Actions"]}>
                {filtered.length > 0 ? (
                    filtered.map((producer) => (
                        <TableRow key={producer.id}>
                            <td className="px-4 py-3">
                                {producer.logo ? (
                                    <img
                                        src={`/storage/${producer.logo}`}
                                        alt={producer.name}
                                        className="w-12 h-12 rounded object-cover border"
                                    />
                                ) : (
                                    <span className="text-gray-400">—</span>
                                )}
                            </td>
                            <td className="px-4 py-3 font-medium">{producer.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                                {producer.description || "—"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                                {new Date(producer.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 flex gap-2">
                                <Link href={`/backend/producers/${producer.id}/edit`}>
                                    <Button variant="outline" size="sm">
                                        <Pencil className="h-4 w-4 mr-1" /> Edit
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(producer.id)}
                                >
                                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                                </Button>
                            </td>
                        </TableRow>
                    ))
                ) : (
                    <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                            No producers found.
                        </td>
                    </tr>
                )}
            </Table>

            <TablePagination page={page} totalPages={1} onPageChange={setPage} />
        </div>
    );
}

Index.layout = (page: React.ReactNode) => <BackendLayout>{page}</BackendLayout>;
