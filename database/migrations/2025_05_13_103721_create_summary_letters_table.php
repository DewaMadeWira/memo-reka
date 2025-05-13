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
        Schema::create('summary_letters', function (Blueprint $table) {
            $table->id();
            $table->foreignId("invitation_id");
            $table->foreign('invitation_id')->references('id')->on('invitation_letters');
            $table->string("file_path");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('summary_letters');
    }
};
