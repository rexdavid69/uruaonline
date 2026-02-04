import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import BackendLayout from "@/layouts/backend/backend-layout";
import { router, usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import { ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuoteItem {
  id: number;
  product_name_snapshot: string;
  quantity: number;
  unit_price_snapshot: number | null;
  line_total_snapshot: number | null;

  // ✅ new fields (admin pricing)
  admin_unit_price?: number | null;
  admin_line_total?: number | null;
}

interface QuoteRequest {
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

interface PageProps extends InertiaPageProps {
  quote: QuoteRequest;
  flash?: { success?: string };
  errors?: Record<string, string>;
}

function formatNaira(n: number) {
  return `₦${Number(n).toLocaleString()}`;
}

function parseMoney(input: string): number | null {
  const cleaned = input.replace(/,/g, "").trim();
  if (!cleaned) return null;
  const num = Number(cleaned);
  if (Number.isNaN(num)) return null;
  if (num < 0) return null;
  return num;
}

export default function Show() {
  const { quote, flash, errors } = usePage<PageProps>().props;

  const [status, setStatus] = useState(quote.status);
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);

  // Admin prices in local state (string so input feels natural)
  const [adminPrices, setAdminPrices] = useState<Record<number, string>>(() => {
    const init: Record<number, string> = {};
    for (const item of quote.items) {
      // prefer admin_unit_price, else empty
      init[item.id] =
        item.admin_unit_price !== undefined && item.admin_unit_price !== null
          ? String(item.admin_unit_price)
          : "";
    }
    return init;
  });

  const computed = useMemo(() => {
    const rows = quote.items.map((item) => {
      const adminUnit = parseMoney(adminPrices[item.id] ?? "");
      const snapshotUnit = item.unit_price_snapshot;

      // final unit = admin override OR snapshot price
      const finalUnit = adminUnit ?? snapshotUnit;

      const adminLine = adminUnit === null ? null : adminUnit * item.quantity;
      const finalLine =
        finalUnit === null ? null : Number(finalUnit) * item.quantity;

      const needsPrice = finalUnit === null;

      return {
        ...item,
        adminUnit,
        snapshotUnit,
        finalUnit,
        adminLine,
        finalLine,
        needsPrice,
      };
    });

    const adminTotal = rows.reduce((sum, r) => sum + (r.adminLine ?? 0), 0);
    const finalTotal = rows.reduce((sum, r) => sum + (r.finalLine ?? 0), 0);

    const hasMissingPrices = rows.some((r) => r.needsPrice);

    return { rows, adminTotal, finalTotal, hasMissingPrices };
  }, [adminPrices, quote.items]);

  const handleSave = () => {
    setLoading(true);

    router.put(
      `/backend/quotes/${quote.id}`,
      {
        status,
        items: quote.items.map((item) => ({
          id: item.id,
          admin_unit_price: parseMoney(adminPrices[item.id] ?? ""),
        })),
      },
      {
        onFinish: () => setLoading(false),
      }
    );
  };

  const handleConvertToOrder = () => {
    setConverting(true);

    router.post(
      `/backend/quotes/${quote.id}/convert-to-order`,
      {},
      {
        onFinish: () => setConverting(false),
      }
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => history.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Quote #{quote.id}
        </h2>
      </div>

      {flash?.success && (
        <div className="rounded-md bg-green-100 p-3 text-green-700">
          {flash.success}
        </div>
      )}

      {/* Show server-side errors (convert validation etc.) */}
      {errors?.quote && (
        <div className="rounded-md bg-red-100 p-3 text-red-700">{errors.quote}</div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Customer */}
        <div className="rounded-lg border p-4 bg-white dark:bg-gray-900 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Customer Info</h3>
          <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <p>
              <strong>Name:</strong> {quote.full_name}
            </p>
            <p>
              <strong>Email:</strong> {quote.email}
            </p>
            <p>
              <strong>Phone:</strong> {quote.phone || "—"}
            </p>
            <p className="text-xs text-gray-500">
              Submitted: {new Date(quote.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Delivery */}
        <div className="rounded-lg border p-4 bg-white dark:bg-gray-900 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>
          <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <p>{quote.address || "—"}</p>
            <p>
              {[quote.city, quote.state, quote.country].filter(Boolean).join(", ") ||
                "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-lg border p-4 bg-white dark:bg-gray-900 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Customer Notes</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {quote.notes || "—"}
        </p>
      </div>

      {/* Items */}
      <div className="rounded-lg border p-4 bg-white dark:bg-gray-900 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Requested Items</h3>
            <p className="text-xs text-gray-500">
              Enter <strong>Admin Unit Price</strong> for RFQ items. Leaving it blank means “not priced yet”.
            </p>
          </div>

          <div className="text-right text-sm">
            <div className="font-semibold text-gray-800 dark:text-gray-100">
              Final Total (preview): {formatNaira(computed.finalTotal)}
            </div>
            <div className="text-xs text-gray-500">
              Admin total (only overrides): {formatNaira(computed.adminTotal)}
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-sm text-gray-600 dark:text-gray-400">
                <th className="py-2 pr-3">Product</th>
                <th className="py-2 pr-3">Snapshot Unit</th>
                <th className="py-2 pr-3">Admin Unit</th>
                <th className="py-2 pr-3">Qty</th>
                <th className="py-2 pr-3">Final Line</th>
              </tr>
            </thead>

            <tbody>
              {computed.rows.map((row) => {
                const needsPrice = row.needsPrice;

                return (
                  <tr key={row.id} className="border-b last:border-0 text-sm">
                    <td className="py-3 pr-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {row.product_name_snapshot}
                        </span>
                        {needsPrice && (
                          <span className="text-xs text-red-600">
                            Needs pricing (RFQ)
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 pr-3 text-gray-700 dark:text-gray-300">
                      {row.snapshotUnit === null
                        ? "RFQ"
                        : formatNaira(row.snapshotUnit)}
                    </td>

                    <td className="py-3 pr-3">
                      <input
                        value={adminPrices[row.id] ?? ""}
                        onChange={(e) =>
                          setAdminPrices((prev) => ({
                            ...prev,
                            [row.id]: e.target.value,
                          }))
                        }
                        placeholder="e.g. 150000"
                        className={`w-40 rounded-md border px-2 py-1 text-sm dark:bg-gray-900 dark:text-gray-100 ${
                          needsPrice
                            ? "border-red-300 focus:border-red-400"
                            : "border-gray-200"
                        }`}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {row.adminUnit === null
                          ? "—"
                          : `Admin line: ${formatNaira(row.adminLine ?? 0)}`}
                      </div>
                    </td>

                    <td className="py-3 pr-3">{row.quantity}</td>

                    <td className="py-3 pr-3 font-semibold text-gray-900 dark:text-gray-100">
                      {row.finalLine === null ? "—" : formatNaira(row.finalLine)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-right font-semibold text-gray-800 dark:text-gray-100">
          Priced total snapshot (DB):{" "}
          {formatNaira(Number(quote.priced_total_snapshot ?? 0))}
        </div>
      </div>

      {/* Status + Actions */}
      <div className="rounded-lg border p-4 bg-white dark:bg-gray-900 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold mb-2">Quote Actions</h3>

        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm mb-1">Status</label>
            <Select value={status} onValueChange={(value) => setStatus(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Quote"}
          </Button>

          <div className="flex flex-col gap-1">
            <Button
              variant="default"
              onClick={handleConvertToOrder}
              disabled={converting || computed.hasMissingPrices}
              title={
                computed.hasMissingPrices
                  ? "Set prices for all RFQ items first"
                  : "Convert quote into an order"
              }
            >
              {converting ? "Converting..." : "Convert to Order"}
            </Button>

            {computed.hasMissingPrices && (
              <span className="text-xs text-red-600">
                Add admin prices for all RFQ items before converting.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

Show.layout = (page: React.ReactNode) => <BackendLayout>{page}</BackendLayout>;
