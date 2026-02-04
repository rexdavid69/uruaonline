<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Inertia\Inertia;

class CartController extends Controller
{

    public function index(Request $request)
    {
        $cart = $request->session()->get('cart', []);

        $hasRfq = collect($cart)->contains(function ($item) {
            $price = $item['price'] ?? null;
            return is_null($price) || (is_numeric($price) && $price <= 0);
        });

        $pricedTotal = collect($cart)->sum(function ($item) {
            $price = $item['price'] ?? null;
            if (is_null($price) || (is_numeric($price) && $price <= 0)) return 0;
            return $price * ($item['quantity'] ?? 1);
        });

        return Inertia::render('frontend/cart', [
            'items' => array_values($cart),
            'pricedTotal' => $pricedTotal, // ✅ priced items only
            'hasRfq' => $hasRfq,
        ]);
    }


    public function store(Request $request)
    {
        $productId = $request->input('product_id') ?? $request->input('id');
        $product = Product::findOrFail($productId);

        $cart = $request->session()->get('cart', []);

        if (isset($cart[$product->id])) {
            $cart[$product->id]['quantity'] += 1;
        } else {
            $cart[$product->id] = [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price, // nullable ok
                'quantity' => 1,
                'image' => $product->image,
            ];
        }

        $request->session()->put('cart', $cart);

        return response()->json([
            'message' => "{$product->name} added to cart!",
            'cartCount' => count($cart),
        ]);
    }


    public function destroy(Request $request, $id)
    {
        $cart = $request->session()->get('cart', []);

        if (isset($cart[$id])) {
            unset($cart[$id]);
            $request->session()->put('cart', $cart);
        }

        return response()->json(['message' => 'Item removed']);
    }


    public function clear(Request $request)
    {
        $request->session()->forget('cart');
        return response()->json(['message' => 'Cart cleared']);
    }
}
