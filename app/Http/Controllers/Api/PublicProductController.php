<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Producer;
use App\Models\Product;

class PublicProductController extends Controller
{
    /**
     * 🧭 Fetch all producers (public list)
     */
    public function index()
    {
        $producers = Producer::select('id', 'name', 'logo', 'description')->get();

        return response()->json([
            'status' => 'success',
            'producers' => $producers,
        ]);
    }

    /**
     * 🏷️ Fetch products for a producer
     * Grouped by Category → Producer Category
     * Ordered by sort_priority (per-producer priority)
     * Accessories automatically sink (priority 1000)
     */
    public function productsByProducer($id)
    {
        try {
            $producer = Producer::findOrFail($id);

            $products = Product::query()
                ->with(['category', 'producerCategory'])
                ->leftJoin(
                    'producer_categories',
                    'products.producer_category_id',
                    '=',
                    'producer_categories.id'
                )
                ->where('products.producer_id', $id)
                ->orderBy('producer_categories.sort_priority', 'asc')
                ->orderBy('products.created_at', 'desc')
                ->select('products.*')
                ->get()
                ->groupBy(fn ($p) => optional($p->category)->name ?? 'Uncategorized')
                ->map(fn ($grouped) =>
                    $grouped->groupBy(fn ($p) => optional($p->producerCategory)->name ?? 'General')
                );

            return response()->json([
                'status' => 'success',
                'producer' => [
                    'id' => $producer->id,
                    'name' => $producer->name,
                    'logo' => $producer->logo,
                    'description' => $producer->description,
                ],
                'groupedCategories' => $products,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Server error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ⚠️ Legacy endpoint
     * Uses the same sort_priority logic for consistency
     */
    public function show($producerId)
    {
        $producer = Producer::select('id', 'name', 'logo', 'description')->find($producerId);

        if (!$producer) {
            return response()->json([
                'status' => 'error',
                'message' => 'Producer not found.',
            ], 404);
        }

        $products = Product::query()
            ->with(['category', 'subcategory'])
            ->leftJoin(
                'producer_categories',
                'products.producer_category_id',
                '=',
                'producer_categories.id'
            )
            ->where('products.producer_id', $producerId)
            ->orderBy('producer_categories.sort_priority', 'asc')
            ->orderBy('products.created_at', 'desc')
            ->select('products.*')
            ->get();

        $grouped = [];

        foreach ($products as $product) {
            $categoryName = $product->category->name ?? 'Uncategorized';
            $subcategoryName = $product->subcategory->name ?? 'General';

            $grouped[$categoryName][$subcategoryName][] = [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price, // ✅ keep null (RFQ)
                'image' => $product->image,
                'sku' => $product->sku,
                'mpn' => $product->mpn,
                'stock_status' => $product->stock_status ?? 'in_stock',
            ];
        }

        return response()->json([
            'status' => 'success',
            'producer' => $producer,
            'groupedCategories' => $grouped,
        ]);
    }
}
