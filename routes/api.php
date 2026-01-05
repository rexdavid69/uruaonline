<?php

use App\Http\Controllers\Api\PublicProductController;
use App\Http\Controllers\Api\CartController as ApiCartController;
use App\Http\Controllers\Backend\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 🔒 Authenticated user info
Route::middleware('auth:sanctum')->get('/user', fn(Request $request) => $request->user());

// 🧩 Product specs (modal)
Route::get('/products/{product}/specs', [ProductController::class, 'getSpecs']);
Route::get('/products/{product}/features', [ProductController::class, 'features']);

// 🛍️ Public product listing
Route::prefix('public')->group(function () {
    // All producers
    Route::get('/producers', [PublicProductController::class, 'index']); // index method returns all producers

    // Products by specific producer
    Route::get('/producer/{id}/products', [PublicProductController::class, 'productsByProducer']);

    // Optional: alternate endpoint to fetch grouped categories for a producer
    Route::get('/producer/{producerId}/categories', [\App\Http\Controllers\Api\PublicController::class, 'producerProducts']);
});

// 🛒 CART ROUTES (frontend)
Route::prefix('cart')->group(function () {
    Route::get('/', [ApiCartController::class, 'index']);
    Route::post('/', [ApiCartController::class, 'store']);
    Route::put('/{productId}', [ApiCartController::class, 'update']);
    Route::delete('/{productId}', [ApiCartController::class, 'destroy']);
    Route::delete('/', [ApiCartController::class, 'clear']);
});

// 🔐 ADMIN PRODUCT MANAGEMENT (authenticated)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
});
