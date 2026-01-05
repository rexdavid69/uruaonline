<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Producer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

use Illuminate\Validation\Rule;

class ProducerController extends Controller
{
    // List all producers
    public function index()
    {
        $producers = Producer::all();
        return Inertia::render('backend/producers/Index', [
            'producers' => $producers,
        ]);
    }

    // Show create form
    public function create()
    {
        return Inertia::render('backend/producers/Create');
    }

    // Store new producer
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:producers,name',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('producers', 'public');
        }

        Producer::create($validated);

        return redirect()->route('backend.producers.index')
                         ->with('success', 'Producer created successfully.');
    }

    // Show edit form
    public function edit(Producer $producer)
    {
        return Inertia::render('backend/producers/Edit', [
            'producer' => $producer,
        ]);
    }

    // Update existing producer
    public function update(Request $request, Producer $producer)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('producers')->ignore($producer->id)],
            'description' => 'nullable|string',
            'logo' => 'nullable|image|max:2048',
        ]);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($producer->logo && Storage::disk('public')->exists($producer->logo)) {
                Storage::disk('public')->delete($producer->logo);
            }

            // Store new logo
            $validated['logo'] = $request->file('logo')->store('producers', 'public');
        }

        $producer->update($validated);

        return redirect()->route('backend.producers.index')
                         ->with('success', 'Producer updated successfully.');
    }

    // Delete producer
    public function destroy(Producer $producer)
    {
        if ($producer->logo && Storage::disk('public')->exists($producer->logo)) {
            Storage::disk('public')->delete($producer->logo);
        }

        $producer->delete();

        return redirect()->route('backend.producers.index')
                         ->with('success', 'Producer deleted.');
    }
}
