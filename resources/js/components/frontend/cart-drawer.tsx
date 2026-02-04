import React, { useEffect, useMemo, useState } from "react";
import { Link } from "@inertiajs/react";
import { Trash2, X, ShoppingCart } from "lucide-react";

interface CartItem {
  id: number;
  quantity: number;
  name?: string;
  price?: number;
  image?: string;
  product?: {
    name: string;
    price: number;
    image: string;
  };
}

export default function CartDrawer({ onClose }: { onClose: () => void }) {
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
      const res = await fetch("/api/cart", {
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
      });

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
      const res = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN":
            (
              document.querySelector(
                'meta[name="csrf-token"]'
              ) as HTMLMetaElement
            )?.content || "",
        },
        credentials: "include",
      });

      if (res.ok) {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const total = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + (item.price || 0) * item.quantity,
        0
      ),
    [cartItems]
  );

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-[420px] animate-[slideIn_0.3s_ease-out] bg-white shadow-2xl dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-cyan-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Your Cart
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-slate-100 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          </button>
        </div>

        {/* Body */}
        <div className="flex h-[calc(100%-5rem)] flex-col">
          {loading ? (
            <div className="flex flex-1 items-center justify-center text-slate-500 dark:text-slate-400">
              Loading cart…
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <p className="font-semibold text-slate-900 dark:text-white">
                Your cart is empty
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Add products to see them here
              </p>
              <Link
                href="/catalog"
                className="mt-4 rounded-xl bg-cyan-600 px-5 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="flex-1 overflow-y-auto divide-y dark:divide-gray-800">
                {cartItems.map((item) => {
                  const img = getImageUrl(item.image);

                  return (
                    <div key={item.id} className="flex gap-3 px-5 py-4">
                      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-slate-50 dark:bg-gray-800">
                        {img ? (
                          <img
                            src={img}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-semibold text-slate-400">
                            NO IMG
                          </span>
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          ₦{(item.price ?? 0).toLocaleString()} ×{" "}
                          {item.quantity}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          ₦
                          {(
                            (item.price ?? 0) * item.quantity
                          ).toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="rounded-lg p-1 text-red-500 transition hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="border-t border-slate-200 px-5 py-4 dark:border-gray-800">
                <div className="mb-4 flex justify-between text-sm font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">
                    Total
                  </span>
                  <span className="text-lg text-slate-900 dark:text-white">
                    ₦{total.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/cart"
                    className="rounded-xl border border-cyan-600 px-4 py-2 text-center text-sm font-semibold text-cyan-700 hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-900/20"
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    className="rounded-xl bg-cyan-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-cyan-700"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tailwind animation */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
