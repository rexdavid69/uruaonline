<?php

namespace App\Http\Controllers\Payments;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Stripe\StripeClient;

class StripeController extends Controller
{
    public function init(Order $order)
    {
        abort_unless(Auth::check() && Auth::id() === $order->user_id, 403);

        if ($order->payment_status === 'successful') {
            return response()->json(['message' => 'Order already paid.'], 409);
        }

        $secret = config('services.stripe.secret');
        if (!$secret || !str_starts_with($secret, 'sk_')) {
            return response()->json([
                'message' => 'Stripe secret key is missing/invalid. Check STRIPE_SECRET in .env and config/services.php.',
            ], 500);
        }

        // Ensure payment row exists
        $payment = $order->payment()->firstOrCreate([], [
            'amount' => $order->total,
            'status' => 'pending',
            'method' => 'stripe',
        ]);

        try {
            $stripe = new StripeClient($secret);

            // NOTE: Stripe Checkout commonly does not support NGN.
            // We'll charge in USD using a temporary conversion rate for dev.
            $rate = 1500; // TODO: replace with real FX
            $lineItems = $order->items()->with('product')->get()->map(function ($item) use ($rate) {
                $unitAmountUsd = (int) round(((float) $item->price / $rate) * 100); // cents
                $unitAmountUsd = max($unitAmountUsd, 50); // minimum $0.50 (avoid Stripe min issues)

                return [
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => $item->product?->name ?? 'Item',
                        ],
                        'unit_amount' => $unitAmountUsd,
                    ],
                    'quantity' => (int) $item->quantity,
                ];
            })->values()->all();

            if (count($lineItems) === 0) {
                return response()->json(['message' => 'Order has no items.'], 422);
            }

            $session = $stripe->checkout->sessions->create([
                'mode' => 'payment',
                'line_items' => $lineItems,
                'success_url' => route('stripe.success') . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('stripe.cancel') . '?order_id=' . $order->id,
                'metadata' => [
                    'order_id' => (string) $order->id,
                    'payment_id' => (string) $payment->id,
                    'user_id' => (string) $order->user_id,
                ],
            ]);

            $payment->update([
                'reference' => $session->id,
                'method' => 'stripe',
                'status' => 'pending',
                'transaction_data' => [
                    'checkout_session_id' => $session->id,
                    'checkout_url' => $session->url,
                ],
            ]);

            $order->update([
                'payment_method' => 'stripe',
                'payment_status' => 'pending',
            ]);

            return response()->json([
                'url' => $session->url,
                'session_id' => $session->id,
            ]);
        } catch (\Throwable $e) {
            // Persist failure so you can see it in admin
            $payment->update([
                'status' => 'failed',
                'transaction_data' => array_merge($payment->transaction_data ?? [], [
                    'error' => $e->getMessage(),
                ]),
            ]);

            $order->update([
                'payment_status' => 'failed',
            ]);

            return response()->json([
                'message' => 'Stripe init failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function success(Request $request)
    {
        $sessionId = $request->query('session_id');
        abort_unless($sessionId, 400);

        // Webhook marks it paid; this just sets order_id in session for thank-you
        $payment = Payment::where('reference', $sessionId)->first();
        if ($payment) {
            session(['order_id' => $payment->order_id]);
        }

        return redirect()->route('checkout.thankyou');
    }

    public function cancel(Request $request)
    {
        $orderId = $request->query('order_id');

        if ($orderId) {
            return redirect()
                ->route('frontend.orders.show', $orderId)
                ->with('error', 'Stripe payment cancelled.');
        }

        return redirect()
            ->route('frontend.orders.index')
            ->with('error', 'Stripe payment cancelled.');
    }
}
