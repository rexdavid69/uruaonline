<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\SettingsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        // You use admins table + admin.auth middleware
        $admin = Auth::guard('admin')->user();
        abort_if(!$admin, 403);

        $settings = Setting::query()
            ->orderBy('group')
            ->orderBy('key')
            ->get(['id', 'key', 'label', 'group', 'type', 'value', 'hint'])
            ->map(function ($s) {
                return [
                    'id' => $s->id,
                    'key' => $s->key,
                    'label' => $s->label,
                    'group' => $s->group,
                    'type' => $s->type,
                    'value' => SettingsService::get($s->key),
                    'hint' => $s->hint,
                ];
            })
            ->groupBy('group')
            ->toArray();

        return Inertia::render('backend/settings/index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        abort_if(!$admin, 403);

        $payload = $request->validate([
            'items' => ['required', 'array'],
            'items.*.key' => ['required', 'string'],
            'items.*.type' => ['required', 'string', 'in:string,number,boolean,text,json'],
            'items.*.value' => ['nullable'],
        ]);

        foreach ($payload['items'] as $item) {
            SettingsService::set($item['key'], $item['value'], [
                'type' => $item['type'],
            ]);
        }

        return redirect()->back()->with('success', 'Settings updated.');
    }

    public function account()
{
    $admin = \Illuminate\Support\Facades\Auth::guard('admin')->user();
    abort_if(!$admin, 403);

    return \Inertia\Inertia::render('backend/settings/account', [
        'admin' => [
            'name' => $admin->name,
            'email' => $admin->email,
        ],
    ]);
}

public function updateAccount(\Illuminate\Http\Request $request)
{
    $admin = \Illuminate\Support\Facades\Auth::guard('admin')->user();
    abort_if(!$admin, 403);

    $validated = $request->validate([
        'name' => ['required', 'string', 'max:120'],
        'email' => ['required', 'email', 'max:190', 'unique:admins,email,' . $admin->id],
        'current_password' => ['nullable', 'string'],
        'new_password' => ['nullable', 'string', 'min:8', 'confirmed'],
    ]);

    // Update name/email
    $admin->name = $validated['name'];
    $admin->email = $validated['email'];

    // If changing password, verify current password
    if (!empty($validated['new_password'])) {
        if (empty($validated['current_password']) || !\Illuminate\Support\Facades\Hash::check($validated['current_password'], $admin->password)) {
            return back()->withErrors([
                'current_password' => 'Current password is incorrect.',
            ]);
        }

        $admin->password = \Illuminate\Support\Facades\Hash::make($validated['new_password']);
    }

    $admin->save();

    return redirect()->back()->with('success', 'Account updated.');
}

}
