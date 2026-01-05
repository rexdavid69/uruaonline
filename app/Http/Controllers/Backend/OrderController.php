<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * 🧾 Show all orders (Admin Dashboard)
     */
    public function index(Request $request)
    {
        $query = Order::with(['user', 'items.product', 'shippingAddress', 'payment'])
            ->latest();

        // Optional filtering by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Optional search (by customer name or email)
        if ($search = $request->get('search')) {
            $query->whereHas('shippingAddress', function ($q) use ($search) {
                $q->where('full_name', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%");
            });
        }

        $orders = $query->paginate(15);

        return Inertia::render('backend/orders/index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    /**
     * 👁️ View a single order in detail
     */
    public function show(Order $order)
    {
        $order->load(['user', 'items.product', 'shippingAddress', 'payment']);

        return Inertia::render('backend/orders/show', [
            'order' => $order,
        ]);
    }

    /**
     * 🔄 Update order status or payment status
     */
    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'nullable|string|in:pending,paid,shipped,delivered,cancelled',
            'payment_status' => 'nullable|string|in:pending,successful,failed,refunded',
        ]);

        $order->update(array_filter($validated));

        return redirect()->back()->with('success', 'Order updated successfully.');
    }

    /**
     * ❌ Optional: Delete an order (use with caution)
     */
    public function destroy(Order $order)
    {
        $order->delete();

        return redirect()->route('backend.orders.index')
            ->with('success', 'Order deleted successfully.');
    }
}
