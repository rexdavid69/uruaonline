import React, { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import { Trash2, X } from "lucide-react";

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

  const fetchCartItems = async () => {
    try {
      const res = await fetch("/api/cart", {
        headers: {
          "Accept": "application/json", // 👈 forces Laravel to treat this as API
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
          "Accept": "application/json", // 👈 add this
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN":
            (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)
              ?.content || "",
        },
        credentials: "include",
      });

      if (res.ok) {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        console.error("Delete failed", await res.text());
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };




  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 z-50 h-full w-full sm:w-[450px] bg-white shadow-xl transform animate-slide-in">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 flex flex-col h-[calc(100%-5rem)]">
          {loading ? (
            <div className="text-center text-gray-600 mt-10">Loading...</div>
          ) : cartItems.length === 0 ? (
            <div className="text-center text-gray-600 mt-10">
              Your cart is empty 🛒
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto divide-y">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-3">
                    {item.image && (
                      <img
                        src={`http://127.0.0.1:8000/storage/${item.image}`}
                        alt={item.name}
                        className="h-14 w-14 rounded object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        ₦{item.price?.toLocaleString() ?? 0} × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        ₦{((item.price ?? 0) * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between mb-4 font-semibold">
                  <span>Total:</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>

                <div className="flex gap-2">
                  <Link
                    href="/cart"
                    className="flex-1 text-center rounded-md border border-cyan-600 px-4 py-2 text-cyan-600 hover:bg-cyan-50 transition"
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    className="flex-1 text-center rounded-md bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700 transition"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}
