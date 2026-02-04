<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function page(Request $request)
    {
        $user = Auth::guard('admin')->user();
        abort_if(!$user, 403);

        $filters = $request->only(['status', 'q']);
        $status = $filters['status'] ?? 'all';
        $q = $filters['q'] ?? null;

        $query = Notification::where('user_id', $user->id)->latest();

        if ($status === 'unread') {
            $query->whereNull('read_at');
        } elseif ($status === 'read') {
            $query->whereNotNull('read_at');
        }

        if ($q) {
            $query->where(function ($sub) use ($q) {
                $sub->where('title', 'like', "%{$q}%")
                    ->orWhere('message', 'like', "%{$q}%");
            });
        }

        return Inertia::render('backend/notifications/index', [
            'filters' => $filters,
            'notifications' => $query->paginate(20)->withQueryString(),
            'unreadCount' => Notification::where('user_id', $user->id)->whereNull('read_at')->count(),
        ]);
    }

    // JSON feed for bell dropdown
    public function index()
    {
        $user = Auth::guard('admin')->user();
        abort_if(!$user, 403);

        $items = Notification::where('user_id', $user->id)
            ->latest()
            ->take(15)
            ->get()
            ->map(fn($n) => [
                'id' => $n->id,
                'title' => $n->title,
                'message' => $n->message,
                'level' => $n->level,
                'action_url' => $n->action_url,
                'read_at' => optional($n->read_at)->toISOString(),
                'created_at' => $n->created_at->diffForHumans(),
            ]);

        $unreadCount = Notification::where('user_id', $user->id)->whereNull('read_at')->count();

        return response()->json([
            'items' => $items,
            'unreadCount' => $unreadCount,
        ]);
    }

    public function markRead(Request $request, Notification $notification)
    {
        $user = Auth::guard('admin')->user();
        abort_if(!$user || $notification->user_id !== $user->id, 403);

        $notification->update(['read_at' => now()]);
        return response()->json(['ok' => true]);
    }

    public function markAllRead()
    {
        $user = Auth::guard('admin')->user();
        abort_if(!$user, 403);

        Notification::where('user_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['ok' => true]);
    }
}
