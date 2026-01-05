<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;


class OrderController extends Controller
{
    use AuthorizesRequests;
    public function index()
    {
        $orders = Order::with('items.product', 'payment')
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('frontend/orders/index', [
            'orders' => $orders,
        ]);
    }


    public function show(Order $order)
    {
        $this->authorize('view', $order); // Ensure user can view their order

        $order->load('items.product', 'shippingAddress', 'payment');

        return Inertia::render('frontend/orders/show', [
            'order' => $order,
        ]);
    }


}
