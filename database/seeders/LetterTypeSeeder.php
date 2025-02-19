<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LetterTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('letter_types')->insert([
            'letter_name' => "Memo",
        ]);
        DB::table('letter_types')->insert([
            'letter_name' => "Invitation Letter",
        ]);
    }
}
