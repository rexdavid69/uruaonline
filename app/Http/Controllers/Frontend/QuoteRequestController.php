<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\QuoteRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class QuoteRequestController extends Controller
{
    public function index()
    {
        $quotes = QuoteRequest::query()
            ->with(['items']) // lightweight; add product if you want
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('frontend/quotes/index', [
            'quotes' => $quotes,
        ]);
    }

    public function show(QuoteRequest $quote)
    {
        abort_unless($quote->user_id === Auth::id(), 403);
    
        $quote->load(['items.product']);
    
        return Inertia::render('frontend/quotes/show', [
            'quote' => $quote,
        ]);
    }
    
}
