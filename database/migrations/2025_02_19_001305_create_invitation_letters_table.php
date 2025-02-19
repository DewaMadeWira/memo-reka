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
        Schema::create('invitation_letters', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string("invitation_name");
            $table->string("invitation_number");
            $table->foreignId("letter_id");
            $table->foreignId("from_division");
            $table->foreignId("to_division");
            $table->foreign('from_division')->references('id')->on('divisions');
            $table->foreign('to_division')->references('id')->on('divisions');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invitation_letters');
    }
};
