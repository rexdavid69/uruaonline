<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\SettingsService;

class SeedSettingsDefaults extends Command
{
    protected $signature = 'settings:seed-defaults';
    protected $description = 'Seed default settings into the settings table';

    public function handle(): int
    {
        SettingsService::seedDefaults();
        $this->info('✅ Default settings seeded.');
        return self::SUCCESS;
    }
}
