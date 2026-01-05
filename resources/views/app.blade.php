<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}"
      @class(['dark' => ($appearance ?? 'system') === 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- ================================
             INSTANT DARK MODE INITIALIZER
             ================================ --}}
        <script>
            (function () {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (prefersDark) {
                        // Use requestAnimationFrame to prevent forced reflow warning
                        requestAnimationFrame(() => {
                            document.documentElement.classList.add('dark');
                        });
                    }
                } else if (appearance === 'dark') {
                    document.documentElement.classList.add('dark');
                }
            })();
        </script>

        {{-- ================================
             BASE THEME BACKGROUND COLORS
             ================================ --}}
        <style>
            html {
                background-color: oklch(1 0 0);
                transition: background-color 0.3s ease;
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        {{-- ================================
             FAVICONS
             ================================ --}}
             <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
             <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
             <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
             <link rel="manifest" href="/site.webmanifest">
        {{-- ================================
             FONT OPTIMIZATION
             ================================ --}}
        <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
        <link rel="preload"
              href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
              as="style"
              onload="this.rel='stylesheet'">
        <noscript>
            <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet">
        </noscript>

        <meta name="csrf-token" content="{{ csrf_token() }}">
        {{-- ================================
             VITE + INERTIA SETUP
             ================================ --}}
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>

    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') === 'dark'])>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <script>
        (function () {
            const appearance = '{{ $appearance ?? "system" }}';
            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                    requestAnimationFrame(() => {
                        document.documentElement.classList.add('dark');
                    });
                }
            } else if (appearance === 'dark') {
                document.documentElement.classList.add('dark');
            }
        })();
    </script>

    <style>
        html {
            background-color: oklch(1 0 0);
            transition: background-color 0.3s ease;
        }
        html.dark {
            background-color: oklch(0.145 0 0);
        }

        /* Font families */
        body {
            font-family: 'Roboto', sans-serif;
        }
        h1, h2, h3, h4, .product-title, .nav, .logo {
            font-family: 'Playfair Display', serif;
        }
    </style>

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
    <link rel="preload"
          href="https://fonts.bunny.net/css?family=playfair-display:400,700|roboto:400,500,700"
          as="style"
          onload="this.rel='stylesheet'">
    <noscript>
        <link href="https://fonts.bunny.net/css?family=playfair-display:400,700|roboto:400,500,700" rel="stylesheet">
    </noscript>

    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>
<body class="font-sans antialiased">
    @inertia
</body>
</html>
