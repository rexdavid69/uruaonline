<?php

use App\Http\Controllers\Frontend\CatalogController;
use App\Http\Controllers\Frontend\ProducerController;
use App\Http\Controllers\Frontend\CartController;
use App\Http\Controllers\Frontend\CheckoutController;
use App\Http\Controllers\Frontend\OrderController;
use App\Models\User;
use App\Models\Order;
use App\Models\Cart;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes (Frontend)
|--------------------------------------------------------------------------
| These routes handle all user-facing pages. Backend/admin routes are loaded separately.
*/

// ------------------ Public Routes ------------------

// Home Page
Route::get('/', fn() => Inertia::render('welcome'))->name('home');

// Contact Page
Route::get('/contactus', fn() => Inertia::render('frontend/contactus'))->name('contactus');
Route::get('/aboutus', fn() => Inertia::render('frontend/aboutus'))->name('aboutus');

// Catalog & Producers
Route::get('/catalog', [CatalogController::class, 'allProducers'])->name('catalog.all');
Route::get('/producer/{id}/products', [CatalogController::class, 'showProducerProducts'])->name('catalog.producer.products');
Route::get('/producer/{id}', [ProducerController::class, 'show'])->name('producer.show');

// Cart Page
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
Route::delete('/cart/{id}', [CartController::class, 'destroy'])->name('cart.destroy');

// Checkout Routes
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

// Thank You Page
Route::get('/thank-you', fn() => Inertia::render('frontend/checkout/thank-you'))->name('checkout.thankyou');

// ------------------ Authenticated User Routes ------------------
Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::middleware('redirect.if.admin')->group(function () {
        Route::get('/dashboard', function () {
            /** @var User $user */
            $user = auth()->user();
            if (!$user) {
                abort(403, 'Unauthorized');
            }

            $orders = Order::where('user_id', $user->id)->latest()->take(5)->get();
            $cart = Cart::where('user_id', $user->id)->with('items.product')->first();

            return Inertia::render('frontend/dashboard', [
                'user' => $user,
                'orders' => $orders,
                'cart' => $cart,
            ]);
        })->name('dashboard');
    });

    // My Orders
    Route::get('/my-orders', [OrderController::class, 'index'])->name('frontend.orders.index');
    Route::get('/my-orders/{order}', [OrderController::class, 'show'])->name('frontend.orders.show');
});

// ------------------ Backend / Admin Routes ------------------
require __DIR__ . '/backend.php';

// ------------------ Auth / Settings Routes ------------------
require __DIR__ . '/auth.php';
require __DIR__ . '/settings.php';
