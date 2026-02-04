/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useForm, Link, router } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import UserLayout from "@/layouts/frontend/user-layout";

type CartItem = {
  id: number;
  name: string;
  price: number | null;
  quantity: number;
  image?: string;
};

interface PageProps {
  cart: CartItem[];
  pricedTotal: number;
  hasRfq: boolean;
  [key: string]: any;
}

const isRFQ = (price: any) => price === null || price === undefined || Number(price) <= 0;
const formatNaira = (n: any) => `₦${Number(n).toLocaleString()}`;

export default function QuoteCheckout({ cart = [], pricedTotal = 0 }: PageProps) {
  const { data, setData, processing, errors, reset } = useForm({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    router.post(
      "/quote-checkout",
      {
        notes: data.notes,
        cart: cart.map((item) => ({
          id: item.id,
          price: item.price, // nullable
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
      },
      {
        onSuccess: () => {
          reset();
          router.visit("/quote-thank-you");
        },
      }
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 grid md:grid-cols-3 gap-8">
      {/* Form */}
      <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
            Request for Quote
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            We’ll review your items and send you a quote.
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number (optional)</Label>
              <Input
                id="phone"
                value={data.phone}
                onChange={(e) => setData("phone", e.target.value)}
                placeholder="+234 801 234 5678"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <Label htmlFor="address">Delivery Address (optional)</Label>
              <Textarea
                id="address"
                value={data.address}
                onChange={(e) => setData("address", e.target.value)}
                placeholder="123 Main Street, Lagos"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={data.notes}
                onChange={(e) => setData("notes", e.target.value)}
                placeholder="Quantities, preferred delivery time, required accessories, etc."
              />
            </div>
          </div>
        </div>

        <Button type="submit" disabled={processing} className="w-full md:w-auto">
          {processing ? "Submitting..." : "Submit Quote Request"}
        </Button>

        <div className="text-sm">
          <Link href="/cart" className="text-blue-600 underline">
            ← Back to Cart
          </Link>
        </div>
      </form>

      {/* Summary */}
      <div className="border rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Quote Summary
        </h2>

        {cart.length ? (
          <>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 mb-4">
              {cart.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={`/storage/${item.image}`}
                        alt={item.name}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                    )}
                    <div>
                      <div className="text-gray-800 dark:text-gray-100">
                        {item.name} × {item.quantity}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-300">
                        {isRFQ(item.price) ? "RFQ item" : `Unit: ${formatNaira(item.price)}`}
                      </div>
                    </div>
                  </div>

                  <span className="text-gray-700 dark:text-gray-300">
                    {isRFQ(item.price)
                      ? "RFQ"
                      : formatNaira(Number(item.price) * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex justify-between font-semibold text-base">
              <span>Estimated total (priced items only):</span>
              <span>{formatNaira(pricedTotal)}</span>
            </div>

            <p className="mt-2 text-xs text-gray-500 dark:text-gray-300">
              RFQ items will be priced in the quote we send you.
            </p>
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

QuoteCheckout.layout = (page: React.ReactNode) => <UserLayout>{page}</UserLayout>;
