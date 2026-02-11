<?php

namespace App\Services;

use App\Models\Admin;
use App\Models\Notification;
use App\Models\User;

class NotificationService
{
    protected static function notificationsEnabled(string $type): bool
    {
        return match ($type) {
            'order.created'   => SettingsService::get('notifications.order_created', true),
            'quote.received'  => SettingsService::get('notifications.quote_received', true),
            'payment.failed'  => SettingsService::get('notifications.payment_failed', true),
            default => true,
        };
    }

    /**
     * Generic notify (recipient id stored in notifications.user_id)
     * Works for BOTH Admin and User as long as you query by that id.
     */
    public static function notify(
        int $recipientId,
        string $type,
        string $title,
        ?string $message = null,
        ?string $actionUrl = null,
        string $level = 'info',
        array $data = []
    ): ?Notification {
        if (!self::notificationsEnabled($type)) {
            return null;
        }

        return Notification::create([
            'user_id' => $recipientId, // ✅ FIXED
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'action_url' => $actionUrl,
            'level' => $level,
            'data' => $data ?: null,
        ]);
    }

    public static function notifyAdmins(
        string $type,
        string $title,
        ?string $message = null,
        ?string $actionUrl = null,
        string $level = 'info',
        array $data = []
    ): void {
        if (!self::notificationsEnabled($type)) {
            return;
        }

        Admin::query()->each(function ($admin) use ($type, $title, $message, $actionUrl, $level, $data) {
            self::notify(
                $admin->id,   // stored in notifications.user_id
                $type,
                $title,
                $message,
                $actionUrl,
                $level,
                $data
            );
        });
    }

    public static function notifyUser(
        int $userId,
        string $type,
        string $title,
        ?string $message = null,
        ?string $actionUrl = null,
        string $level = 'info',
        array $data = []
    ): ?Notification {
        // (optional) ensure user exists; prevents orphan ids
        if (!User::whereKey($userId)->exists()) return null;

        return self::notify($userId, $type, $title, $message, $actionUrl, $level, $data);
    }
}
