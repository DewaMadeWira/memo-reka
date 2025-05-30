<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\OfficialInvited;

class OfficialInvitedSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        OfficialInvited::create([
            'official_name' => 'General Manager',
            'official_code' => 'GM',
        ]);

        OfficialInvited::create([
            'official_name' => 'Manager',
            'official_code' => null,
        ]);

        OfficialInvited::create([
            'official_name' => 'Direktur',
            'official_code' => null,
        ]);
    }
}
