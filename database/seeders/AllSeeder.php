<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AllSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        //
        $this->call([
            RoleSeeder::class,
            DivisionSeeder::class,
            UserSeeder::class,
            ApprovalCorrectionSeeder::class,
            LetterTypeSeeder::class,
            StatusSeeder::class,
            StagesSeeder::class,
            LetterType::class,
            MemoSeeder::class,

        ]);
    }
}
