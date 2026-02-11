<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class OrderController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $orders = Order::with('items.product', 'payment')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('frontend/orders/index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order)
    {
        $this->authorize('view', $order);

        $order->load('items.product', 'shippingAddress', 'payment');

        return Inertia::render('frontend/orders/show', [
            'order' => $order->toArray(),
        ]);
    }

    public function updatePaymentMethod(Request $request, Order $order)
    {
        $this->authorize('updatePaymentMethod', $order);

        $validated = $request->validate([
            'payment_method' => 'required|string|in:paystack,stripe,transfer,cod',
        ]);

        if (strtolower((string) $order->payment_status) === 'successful') {
            return response()->json([
                'message' => 'Order is already paid.',
            ], 409);
        }

        $order->update([
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'pending',
        ]);

        $order->payment()->updateOrCreate(
            [], 
            [
                'amount' => $order->total,
                'status' => 'pending',
                'method' => $validated['payment_method'],
            ]
        );

        return response()->noContent(); 
    }
}
