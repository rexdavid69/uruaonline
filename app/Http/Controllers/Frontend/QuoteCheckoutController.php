<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\QuoteRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class QuoteCheckoutController extends Controller
{
    public function store(Request $request)
    {
        $isInertia = (bool) $request->header('X-Inertia'); // ✅ detect Inertia

        $validated = $request->validate([
            'cart' => 'required|array|min:1',
            'cart.*.id' => 'required|integer|exists:products,id',
            'cart.*.price' => 'nullable|numeric|min:0',
            'cart.*.quantity' => 'required|integer|min:1',

            'shipping' => 'required|array',
            'shipping.full_name' => 'required|string|max:255',
            'shipping.email' => 'required|email',
            'shipping.phone' => 'nullable|string|max:20',
            'shipping.address' => 'nullable|string|max:500',
            'shipping.city' => 'nullable|string|max:255',
            'shipping.state' => 'nullable|string|max:255',
            'shipping.country' => 'nullable|string|max:255',

            'notes' => 'nullable|string|max:1000',
        ]);

        // Must contain at least 1 RFQ item (Rule A)
        $hasRfq = collect($validated['cart'])->contains(function ($item) {
            $price = $item['price'] ?? null;
            return is_null($price) || (is_numeric($price) && $price <= 0);
        });

        if (!$hasRfq) {
            // ✅ Inertia: return back with errors
            if ($isInertia) {
                return back()->withErrors([
                    'quote' => 'No RFQ items found. Use normal checkout.',
                ]);
            }

            // ✅ API: JSON
            return response()->json([
                'message' => 'No RFQ items found. Use normal checkout.',
            ], 422);
        }

        DB::beginTransaction();

        try {
            $productIds = collect($validated['cart'])->pluck('id')->unique()->values()->all();
            $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

            $pricedTotal = collect($validated['cart'])->sum(function ($item) use ($products) {
                $p = $products->get($item['id']);
                $unit = $p?->price;
                if (is_null($unit) || $unit <= 0) return 0;
                return $unit * $item['quantity'];
            });

            $quote = QuoteRequest::create([
                'user_id' => Auth::id(),
                'full_name' => $validated['shipping']['full_name'],
                'email' => $validated['shipping']['email'],
                'phone' => $validated['shipping']['phone'] ?? null,
                'address' => $validated['shipping']['address'] ?? null,
                'city' => $validated['shipping']['city'] ?? null,
                'state' => $validated['shipping']['state'] ?? null,
                'country' => $validated['shipping']['country'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'priced_total_snapshot' => $pricedTotal,
                'status' => 'pending',
            ]);

            foreach ($validated['cart'] as $item) {
                $product = $products->get($item['id']);
                if (!$product) continue;

                $unit = $product->price; // snapshot from DB
                $isRfqItem = is_null($unit) || $unit <= 0;

                $quote->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'product_name_snapshot' => $product->name,
                    'unit_price_snapshot' => $isRfqItem ? null : $unit,
                    'line_total_snapshot' => $isRfqItem ? null : ($unit * $item['quantity']),
                ]);
            }

            DB::commit();

            session()->forget('cart');
            session()->put('quote_request_id', $quote->id);

            // ✅ Inertia: redirect (valid Inertia response)
            if ($isInertia) {
                return redirect()->route('quote.thankyou');
            }

            // ✅ API: JSON
            return response()->json([
                'message' => 'Quote request submitted!',
                'quote_request_id' => $quote->id,
                'quote' => $quote->load('items'),
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();

            if ($isInertia) {
                return back()->withInput()->withErrors([
                    'quote' => 'Failed to submit quote request: ' . $e->getMessage(),
                ]);
            }

            return response()->json([
                'message' => 'Failed to submit quote request',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function thankYou()
    {
        $quoteId = session('quote_request_id');

        if (!$quoteId) {
            return redirect()->route('home');
        }

        return inertia('frontend/checkout/quote-checkout-thank-you', [
            'quoteRequestId' => $quoteId,
        ]);
    }
}
