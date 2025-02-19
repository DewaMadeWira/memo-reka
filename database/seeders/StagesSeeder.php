<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class StagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        DB::table('request_stages')->insert([
            'id' => 1,
            'stage_name' => "Pembuatan Memo Internal",
            'sequence' => 1,
            'conditions' => "Pembuatan / Edit Memo",
            'letter_id' => 1,
            'approver_id' => 2,
            'to_stage_id' => 3,
            'status_id' => 1,
            'rejected_id' => 2,
        ]);
        // May use is rejectable 
        // If Rejected Didn't go anywhere change status to Rejected
        DB::table('request_stages')->insert([
            'id' => 2,
            'stage_name' => "Memo Internal Ditolak",
            'sequence' => 1,
            'conditions' => "Pembuatan / Edit Memo",
            'letter_id' => 1,
            'approver_id' => 2,
            'to_stage_id' => 1,
            'status_id' => 4,
            'rejected_id' => NULL,
        ]);

        DB::table('request_stages')->insert([
            'id' => 3,
            'stage_name' => "Memo Internal",
            'sequence' => 2,
            'conditions' => "Approval Manajer Internal",
            'letter_id' => 1,
            'approver_id' => 1,
            'to_stage_id' => 5,
            'status_id' => 2,
            'rejected_id' => 7,
        ]);
        // If Rejected Go Mark as Rejected and Done
        DB::table('request_stages')->insert([
            'id' => 4,
            'stage_name' => "Memo Internal",
            'sequence' => 2,
            'conditions' => "Approval Manajer Internal",
            'letter_id' => 1,
            'approver_id' => 1,
            'to_stage_id' => NULL,
            'status_id' => 6,
            'rejected_id' => NULL,
        ]);
        DB::table('request_stages')->insert([
            'id' => 5,
            'stage_name' => "Memo Eksternal Diproses",
            'sequence' => 3,
            'conditions' => "Approval Manajer Eksternal",
            'letter_id' => 1,
            'approver_id' => 1,
            'to_stage_id' => 7,
            'status_id' => 3,
            'rejected_id' => 6,
        ]);
        DB::table('request_stages')->insert([
            'id' => 6,
            'stage_name' => "Memo Eksternal Ditolak",
            'sequence' => 3,
            'conditions' => "Approval Manajer Eksternal",
            'letter_id' => 1,
            'approver_id' => 1,
            'to_stage_id' => 5,
            'status_id' => 4,
            'rejected_id' => NULL,
        ]);
        // If rejected didn't go anywhere 
        DB::table('request_stages')->insert([
            'id' => 7,
            'stage_name' => "Memo Eksternal Selesai",
            'sequence' => 3,
            'conditions' => "Approval Manajer Eksternal",
            'letter_id' => 1,
            'approver_id' => 1,
            'to_stage_id' => NULL,
            'status_id' => 5,
            'rejected_id' => NULL,
        ]);
        DB::table('request_stages')->insert([
            'id' => 8,
            'stage_name' => "Undangan Rapat",
            'sequence' => 3,
            'conditions' => "Approval Manajer Internal",
            'letter_id' => 1,
            'approver_id' => 1,
            'to_stage_id' => 10,
            'status_id' => 1,
            'rejected_id' => 9,
        ]);
        // If rejected mark as rejected 
        DB::table('request_stages')->insert([
            'id' => 9,
            'stage_name' => "Undangan Rapat Ditolak",
            'sequence' => 3,
            'conditions' => "Approval Manajer Internal",
            'letter_id' => 2,
            'approver_id' => 1,
            'to_stage_id' => 8,
            'status_id' => 5,
            'rejected_id' => NULL,
        ]);
        DB::table('request_stages')->insert([
            'id' => 10,
            'stage_name' => "Undangan Rapat Disetujui",
            'sequence' => 3,
            'conditions' => "Approval Manajer Internal",
            'letter_id' => 2,
            'approver_id' => 1,
            'to_stage_id' => 11,
            'status_id' => 3,
            'rejected_id' => NULL,
        ]);
        DB::table('request_stages')->insert([
            'id' => 11,
            'stage_name' => "Undangan Rapat Diterima",
            'sequence' => 3,
            'conditions' => "Approval Manajer Internal",
            'letter_id' => 2,
            'approver_id' => 1,
            'to_stage_id' => NULL,
            'status_id' => 5,
            'rejected_id' => NULL,
        ]);
        Schema::enableForeignKeyConstraints();
    }
}
