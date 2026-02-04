/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import UserLayout from '@/layouts/frontend/user-layout';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import React, { useMemo } from 'react';
import { type SharedData } from '@/types';

interface CartItem {
  id: number;
  name: string;
  price: number | null;
  quantity: number;
  image?: string;
}

interface PageProps {
  cart: CartItem[];
  total: number; // priced-only total from backend
  hasRfq?: boolean;
  [key: string]: any;
}

type PaymentMethod = 'paystack' | 'transfer' | 'cod';

type CheckoutForm = {
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
  payment_method: PaymentMethod;
};

const isRFQ = (price: number | null | undefined) =>
  price === null || price === undefined || Number(price) <= 0;

const formatNaira = (n: number | null | undefined) =>
  `₦${Number(n ?? 0).toLocaleString()}`;

export default function Checkout({
  cart = [],
  total = 0,
  hasRfq = false,
}: PageProps) {
  const { auth } = usePage<SharedData>().props;
  const user = auth?.user ?? null;

  // Build a nicer address from account defaults (line1 + line2)
  const defaultAddress = useMemo(() => {
    const line1 = (user as any)?.address_line1 as string | null | undefined;
    const line2 = (user as any)?.address_line2 as string | null | undefined;
    return [line1, line2].filter(Boolean).join('\n');
  }, [user]);

  // Default shipping values from user account
  const { data, setData, processing, errors, reset } = useForm<CheckoutForm>({
    shipping: {
      full_name: user?.name ?? '',
      email: user?.email ?? '',
      phone: ((user as any)?.phone as string | null | undefined) ?? '',
      address: defaultAddress || '',
      city: ((user as any)?.city as string | null | undefined) ?? 'Lagos',
      state: ((user as any)?.state as string | null | undefined) ?? 'Lagos State',
      country: ((user as any)?.country as string | null | undefined) ?? 'Nigeria',
    },
    notes: '',
    payment_method: 'cod',
  });

  const cartHasRfq = cart.some((i) => isRFQ(i.price));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    router.post(
      '/checkout',
      {
        cart: cart.map((item) => ({
          id: item.id,
          price: item.price,
          quantity: item.quantity,
        })),
        shipping: data.shipping,
        payment_method: data.payment_method,
        notes: data.notes,
      },
      {
        onSuccess: () => {
          reset();
        },
        onError: (errs) => {
          console.log(errs);
          console.log('SENT payment_method:', data.payment_method);
        },
      },
    );
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
      {/* 🧾 Checkout Form */}
      <form onSubmit={handleSubmit} className="space-y-6 md:col-span-2">
        <div>
          <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
            Shipping Details
          </h2>

          {/* If somehow RFQ items slip in, warn */}
          {(hasRfq || cartHasRfq) && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200">
              Your cart contains items that require a quote. Please go back to cart
              and use the Request Quote checkout.
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={data.shipping.full_name}
                onChange={(e) =>
                  setData('shipping', {
                    ...data.shipping,
                    full_name: e.target.value,
                  })
                }
                placeholder="John Doe"
              />
              {errors['shipping.full_name'] && (
                <p className="mt-1 text-sm text-red-500">
                  {errors['shipping.full_name'] as any}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={data.shipping.email}
                onChange={(e) =>
                  setData('shipping', {
                    ...data.shipping,
                    email: e.target.value,
                  })
                }
                placeholder="you@example.com"
              />
              {errors['shipping.email'] && (
                <p className="mt-1 text-sm text-red-500">
                  {errors['shipping.email'] as any}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={data.shipping.phone}
                onChange={(e) =>
                  setData('shipping', {
                    ...data.shipping,
                    phone: e.target.value,
                  })
                }
                placeholder="+234 801 234 5678"
              />
              {errors['shipping.phone'] && (
                <p className="mt-1 text-sm text-red-500">
                  {errors['shipping.phone'] as any}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="address">Delivery Address</Label>
              <Textarea
                id="address"
                value={data.shipping.address}
                onChange={(e) =>
                  setData('shipping', {
                    ...data.shipping,
                    address: e.target.value,
                  })
                }
                placeholder="123 Main Street, Lagos"
              />
              {errors['shipping.address'] && (
                <p className="mt-1 text-sm text-red-500">
                  {errors['shipping.address'] as any}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={data.shipping.city}
                onChange={(e) =>
                  setData('shipping', {
                    ...data.shipping,
                    city: e.target.value,
                  })
                }
                placeholder="Lagos"
              />
              {errors['shipping.city'] && (
                <p className="mt-1 text-sm text-red-500">
                  {errors['shipping.city'] as any}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={data.shipping.state}
                onChange={(e) =>
                  setData('shipping', {
                    ...data.shipping,
                    state: e.target.value,
                  })
                }
                placeholder="Lagos State"
              />
              {errors['shipping.state'] && (
                <p className="mt-1 text-sm text-red-500">
                  {errors['shipping.state'] as any}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={data.shipping.country}
                onChange={(e) =>
                  setData('shipping', {
                    ...data.shipping,
                    country: e.target.value,
                  })
                }
                placeholder="Nigeria"
              />
              {errors['shipping.country'] && (
                <p className="mt-1 text-sm text-red-500">
                  {errors['shipping.country'] as any}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="notes">Order Notes (optional)</Label>
              <Textarea
                id="notes"
                value={data.notes}
                onChange={(e) => setData('notes', e.target.value)}
                placeholder="Any delivery notes or requests..."
              />
              {errors.notes && (
                <p className="mt-1 text-sm text-red-500">{errors.notes as any}</p>
              )}
            </div>

            <div>
              <Label>Payment Method</Label>
              <select
                className="w-full rounded-md border p-2 dark:bg-gray-800 dark:text-gray-100"
                value={data.payment_method}
                onChange={(e) =>
                  setData('payment_method', e.target.value as PaymentMethod)
                }
              >
                <option value="cod">Pay on Delivery</option>
                <option value="transfer">Bank Transfer</option>
                <option value="paystack">Card Payment</option>
              </select>
              {errors.payment_method && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.payment_method as any}
                </p>
              )}
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={processing || hasRfq || cartHasRfq || cart.length === 0}
          className="w-full md:w-auto"
        >
          {processing ? 'Placing Order...' : 'Place Order'}
        </Button>

        {(hasRfq || cartHasRfq) && (
          <div className="text-sm">
            <Link href="/cart" className="text-blue-600 underline">
              ← Back to Cart
            </Link>
          </div>
        )}
      </form>

      {/* 🛒 Cart Summary */}
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-100">
          Your Order
        </h2>

        {cart.length > 0 ? (
          <>
            <ul className="mb-4 divide-y divide-gray-200 dark:divide-gray-700">
              {cart.map((item) => {
                const rfq = isRFQ(item.price);
                const lineTotal = rfq ? 0 : Number(item.price) * item.quantity;

                return (
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
                      <div>
                        <div className="text-gray-800 dark:text-gray-100">
                          {item.name} × {item.quantity}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-300">
                          {rfq
                            ? 'RFQ item'
                            : `Unit: ${formatNaira(item.price)}`}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      {rfq ? (
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          RFQ
                        </span>
                      ) : (
                        <span className="text-gray-700 dark:text-gray-300">
                          {formatNaira(lineTotal)}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>{formatNaira(total)}</span>
            </div>

            {cartHasRfq && (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-300">
                Total shown is for priced items only. RFQ items will be priced in
                your quote.
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-500">
            Your cart is empty.{' '}
            <Link href="/catalog" className="text-blue-600 underline">
              Go shopping
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

Checkout.layout = (page: React.ReactNode) => <UserLayout>{page}</UserLayout>;
