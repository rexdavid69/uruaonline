<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function __construct()
    {
        /** @var \Illuminate\Routing\Controller $this */
        $this->middleware(['auth', 'admin']);
    }

    /**
     * Backend Dashboard
     */
    public function index()
    {
        return Inertia::render('backend/index', [
            'totalUsers' => User::count(),
            'totalAdmins' => User::where('role', 'admin')->count(),
            'totalProducts' => Product::count(),
            'totalOrders' => Order::count(),
        ]);
    }

    /**
     * Manage Users Page
     */
    public function users()
    {
        return Inertia::render('backend/users/index', [
            'users' => User::all(),
        ]);
    }
}
