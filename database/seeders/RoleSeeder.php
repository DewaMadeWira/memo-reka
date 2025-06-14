<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //

        DB::table('roles')->insert([
            'role_name' => "admin",
        ]);
        DB::table('roles')->insert([
            'role_name' => "user",
        ]);
        DB::table('roles')->insert([
            'role_name' => "super_admin",
        ]);
    }
}
