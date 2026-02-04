<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use App\Models\QuoteRequest; // change if your model name differs
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $productCount = Product::count();
        $userCount = User::count();

        // Orders KPIs
        $orderCount = Order::count();
        $pendingOrders = Order::where('status', 'pending')->count();

        // Revenue (assumes orders have total and payment_status)
        $todayRevenue = Order::whereDate('created_at', today())
            ->where('payment_status', 'paid')
            ->sum('total');

        $monthRevenue = Order::whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])
            ->where('payment_status', 'paid')
            ->sum('total');

        // Recent orders
        $recentOrders = Order::latest()
            ->take(10)
            ->get(['id', 'total', 'status', 'payment_status', 'created_at', 'user_id']);

        // Orders by status (simple counts)
        $ordersByStatus = Order::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        // Quotes KPI (optional)
        $quoteCount = class_exists(QuoteRequest::class) ? QuoteRequest::count() : 0;

        // Revenue series (last 14 days) for chart later
        $start = now()->subDays(13)->startOfDay();
        $dailyRevenue = Order::where('created_at', '>=', $start)
            ->where('payment_status', 'paid')
            ->selectRaw('DATE(created_at) as day, SUM(total) as revenue')
            ->groupBy('day')
            ->orderBy('day')
            ->get();

        return Inertia::render('backend/dashboard', [
            'productCount' => $productCount,
            'userCount' => $userCount,

            'kpis' => [
                'orderCount' => $orderCount,
                'pendingOrders' => $pendingOrders,
                'todayRevenue' => (float) $todayRevenue,
                'monthRevenue' => (float) $monthRevenue,
                'quoteCount' => $quoteCount,
            ],

            'recentOrders' => $recentOrders,
            'ordersByStatus' => $ordersByStatus,
            'dailyRevenue' => $dailyRevenue,
        ]);
    }
}
