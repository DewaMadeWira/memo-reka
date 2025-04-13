<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OfficialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('officials')->insert([
            [
                'official_name' => 'Presiden Direktur',
                'official_code' => '01',
            ],
            [
                'official_name' => 'Direktur Keuangan, SDM, dan Manajemen Resiko',
                'official_code' => '02',
            ],
            [
                'official_name' => 'Direktur Teknologi dan Operasi',
                'official_code' => '03',
            ],
            [
                'official_name' => 'Pejabat setingkat M-GM',
                'official_code' => '-',
            ],
            [
                'official_name' => 'Board of Director',
                'official_code' => 'BOD',
            ],
            [
                'official_name' => 'Board of Commissioner',
                'official_code' => 'BOC',
            ],
            [
                'official_name' => 'Shareholder',
                'official_code' => 'SHA',
            ],
        ]);
    }
}
