/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import UserLayout from "@/layouts/frontend/user-layout";
import { Link, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

interface PageProps {
  quoteId: number;
  total: number;
  errors?: any;
  [key: string]: any;
}

const formatNaira = (n: number) => `₦${Number(n ?? 0).toLocaleString()}`;

export default function ChoosePayment() {
  const { quoteId, total, errors } = usePage<PageProps>().props;
  const [paymentMethod, setPaymentMethod] = useState<"paystack"|"stripe"|"transfer"|"cod">("paystack");

  const submit = () => {
router.post(route('quotes.convertToOrder', quoteId), { payment_method: paymentMethod });
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4 space-y-6">
      <Link href={`/my-quotes/${quoteId}`} className="text-blue-600 underline text-sm">
        ← Back to Quote
      </Link>

      <div className="rounded-lg border bg-white dark:bg-gray-800 p-5 shadow-sm space-y-3">
        <h1 className="text-xl font-bold">Choose Payment Method</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Total to pay: <span className="font-semibold">{formatNaira(total)}</span>
        </p>

        {errors?.quote && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-200">
            {errors.quote}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium">Payment method</label>
          <select
            className="w-full rounded-md border p-2 dark:bg-gray-900"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as any)}
          >
            <option value="paystack">Paystack (Card/Bank)</option>
            <option value="stripe">Stripe (Card)</option>
            <option value="transfer">Bank Transfer</option>
            <option value="cod">Pay on Delivery</option>
          </select>
        </div>

        <Button onClick={submit} className="w-full">
          Continue
        </Button>
      </div>
    </div>
  );
}

ChoosePayment.layout = (page: React.ReactNode) => <UserLayout>{page}</UserLayout>;
