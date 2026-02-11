<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\QuoteRequest;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Services\NotificationService;

use Inertia\Inertia;

class QuoteRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = QuoteRequest::query()
            ->with(['items'])
            ->latest();

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $quotes = $query->paginate(15)->withQueryString();

        return Inertia::render('backend/quotes/index', [
            'quotes' => $quotes,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    
    public function show(QuoteRequest $quote)
    {
        $quote->load(['items']);

        return Inertia::render('backend/quotes/show', [
            'quote' => $quote,
        ]);
    }

   
   public function update(Request $request, QuoteRequest $quote)
{
    $validated = $request->validate([
        'status' => 'required|string|in:pending,reviewing,ready,converted,closed',
        'items' => 'nullable|array',
        'items.*.id' => 'required|integer|exists:quote_request_items,id',
        'items.*.admin_unit_price' => 'nullable|numeric|min:0',
    ]);

    $oldStatus = $quote->status;

    DB::transaction(function () use ($validated, $quote) {
        $quote->update(['status' => $validated['status']]);

        if (!empty($validated['items'])) {
            $itemsById = collect($validated['items'])->keyBy('id');
            $quote->load('items');

            foreach ($quote->items as $item) {
                if (!$itemsById->has($item->id)) continue;

                $adminUnit = $itemsById[$item->id]['admin_unit_price'] ?? null;
                if ($adminUnit === '' || $adminUnit === false) $adminUnit = null;

                $item->admin_unit_price = $adminUnit;
                $item->admin_line_total = is_null($adminUnit)
                    ? null
                    : ($adminUnit * $item->quantity);

                $item->save();
            }
        }
    });

    // ✅ Notify user when quote becomes "ready"
    // (this covers: "user doesn't get notified when price is updated in quote")
    if ($oldStatus !== 'ready' && $validated['status'] === 'ready') {
        NotificationService::notifyUser(
            userId: $quote->user_id,
            type: 'quote.priced',
            title: 'Your Quote Has Been Priced',
            message: "Your quote (#{$quote->id}) has been priced. You can review and proceed.",
            actionUrl: route('quotes.show', $quote->id), // frontend quote show route
            level: 'success',
            data: ['quote_request_id' => $quote->id]
        );
    }

    return back()->with('success', 'Quote updated successfully.');
}


   
    public function convertToOrder(\App\Models\QuoteRequest $quote)
    {
        $quote->load('items');
    
        // prevent double conversion
        if ($quote->converted_order_id) {
            return redirect()
                ->route('backend.orders.show', $quote->converted_order_id)
                ->with('success', 'Quote already converted.');
        }
    
        // validate final prices
        foreach ($quote->items as $item) {
            $finalUnit = $item->admin_unit_price ?? $item->unit_price_snapshot;
            if (is_null($finalUnit) || $finalUnit <= 0) {
                return back()->withErrors([
                    'quote' => 'Cannot convert: one or more items still have no price. Set admin prices first.',
                ]);
            }
        }
    
        $order = null;
    
        DB::transaction(function () use ($quote, &$order) {
    
            $total = $quote->items->sum(function ($item) {
                $finalUnit = $item->admin_unit_price ?? $item->unit_price_snapshot;
                return $finalUnit * $item->quantity;
            });
    
            $order = \App\Models\Order::create([
                'user_id' => $quote->user_id,
                'total' => $total,
                'status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => 'quote',
                'notes' => $quote->notes,
            ]);
    
            foreach ($quote->items as $item) {
                $finalUnit = $item->admin_unit_price ?? $item->unit_price_snapshot;
    
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $finalUnit,
                    'subtotal' => $finalUnit * $item->quantity,
                ]);
            }
    
            // ✅ IMPORTANT: your ShippingAddress uses `address`, NOT `address_line1`
            $order->shippingAddress()->create([
                'full_name' => $quote->full_name,
                'email' => $quote->email,
                'phone' => $quote->phone,
                'address' => $quote->address, // ✅ FIX
                'city' => $quote->city,
                'state' => $quote->state,
                'country' => $quote->country,
            ]);
    
            $order->payment()->create([
                'amount' => $total,
                'status' => 'pending',
                'method' => 'quote',
            ]);
    
            $quote->update([
                'status' => 'closed',
                'converted_order_id' => $order->id,
                'converted_at' => now(),
            ]);
        });
    
        return redirect()
            ->route('backend.orders.show', $order->id)
            ->with('success', 'Order created from quote successfully.');
    }

    public function destroy(QuoteRequest $quote)
    {
        $quote->delete();

        return redirect()->route('backend.quotes.index')
            ->with('success', 'Quote deleted successfully.');
    }
    
}
