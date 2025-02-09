<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ApprovalCorrectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //

        DB::table('approval_types')->insert([
            'approval_name' => "2-Eyes",
        ]);
        DB::table('approval_types')->insert([
            'approval_name' => "4-Eyes",
        ]);
        DB::table('correction_types')->insert([
            'correction_name' => "Reject Ultimately",
        ]);
        DB::table('correction_types')->insert([
            'correction_name' => "Correct and Repeat",
        ]);
    }
}
