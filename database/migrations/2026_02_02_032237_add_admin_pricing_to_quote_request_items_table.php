<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('quote_request_items', function (Blueprint $table) {
            $table->decimal('admin_unit_price', 12, 2)->nullable()->after('line_total_snapshot');
            $table->decimal('admin_line_total', 12, 2)->nullable()->after('admin_unit_price');
        });
    }

    public function down(): void
    {
        Schema::table('quote_request_items', function (Blueprint $table) {
            $table->dropColumn(['admin_unit_price', 'admin_line_total']);
        });
    }
};
