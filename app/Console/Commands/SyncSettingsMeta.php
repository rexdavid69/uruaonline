<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Setting;
use App\Services\SettingsService;

class SyncSettingsMeta extends Command
{
    protected $signature = 'settings:sync-meta';
    protected $description = 'Sync settings metadata (group/label/type/hint) without overwriting values';

    public function handle(): int
    {
        $meta = [
            // General
            'store.name' => ['label' => 'Store name', 'group' => 'general', 'type' => 'string', 'hint' => 'Shown in admin and optionally on the site.'],
            'store.support_email' => ['label' => 'Support email', 'group' => 'general', 'type' => 'string', 'hint' => 'Used for customer support messages.'],
            'store.support_phone' => ['label' => 'Support phone', 'group' => 'general', 'type' => 'string', 'hint' => 'Optional phone number shown to customers.'],
            'store.currency' => ['label' => 'Currency', 'group' => 'general', 'type' => 'string', 'hint' => 'Examples: NGN, USD, EUR.'],
            'store.timezone' => ['label' => 'Timezone', 'group' => 'general', 'type' => 'string', 'hint' => 'Used for reports and dates.'],

            // Orders & Quotes
            'orders.default_status' => ['label' => 'Default order status', 'group' => 'orders', 'type' => 'string', 'hint' => 'Applied when creating an order.'],
            'orders.default_payment_status' => ['label' => 'Default payment status', 'group' => 'orders', 'type' => 'string', 'hint' => 'Applied when creating an order.'],
            'quotes.validity_days' => ['label' => 'Quote validity (days)', 'group' => 'orders', 'type' => 'number', 'hint' => 'How long a quote is valid before expiry.'],
            'quotes.allow_convert_to_order' => ['label' => 'Allow converting quotes to orders', 'group' => 'orders', 'type' => 'boolean', 'hint' => 'If disabled, hide/disable conversion action.'],

            // Notifications
            'notifications.order_created' => ['label' => 'Notify on new order', 'group' => 'notifications', 'type' => 'boolean', 'hint' => 'Creates an in-app notification when a new order is created.'],
            'notifications.quote_received' => ['label' => 'Notify on new quote', 'group' => 'notifications', 'type' => 'boolean', 'hint' => 'Creates an in-app notification when a new quote is received.'],
            'notifications.payment_failed' => ['label' => 'Notify on payment failed', 'group' => 'notifications', 'type' => 'boolean', 'hint' => 'Creates an in-app notification when a payment fails.'],
        ];

        foreach ($meta as $key => $m) {
            $setting = Setting::where('key', $key)->first();

            if ($setting) {
                // ✅ Update metadata only (do NOT overwrite value)
                $setting->update([
                    'label' => $m['label'],
                    'group' => $m['group'],
                    'type'  => $m['type'],
                    'hint'  => $m['hint'],
                ]);
            } else {
                // If missing, create with default value via seeder logic
                // (value will be set by seedDefaults)
                SettingsService::seedDefaults();
            }
        }

        SettingsService::clearCache();
        $this->info('✅ Settings metadata synced (values preserved).');

        return self::SUCCESS;
    }
}
