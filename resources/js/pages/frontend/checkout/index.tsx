import React from "react";
import { useForm, Link, router } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import UserLayout from "@/layouts/frontend/user-layout"; // ✅ Correct import

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

interface PageProps {
    cart: CartItem[];
    total: number;
}

export default function Checkout({ cart = [], total = 0 }: PageProps) {
    const { data, setData, processing, errors, reset } = useForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        notes: "",
        payment_method: "pay_on_delivery",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.post("/checkout", {
            ...data,
            cart: cart.map(item => ({
                id: item.id,
                price: item.price,
                quantity: item.quantity,
            })),
            shipping: {
                full_name: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address,
                city: "Lagos",
                state: "Lagos State",
                country: "Nigeria",
            },
        }, {
            onSuccess: () => {
                reset();
                router.visit("/thank-you");
            },
            onError: (errors) => {
                console.log(errors);
            },
        });
    };

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 grid md:grid-cols-3 gap-8">
            {/* 🧾 Checkout Form */}
            <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
                <div>
                    <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                        Shipping Details
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                placeholder="John Doe"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                placeholder="you@example.com"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                value={data.phone}
                                onChange={(e) => setData("phone", e.target.value)}
                                placeholder="+234 801 234 5678"
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="address">Delivery Address</Label>
                            <Textarea
                                id="address"
                                value={data.address}
                                onChange={(e) => setData("address", e.target.value)}
                                placeholder="123 Main Street, Lagos"
                            />
                            {errors.address && (
                                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="notes">Order Notes (optional)</Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData("notes", e.target.value)}
                                placeholder="Any delivery notes or requests..."
                            />
                        </div>

                        <div>
                            <Label>Payment Method</Label>
                            <select
                                className="w-full border rounded-md p-2 dark:bg-gray-800 dark:text-gray-100"
                                value={data.payment_method}
                                onChange={(e) =>
                                    setData("payment_method", e.target.value)
                                }
                            >
                                <option value="pay_on_delivery">Pay on Delivery</option>
                                <option value="bank_transfer">Bank Transfer</option>
                                <option value="card_payment">Card Payment</option>
                            </select>
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={processing}
                    className="w-full md:w-auto"
                >
                    {processing ? "Placing Order..." : "Place Order"}
                </Button>
            </form>

            {/* 🛒 Cart Summary */}
            <div className="border rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    Your Order
                </h2>
                {cart.length > 0 ? (
                    <>
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700 mb-4">
                            {cart.map((item) => (
                                <li
                                    key={item.id}
                                    className="flex items-center justify-between py-3"
                                >
                                    <div className="flex items-center gap-3">
                                        {item.image && (
                                            <img
                                                src={`/storage/${item.image}`}
                                                alt={item.name}
                                                className="h-12 w-12 rounded-md object-cover"
                                            />
                                        )}
                                        <span className="text-gray-800 dark:text-gray-100">
                                            {item.name} × {item.quantity}
                                        </span>
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300">
                                        ₦{(item.price * item.quantity).toLocaleString()}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-between font-semibold text-lg">
                            <span>Total:</span>
                            <span>₦{total.toLocaleString()}</span>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500 text-sm">
                        Your cart is empty.{" "}
                        <Link href="/catalog" className="text-blue-600 underline">
                            Go shopping
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
}

// ✅ Proper Layout Wrapper
Checkout.layout = (page: React.ReactNode) => <UserLayout>{page}</UserLayout>;
