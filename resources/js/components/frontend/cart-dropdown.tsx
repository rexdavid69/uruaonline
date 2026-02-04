import React, { useEffect, useMemo, useState } from "react";
import { Link } from "@inertiajs/react";
import { Trash2, ShoppingCart, Loader2 } from "lucide-react";

interface CartItem {
  id: number;
  quantity: number;
  name?: string;
  price?: number | null;
  image?: string;
  product?: {
    name: string;
    price: number;
    image: string;
  };
}

export default function CartDropdown() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const APP_URL = import.meta.env.VITE_APP_URL || "http://127.0.0.1:8000";

  const getImageUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${APP_URL}/storage/${path.replace(/^storage\/|^public\//, "")}`;
  };

  const fetchCartItems = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();

      let items: CartItem[] = [];
      if (Array.isArray(data)) items = data;
      else if (Array.isArray(data.cart)) items = data.cart;
      else if (Array.isArray(data.items)) items = data.items;

      const normalized = items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        name: item.name ?? item.product?.name ?? "Unnamed",
        price: item.price ?? item.product?.price ?? 0,
        image: item.image ?? item.product?.image ?? "",
      }));

      setCartItems(normalized);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleRemove = async (id: number) => {
    try {
      const res = await fetch(`/api/cart/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0),
    [cartItems]
  );

  // ===== Loading =====
  if (loading) {
    return (
      <div className="absolute right-0 mt-3 w-96 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 dark:border-gray-800">
          <ShoppingCart className="h-4 w-4 text-cyan-600" />
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Cart
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 px-4 py-10 text-slate-600 dark:text-slate-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading…</span>
        </div>
      </div>
    );
  }

  // ===== Empty =====
  if (cartItems.length === 0) {
    return (
      <div className="absolute right-0 mt-3 w-96 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 dark:border-gray-800">
          <ShoppingCart className="h-4 w-4 text-cyan-600" />
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Cart
          </p>
        </div>

        <div className="px-4 py-10 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700 dark:bg-cyan-900/25 dark:text-cyan-200">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Your cart is empty
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Add items to see them here.
          </p>

          <Link
            href="/catalog"
            className="mt-4 inline-flex items-center justify-center rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  // ===== Normal =====
  return (
    <div className="absolute right-0 mt-3 w-96 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-cyan-600" />
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Cart Summary
          </p>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-gray-800 dark:text-slate-200">
            {cartItems.length}
          </span>
        </div>

        <Link
          href="/cart"
          className="text-xs font-semibold text-cyan-700 hover:text-cyan-800 dark:text-cyan-300"
        >
          View cart →
        </Link>
      </div>

      {/* Items */}
      <div className="max-h-72 overflow-y-auto">
        {cartItems.map((item) => {
          const img = getImageUrl(item.image);

          return (
            <div
              key={item.id}
              className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 dark:border-gray-800"
            >
              {/* Image */}
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-slate-50 dark:bg-gray-800">
                {img ? (
                  <img
                    src={img}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="text-[10px] font-semibold text-slate-400">
                    NO IMG
                  </span>
                )}
              </div>

              {/* Meta */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {item.name}
                </p>

                <div className="mt-1 flex items-center justify-between">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ₦{(item.price ?? 0).toLocaleString()} ×{" "}
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {item.quantity}
                    </span>
                  </p>

                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    ₦{((item.price ?? 0) * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Remove */}
              <button
                onClick={() => handleRemove(item.id)}
                className="rounded-xl p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                title="Remove"
                aria-label="Remove item"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 px-4 py-4 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Total
          </span>
          <span className="text-base font-extrabold text-slate-900 dark:text-white">
            ₦{total.toLocaleString()}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href="/cart"
            className="rounded-xl border border-cyan-600 px-4 py-2 text-center text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-900/20"
          >
            View Cart
          </Link>
          <Link
            href="/checkout"
            className="rounded-xl bg-cyan-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
