/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import UserLayout from "@/layouts/frontend/user-layout";
import { router, useForm, usePage, Link } from "@inertiajs/react";
import { type SharedData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CartItem {
  id: number;
  name: string;
  price: number | null;
  quantity: number;
  image?: string;
}

interface PageProps {
  cart: CartItem[];
  pricedTotal: number;
  hasRfq: boolean;
  [key: string]: any;
}

type QuoteCheckoutForm = {
  shipping: {
    full_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
  };
  notes: string;
};

const isRFQ = (price: number | null | undefined) =>
  price === null || price === undefined || Number(price) <= 0;

export default function QuoteCheckout({ cart = [], pricedTotal = 0 }: PageProps) {
  const { auth } = usePage<SharedData>().props;
  const user = auth?.user ?? null;

  // Same address builder you used in normal checkout
  const defaultAddress = useMemo(() => {
    const line1 = (user as any)?.address_line1 as string | null | undefined;
    const line2 = (user as any)?.address_line2 as string | null | undefined;
    return [line1, line2].filter(Boolean).join("\n");
  }, [user]);

  const { data, setData, processing, errors, reset } = useForm<QuoteCheckoutForm>({
    shipping: {
      full_name: user?.name ?? "",
      email: user?.email ?? "",
      phone: ((user as any)?.phone as string | null | undefined) ?? "",
      address: defaultAddress || "",
      city: ((user as any)?.city as string | null | undefined) ?? "Lagos",
      state: ((user as any)?.state as string | null | undefined) ?? "Lagos State",
      country: ((user as any)?.country as string | null | undefined) ?? "Nigeria",
    },
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    router.post(
      "/quote-checkout",
      {
        cart: cart.map((item) => ({
          id: item.id,
          price: item.price, // can be null/0
          quantity: item.quantity,
        })),
        shipping: data.shipping,
        notes: data.notes,
      },
      {
        onSuccess: () => reset(),
      }
    );
  };

  const cartHasRfq = cart.some((i) => isRFQ(i.price));

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
      <form onSubmit={handleSubmit} className="space-y-6 md:col-span-2">
        <div>
          <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
            Request Quote (RFQ)
          </h2>

          {!cartHasRfq && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200">
              No RFQ items found. Please use normal checkout.
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={data.shipping.full_name}
                onChange={(e) =>
                  setData("shipping", { ...data.shipping, full_name: e.target.value })
                }
              />
              {errors["shipping.full_name"] && (
                <p className="mt-1 text-sm text-red-500">{errors["shipping.full_name"] as any}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={data.shipping.email}
                onChange={(e) =>
                  setData("shipping", { ...data.shipping, email: e.target.value })
                }
              />
              {errors["shipping.email"] && (
                <p className="mt-1 text-sm text-red-500">{errors["shipping.email"] as any}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={data.shipping.phone}
                onChange={(e) =>
                  setData("shipping", { ...data.shipping, phone: e.target.value })
                }
              />
              {errors["shipping.phone"] && (
                <p className="mt-1 text-sm text-red-500">{errors["shipping.phone"] as any}</p>
              )}
            </div>

            <div>
              <Label htmlFor="address">Delivery Address</Label>
              <Textarea
                id="address"
                value={data.shipping.address}
                onChange={(e) =>
                  setData("shipping", { ...data.shipping, address: e.target.value })
                }
              />
              {errors["shipping.address"] && (
                <p className="mt-1 text-sm text-red-500">{errors["shipping.address"] as any}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={data.shipping.city}
                  onChange={(e) =>
                    setData("shipping", { ...data.shipping, city: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={data.shipping.state}
                  onChange={(e) =>
                    setData("shipping", { ...data.shipping, state: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={data.shipping.country}
                onChange={(e) =>
                  setData("shipping", { ...data.shipping, country: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={data.notes}
                onChange={(e) => setData("notes", e.target.value)}
              />
              {errors["notes"] && (
                <p className="mt-1 text-sm text-red-500">{errors["notes"] as any}</p>
              )}
            </div>
          </div>
        </div>

        <Button type="submit" disabled={processing || !cartHasRfq || cart.length === 0} className="w-full md:w-auto">
          {processing ? "Submitting..." : "Submit Quote Request"}
        </Button>

        <div className="text-sm">
          <Link href="/cart" className="text-blue-600 underline">
            ← Back to Cart
          </Link>
        </div>
      </form>

      <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-100">Summary</h2>

        <div className="text-sm text-gray-700 dark:text-gray-200">
          Priced items total (snapshot): <span className="font-semibold">₦{pricedTotal.toLocaleString()}</span>
        </div>

        <p className="mt-2 text-xs text-gray-500 dark:text-gray-300">
          RFQ items will be priced by our team and updated in your quote details.
        </p>
      </div>
    </div>
  );
}

QuoteCheckout.layout = (page: React.ReactNode) => <UserLayout>{page}</UserLayout>;
