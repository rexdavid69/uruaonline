/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { Link, usePage } from "@inertiajs/react";
import UserLayout from "@/layouts/frontend/user-layout";

interface QuoteItem {
  id: number;
  product_id: number;
  product_name_snapshot: string;
  quantity: number;

  // snapshot at time of request
  unit_price_snapshot: number | null;
  line_total_snapshot: number | null;

  // ✅ admin pricing (the “offer”)
  admin_unit_price?: number | null;
  admin_line_total?: number | null;

  product?: {
    id: number;
    name: string;
    image?: string | null;
  };
}

interface Quote {
  id: number;
  full_name: string;
  email: string;
  phone?: string | null;

  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;

  notes?: string | null;

  status: string;
  priced_total_snapshot: number;
  created_at: string;

  items: QuoteItem[];
}

interface PageProps {
  quote?: Quote;
  [key: string]: any;
}

const formatNaira = (n: number | null | undefined) =>
  `₦${Number(n ?? 0).toLocaleString()}`;

function getFinalUnit(item: QuoteItem): number | null {
  // final unit is admin override if present, else snapshot price
  const admin = item.admin_unit_price ?? null;
  if (admin !== null && Number(admin) > 0) return Number(admin);

  const snap = item.unit_price_snapshot ?? null;
  if (snap !== null && Number(snap) > 0) return Number(snap);

  return null;
}

export default function QuoteShow() {
  const { quote } = usePage<PageProps>().props;

  if (!quote) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <Link href="/my-quotes" className="text-blue-600 underline text-sm">
          ← Back to Quotes
        </Link>
        <p className="mt-6 text-gray-600 dark:text-gray-300">Quote not found.</p>
      </div>
    );
  }

  const rows = (quote.items ?? []).map((item) => {
    const finalUnit = getFinalUnit(item);
    const finalLine = finalUnit === null ? null : finalUnit * item.quantity;

    const isPriced = finalUnit !== null;
    const unitLabel =
      finalUnit === null ? (
        <span className="text-amber-600 font-semibold">Pending pricing</span>
      ) : (
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          {formatNaira(finalUnit)}
        </span>
      );

    const lineLabel = finalLine === null ? "—" : formatNaira(finalLine);

    // optional helper labels (so user can see what changed)
    const showingAdminOverride =
      item.admin_unit_price !== null &&
      item.admin_unit_price !== undefined &&
      Number(item.admin_unit_price) > 0;

    return {
      item,
      finalUnit,
      finalLine,
      isPriced,
      unitLabel,
      lineLabel,
      showingAdminOverride,
    };
  });

  const finalTotal = rows.reduce((sum, r) => sum + (r.finalLine ?? 0), 0);
  const hasMissingPrices = rows.some((r) => r.finalUnit === null);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <Link href="/my-quotes" className="text-blue-600 underline text-sm">
        ← Back to Quotes
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Quote #{quote.id}</h1>
          <p className="text-sm text-gray-500">
            Submitted on {new Date(quote.created_at).toLocaleString()}
          </p>

          {hasMissingPrices ? (
            <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
              Some items are still pending pricing. We’ll update this quote once pricing is ready.
            </p>
          ) : (
            <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-300">
              This quote has been priced. You can proceed with the next steps with our team.
            </p>
          )}
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
          {quote.status}
        </span>
      </div>

      {/* Customer / Delivery */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-lg border p-4 bg-white dark:bg-gray-800 shadow-sm">
          <h2 className="font-semibold mb-2">Customer</h2>
          <div className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
            <p>{quote.full_name}</p>
            <p>{quote.email}</p>
            <p>{quote.phone || "—"}</p>
          </div>
        </div>

        <div className="rounded-lg border p-4 bg-white dark:bg-gray-800 shadow-sm">
          <h2 className="font-semibold mb-2">Delivery Address</h2>
          <div className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
            <p>{quote.address || "—"}</p>
            <p>
              {[quote.city, quote.state, quote.country].filter(Boolean).join(", ") || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-lg border p-4 bg-white dark:bg-gray-800 shadow-sm">
        <h2 className="font-semibold mb-2">Notes</h2>
        <p className="text-sm text-gray-700 dark:text-gray-200">{quote.notes || "—"}</p>
      </div>

      {/* Items */}
      <div className="rounded-lg border p-4 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-semibold mb-3">Requested Items</h2>

          <div className="text-right">
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Current quoted total: {formatNaira(finalTotal)}
            </div>
            <div className="text-xs text-gray-500">
              (Old snapshot total: {formatNaira(quote.priced_total_snapshot)})
            </div>
          </div>
        </div>

        {quote.items?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left text-sm text-gray-600 dark:text-gray-400">
                  <th className="py-2 pr-3">Product</th>
                  <th className="py-2 pr-3">Unit Price</th>
                  <th className="py-2 pr-3">Qty</th>
                  <th className="py-2 pr-3">Line Total</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((r) => (
                  <tr key={r.item.id} className="border-b last:border-0 text-sm">
                    <td className="py-3 pr-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {r.item.product_name_snapshot}
                        </span>

                        {r.showingAdminOverride ? (
                          <span className="text-xs text-cyan-700 dark:text-cyan-300">
                            Updated by admin quote pricing
                          </span>
                        ) : r.item.unit_price_snapshot !== null ? (
                          <span className="text-xs text-gray-500">
                            Using snapshot price
                          </span>
                        ) : (
                          <span className="text-xs text-amber-600">
                            RFQ item (awaiting price)
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 pr-3 text-gray-700 dark:text-gray-300">
                      {r.unitLabel}
                    </td>

                    <td className="py-3 pr-3">{r.item.quantity}</td>

                    <td className="py-3 pr-3 font-semibold text-gray-900 dark:text-gray-100">
                      {r.lineLabel}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {hasMissingPrices && (
              <div className="mt-4 rounded-md bg-amber-50 p-3 text-amber-800 text-sm dark:bg-amber-900/20 dark:text-amber-200">
                Some items are still missing prices. Once our team adds the prices, you’ll see the updated totals here.
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No items found on this quote.</p>
        )}
      </div>

      {/* Optional: next step CTA */}
      <div className="rounded-lg border p-4 bg-white dark:bg-gray-800 shadow-sm">
        <h2 className="font-semibold mb-2">Next Step</h2>
        {hasMissingPrices ? (
          <p className="text-sm text-gray-700 dark:text-gray-200">
            Your quote is being reviewed. We’ll contact you once pricing is ready.
          </p>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <p className="text-sm text-gray-700 dark:text-gray-200">
              Your quote has been priced. If you want to proceed, contact support or reply to the message we sent.
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
            >
              Contact Support
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

QuoteShow.layout = (page: React.ReactNode) => <UserLayout>{page}</UserLayout>;
