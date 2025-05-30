<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        $this->call([
            OfficialSeeder::class,
            RoleSeeder::class,
            DivisionSeeder::class,
            UserSeeder::class,
            ApprovalCorrectionSeeder::class,
            LetterTypeSeeder::class,
            StatusSeeder::class,
            StagesSeeder::class,
            LetterType::class,
            MemoLetterSeeder::class,
            RequestLetterSeeder::class,
            OfficialInvitedSeeder::class,
            InvitedUserSeeder::class,
            InvitationLetterSeeder::class,
            RequestLetterSeederInvite::class,
            SummaryLetterSeeder::class,
            RequestLetterWithSummarySeeder::class,
            // MemoSeeder::class,
        ]);
    }
}
