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
        Schema::create('letter_types', function (Blueprint $table) {
            $table->id();
            $table->string("letter_name");
            $table->foreignId("approval_id");
            $table->foreignId("correction_id");
            $table->timestamps();
            $table->foreign('approval_id')->references('id')->on('approval_types');
            $table->foreign('correction_id')->references('id')->on('correction_types');
        });
        Schema::table('memo_letters', function (Blueprint $table) {

            $table->foreign('letter_id')->references('id')->on('letter_types');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('letter_types');
    }
};
