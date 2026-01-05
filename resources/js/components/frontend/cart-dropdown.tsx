import React, { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import { Trash2 } from "lucide-react";

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

export default function CartDropdown() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

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
        // Remove locally
        setCartItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  if (loading)
    return (
      <div className="absolute right-0 mt-3 w-80 rounded-lg bg-white shadow-xl p-4 text-center text-gray-700">
        Loading...
      </div>
    );

  if (cartItems.length === 0)
    return (
      <div className="absolute right-0 mt-3 w-80 rounded-lg bg-white shadow-xl p-4 text-center text-gray-700">
        Your cart is empty 🛒
      </div>
    );

  return (
    <div className="absolute right-0 mt-3 w-80 rounded-lg bg-white shadow-xl p-4 text-gray-800">
      <h3 className="mb-2 text-lg font-semibold">Cart Summary</h3>
      <div className="max-h-60 overflow-y-auto divide-y">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3 py-2">
            {item.image && (
              <img
                src={`http://127.0.0.1:8000/storage/${item.image}`}
                alt={item.name}
                className="h-12 w-12 rounded object-cover"
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

      <div className="mt-3 flex justify-between items-center border-t pt-3">
        <span className="font-semibold">Total:</span>
        <span className="font-bold">₦{total.toLocaleString()}</span>
      </div>

      <div className="mt-4 flex gap-2">
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
  );
}
