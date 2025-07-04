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
        Schema::create('request_stages', function (Blueprint $table) {
            $table->id();
            $table->string('stage_name');
            $table->integer('sequence');
            $table->string('description')->nullable();
            $table->foreignId('letter_id');
            $table->foreignId('approver_id');
            $table->foreignId('to_stage_id')->nullable();
            $table->foreignId('rejected_id')->nullable();
            $table->foreignId('status_id');
            $table->boolean('requires_file_upload')->default(false);
            $table->boolean('is_fixable')->default(false);
            $table->boolean('requires_rejection_reason')->default(false);
            $table->boolean('is_external')->default(false);
            $table->boolean('notify_internal_manager')->nullable();    // e.g., ["internal_manager"]
            $table->boolean('notify_internal_user')->nullable(); // e.g., ["internal_user"]
            $table->boolean('notify_internal')->nullable(); // e.g., ["internal_user", "internal_manager"]
            $table->boolean('notify_external')->nullable(); // e.g., ["external_user"]
            $table->boolean('notify_external_manager')->nullable(); // e.g., ["external_user"]
            $table->boolean('notify_external_user')->nullable(); // e.g., ["external_user"]
            // $table->boolean('notify_creator')->nullable(); // e.g., ["external_user"]

            // $table->boolean('notify_external_manager')->nullable(); // e.g., ["external_manager"]
            // $table->boolean('notify_external_user')->nullable(); // e.g., ["external_manager"]
            $table->timestamps();
            $table->foreign('letter_id')->references('id')->on('letter_types');
            $table->foreign('approver_id')->references('id')->on('roles');
            $table->foreign('to_stage_id')->references('id')->on('request_stages');
            $table->foreign('rejected_id')->references('id')->on('request_stages');
            $table->foreign('status_id')->references('id')->on('request_statuses');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('request_stages');
    }
};
