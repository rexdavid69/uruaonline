<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\User;

class DashboardController extends Controller
{
    // Show admin dashboard
    public function index()
    {
        // Get total number of products
        $productCount = Product::count();
        $userCount = User::count();

        return Inertia::render('Backend/Dashboard', [
            'productCount' => $productCount,
            'userCount' => $userCount,
        ]);
    }
}
