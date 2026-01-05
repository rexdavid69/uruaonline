<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('reference')->nullable(); // Paystack or Flutterwave reference
            $table->decimal('amount', 10, 2)->default(0);
            $table->string('status')->default('pending'); // pending, success, failed
            $table->string('method')->nullable(); // paystack, transfer, COD
            $table->json('transaction_data')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
