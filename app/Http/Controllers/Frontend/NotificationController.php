<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        $user = Auth::user();
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

        $unreadCount = Notification::where('user_id', $user->id)
            ->whereNull('read_at')
            ->count();

        return response()->json([
            'items' => $items,
            'unreadCount' => $unreadCount,
        ]);
    }

    public function markRead(Notification $notification)
    {
        $user = Auth::user();
        abort_if(!$user || $notification->user_id !== $user->id, 403);

        $notification->update(['read_at' => now()]);
        return response()->json(['ok' => true]);
    }

    public function markAllRead()
    {
        $user = Auth::user();
        abort_if(!$user, 403);

        Notification::where('user_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['ok' => true]);
    }
}
