/* eslint-disable @typescript-eslint/no-explicit-any */
import UserLayout from "@/layouts/frontend/user-layout";
import { Head, Link, router } from "@inertiajs/react";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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

  const APP_URL = import.meta.env.VITE_APP_URL || "http://127.0.0.1:8000";

  const getImageUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${APP_URL}/storage/${path.replace(/^storage\/|^public\//, "")}`;
  };

  const normalizeCart = (items: any[]) => {
    const normalized = items.map((item) => ({
      id: item.id,
      name: item.name ?? item.product?.name ?? "Unnamed",
      price: item.price ?? item.product?.price ?? 0,
      quantity: item.quantity ?? 1,
      image: item.image ?? item.product?.image ?? "",
    }));
    setCartItems(normalized);
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/cart");
        const data = await res.json();

        if (Array.isArray(data.items)) normalizeCart(data.items);
        else if (Array.isArray(data.cart)) normalizeCart(Object.values(data.cart));
        else if (Array.isArray(data)) normalizeCart(data);
        else setCartItems([]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleRemove = async (id: number) => {
    await fetch(`/cart/${id}`, {
      method: "DELETE",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRF-TOKEN":
          document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
      },
      credentials: "include",
    });

    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQty = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
      )
    );
  };

  const total = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [cartItems]
  );

  return (
    <UserLayout title="Shopping Cart">
      <Head title="Shopping Cart" />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="mb-8 flex items-center gap-3 text-3xl font-extrabold text-slate-900 dark:text-white">
          <ShoppingCart className="h-7 w-7 text-cyan-600" />
          Shopping Cart
        </h1>

        {loading ? (
          <div className="text-center text-slate-500">Loading cart…</div>
        ) : cartItems.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <ShoppingCart className="mx-auto mb-4 h-10 w-10 text-slate-400" />
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              Your cart is empty
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Browse products and add them to your cart.
            </p>
            <Link
              href="/catalog"
              className="mt-6 inline-block rounded-xl bg-cyan-600 px-6 py-3 font-semibold text-white hover:bg-cyan-700"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
            {/* Items */}
            <div className="space-y-5">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-slate-50 dark:bg-gray-800">
                    {item.image ? (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-slate-400">NO IMAGE</span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      ₦{item.price.toLocaleString()}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 dark:border-gray-700">
                        <button onClick={() => updateQty(item.id, -1)}>
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-6 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button onClick={() => updateQty(item.id, 1)}>
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <span className="text-lg font-bold text-slate-900 dark:text-white">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="sticky top-24 h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
                Order Summary
              </h3>

              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>₦{total.toLocaleString()}</span>
              </div>

              <div className="my-4 border-t dark:border-gray-700" />

              <div className="flex justify-between text-xl font-extrabold text-slate-900 dark:text-white">
                <span>Total</span>
                <span>₦{total.toLocaleString()}</span>
              </div>

              <button
                onClick={() => router.visit("/checkout")}
                className="mt-6 w-full rounded-2xl bg-cyan-600 py-3 font-semibold text-white hover:bg-cyan-700"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
