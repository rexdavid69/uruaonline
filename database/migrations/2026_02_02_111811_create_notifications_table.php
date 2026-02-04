<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // what type of alert is this?
            $table->string('type', 50); // e.g. order.created, stock.low, payment.failed

            $table->string('title');
            $table->text('message')->nullable();

            // where should clicking it go?
            $table->string('action_url')->nullable();

            // severity for UI badges
            $table->string('level', 20)->default('info'); // info | success | warning | danger

            // extra data (order_id, product_id, etc)
            $table->json('data')->nullable();

            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'read_at']);
            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};