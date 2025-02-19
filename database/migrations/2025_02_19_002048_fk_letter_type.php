<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        //
        Schema::table('memo_letters', function (Blueprint $table) {
            $table->foreign('letter_id')->references('id')->on('letter_types');
        });
        Schema::table('invitation_letters', function (Blueprint $table) {
            $table->foreign('letter_id')->references('id')->on('letter_types');
        });
        Schema::table('request_letters', function (Blueprint $table) {
            $table->foreign('invitation_id')->references('id')->on('invitation_letters');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
