<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class SettingsService
{
    private const CACHE_KEY = 'app_settings_all_v1';

    public static function all(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, function () {
            // returns [key => castValue]
            return Setting::query()
                ->get()
                ->mapWithKeys(function ($s) {
                    return [$s->key => self::castOut($s->value, $s->type)];
                })
                ->toArray();
        });
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        $all = self::all();
        return array_key_exists($key, $all) ? $all[$key] : $default;
    }

    public static function set(string $key, mixed $value, array $meta = []): Setting
    {
        $setting = Setting::query()->firstOrNew(['key' => $key]);
    
        // Preserve existing metadata unless explicitly provided
        $type  = $meta['type']  ?? $setting->type  ?? 'string';
        $group = $meta['group'] ?? $setting->group ?? 'general';
        $label = array_key_exists('label', $meta) ? $meta['label'] : ($setting->label ?? null);
        $hint  = array_key_exists('hint', $meta)  ? $meta['hint']  : ($setting->hint ?? null);
    
        $setting->fill([
            'type'  => $type,
            'group' => $group,
            'label' => $label,
            'hint'  => $hint,
            'value' => self::castIn($value, $type),
        ]);
    
        $setting->save();
    
        self::clearCache();
        return $setting;
    }
    

    public static function seedDefaults(): void
    {
        $defaults = [
            // General
            [
                'key' => 'store.name',
                'label' => 'Store name',
                'group' => 'general',
                'type' => 'string',
                'value' => 'UruaOnline',
                'hint' => 'Shown in admin and optionally on the site.',
            ],
            [
                'key' => 'store.support_email',
                'label' => 'Support email',
                'group' => 'general',
                'type' => 'string',
                'value' => 'support@uruaonline.test',
                'hint' => 'Used for customer support messages.',
            ],
            [
                'key' => 'store.support_phone',
                'label' => 'Support phone',
                'group' => 'general',
                'type' => 'string',
                'value' => '',
                'hint' => 'Optional phone number shown to customers.',
            ],
            [
                'key' => 'store.currency',
                'label' => 'Currency',
                'group' => 'general',
                'type' => 'string',
                'value' => 'NGN',
                'hint' => 'Examples: NGN, USD, EUR.',
            ],
            [
                'key' => 'store.timezone',
                'label' => 'Timezone',
                'group' => 'general',
                'type' => 'string',
                'value' => config('app.timezone', 'UTC'),
                'hint' => 'Used for reports and dates.',
            ],

            // Orders & Quotes
            [
                'key' => 'orders.default_status',
                'label' => 'Default order status',
                'group' => 'orders',
                'type' => 'string',
                'value' => 'pending',
                'hint' => 'Applied when creating an order.',
            ],
            [
                'key' => 'orders.default_payment_status',
                'label' => 'Default payment status',
                'group' => 'orders',
                'type' => 'string',
                'value' => 'pending',
                'hint' => 'Applied when creating an order.',
            ],
            [
                'key' => 'quotes.validity_days',
                'label' => 'Quote validity (days)',
                'group' => 'orders',
                'type' => 'number',
                'value' => 14,
                'hint' => 'How long a quote is valid before expiry.',
            ],
            [
                'key' => 'quotes.allow_convert_to_order',
                'label' => 'Allow converting quotes to orders',
                'group' => 'orders',
                'type' => 'boolean',
                'value' => true,
                'hint' => 'If disabled, hide/disable conversion action.',
            ],

            // Notifications toggles
            [
                'key' => 'notifications.order_created',
                'label' => 'Notify on new order',
                'group' => 'notifications',
                'type' => 'boolean',
                'value' => true,
                'hint' => 'Creates an in-app notification when a new order is created.',
            ],
            [
                'key' => 'notifications.quote_received',
                'label' => 'Notify on new quote',
                'group' => 'notifications',
                'type' => 'boolean',
                'value' => true,
                'hint' => 'Creates an in-app notification when a new quote is received.',
            ],
            [
                'key' => 'notifications.payment_failed',
                'label' => 'Notify on payment failed',
                'group' => 'notifications',
                'type' => 'boolean',
                'value' => true,
                'hint' => 'Creates an in-app notification when a payment fails.',
            ],
        ];

        foreach ($defaults as $d) {
            Setting::query()->firstOrCreate(
                ['key' => $d['key']],
                [
                    'label' => $d['label'],
                    'group' => $d['group'],
                    'type' => $d['type'],
                    'value' => self::castIn($d['value'], $d['type']),
                    'hint' => $d['hint'] ?? null,
                ]
            );
        }

        self::clearCache();
    }

    public static function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    private static function castOut(?string $value, string $type): mixed
    {
        if ($value === null) return null;

        return match ($type) {
            'boolean' => $value === '1' || strtolower($value) === 'true',
            'number'  => is_numeric($value) ? (float)$value : 0,
            'json'    => json_decode($value, true) ?? [],
            default   => $value,
        };
    }

    private static function castIn(mixed $value, string $type): ?string
    {
        if ($value === null) return null;

        return match ($type) {
            'boolean' => $value ? '1' : '0',
            'number'  => (string)$value,
            'json'    => json_encode($value, JSON_UNESCAPED_UNICODE),
            default   => (string)$value,
        };
    }
    
}
