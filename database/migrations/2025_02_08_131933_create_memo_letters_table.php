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
            $table->integer("monthly_counter")->nullable();
            $table->integer("yearly_counter")->nullable();
            $table->string("perihal");
            $table->text("content");
            $table->foreignId("letter_id");
            $table->foreignId("from_division");
            $table->foreignId("to_division");
            $table->foreignId("signatory");
            $table->timestamps();
            $table->foreign('signatory')->references('id')->on('users');
            $table->foreign('from_division')->references('id')->on('divisions');
            $table->foreign('to_division')->references('id')->on('divisions');
            // $table->foreign('letter_id')->references('id')->on('letter_types');
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
