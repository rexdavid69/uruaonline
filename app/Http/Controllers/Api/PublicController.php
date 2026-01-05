<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Producer;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    /**
     * Fetch all products for a specific producer,
     * grouped by Category → Subcategory
     */
    public function producerProducts($producerId)
    {
        // Fetch the producer with minimal fields
        $producer = Producer::select('id', 'name', 'logo', 'description')->findOrFail($producerId);

        // Fetch products with their category + subcategory relationships
        $products = Product::with(['category', 'subcategory'])
            ->where('producer_id', $producerId)
            ->get();

        $groupedCategories = [];

        foreach ($products as $product) {
            $categoryName = $product->category->name ?? 'Uncategorized';
            $subcategoryName = $product->subcategory->name ?? 'General';

            // Initialize category
            if (!isset($groupedCategories[$categoryName])) {
                $groupedCategories[$categoryName] = [];
            }

            // Initialize subcategory
            if (!isset($groupedCategories[$categoryName][$subcategoryName])) {
                $groupedCategories[$categoryName][$subcategoryName] = [];
            }

            // Push product into correct subcategory
            $groupedCategories[$categoryName][$subcategoryName][] = [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'image' => $product->image,
                'stock_status' => $product->stock_status ?? 'in_stock',
                'sku' => $product->sku ?? null,
                'mpn' => $product->mpn ?? null,
            ];
        }

        return response()->json([
            'producer' => $producer,
            'groupedCategories' => $groupedCategories,
        ]);
    }
}
