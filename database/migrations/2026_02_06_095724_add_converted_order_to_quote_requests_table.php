<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('quote_requests', function (Blueprint $table) {
            // ✅ Only add converted_order_id if it doesn't exist
            if (!Schema::hasColumn('quote_requests', 'converted_order_id')) {
                $table->foreignId('converted_order_id')
                    ->nullable()
                    ->after('status')
                    ->constrained('orders')
                    ->nullOnDelete();
            }

            // ✅ Only add converted_at if it doesn't exist
            if (!Schema::hasColumn('quote_requests', 'converted_at')) {
                $table->timestamp('converted_at')
                    ->nullable()
                    ->after('converted_order_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('quote_requests', function (Blueprint $table) {
            // Drop FK + column only if it exists
            if (Schema::hasColumn('quote_requests', 'converted_order_id')) {
                // safest: drop FK first (name may vary in some DBs)
                try {
                    $table->dropConstrainedForeignId('converted_order_id');
                } catch (\Throwable $e) {
                    // fallback: just drop the column if constraint name differs
                    $table->dropColumn('converted_order_id');
                }
            }

            if (Schema::hasColumn('quote_requests', 'converted_at')) {
                $table->dropColumn('converted_at');
            }
        });
    }
};
