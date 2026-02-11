<?php

use App\Http\Controllers\Frontend\CatalogController;
use App\Http\Controllers\Frontend\ProducerController;
use App\Http\Controllers\Frontend\CartController;
use App\Http\Controllers\Frontend\CheckoutController;
use App\Http\Controllers\Frontend\OrderController;
use App\Http\Controllers\Frontend\QuoteCheckoutController;
use App\Http\Controllers\Frontend\QuoteRequestController;
use App\Http\Controllers\Frontend\QuoteToOrderController;
use App\Http\Controllers\Frontend\NotificationController as FrontNotificationController;
use App\Http\Controllers\Payments\PaystackController;
use App\Http\Controllers\Payments\StripeController;
use App\Http\Controllers\Payments\StripeWebhookController;
use App\Models\User;
use App\Models\Order;
use App\Models\Cart;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes (Frontend)
|--------------------------------------------------------------------------
*/

// ------------------ Public Routes ------------------

// Home Page
Route::get('/', fn () => Inertia::render('welcome'))->name('home');

// Static pages
Route::get('/contactus', fn () => Inertia::render('frontend/contactus'))->name('contactus');
Route::get('/aboutus', fn () => Inertia::render('frontend/aboutus'))->name('aboutus');

// Catalog & Producers
Route::get('/catalog', [CatalogController::class, 'allProducers'])->name('catalog.all');
Route::get('/producer/{id}/products', [CatalogController::class, 'showProducerProducts'])->name('catalog.producer.products');
Route::get('/producer/{id}', [ProducerController::class, 'show'])->name('producer.show');

// Cart
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
Route::delete('/cart/{id}', [CartController::class, 'destroy'])->name('cart.destroy');

// Checkout
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

// Quote checkout
Route::post('/quote-checkout', [QuoteCheckoutController::class, 'store'])->name('quote.checkout.store');
Route::get('/quote-thank-you', [QuoteCheckoutController::class, 'thankYou'])->name('quote.thankyou');

// Thank You
Route::get('/thank-you', fn () => Inertia::render('frontend/checkout/thank-you'))->name('checkout.thankyou');

// Stripe webhook (must be public)
Route::post('/webhooks/stripe', [StripeWebhookController::class, 'handle'])->name('stripe.webhook');


// ------------------ Authenticated User Routes ------------------
Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::middleware('redirect.if.admin')->group(function () {
        Route::get('/dashboard', function () {
            /** @var User $user */
            $user = auth()->user();
            if (!$user) abort(403, 'Unauthorized');

            $orders = Order::where('user_id', $user->id)->latest()->take(5)->get();
            $cart = Cart::where('user_id', $user->id)->with('items.product')->first();

            return Inertia::render('frontend/dashboard', [
                'user' => $user,
                'orders' => $orders,
                'cart' => $cart,
            ]);
        })->name('dashboard');
    });

    // Orders
    Route::get('/my-orders', [OrderController::class, 'index'])->name('frontend.orders.index');
    Route::get('/my-orders/{order}', [OrderController::class, 'show'])->name('frontend.orders.show');
    Route::patch('/my-orders/{order}/payment-method', [OrderController::class, 'updatePaymentMethod'])
        ->name('frontend.orders.payment_method');

    // Quotes
    Route::get('/my-quotes', [QuoteRequestController::class, 'index'])->name('quotes.index');
    Route::get('/my-quotes/{quote}', [QuoteRequestController::class, 'show'])->name('quotes.show');

    Route::get('/my-quotes/{quote}/choose-payment', [QuoteToOrderController::class, 'choosePayment'])
        ->name('quotes.choosePayment');

    Route::post('/my-quotes/{quote}/convert-to-order', [QuoteToOrderController::class, 'convert'])
        ->name('quotes.convertToOrder');

    // Notifications (User bell)
    Route::get('/api/notifications', [FrontNotificationController::class, 'index']);
    Route::post('/api/notifications/{notification}/read', [FrontNotificationController::class, 'markRead']);
    Route::post('/api/notifications/read-all', [FrontNotificationController::class, 'markAllRead']);

    // Settings
    Route::patch('/settings/account', [\App\Http\Controllers\Settings\AccountController::class, 'update'])
        ->name('settings.account.update');

    Route::get('/settings/account', fn () => Inertia::render('settings/account'))
        ->name('settings.account');

    Route::get('/settings/security', fn () => Inertia::render('settings/security'))
        ->name('settings.security');

    // Payments (auth protected)
    Route::post('/payments/paystack/init/{order}', [PaystackController::class, 'init'])->name('paystack.init');
    Route::get('/paystack/callback', [PaystackController::class, 'callback'])->name('paystack.callback');

    Route::post('/payments/stripe/init/{order}', [StripeController::class, 'init'])->name('stripe.init');
    Route::get('/stripe/success', [StripeController::class, 'success'])->name('stripe.success');
    Route::get('/stripe/cancel', [StripeController::class, 'cancel'])->name('stripe.cancel');
});


// ------------------ Backend / Admin Routes ------------------
require __DIR__ . '/backend.php';

// ------------------ Auth / Settings Routes ------------------
require __DIR__ . '/auth.php';
require __DIR__ . '/settings.php';
