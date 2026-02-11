<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;


class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
public function create(Request $request)
{
    $redirect = $request->query('redirect'); // ✅ define it

    return Inertia::render('auth/login', [
        'canResetPassword' => Route::has('password.request'),
        'status' => session('status'),
        'redirect' => $redirect, // ✅ now safe
    ]);
}

    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request)
{
    $credentials = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required'],
    ]);

    if (!Auth::attempt($credentials, $request->boolean('remember'))) {
        throw ValidationException::withMessages([
            'email' => __('auth.failed'),
        ]);
    }

    $request->session()->regenerate();

    // ✅ If a redirect was provided, set it as intended (safe-guarded)
    $redirect = $request->input('redirect');
    if (is_string($redirect) && str_starts_with($redirect, '/')) {
        $request->session()->put('url.intended', $redirect);
    }

    return redirect()->intended(RouteServiceProvider::HOME);
}


    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
