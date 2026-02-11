/* eslint-disable @typescript-eslint/no-explicit-any */
// resources/js/pages/frontend/orders/show.tsx

import React, { useMemo, useState } from "react";
import axios from "axios";
import { usePage, Link, router } from "@inertiajs/react";
import UserLayout from "@/layouts/frontend/user-layout";

interface Product {
  id: number;
  name: string;
  image?: string;
}

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: Product;
}

interface Payment {
  method: string;
  status: string;
  reference?: string;
}

interface ShippingAddress {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

interface Order {
  id: number;
  status: string;
  payment_status: string;
  payment_method?: string;
  total: number;
  created_at: string;
  items: OrderItem[];
  payment?: Payment;
  shipping_address?: ShippingAddress;
}

interface PageProps {
  order: Order;
  [key: string]: any;
}

type PaymentMethod = "paystack" | "stripe" | "transfer" | "cod";

export default function OrderShow() {
  const { order } = usePage<PageProps>().props;

  // Use either the order.payment_method OR payment.method (but order.payment_method should be source of truth)
  const currentMethod = useMemo(() => {
    return String(order.payment_method || order.payment?.method || "")
      .toLowerCase()
      .trim();
  }, [order.payment_method, order.payment?.method]);

  const isUnpaid = String(order.payment_status).toLowerCase() !== "successful";
  const canPayOnline = currentMethod === "paystack" || currentMethod === "stripe";

  const [savingMethod, setSavingMethod] = useState(false);

  const updatePaymentMethod = async (newMethod: PaymentMethod) => {
    try {
      setSavingMethod(true);

      // This endpoint MUST exist in backend (I’ll show it below)
      await axios.patch(`/my-orders/${order.id}/payment-method`, {
        payment_method: newMethod,
      });

      // refresh the page props so method updates immediately
      router.reload({ only: ["order"] });
    } catch (e: any) {
      console.error(e);
      alert(e?.response?.data?.message ?? e?.message ?? "Failed to update payment method");
    } finally {
      setSavingMethod(false);
    }
  };

  const payNow = async () => {
    try {
      if (!canPayOnline) {
        alert("Please select Paystack or Stripe first.");
        return;
      }

      if (currentMethod === "paystack") {
        const res = await axios.post(`/payments/paystack/init/${order.id}`);
        const url = res.data?.authorization_url;
        if (!url) throw new Error("Paystack returned no authorization_url");
        window.location.href = url;
        return;
      }

      if (currentMethod === "stripe") {
        const res = await axios.post(`/payments/stripe/init/${order.id}`);
        const url = res.data?.url;
        if (!url) throw new Error("Stripe returned no url");
        window.location.href = url;
        return;
      }
    } catch (e: any) {
      console.error(e);
      alert(e?.response?.data?.message ?? e?.message ?? "Payment init failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <Link href="/my-orders" className="text-blue-600 underline text-sm">
        ← Back to Orders
      </Link>

      <h1 className="text-2xl font-bold mb-2">Order #{order.id}</h1>
      <p className="text-gray-500 mb-4">
        Placed on {new Date(order.created_at).toLocaleDateString()}
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Shipping */}
        <div className="rounded-lg border p-4 bg-white dark:bg-gray-800 shadow-sm">
          <h2 className="font-semibold mb-2">Shipping Address</h2>

          {order.shipping_address ? (
            <div className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
              <p>{order.shipping_address.full_name}</p>
              <p>{order.shipping_address.phone}</p>
              <p>{order.shipping_address.address}</p>
              <p>
                {order.shipping_address.city}, {order.shipping_address.state}
              </p>
              <p>{order.shipping_address.country}</p>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No shipping info available.</p>
          )}
        </div>

        {/* Payment */}
        <div className="rounded-lg border p-4 bg-white dark:bg-gray-800 shadow-sm">
          <h2 className="font-semibold mb-2">Payment</h2>

          <div className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
            <p>Method: {order.payment_method ?? order.payment?.method ?? "—"}</p>
            <p>Status: {order.payment?.status ?? order.payment_status}</p>
            {order.payment?.reference && <p>Reference: {order.payment.reference}</p>}
          </div>

          {/* ✅ Allow user choose payment method if unpaid */}
          {isUnpaid && (
            <div className="mt-4 space-y-2">
              <label className="block text-xs text-gray-500 dark:text-gray-300">
                Select payment method
              </label>

              <select
                className="w-full rounded-md border p-2 dark:bg-gray-900 dark:text-gray-100"
                value={(currentMethod || "") as any}
                onChange={(e) => updatePaymentMethod(e.target.value as PaymentMethod)}
                disabled={savingMethod}
              >
                <option value="">-- choose --</option>
                <option value="paystack">Paystack (Card/Bank)</option>
                <option value="stripe">Stripe (Card)</option>
                <option value="transfer">Bank Transfer</option>
                <option value="cod">Pay on Delivery</option>
              </select>

              {savingMethod && (
                <p className="text-xs text-gray-500 dark:text-gray-300">Saving…</p>
              )}
            </div>
          )}

          {/* ✅ Pay Now shows once method is paystack/stripe */}
          {isUnpaid && canPayOnline && (
            <button
              type="button"
              onClick={payNow}
              className="mt-3 w-full rounded-md bg-black px-4 py-2 text-white"
            >
              Pay Now
            </button>
          )}

          {isUnpaid && !canPayOnline && (
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-300">
              Online payment is not enabled for this order yet. Select Paystack or Stripe above.
            </p>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="rounded-lg border p-4 bg-white dark:bg-gray-800 shadow-sm">
        <h2 className="font-semibold mb-2">Items</h2>

        <ul className="list-disc pl-5 text-gray-700 dark:text-gray-200">
          {order.items.map((item) => (
            <li key={item.id}>
              {item.product.name} × {item.quantity} - ₦{item.price.toLocaleString()}{" "}
              (Subtotal: ₦{(item.price * item.quantity).toLocaleString()})
            </li>
          ))}
        </ul>

        <div className="text-right font-semibold mt-2">
          Total: ₦{(order.total ?? 0).toLocaleString()}
        </div>
      </div>

      <div className="space-y-2">
        <p>
          Status: <span className="font-semibold">{order.status}</span>
        </p>
        <p>
          Payment Status: <span className="font-semibold">{order.payment_status}</span>
        </p>
      </div>
    </div>
  );
}

OrderShow.layout = (page: React.ReactNode) => <UserLayout>{page}</UserLayout>;
