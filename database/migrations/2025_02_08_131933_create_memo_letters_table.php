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
        Schema::create('memo_letters', function (Blueprint $table) {
            $table->id();
            $table->string("memo_number");
            $table->foreignId("letter_id");
            $table->foreignId("from_division");
            $table->foreignId("to_division");
            $table->timestamps();
            $table->foreign('from_division')->references('id')->on('divisions');
            $table->foreign('to_division')->references('id')->on('divisions');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('memo_letters');
    }
};
