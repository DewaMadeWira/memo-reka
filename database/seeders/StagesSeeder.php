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
        //
        Schema::disableForeignKeyConstraints();
        DB::table('request_stages')->insert([
            'id' => 1,
            'stage_name' => "Memo Internal",
            'sequence' => 1,
            'conditions' => "Pembuatan / Edit Memo",
            'letter_id' => 1,
            'approver_id' => 2,
            'to_stage_id' => 2,
            'status_id' => 1,
        ]);
        DB::table('request_stages')->insert([
            'id' => 2,
            'stage_name' => "Memo Internal",
            'sequence' => 2,
            'conditions' => "Approval Manajer Internal",
            'letter_id' => 1,
            'approver_id' => 1,
            'to_stage_id' => 2,
            'status_id' => 2,
        ]);
        DB::table('request_stages')->insert([
            'id' => 3,
            'stage_name' => "Memo Eksternal Diproses",
            'sequence' => 3,
            'conditions' => "Approval Manajer Eksternal",
            'letter_id' => 1,
            'approver_id' => 1,
            'to_stage_id' => 1,
            'status_id' => 3,
        ]);
        DB::table('request_stages')->insert([
            'id' => 4,
            'stage_name' => "Memo Eksternal Selesai",
            'sequence' => 3,
            'conditions' => "Approval Manajer Eksternal",
            'letter_id' => 1,
            'approver_id' => 1,
            'to_stage_id' => 1,
            'status_id' => 5,
        ]);
        Schema::enableForeignKeyConstraints();
    }
}
