<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    /**
     * Show checkout page (RFQ or normal)
     */
    public function index()
    {
        $cart = array_values(session('cart', []));

        $hasRfq = collect($cart)->contains(function ($item) {
            $price = $item['price'] ?? null;
            return is_null($price) || (is_numeric($price) && $price <= 0);
        });

        $pricedTotal = collect($cart)->sum(function ($item) {
            $price = $item['price'] ?? null;
            if (is_null($price) || (is_numeric($price) && $price <= 0)) return 0;
            return $price * ($item['quantity'] ?? 1);
        });

        // ✅ RULE A: any RFQ => quote checkout page
        if ($hasRfq) {
            return Inertia::render('frontend/checkout/quote-checkout', [
                'cart' => $cart,
                'pricedTotal' => $pricedTotal,
                'hasRfq' => $hasRfq,
            ]);
        }

        // ✅ priced-only => normal checkout
        return Inertia::render('frontend/checkout/index', [
            'cart' => $cart,
            'total' => $pricedTotal,
            'hasRfq' => $hasRfq,
        ]);
    }

    /**
     * Create order + related records
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'cart' => 'required|array|min:1',
            'cart.*.id' => 'required|integer|exists:products,id',
            'cart.*.price' => 'required|numeric|min:0',
            'cart.*.quantity' => 'required|integer|min:1',

            'shipping' => 'required|array',
            'shipping.full_name' => 'required|string|max:255',
            'shipping.email' => 'required|email',
            'shipping.phone' => 'required|string|max:20',
            'shipping.address' => 'required|string|max:500', // ✅ matches DB column
            'shipping.city' => 'required|string|max:255',
            'shipping.state' => 'required|string|max:255',
            'shipping.country' => 'required|string|max:255',

            'payment_method' => 'required|string|in:paystack,stripe,transfer,cod',
            'notes' => 'nullable|string|max:1000',
        ]);

        DB::beginTransaction();

        try {
            // Calculate total
            $total = collect($validated['cart'])->sum(function ($item) {
                return $item['price'] * $item['quantity'];
            });

            // Create order
            $order = Order::create([
                'user_id' => Auth::id(),
                'total' => $total,
                'status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => $validated['payment_method'],
                'notes' => $validated['notes'] ?? null,
            ]);

            // Add order items
            foreach ($validated['cart'] as $item) {
                $order->items()->create([
                    'product_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'subtotal' => $item['price'] * $item['quantity'],
                ]);
            }

            // ✅ Create shipping address (KEEP 'address' because DB column is 'address')
            $shipping = $validated['shipping'];
            $shipping['address'] = trim((string) ($shipping['address'] ?? ''));

            if ($shipping['address'] === '') {
                DB::rollBack();
                return redirect()
                    ->back()
                    ->withInput()
                    ->withErrors(['shipping.address' => 'Delivery address is required.']);
            }

            $order->shippingAddress()->create($shipping);

            // Create payment record
            $order->payment()->create([
                'amount' => $total,
                'status' => 'pending',
                'method' => $validated['payment_method'],
            ]);

            DB::commit();
            session()->forget('cart');

            // store for thank-you page
            session(['order_id' => $order->id]);

            // ✅ Inertia redirect: go to order page (pay now) if online method
            if ($request->header('X-Inertia')) {
                if (in_array($validated['payment_method'], ['paystack', 'stripe'], true)) {
                    return redirect()
                        ->route('frontend.orders.show', $order->id)
                        ->with('pay_now', true);
                }

                return redirect()->route('checkout.thankyou');
            }

            // ✅ Only JSON for true API clients (not Inertia)
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Order created successfully!',
                    'order_id' => $order->id,
                    'order' => $order->load('items', 'shippingAddress', 'payment'),
                ], 201);
            }

            return redirect()->route('checkout.thankyou');
        } catch (\Throwable $e) {
            DB::rollBack();

            // ✅ Never return JSON to Inertia
            if ($request->header('X-Inertia')) {
                return redirect()
                    ->back()
                    ->withInput()
                    ->withErrors(['checkout' => 'Failed to create order: ' . $e->getMessage()]);
            }

            // JSON only for non-Inertia API calls
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Failed to create order',
                    'error' => $e->getMessage(),
                ], 500);
            }

            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['checkout' => 'Failed to create order: ' . $e->getMessage()]);
        }
    }

    /**
     * Thank you page (requires order_id in session)
     */
    public function thankYou(Request $request)
    {
        $orderId = session('order_id');

        if (!$orderId) {
            return redirect()->route('home');
        }

        return inertia('frontend/checkout/thank-you', [
            'orderId' => $orderId,
        ]);
    }
}
