<?php

namespace App\Http\Controllers\Payments;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class PaystackController extends Controller
{
    /**
     * Initialize a Paystack transaction for an Order and return authorization URL.
     * POST /paystack/init/{order}
     */
    public function init(Order $order)
    {
        abort_unless(Auth::id() === $order->user_id, 403);

        if ($order->payment_status === 'successful') {
            return response()->json([
                'message' => 'Order already paid.',
            ], 409);
        }

        // Ensure payment row exists (1 payment record per order)
        $payment = $order->payment()->firstOrCreate([], [
            'amount' => $order->total,
            'status' => 'pending',
            'method' => 'paystack',
        ]);

        // Reference: unique + stable
        $reference = $payment->reference ?: ('uru_' . $order->id . '_' . now()->timestamp);

        $payment->update([
            'reference' => $reference,
            'method' => 'paystack',
            'status' => 'pending',
        ]);

        $email = $order->shippingAddress?->email ?? Auth::user()?->email;
        if (! $email) {
            return response()->json(['message' => 'Missing customer email for Paystack.'], 422);
        }

        $amountKobo = (int) round(((float) $order->total) * 100);

        // Ensure paystack config exists
        $secret = config('services.paystack.secret');
        $callbackUrl = config('services.paystack.callback_url');
        $baseUrl = rtrim(config('services.paystack.base_url', 'https://api.paystack.co'), '/');

        if (! $secret) {
            return response()->json([
                'message' => 'Paystack secret key missing. Check config/services.php and .env',
            ], 500);
        }

        $payload = [
            'email' => $email,
            'amount' => $amountKobo,
            'reference' => $reference,
            'callback_url' => $callbackUrl,
            'metadata' => [
                'order_id' => $order->id,
                'user_id' => $order->user_id,
            ],
        ];

        $res = Http::withToken($secret)
            ->acceptJson()
            ->asJson()
            ->post("{$baseUrl}/transaction/initialize", $payload);

        // Fail fast with visibility
        if (! $res->ok() || ! data_get($res->json(), 'status')) {
            $payment->update([
                'status' => 'failed',
                'transaction_data' => $res->json() ?: ['raw' => $res->body()],
            ]);

            logger()->error('Paystack init failed', [
                'http_status' => $res->status(),
                'body' => $res->json(),
                'raw' => $res->body(),
                'payload' => $payload,
            ]);

            return response()->json([
                'message' => 'Paystack initialization failed',
                'error' => $res->json() ?: $res->body(),
            ], 500);
        }

        $authUrl = data_get($res->json(), 'data.authorization_url');

        $payment->update([
            'status' => 'pending',
            'transaction_data' => $res->json(),
        ]);

        $order->update([
            'payment_method' => 'paystack',
            'payment_status' => 'pending',
        ]);

        return response()->json([
            'authorization_url' => $authUrl,
            'reference' => $reference,
        ]);
    }

    /**
     * Paystack redirects the user back here with ?reference=xxx
     * GET /paystack/callback
     */
    public function callback(Request $request)
    {
        $reference = $request->query('reference');
        abort_unless($reference, 400);

        $secret = config('services.paystack.secret');
        $baseUrl = rtrim(config('services.paystack.base_url', 'https://api.paystack.co'), '/');

        if (! $secret) {
            abort(500, 'Paystack secret key missing.');
        }

        $res = Http::withToken($secret)
            ->acceptJson()
            ->get("{$baseUrl}/transaction/verify/{$reference}");

        $data = $res->json() ?: ['raw' => $res->body()];

        // Find payment by reference
        $payment = Payment::where('reference', $reference)->firstOrFail();
        $order = $payment->order;

        // Callback may be visited without login; if logged in, enforce ownership
        if (Auth::check()) {
            abort_unless(Auth::id() === $order->user_id, 403);
        }

        $status = data_get($data, 'data.status'); // success, failed, abandoned

        if ($res->ok() && $status === 'success') {
            $payment->update([
                'status' => 'success',
                'method' => 'paystack',
                'transaction_data' => $data,
            ]);

            $order->update([
                'payment_method' => 'paystack',
                'payment_status' => 'successful',
                'status' => 'paid',
            ]);

            // Your existing thank-you session approach:
            session(['order_id' => $order->id]);

            return redirect()->route('checkout.thankyou');
        }

        $payment->update([
            'status' => 'failed',
            'transaction_data' => $data,
        ]);

        $order->update([
            'payment_status' => 'failed',
        ]);

        return redirect()
            ->route('frontend.orders.show', $order->id)
            ->with('error', 'Payment failed or was cancelled. Please try again.');
    }
}
