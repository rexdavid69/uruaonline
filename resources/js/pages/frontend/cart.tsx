import UserLayout from '@/layouts/frontend/user-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

export default function Cart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const APP_URL = import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000';

    const getImageUrl = (path?: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${APP_URL}/storage/${path.replace(/^storage\/|^public\//, '')}`;
    };

    // Normalize cart items and calculate total
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normalizeCart = (items: any[]) => {
        const normalized = items.map((item) => ({
            id: item.id,
            name: item.name ?? item.product?.name ?? 'Unnamed',
            price: item.price ?? item.product?.price ?? 0,
            quantity: item.quantity ?? 1,
            image: item.image ?? item.product?.image ?? '',
        }));
        setCartItems(normalized);

        const calculatedTotal = normalized.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
        );
        setTotal(calculatedTotal);
    };

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await fetch('/api/cart');
                const data = await res.json();

                if (Array.isArray(data.items)) normalizeCart(data.items);
                else if (Array.isArray(data.cart))
                    normalizeCart(Object.values(data.cart));
                else if (Array.isArray(data)) normalizeCart(data);
                else {
                    console.warn('Unexpected cart data format:', data);
                    setCartItems([]);
                    setTotal(0);
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    // Remove item
    const handleRemove = async (id: number) => {
        try {
            const res = await fetch(`/cart/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                credentials: 'include', // 👈 important for session cookies
            });

            if (res.ok) {
                const updated = cartItems.filter((item) => item.id !== id);
                setCartItems(updated);
                setTotal(
                    updated.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0,
                    ),
                );
            } else {
                console.error('Failed to delete:', await res.text());
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    // Update quantity
    const handleQuantityChange = (id: number, newQty: number) => {
        const updated = cartItems.map((item) =>
            item.id === id ? { ...item, quantity: newQty } : item,
        );
        setCartItems(updated);
        setTotal(
            updated.reduce((sum, item) => sum + item.price * item.quantity, 0),
        );
    };

    return (
        <UserLayout title="My Cart">
            <Head title="My Cart" />

            <div className="flex flex-col gap-6 p-6">
                <h2 className="text-2xl font-bold text-cyan-800 dark:text-cyan-300">
                    Shopping Cart
                </h2>

                {loading ? (
                    <p className="text-gray-500">Loading your cart...</p>
                ) : cartItems.length === 0 ? (
                    <div className="py-10 text-center">
                        <p className="text-gray-600 dark:text-gray-300">
                            Your cart is empty.
                        </p>
                        <Link
                            href="/"
                            className="mt-4 inline-block rounded-lg bg-cyan-600 px-6 py-2 font-medium text-white transition hover:bg-cyan-700"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        Product
                                    </th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        Quantity
                                    </th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                {cartItems.map((item) => (
                                    <tr key={item.id}>
                                        <td className="flex items-center gap-4 px-6 py-4">
                                            {item.image && (
                                                <img
                                                    src={getImageUrl(
                                                        item.image,
                                                    )}
                                                    alt={item.name}
                                                    className="h-16 w-16 rounded-lg object-contain"
                                                />
                                            )}
                                            <span className="font-medium text-gray-800 dark:text-gray-100">
                                                {item.name}
                                            </span>
                                        </td>
                                        <td className="text-center text-gray-700 dark:text-gray-300">
                                            ₦{item.price.toLocaleString()}
                                        </td>
                                        <td className="text-center">
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    handleQuantityChange(
                                                        item.id,
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 1,
                                                    )
                                                }
                                                min="1"
                                                className="w-16 rounded-md border border-gray-300 bg-gray-50 px-2 py-1 text-center dark:border-gray-600 dark:bg-gray-800"
                                            />
                                        </td>
                                        <td className="text-center font-semibold text-gray-800 dark:text-gray-100">
                                            ₦
                                            {(
                                                item.price * item.quantity
                                            ).toLocaleString()}
                                        </td>
                                        <td className="text-center">
                                            <button
                                                onClick={() =>
                                                    handleRemove(item.id)
                                                }
                                                className="rounded-md bg-red-500 p-2 text-white transition hover:bg-red-600"
                                                title="Remove"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {cartItems.length > 0 && (
                    <div className="mt-6 flex flex-col items-end gap-4">
                        <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            Total:{' '}
                            <span className="text-cyan-700 dark:text-cyan-400">
                                ₦{total.toLocaleString()}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() => router.visit('/checkout')}
                            className="w-full rounded-lg bg-cyan-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-cyan-700 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:outline-none md:w-auto md:text-base dark:focus:ring-offset-gray-900"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
