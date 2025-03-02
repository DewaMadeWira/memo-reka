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

                'name' => "Adi",
                'email' => "adi@gmail.com",
                "password" => Hash::make("12345678"),
                'role_id' => 1,
                'division_id' => 1,
            ],

            [

                'name' => "Hisyam Syafiq A.",
                'email' => "hisyam@gmail.com",
                "password" => Hash::make("12345678"),
                'role_id' => 1,
                'division_id' => 1,
            ],
            [

                'name' => "Budi",
                'email' => "budi@gmail.com",
                "password" => Hash::make("12345678"),
                'role_id' => 2,
                'division_id' => 1,
            ],
            [

                'name' => "Dika",
                'email' => "dika@gmail.com",
                "password" => Hash::make("12345678"),
                'role_id' => 1,
                'division_id' => 2,
            ],
            [

                'name' => "Eko",
                'email' => "eko@gmail.com",
                "password" => Hash::make("12345678"),
                'role_id' => 2,
                'division_id' => 2,
            ]
        ]);
    }
}
