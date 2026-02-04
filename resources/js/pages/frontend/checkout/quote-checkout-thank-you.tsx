/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Link, usePage } from "@inertiajs/react";
import UserLayout from "@/layouts/frontend/user-layout";

export default function QuoteThankYou() {
  const { quoteRequestId } = usePage<any>().props;

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
      <h1 className="text-2xl font-bold">Quote Request Submitted</h1>
      <p className="text-gray-600 dark:text-gray-300">
        Your quote request ID is <span className="font-semibold">#{quoteRequestId}</span>.
        We’ll contact you shortly with pricing and availability.
      </p>

      <div className="pt-4 flex items-center justify-center gap-3">
        <Link href="/catalog" className="text-blue-600 underline">
          Continue shopping
        </Link>
        <Link href="/cart" className="text-blue-600 underline">
          View cart
        </Link>
      </div>
    </div>
  );
}

QuoteThankYou.layout = (page: React.ReactNode) => <UserLayout>{page}</UserLayout>;
