<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Cart;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $orders = Order::where('user_id', $user->id)
                        ->latest()
                        ->take(5)
                        ->get();

        $cart = Cart::where('user_id', $user->id)
                    ->with('items.product')
                    ->first();

        return Inertia::render('Frontend/Dashboard', [
            'user' => $user,
            'orders' => $orders,
            'cart' => $cart,
        ]);
    }
}
