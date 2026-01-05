<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Backend\ProductController;
use App\Http\Controllers\Backend\OrderController;
use App\Http\Controllers\Backend\UserController;
use App\Http\Controllers\Backend\DashboardController;
use App\Http\Controllers\Backend\ProducerController;
use App\Http\Controllers\Backend\CartController;
use App\Http\Controllers\Backend\ProductSpecificationController;

Route::name('backend.')->prefix('backend')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | 🔑 Admin Authentication
    |--------------------------------------------------------------------------
    */
    Route::middleware('admin.guest')->group(function () {
        Route::get('/auth/login', [AdminAuthController::class, 'showLoginForm'])->name('login');
        Route::post('/auth/login', [AdminAuthController::class, 'login'])->name('login.submit');
    });

    /*
    |--------------------------------------------------------------------------
    | 🔒 Protected Admin Routes
    |--------------------------------------------------------------------------
    */
    Route::middleware('admin.auth')->group(function () {

        // 🧭 Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // 👥 Users CRUD
        Route::resource('users', UserController::class)->except(['show']);

        // 🏭 Producers CRUD
        Route::resource('producers', ProducerController::class)->except(['show']);

        // 🛒 Products CRUD
        Route::resource('products', ProductController::class)->except(['show']);

        /*
        |--------------------------------------------------------------------------
        | ⚙️ Product Specifications Management
        |--------------------------------------------------------------------------
        | Nested under products and uses separate update/delete endpoints
        */
        Route::prefix('products/{product}')->group(function () {
            Route::get('/specs', [ProductSpecificationController::class, 'index'])->name('products.specs.index');
            Route::post('/specs', [ProductSpecificationController::class, 'store'])->name('products.specs.store');
        });
        Route::put('/specs/{spec}', [ProductSpecificationController::class, 'update'])->name('products.specs.update');
        Route::delete('/specs/{spec}', [ProductSpecificationController::class, 'destroy'])->name('products.specs.destroy');

        // 📦 Orders CRUD
        Route::resource('orders', OrderController::class)
            ->only(['index', 'show', 'update'])
            ->names('orders');

        // 🛍️ Cart Routes
        Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
        Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
        Route::delete('/cart/{id}', [CartController::class, 'destroy'])->name('cart.destroy');
        Route::delete('/cart', [CartController::class, 'clear'])->name('cart.clear');

        // 🚪 Logout
        Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');
    });
});
