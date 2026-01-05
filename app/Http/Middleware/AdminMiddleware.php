<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        /** @var User|null $user */
        $user = Auth::user(); // Intelephense now knows $user is a User model

        if ($user !== null && $user->isAdmin()) {
            return $next($request);
        }

        abort(403, 'Unauthorized');
    }
}
