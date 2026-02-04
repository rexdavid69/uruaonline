<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ProducerController extends Controller
{
    public function show($id)
    {
        return Inertia::render('frontend/producer-products', [
            'producerId' => (int) $id,
        ]);
    }
}
