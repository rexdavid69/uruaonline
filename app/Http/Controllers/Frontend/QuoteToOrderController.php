<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\QuoteRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Services\NotificationService;


class QuoteToOrderController extends Controller
{
    private function quoteFinalTotal(QuoteRequest $quote): float
    {
        // Use admin prices when present, else snapshot prices
        return (float) $quote->items->sum(function ($item) {
            $unit = $item->admin_unit_price ?? $item->unit_price_snapshot;
            $unit = is_null($unit) ? 0 : (float) $unit;
            return $unit * (int) $item->quantity;
        });
    }

    private function quoteIsFullyPriced(QuoteRequest $quote): bool
    {
        return $quote->items->every(function ($item) {
            $unit = $item->admin_unit_price ?? $item->unit_price_snapshot;
            return !is_null($unit) && (float) $unit > 0;
        });
    }

    public function choosePayment(QuoteRequest $quote)
    {
        abort_unless($quote->user_id === Auth::id(), 403);
        $quote->load('items');

        if (!$this->quoteIsFullyPriced($quote)) {
            return redirect()
                ->route('quotes.show', $quote->id)
                ->withErrors(['quote' => 'This quote is not fully priced yet.']);
        }

        // If already converted, go to order page
        if ($quote->converted_order_id) {
            return redirect()->route('frontend.orders.show', $quote->converted_order_id);
        }

        $total = $this->quoteFinalTotal($quote);

        return Inertia::render('frontend/quotes/choose-payment', [
            'quoteId' => $quote->id,
            'total' => $total,
        ]);
    }

    public function convert(Request $request, QuoteRequest $quote)
    {
        abort_unless($quote->user_id === Auth::id(), 403);

        $validated = $request->validate([
            'payment_method' => 'required|string|in:paystack,stripe,transfer,cod',
        ]);

        $quote->load('items');

        if (!$this->quoteIsFullyPriced($quote)) {
            return back()->withErrors(['quote' => 'This quote is not fully priced yet.']);
        }

        // If already converted, just update payment method and go to order
        if ($quote->converted_order_id) {
            $order = Order::whereKey($quote->converted_order_id)->firstOrFail();
            $order->update([
                'payment_method' => $validated['payment_method'],
                'payment_status' => 'pending',
            ]);

            $order->payment()->updateOrCreate([], [
                'amount' => $order->total,
                'status' => 'pending',
                'method' => $validated['payment_method'],
            ]);

            // Admin: new order created from quote
NotificationService::notifyAdmins(
    type: 'order.created',
    title: 'New Order Created',
    message: "Order (#{$order->id}) created from Quote (#{$quote->id}).",
    actionUrl: route('admin.orders.show', $order->id), // adjust route if different
    level: 'success',
    data: ['order_id' => $order->id, 'quote_request_id' => $quote->id]
);

// User: quote converted to order (ready to pay/checkout)
NotificationService::notifyUser(
    userId: $quote->user_id,
    type: 'quote.converted',
    title: 'Your Quote is Ready',
    message: "Your quote (#{$quote->id}) has been converted to an order. You can proceed to payment.",
    actionUrl: route('frontend.orders.show', $order->id), // adjust route if different
    level: 'info',
    data: ['order_id' => $order->id, 'quote_request_id' => $quote->id]
);

            return redirect()->route('frontend.orders.show', $order->id);
        }

        $order = DB::transaction(function () use ($quote, $validated) {
            $total = $this->quoteFinalTotal($quote);

            $order = Order::create([
                'user_id' => Auth::id(),
                'total' => $total,
                'status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => $validated['payment_method'],
                'notes' => $quote->notes,
            ]);

            foreach ($quote->items as $qi) {
                $unit = $qi->admin_unit_price ?? $qi->unit_price_snapshot;
                $unit = (float) $unit;

                $order->items()->create([
                    'product_id' => $qi->product_id,
                    'quantity' => (int) $qi->quantity,
                    'price' => $unit,
                    'subtotal' => $unit * (int) $qi->quantity,
                ]);
            }

            // Shipping address (from quote request)
            $order->shippingAddress()->create([
                'full_name' => $quote->full_name,
                'email' => $quote->email,
                'phone' => $quote->phone ?? '',
                'address' => $quote->address ?? '',
                'city' => $quote->city ?? '',
                'state' => $quote->state ?? '',
                'country' => $quote->country ?? '',
            ]);

            // Payment row
            $order->payment()->create([
                'amount' => $order->total,
                'status' => 'pending',
                'method' => $validated['payment_method'],
            ]);

            // Link quote -> order
            $quote->update([
                'status' => 'priced', // or keep your existing status convention
                'converted_order_id' => $order->id,
                'converted_at' => now(),
            ]);

            // Link items too (optional but consistent with your columns)
            foreach ($quote->items as $qi) {
                $qi->update([
                    'converted_order_id' => $order->id,
                    'converted_at' => now(),
                ]);
            }

            return $order;
        });

        return redirect()->route('frontend.orders.show', $order->id);
    }
}
