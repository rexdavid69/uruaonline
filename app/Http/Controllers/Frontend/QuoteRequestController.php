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
    'quote' => $quote->only([
        'id','user_id','full_name','email','phone','address','city','state','country','notes',
        'status','priced_total_snapshot','created_at','converted_order_id','converted_at',
    ]) + [
        'items' => $quote->items->map(fn ($i) => [
            'id' => $i->id,
            'product_id' => $i->product_id,
            'product_name_snapshot' => $i->product_name_snapshot,
            'quantity' => $i->quantity,
            'unit_price_snapshot' => $i->unit_price_snapshot,
            'line_total_snapshot' => $i->line_total_snapshot,
            'admin_unit_price' => $i->admin_unit_price,
            'admin_line_total' => $i->admin_line_total,
        ])->values(),
    ],
]); 
}
}