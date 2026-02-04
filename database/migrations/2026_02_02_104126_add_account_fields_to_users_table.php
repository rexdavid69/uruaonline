<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 30)->nullable();
            $table->string('company_name')->nullable();
            $table->string('job_title')->nullable();

            $table->string('country')->nullable();
            $table->string('state')->nullable();
            $table->string('city')->nullable();
            $table->string('address_line1')->nullable();
            $table->string('address_line2')->nullable();
            $table->string('postal_code', 20)->nullable();

            $table->enum('preferred_contact', ['email', 'phone', 'whatsapp'])
                  ->default('email');

            $table->string('timezone')->nullable();
            $table->string('locale', 10)->nullable();

            $table->json('notification_preferences')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'company_name',
                'job_title',
                'country',
                'state',
                'city',
                'address_line1',
                'address_line2',
                'postal_code',
                'preferred_contact',
                'timezone',
                'locale',
                'notification_preferences',
            ]);
        });
    }
};
