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
     * Handle checkout and create order
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
            'shipping.address' => 'required|string|max:500',
            'shipping.city' => 'required|string|max:255',
            'shipping.state' => 'required|string|max:255',
            'shipping.country' => 'required|string|max:255',
            'payment_method' => 'required|string|in:paystack,transfer,cod',
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

            // Create shipping address
            $order->shippingAddress()->create($validated['shipping']);

            // Create payment record
            $order->payment()->create([
                'amount' => $total,
                'status' => 'pending',
                'method' => $validated['payment_method'],
            ]);

            DB::commit();
            session()->forget('cart');


            // ✅ Inertia request? must redirect (or Inertia::location)
            if ($request->header('X-Inertia')) {
                return redirect()->route('checkout.thankyou')->with('order_id', $order->id);
            }

            // ✅ Only return JSON for non-Inertia API consumers
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Order created successfully!',
                    'order_id' => $order->id,
                    'order' => $order->load('items', 'shippingAddress', 'payment'),
                ], 201);
            }

            return redirect()->route('checkout.thankyou')->with('order_id', $order->id);
        } catch (\Throwable $e) {
            DB::rollBack();

            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'message' => 'Failed to create order',
                    'error' => $e->getMessage(),
                ], 500);
            }

            return redirect()->back()->withInput()->withErrors(['checkout' => 'Failed to create order: ' . $e->getMessage()]);
        }
    }

    /**
     * Show thank you page (requires order_id in session)
     */
    public function thankYou(Request $request)
    {
        $orderId = session('order_id');

        if (!$orderId) {
            // prevent direct access
            return redirect()->route('home');
        }

        // If you want to load order details here, you can:
        // $order = Order::with('items', 'shippingAddress', 'payment')->find($orderId);

        return inertia('frontend/checkout/thank-you', [
            'orderId' => $orderId,
        ]);
    }
}
