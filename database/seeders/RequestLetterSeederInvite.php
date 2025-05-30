<?php

namespace Database\Seeders;

use App\Models\InvitationLetter;
use App\Models\LetterType;
use App\Models\RequestStages;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RequestLetterSeederInvite extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if we have invitation letters and other required data
        $invitationCount = InvitationLetter::count();
        $userCount = User::count();
        $stagesCount = RequestStages::count();
        $letterTypeCount = LetterType::count();

        if ($invitationCount == 0 || $userCount == 0 || $stagesCount == 0 || $letterTypeCount == 0) {
            $this->command->error('Please make sure you have data in InvitationLetters, Users, RequestStages, and LetterTypes tables!');
            return;
        }

        // Get IDs from related tables
        $invitationIds = InvitationLetter::pluck('id')->toArray();
        $userIds = User::pluck('id')->toArray();
        $stagesIds = RequestStages::pluck('id')->toArray();
        $letterTypeIds = LetterType::pluck('id')->toArray();

        // Create 100 request letters
        $requestLetters = [];

        for ($i = 1; $i <= 100; $i++) {
            $invitationId = $invitationIds[array_rand($invitationIds)];
            $invitation = InvitationLetter::find($invitationId);

            // Generate a random number of stages for progress (1-3 stages)
            $progressStages = [];
            $numStages = rand(1, 3);
            for ($j = 0; $j < $numStages; $j++) {
                $progressStages[] = $stagesIds[array_rand($stagesIds)];
            }

            // Generate to_stages as JSON array
            $toStages = [$stagesIds[array_rand($stagesIds)]];

            // Generate rejected_stages as JSON array (never null)
            $rejectedStages = [$stagesIds[array_rand($stagesIds)]];

            $createdAt = Carbon::parse($invitation->created_at);
            $updatedAt = Carbon::parse($invitation->created_at)->addHours(rand(1, 24));

            $requestLetters[] = [
                'request_name' => 'Request for Invitation #' . $invitation->invitation_number,
                'user_id' => $userIds[array_rand($userIds)],
                'stages_id' => $stagesIds[array_rand($stagesIds)],
                'invitation_id' => $invitationId,
                'letter_type_id' => $letterTypeIds[array_rand($letterTypeIds)],
                'to_stages' => json_encode($toStages),         // Convert array to JSON string
                'rejected_stages' => json_encode($rejectedStages), // Convert array to JSON string
                'progress_stages' => json_encode($progressStages), // Convert array to JSON string
                'created_at' => $createdAt,
                'updated_at' => $updatedAt
            ];
        }

        // Insert in chunks to avoid memory issues
        foreach (array_chunk($requestLetters, 20) as $chunk) {
            DB::table('request_letters')->insert($chunk);
        }
    }
}
