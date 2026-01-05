<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Inertia\Inertia;

class CartController extends Controller
{
    // 🛒 Inertia Cart Page
    public function index(Request $request)
    {
        $cart = $request->session()->get('cart', []);
        $total = collect($cart)->sum(fn($item) => $item['price'] * $item['quantity']);

        // ✅ This must return an Inertia page
        return Inertia::render('frontend/cart', [
            'items' => array_values($cart),
            'total' => $total,
        ]);
    }

    // ➕ Add to Cart (AJAX/JSON)
    public function store(Request $request)
    {
        $product = Product::findOrFail($request->id);
        $cart = $request->session()->get('cart', []);

        if (isset($cart[$product->id])) {
            $cart[$product->id]['quantity'] += 1;
        } else {
            $cart[$product->id] = [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
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

    // ❌ Remove Item (AJAX)
    public function destroy(Request $request, $id)
    {
        $cart = $request->session()->get('cart', []);

        if (isset($cart[$id])) {
            unset($cart[$id]);
            $request->session()->put('cart', $cart);
        }

        return response()->json(['message' => 'Item removed']);
    }


    // 🧹 Clear Cart (AJAX)
    public function clear(Request $request)
    {
        $request->session()->forget('cart');
        return response()->json(['message' => 'Cart cleared']);
    }
}
