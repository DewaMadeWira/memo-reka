<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('users')->insert([
            'name' => "Adi",
            'email' => "adi@gmail.com",
            "password" => "12345678",
            'role_id' => 1,
            'division_id' => 1,
        ]);
        DB::table('users')->insert([
            'name' => "Budi",
            'email' => "budi@gmail.com",
            "password" => "12345678",
            'role_id' => 2,
            'division_id' => 1,
        ]);
        DB::table('users')->insert([
            'name' => "Dika",
            'email' => "dika@gmail.com",
            "password" => "12345678",
            'role_id' => 1,
            'division_id' => 2,
        ]);
        DB::table('users')->insert([
            'name' => "Eko",
            'email' => "eko@gmail.com",
            "password" => "12345678",
            'role_id' => 2,
            'division_id' => 2,
        ]);
    }
}
