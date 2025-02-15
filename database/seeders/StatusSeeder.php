<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('request_statuses')->insert([
            'status_name' => "Menunggu Persetujuan Manajer",
        ]);
        DB::table('request_statuses')->insert([
            'status_name' => "Menunggu Persetujuan Divisi Tujuan",
        ]);
        DB::table('request_statuses')->insert([
            'status_name' => "Diproses",
        ]);
        DB::table('request_statuses')->insert([
            'status_name' => "Ditolak",
        ]);
        // DB::table('request_statuses')->insert([
        //     'status_name' => "Disetujui",
        // ]);
        DB::table('request_statuses')->insert([
            'status_name' => "Selesai",
        ]);
        DB::table('request_statuses')->insert([
            'status_name' => "Tidak Sesuai",
        ]);
    }
}
