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
        Schema::create('request_letters', function (Blueprint $table) {
            $table->id();
            $table->string("request_name");
            $table->foreignId("user_id");
            // $table->foreignId("status_id");
            $table->foreignId("stages_id");
            $table->foreignId("letter_type_id");
            $table->foreignId("memo_id")->nullable();
            $table->foreignId("invitation_id")->nullable();
            $table->foreignId("summary_id")->nullable();
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users');
            // $table->foreign('status_id')->references('id')->on('request_statuses');
            $table->foreign('stages_id')->references('id')->on('request_stages');
            $table->foreign('memo_id')->references('id')->on('memo_letters');
            $table->foreign('letter_type_id')->references('id')->on('letter_types');
            $table->foreign('summary_id')->references('id')->on('summary_letters');
            $table->json('to_stages');
            $table->json('rejected_stages');
            $table->json('progress_stages');
        });
        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('request_letters');
    }
};
