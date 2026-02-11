<?php

namespace App\Http\Controllers\Payments;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');

        try {
            $event = Webhook::constructEvent(
                $payload,
                $sigHeader,
                config('services.stripe.webhook_secret')
            );
        } catch (\Throwable $e) {
            Log::warning('Stripe webhook signature failed', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object; // Checkout\Session

            $payment = Payment::where('reference', $session->id)->first();

            if ($payment) {
                $payment->update([
                    'status' => 'success',
                    'method' => 'stripe',
                    'transaction_data' => array_merge($payment->transaction_data ?? [], [
                        'webhook' => $event->toArray(),
                    ]),
                ]);

                $order = $payment->order;
                $order->update([
                    'payment_method' => 'stripe',
                    'payment_status' => 'successful',
                    'status' => 'paid',
                ]);
            }
        }

        return response()->json(['received' => true]);
    }
}
