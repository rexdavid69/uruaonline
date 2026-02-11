import React from "react";
import { Link } from "@inertiajs/react";
import UserLayout from "@/layouts/frontend/user-layout";
import { Button } from "@/components/ui/button";

interface Props {
  quoteRequestId: number;
}

export default function QuoteCheckoutThankYou({ quoteRequestId }: Props) {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <div className="rounded-xl border bg-white dark:bg-gray-900 p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Quote request received ✅
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Thanks! We’ve received your request and will send you a quote soon.
        </p>

        <div className="mt-6 rounded-lg bg-gray-50 dark:bg-gray-800 p-4 text-sm">
          <div className="text-gray-500 dark:text-gray-300">Request ID</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            #{quoteRequestId}
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button asChild>
            <Link href={`/my-quotes/${quoteRequestId}`}>View this quote request</Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/catalog">Continue shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

QuoteCheckoutThankYou.layout = (page: React.ReactNode) => <UserLayout>{page}</UserLayout>;
