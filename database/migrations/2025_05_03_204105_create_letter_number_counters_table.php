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
        Schema::create('letter_number_counters', function (Blueprint $table) {
            $table->id();
            $table->foreignId("division_id");
            $table->foreign('division_id')->references('id')->on('divisions');
            $table->foreignId("letter_type_id");
            $table->foreign('letter_type_id')->references('id')->on('letter_types');
            $table->integer("monthly_counter")->nullable();
            $table->integer("yearly_counter")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('letter_number_counters');
    }
};
