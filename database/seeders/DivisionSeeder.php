<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DivisionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('divisions')->insert([
            'division_name' => "Departemen Quality Management and Safety Health Environment & Teknologi Informasi",
            'division_code' => "QMSHE-TI",
        ]);
        DB::table('divisions')->insert([
            'division_name' => "HR & GA",
            'division_code' => "HR-GA",
        ]);
        DB::table('divisions')->insert([
            'division_name' => "Logistik dan Gudang",
            'division_code' => "LOG",
        ]);
        //
    }
}
