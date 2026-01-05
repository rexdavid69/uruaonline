<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Producer;
use App\Models\Product;
use Illuminate\Http\Request;

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
     * 🏷️ Fetch a single producer and its grouped products
     * Grouped by Category → Subcategory
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

        $products = Product::with(['category', 'subcategory'])
            ->where('producer_id', $producerId)
            ->get();

        $grouped = [];

        foreach ($products as $product) {
            $categoryName = $product->category->name ?? 'Uncategorized';
            $subcategoryName = $product->subcategory->name ?? 'General';

            $grouped[$categoryName][$subcategoryName][] = [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
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
    public function productsByProducer($id)
{
    try {
        $producer = Producer::findOrFail($id);

        $products = Product::with(['category', 'producerCategory'])
            ->where('producer_id', $id)
            ->get()
            ->groupBy(fn($p) => optional($p->category)->name ?? 'Uncategorized')
            ->map(function ($grouped) {
                return $grouped->groupBy(fn($p) => optional($p->producerCategory)->name ?? 'General');
            });

        return response()->json([
            'producer' => [
                'id' => $producer->id,
                'name' => $producer->name,
                'logo' => $producer->logo,
                'description' => $producer->description,
            ],
            'groupedCategories' => $products,
        ]);
    } catch (\Exception $e) {
        // Debugging response for now (you can remove this after testing)
        return response()->json([
            'message' => 'Server error: ' . $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ], 500);
    }
}

}
