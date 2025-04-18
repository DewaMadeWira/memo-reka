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
        Schema::disableForeignKeyConstraints();
        Schema::create('memo_letters', function (Blueprint $table) {
            $table->id();
            $table->string("memo_number")->nullable();
            $table->integer("monthly_counter")->nullable();
            $table->integer("yearly_counter")->nullable();
            $table->string("perihal");
            $table->text("content");
            $table->foreignId("letter_id");
            $table->foreignId("from_division");
            $table->foreignId("to_division");
            $table->foreignId("signatory");
            $table->foreignId("official_id");
            $table->string('file_path')->nullable();
            $table->timestamps();
            $table->foreign('signatory')->references('id')->on('users');
            $table->foreign('official_id')->references('id')->on('officials');
            $table->foreign('from_division')->references('id')->on('divisions');
            $table->foreign('to_division')->references('id')->on('divisions');
        });
        Schema::table('memo_letters', function (Blueprint $table) {
            $table->foreign('letter_id')->references('id')->on('letter_types');
        });
        Schema::table('invitation_letters', function (Blueprint $table) {
            $table->foreign('letter_id')->references('id')->on('letter_types');
        });
        Schema::table('request_letters', function (Blueprint $table) {
            $table->foreign('invitation_id')->references('id')->on('invitation_letters');
        });
        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('memo_letters');
    }
};
