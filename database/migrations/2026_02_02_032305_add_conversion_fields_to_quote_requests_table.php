<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('quote_requests', function (Blueprint $table) {
            $table->foreignId('converted_order_id')->nullable()->after('status')
                ->constrained('orders')->nullOnDelete();
            $table->timestamp('converted_at')->nullable()->after('converted_order_id');
        });
    }

    public function down(): void
    {
        Schema::table('quote_requests', function (Blueprint $table) {
            $table->dropConstrainedForeignId('converted_order_id');
            $table->dropColumn('converted_at');
        });
    }
};
