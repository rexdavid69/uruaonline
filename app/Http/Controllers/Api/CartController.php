<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    // 🛒 View cart
    public function index(Request $request)
{
    $cart = $request->session()->get('cart', []);

    // Ensure frontend receives a proper array
    return response()->json([
        'cart' => array_values($cart)
    ]);
}


    // ➕ Add item
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'integer|min:1'
        ]);

        $product = Product::findOrFail($request->product_id);
        $cart = $request->session()->get('cart', []);

        // If product already in cart → update quantity
        if (isset($cart[$product->id])) {
            $cart[$product->id]['quantity'] += $request->input('quantity', 1);
        } else {
            $cart[$product->id] = [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'quantity' => $request->input('quantity', 1),
                'image' => $product->image,
            ];
        }

        $request->session()->put('cart', $cart);

        return response()->json(['message' => 'Item added to cart', 'cart' => $cart]);
    }

    // ✏️ Update quantity
    public function update(Request $request, $productId)
    {
        $request->validate(['quantity' => 'required|integer|min:1']);

        $cart = $request->session()->get('cart', []);

        if (isset($cart[$productId])) {
            $cart[$productId]['quantity'] = $request->quantity;
            $request->session()->put('cart', $cart);
        }

        return response()->json(['message' => 'Cart updated', 'cart' => $cart]);
    }

    // ❌ Remove item
    public function destroy(Request $request, $productId)
    {
        $cart = $request->session()->get('cart', []);

        // Make sure string/number mismatches don't cause issues
        foreach ($cart as $key => $item) {
            if ((string)$key === (string)$productId) {
                unset($cart[$key]);
                break;
            }
        }

        $request->session()->put('cart', $cart);

        return response()->json([
            'message' => 'Item removed',
            'cart' => array_values($cart) // return updated cart
        ]);
    }


    // 🧹 Clear cart
    public function clear(Request $request)
    {
        $request->session()->forget('cart');
        return response()->json(['message' => 'Cart cleared']);
    }

}
