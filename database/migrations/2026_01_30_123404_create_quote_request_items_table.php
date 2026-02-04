<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('quote_request_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quote_request_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();

            $table->integer('quantity')->default(1);

            // Snapshot fields (important)
            $table->string('product_name_snapshot');
            $table->decimal('unit_price_snapshot', 12, 2)->nullable(); // null => RFQ item at time of request
            $table->decimal('line_total_snapshot', 12, 2)->nullable(); // only for priced items

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quote_request_items');
    }
};
