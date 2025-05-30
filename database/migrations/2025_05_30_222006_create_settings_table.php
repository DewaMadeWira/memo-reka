<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // Insert default settings
        DB::table('settings')->insert([
            ['key' => 'company_name', 'value' => 'Memo-Reka', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'company_logo', 'value' => '/assets/images/icon.png', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'company_logo_small', 'value' => '/assets/images/icon.png', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'company_code', 'value' => 'MR', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
