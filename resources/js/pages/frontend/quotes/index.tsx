/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Link, usePage } from "@inertiajs/react";
import UserLayout from "@/layouts/frontend/user-layout";

interface QuoteItem {
  id: number;
  product_name_snapshot: string;
  quantity: number;
  unit_price_snapshot: number | null;
  line_total_snapshot: number | null;
}

interface Quote {
  id: number;
  status: string;
  priced_total_snapshot: number;
  created_at: string;
  items: QuoteItem[];
}

interface PageProps {
  quotes?: Quote[];
  [key: string]: any;
}

const formatNaira = (n: number | null | undefined) =>
  `₦${Number(n ?? 0).toLocaleString()}`;

export default function Quotes() {
  const { quotes = [] } = usePage<PageProps>().props;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">My Quotes</h1>

      {quotes.length === 0 && <p>You haven't submitted any quote requests yet.</p>}

      <div className="space-y-4">
        {quotes.map((quote) => (
          <div
            key={quote.id}
            className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <h2 className="text-lg font-semibold">Quote #{quote.id}</h2>
                <p className="text-sm text-gray-500">
                  Submitted on {new Date(quote.created_at).toLocaleDateString()}
                </p>
              </div>

              <Link
                href={`/my-quotes/${quote.id}`}
                className="text-blue-600 underline text-sm"
              >
                View Details
              </Link>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-300 mt-2">
              <span>Status: {quote.status}</span>
              <span>
                Estimated priced total: {formatNaira(quote.priced_total_snapshot)}
              </span>
            </div>

            <div className="mt-2">
              <p className="text-gray-500 text-sm">Items:</p>
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-200">
                {quote.items.map((item) => (
                  <li key={item.id}>
                    {item.product_name_snapshot} × {item.quantity} —{" "}
                    {item.unit_price_snapshot ? (
                      <>{formatNaira(item.unit_price_snapshot)}</>
                    ) : (
                      <>RFQ</>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Quotes.layout = (page: React.ReactNode) => <UserLayout>{page}</UserLayout>;
