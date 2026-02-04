<?php

namespace App\Http\Controllers\Settings;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AccountController
{
    public function update(Request $request)
    {
        $data = $request->validate([
            'phone' => ['nullable', 'string', 'max:30'],
            'company_name' => ['nullable', 'string', 'max:120'],
            'job_title' => ['nullable', 'string', 'max:120'],

            'country' => ['nullable', 'string', 'max:80'],
            'state' => ['nullable', 'string', 'max:80'],
            'city' => ['nullable', 'string', 'max:80'],
            'address_line1' => ['nullable', 'string', 'max:200'],
            'address_line2' => ['nullable', 'string', 'max:200'],
            'postal_code' => ['nullable', 'string', 'max:20'],

            'preferred_contact' => ['nullable', 'in:email,phone,whatsapp'],
            'timezone' => ['nullable', 'string', 'max:64'],
            'locale' => ['nullable', 'string', 'max:10'],

            'notification_preferences' => ['nullable', 'array'],
            'notification_preferences.order_updates' => ['nullable', 'boolean'],
            'notification_preferences.quote_updates' => ['nullable', 'boolean'],
            'notification_preferences.promotions' => ['nullable', 'boolean'],
        ]);


        /** @var \App\Models\User $user */
        
        $user = Auth::user();

        // Normalize checkbox values if missing
        $prefs = $data['notification_preferences'] ?? [];
        $data['notification_preferences'] = [
            'order_updates' => (bool)($prefs['order_updates'] ?? false),
            'quote_updates' => (bool)($prefs['quote_updates'] ?? false),
            'promotions' => (bool)($prefs['promotions'] ?? false),
        ];

        $user->update($data);

        return back();
    }
}
