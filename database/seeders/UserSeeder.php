<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('users')->insert([
            [

                'name' => "Super Admin",
                'email' => "superadmin@gmail.com",
                "password" => Hash::make("password123"),
                'role_id' => 3,
                'division_id' => 1,
            ],
            [

                'name' => "Manager QMSHETI",
                'email' => "mqmsheti@gmail.com",
                "password" => Hash::make("password123"),
                'role_id' => 1,
                'division_id' => 1,
            ],

            [

                'name' => "Hisyam Syafiq A.",
                'email' => "hisyam@gmail.com",
                "password" => Hash::make("password123"),
                'role_id' => 1,
                'division_id' => 1,
            ],
            [

                'name' => "Pegawai QMSHETI",
                'email' => "pqmsheti@gmail.com",
                "password" => Hash::make("password123"),
                'role_id' => 2,
                'division_id' => 1,
            ],
            [

                'name' => "Manager HR",
                'email' => "mhr@gmail.com",
                "password" => Hash::make("password123"),
                'role_id' => 1,
                'division_id' => 2,
            ],
            [

                'name' => "Pegawai HR",
                'email' => "phr@gmail.com",
                "password" => Hash::make("password123"),
                'role_id' => 2,
                'division_id' => 2,
            ],

            [

                'name' => "Manager LOG",
                'email' => "mlog@gmail.com",
                "password" => Hash::make("password123"),
                'role_id' => 1,
                'division_id' => 3,
            ],
            [

                'name' => "Pegawai LOG",
                'email' => "plog@gmail.com",
                "password" => Hash::make("password123"),
                'role_id' => 2,
                'division_id' => 3,
            ]
        ]);
    }
}
