<?php

namespace App\Services;

use App\Models\Admin;
use App\Models\Notification;

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

    public static function notify(
        int $adminId,
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
            'admin_id' => $adminId,
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

        Admin::query()->each(function ($admin) use (
            $type,
            $title,
            $message,
            $actionUrl,
            $level,
            $data
        ) {
            self::notify(
                $admin->id,
                $type,
                $title,
                $message,
                $actionUrl,
                $level,
                $data
            );
        });
    }
}
