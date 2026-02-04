<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('producer_categories', function (Blueprint $table) {
            $table->integer('sort_priority')->default(100)->after('name'); // default normal priority
        });
    }

    public function down(): void
    {
        Schema::table('producer_categories', function (Blueprint $table) {
            $table->dropColumn('sort_priority');
        });
    }
};
