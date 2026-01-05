<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Producer;
use Inertia\Inertia;

class CatalogController extends Controller
{
    // List all producers
    public function allProducers()
    {
        $producers = Producer::with('categories')->get();

        return Inertia::render('frontend/catalog', [
            'producers' => $producers,
        ]);
    }

    // Show all products for a specific producer
    public function showProducerProducts($id)
    {
        $producer = \App\Models\Producer::findOrFail($id);

        return inertia('frontend/producer-products', [
            'producerId' => $producer->id,
            'producer' => [
                'name' => $producer->name,
                'logo' => $producer->logo,
                'description' => $producer->description,
            ],
        ]);
    }

}
