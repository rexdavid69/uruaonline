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
use App\Http\Controllers\Backend\QuoteRequestController;
use App\Http\Controllers\Backend\NotificationController;
use App\Http\Controllers\Backend\SettingsController;


Route::name('backend.')->prefix('backend')->group(function () {
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

        Route::resource('quotes', QuoteRequestController::class)
            ->only(['index', 'show', 'update', 'destroy'])
            ->names('quotes');

        Route::post('quotes/{quote}/convert-to-order', [QuoteRequestController::class, 'convertToOrder'])
            ->name('quotes.convert');

        Route::prefix('products/{product}')->group(function () {
            Route::get('/specs', [ProductSpecificationController::class, 'index'])->name('products.specs.index');
            Route::post('/specs', [ProductSpecificationController::class, 'store'])->name('products.specs.store');
        });
        Route::put('/specs/{spec}', [ProductSpecificationController::class, 'update'])->name('products.specs.update');
        Route::delete('/specs/{spec}', [ProductSpecificationController::class, 'destroy'])->name('products.specs.destroy');

        // 📦 Orders CRUD
        Route::resource('orders', OrderController::class)
            ->only(['index', 'show', 'update', 'destroy'])
            ->names('orders');

        // 🛍️ Cart Routes
        Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
        Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
        Route::delete('/cart/{id}', [CartController::class, 'destroy'])->name('cart.destroy');
        Route::delete('/cart', [CartController::class, 'clear'])->name('cart.clear');

        //Notifications
        Route::get('/notifications-page', [NotificationController::class, 'page']);
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::post('/notifications/{notification}/read', [NotificationController::class, 'markRead']);
        Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);


        //Settings
        Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
        Route::post('/settings', [SettingsController::class, 'update'])->name('settings.update');
        Route::get('/settings/account', [SettingsController::class, 'account'])->name('settings.account');
        Route::post('/settings/account', [SettingsController::class, 'updateAccount'])->name('settings.account.update');

        
        // 🚪 Logout
        Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');
    });
});
