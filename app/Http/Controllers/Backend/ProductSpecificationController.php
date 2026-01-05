<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductSpecification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductSpecificationController extends Controller
{
    // ✅ Show specs for a product
    public function index(Product $product)
    {
        $specs = $product->specifications()->get(['id', 'key', 'value', 'created_at']);

        return Inertia::render('Backend/Products/Specs', [
            'product' => $product,
            'specs' => $specs,
        ]);
    }

    // ✅ Add new spec
    public function store(Request $request, Product $product)
    {
        $validated = $request->validate([
            'key' => 'required|string|max:255',
            'value' => 'required|string|max:1000',
        ]);

        $product->specifications()->create($validated);

        return back()->with('success', 'Specification added successfully.');
    }

    // ✅ Update spec
    public function update(Request $request, ProductSpecification $spec)
    {
        $validated = $request->validate([
            'key' => 'required|string|max:255',
            'value' => 'required|string|max:1000',
        ]);

        $spec->update($validated);

        return back()->with('success', 'Specification updated.');
    }

    // ✅ Delete spec
    public function destroy(ProductSpecification $spec)
    {
        $spec->delete();

        return back()->with('success', 'Specification removed.');
    }
}
