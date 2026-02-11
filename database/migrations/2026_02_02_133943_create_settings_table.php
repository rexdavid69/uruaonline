<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
            if (!Schema::hasTable('settings')) {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
        
            // Keep these short because they are indexed
            $table->string('key', 150)->unique();     // was default 255
            $table->string('label', 190)->nullable(); // safe default
            $table->string('group', 50)->default('general'); // was 255
        
            $table->string('type', 20)->default('string');
            $table->longText('value')->nullable();
            $table->string('hint', 255)->nullable();
        
            $table->timestamps();
        
            // Composite index now safe: 50 + 150 chars
            $table->index(['group', 'key']);
        });
        
    }
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};