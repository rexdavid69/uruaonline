<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Tag;
use App\Models\Producer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\ProductsFeature;

class ProductController extends Controller
{
    // ✅ Show all products
    public function index(Request $request)
{
    $search = $request->input('search');
    $tag = $request->input('tag');
    $producer = $request->input('producer'); // 👈 new filter

    $products = Product::with(['producer', 'tags'])
        ->when($tag && $tag !== '__all__', function ($query) use ($tag) {
            $query->whereHas('tags', fn($q) => $q->where('name', $tag));
        })
        ->when($producer && $producer !== '__all__', function ($query) use ($producer) {
            $query->where('producer_id', $producer); // 👈 filter by producer_id
        })
        ->when($search, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('producer', fn($p) => $p->where('name', 'like', "%{$search}%"));
            });
        })
        ->orderBy('created_at', 'desc')
        ->paginate(100)
        ->withQueryString();

    return Inertia::render('backend/products/index', [
        'products' => $products,
        'tags' => Tag::all(),
        'producers' => Producer::all(), // 👈 send all producers
        'selectedTag' => $tag,
        'selectedProducer' => $producer, // 👈 send the current producer filter
        'filters' => [
            'search' => $search,
            'tag' => $tag,
            'producer' => $producer,
        ],
    ]);
}


    // ✅ Show create form
    public function create()
    {
        $producers = Producer::select('id', 'name')->get();

        return Inertia::render('Backend/Products/Create', [
            'producers' => $producers,
        ]);
    }

    // ✅ Store new product
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:204800',
            'tags' => 'array',
            'tags.*' => 'string',
            'producer_id' => 'required|exists:producers,id',
        ]);

        // Handle image
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        // Separate tags
        $tags = $validated['tags'] ?? [];
        unset($validated['tags']);

        $product = Product::create($validated);

        // Sync tags
        if (!empty($tags)) {
            $tagIds = collect($tags)->map(fn($tagName) => Tag::firstOrCreate(['name' => trim($tagName)])->id);
            $product->tags()->sync($tagIds);
        }

        return redirect()->route('backend.products.index')->with('success', 'Product created successfully.');
    }

    // ✅ Show edit form
    public function edit(Product $product)
    {
        $product->load('tags');
        $tags = Tag::all();

        return Inertia::render('Backend/Products/Edit', [
            'product' => $product,
            'tags' => $tags,
            'producers' => Producer::all(),
        ]);
    }

    // ✅ Update product
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:9048',
            'tags' => 'array',
            'tags.*' => 'string',
            'producer_id' => 'required|exists:producers,id',
        ]);

        if ($request->filled('price')) {
            $request->merge([
                'price' => str_replace(',', '', (string) $request->input('price')),
            ]);
        }


        // Handle image update
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->store('products', 'public');
        } else {
            // Preserve the old image explicitly
            $validated['image'] = $product->image;
        }

        // Separate tags
        $tags = $validated['tags'] ?? [];
        unset($validated['tags']);

        // Update product
        $product->update($validated);

        // Sync tags
        if (!empty($tags)) {
            $tagIds = collect($tags)->map(fn($tagName) => Tag::firstOrCreate(['name' => trim($tagName)])->id);
            $product->tags()->sync($tagIds);
        } else {
            $product->tags()->detach();
        }

        return redirect()->route('backend.products.index')->with('success', 'Product updated successfully.');
    }


    // ✅ Delete product
    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->tags()->detach();
        $product->delete();

        return back()->with('success', 'Product deleted successfully.');
    }

    // ✅ Public API for frontend homepage (grouped by producer)
    public function publicIndex()
    {
        $producers = Producer::with('products')->get();

        $grouped = $producers->mapWithKeys(fn($producer) => [
            $producer->name => $producer->products->map(fn($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'image' => $product->image ? asset('storage/' . $product->image) : null,
            ])
        ]);

        return response()->json($grouped);
    }

    // ✅ Show single product with specifications
    public function show(Product $product)
    {
        $product->load(['producer', 'tags', 'specifications']);

        return Inertia::render('Backend/Products/Show', [
            'product' => $product,
        ]);
    }

    // ✅ Public API with product specifications
    public function productSpecsApi()
    {
        $products = Product::with('specifications')->get();

        return response()->json($products);
    }
    public function getSpecs(Product $product)
    {
        $product->load(['producer', 'tags', 'specifications']);

        return response()->json([
            'id' => $product->id,
            'name' => $product->name,
            'description' => $product->description,
            'price' => $product->price,
            'sku' => $product->sku,
            'mpn' => $product->mpn,
            'image' => $product->image ? asset('storage/' . $product->image) : null,
            'producer' => $product->producer,
            'tags' => $product->tags,
            'specifications' => $product->specifications->pluck('value', 'key'), // key-value
        ]);
    }

    public function features(Product $product)
    {
        try {
            $product->load('features'); // eager load features

            return response()->json([
                'id' => $product->id,
                'name' => $product->name,
                'features' => $product->features->pluck('feature'), // just return the feature text
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to load features',
                'message' => $e->getMessage()
            ], 500);
        }
    }




}
