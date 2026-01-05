<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    */

    // The paths that should be accessible via CORS
    'paths' => [
        'api/*',       // All API routes
        'sanctum/csrf-cookie', // Laravel Sanctum (if used)
    ],

    // Allowed HTTP methods for CORS requests
    'allowed_methods' => ['*'], // Allow all methods (GET, POST, etc.)

    // Allowed origins (frontends) for CORS requests
    'allowed_origins' => [
        'http://127.0.0.1:8000', // Local dev
        'http://localhost:3000', // React/Vite dev server
        // Add your production frontend domain here, e.g.,
        // 'https://yourdomain.com',
    ],

    // Allowed headers in CORS requests
    'allowed_headers' => ['*'], // Allow all headers

    // Exposed headers for the browser
    'exposed_headers' => [],

    // Maximum age (seconds) for preflight requests to be cached by the browser
    'max_age' => 0,

    // Whether credentials (cookies, auth headers) are allowed
    'supports_credentials' => false,
];
