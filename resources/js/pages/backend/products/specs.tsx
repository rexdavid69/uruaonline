import React, { useState, FormEvent } from "react";
import { useForm, router as inertiaRouter } from "@inertiajs/react";
import BackendLayout from "@/layouts/backend/backend-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface Product {
    id: number;
    name: string;
}

interface Spec {
    id: number;
    key: string;
    value: string;
}

interface SpecsProps {
    product: Product;
    specs: Spec[];
}

export default function Specs({ product, specs }: SpecsProps) {
    const { data, setData, reset, processing } = useForm({
        key: "",
        value: "",
    });

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState({ key: "", value: "" });

    // ✅ Add Specification
    const handleAdd = (e: FormEvent) => {
        e.preventDefault();

        inertiaRouter.post(`/backend/products/${product.id}/specs`, data, {
            onSuccess: () => reset(),
        });
    };

    // ✅ Edit Mode
    const handleEdit = (spec: Spec) => {
        setEditingId(spec.id);
        setEditData({ key: spec.key, value: spec.value });
    };

    // ✅ Update Specification
    const handleUpdate = (e: FormEvent) => {
        e.preventDefault();

        if (!editingId) return;

        inertiaRouter.put(`/backend/products/specs/${editingId}`, editData, {
            onSuccess: () => setEditingId(null),
        });
    };

    // ✅ Delete Specification
    const handleDelete = (id: number) => {
        if (confirm("Delete this specification?")) {
            inertiaRouter.delete(`/backend/specs/${id}`);
        }
    };

    return (
        <BackendLayout>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">
                    Manage Specifications for {product.name}
                </h1>

                {/* Add Spec Form */}
                <Card>
                    <CardContent>
                        <form onSubmit={handleAdd} className="flex gap-3 flex-wrap">
                            <Input
                                placeholder="Key (e.g., Power Output)"
                                value={data.key}
                                onChange={(e) => setData("key", e.target.value)}
                                className="flex-1"
                            />
                            <Input
                                placeholder="Value (e.g., 12V DC)"
                                value={data.value}
                                onChange={(e) => setData("value", e.target.value)}
                                className="flex-1"
                            />
                            <Button type="submit" disabled={processing}>
                                Add Spec
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardContent className="overflow-x-auto">
                        <table className="min-w-full border">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-800">
                                    <th className="px-4 py-2 text-left">Key</th>
                                    <th className="px-4 py-2 text-left">Value</th>
                                    <th className="px-4 py-2 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {specs.length ? (
                                    specs.map((spec) => (
                                        <tr
                                            key={spec.id}
                                            className="border-b hover:bg-gray-50 dark:hover:bg-gray-900"
                                        >
                                            <td className="px-4 py-2">
                                                {editingId === spec.id ? (
                                                    <Input
                                                        value={editData.key}
                                                        onChange={(e) =>
                                                            setEditData({
                                                                ...editData,
                                                                key: e.target.value,
                                                            })
                                                        }
                                                    />
                                                ) : (
                                                    spec.key
                                                )}
                                            </td>

                                            <td className="px-4 py-2">
                                                {editingId === spec.id ? (
                                                    <Input
                                                        value={editData.value}
                                                        onChange={(e) =>
                                                            setEditData({
                                                                ...editData,
                                                                value: e.target.value,
                                                            })
                                                        }
                                                    />
                                                ) : (
                                                    spec.value
                                                )}
                                            </td>

                                            <td className="px-4 py-2 text-right">
                                                {editingId === spec.id ? (
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="sm" onClick={handleUpdate}>
                                                            Save
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => setEditingId(null)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleEdit(spec)}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() =>
                                                                handleDelete(spec.id)
                                                            }
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="px-4 py-4 text-center text-gray-500"
                                        >
                                            No specifications yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </BackendLayout>
    );
}
