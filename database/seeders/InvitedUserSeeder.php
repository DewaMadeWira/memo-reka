<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\InvitedUser;
use App\Models\Division;
use App\Models\OfficialInvited;

class InvitedUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all divisions and officials to reference in our seeder
        $divisions = Division::all();
        $officials = OfficialInvited::all();

        // If no divisions or officials exist, we should create some basic ones
        if ($divisions->isEmpty()) {
            // Creating a default division if none exists
            $division = Division::create(['name' => 'Default Division']);
            $divisions = collect([$division]);
        }

        if ($officials->isEmpty()) {
            // Creating default officials if none exist
            $official = OfficialInvited::create([
                'official_name' => 'General Manager',
                'official_code' => 'GM',
            ]);
            $officials = collect([$official]);
        }

        // Sample invited users data
        $invitedUsers = [
            [
                'nama_pengguna' => 'John Doe',
                'division_id' => $divisions->random()->id,
                'official_id' => $officials->random()->id,
            ],
            [
                'nama_pengguna' => 'Jane Smith',
                'division_id' => $divisions->random()->id,
                'official_id' => $officials->random()->id,
            ],
            [
                'nama_pengguna' => 'Robert Johnson',
                'division_id' => $divisions->random()->id,
                'official_id' => $officials->random()->id,
            ],
            [
                'nama_pengguna' => 'Emily Davis',
                'division_id' => $divisions->random()->id,
                'official_id' => $officials->random()->id,
            ],
            [
                'nama_pengguna' => 'Michael Brown',
                'division_id' => $divisions->random()->id,
                'official_id' => $officials->random()->id,
            ],
        ];

        // Insert the data into the invited_users table
        foreach ($invitedUsers as $userData) {
            InvitedUser::create($userData);
        }
    }
}
