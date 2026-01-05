<?php

use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\RedirectIfAdminAuthenticated;
use App\Http\Middleware\RedirectIfNotAdmin;
use App\Http\Middleware\RedirectIfAuthenticated;
use App\Http\Middleware\RedirectIfGuest;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use App\Http\Middleware\RedirectIfAdmin;

use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use Illuminate\Session\Middleware\StartSession;
use App\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php', // 👈 Add this line if missing
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // 🔐 Cookie & Session Setup
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        // 🌍 Global Web Middleware
        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        // 🧩 API Middleware
        $middleware->group('api', [
            EnsureFrontendRequestsAreStateful::class,
            StartSession::class, // 👈 Enables session for your cart
            VerifyCsrfToken::class, // 👈 Optional but useful for Inertia
            SubstituteBindings::class,
        ]);

        // 🧩 Route Middleware Aliases
        $middleware->alias([
            'admin.auth' => RedirectIfNotAdmin::class,
            'admin.guest' => RedirectIfAdminAuthenticated::class,
            'redirect.if.admin' => RedirectIfAdmin::class,

            'user.auth' => RedirectIfAuthenticated::class,
            'user.guest' => RedirectIfGuest::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
    ->create();
