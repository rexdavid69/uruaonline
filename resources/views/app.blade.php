<!DOCTYPE html>
<html
    lang="{{ str_replace('_', '-', app()->getLocale()) }}"
    @class(['dark' => ($appearance ?? 'system') === 'dark'])
>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- =========================================
         INSTANT DARK MODE INITIALIZER
         ========================================= --}}
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

    {{-- =========================================
         BASE BACKGROUND COLOR (PREVENT FLASH)
         ========================================= --}}
    <style>
        html {
            background-color: oklch(1 0 0);
            transition: background-color 0.25s ease;
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    {{-- =========================================
         FAVICONS
         ========================================= --}}
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">

    {{-- =========================================
         LOCAL FONT PRELOAD (VITE + MANIFEST)
         ========================================= --}}
    @php
        $manifestPath = public_path('build/manifest.json');
        $manifest = file_exists($manifestPath)
            ? json_decode(file_get_contents($manifestPath), true)
            : [];

        // Only preload fonts needed immediately
        $fontKeys = [
            'resources/fonts/PilcrowRounded-Regular.woff2',
            'resources/fonts/PilcrowRounded-Medium.woff2',
            'resources/fonts/Hoover-Bold.woff2',
        ];

        $fontFiles = collect($fontKeys)
            ->map(fn ($key) => $manifest[$key]['file'] ?? null)
            ->filter()
            ->values();
    @endphp

    @foreach ($fontFiles as $file)
        <link
            rel="preload"
            href="{{ asset('build/' . $file) }}"
            as="font"
            type="font/woff2"
            crossorigin
        >
    @endforeach

    {{-- =========================================
         CSRF
         ========================================= --}}
    <meta name="csrf-token" content="{{ csrf_token() }}">

    {{-- =========================================
         VITE + INERTIA
         ========================================= --}}
    @viteReactRefresh
    @vite([
        'resources/js/app.tsx',
        "resources/js/pages/{$page['component']}.tsx"
    ])

    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>
</html>
