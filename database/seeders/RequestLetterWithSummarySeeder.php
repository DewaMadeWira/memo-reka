<?php

namespace Database\Seeders;

use App\Models\InvitationLetter;
use App\Models\LetterType;
use App\Models\RequestStages;
use App\Models\SummaryLetter;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RequestLetterWithSummarySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if we have required data
        $invitationCount = InvitationLetter::count();
        $summaryCount = SummaryLetter::count();
        $userCount = User::count();
        $stagesCount = RequestStages::count();
        $letterTypeCount = LetterType::count();
        
        if ($invitationCount == 0 || $summaryCount == 0 || $userCount == 0 || $stagesCount == 0 || $letterTypeCount == 0) {
            $this->command->error('Please make sure you have data in InvitationLetters, SummaryLetters, Users, RequestStages, and LetterTypes tables!');
            return;
        }
        
        // Get IDs from related tables
        $summaryIds = SummaryLetter::pluck('id')->toArray();
        $userIds = User::pluck('id')->toArray();
        $stagesIds = RequestStages::pluck('id')->toArray();
        $letterTypeIds = LetterType::pluck('id')->toArray();
        
        // Create 100 request letters
        $requestLetters = [];
        
        for ($i = 1; $i <= 100; $i++) {
            // Get a random summary and its associated invitation
            $summaryId = $summaryIds[array_rand($summaryIds)];
            $summary = SummaryLetter::find($summaryId);
            $invitationId = $summary->invitation_id;
            
            // Generate a random number of stages for progress (1-3 stages)
            $progressStages = [];
            $numStages = rand(1, 3);
            for ($j = 0; $j < $numStages; $j++) {
                $progressStages[] = $stagesIds[array_rand($stagesIds)];
            }
            
            // Generate to_stages and rejected_stages as JSON arrays
            $toStages = [$stagesIds[array_rand($stagesIds)]];
            $rejectedStages = [$stagesIds[array_rand($stagesIds)]];
            
            // Use dates from the summary letter
            $createdAt = Carbon::parse($summary->created_at)->addHours(rand(1, 24));
            $updatedAt = $createdAt->copy()->addHours(rand(1, 24));
            
            $requestLetters[] = [
                'request_name' => 'Request for Summary #' . $summaryId . ' of Invitation #' . $invitationId,
                'user_id' => $userIds[array_rand($userIds)],
                'stages_id' => $stagesIds[array_rand($stagesIds)],
                'invitation_id' => $invitationId,
                'summary_id' => $summaryId,
                'letter_type_id' => $letterTypeIds[array_rand($letterTypeIds)],
                'to_stages' => json_encode($toStages),
                'rejected_stages' => json_encode($rejectedStages),
                'progress_stages' => json_encode($progressStages),
                'created_at' => $createdAt,
                'updated_at' => $updatedAt
            ];
        }
        
        // Insert in chunks to avoid memory issues
        foreach (array_chunk($requestLetters, 20) as $chunk) {
            DB::table('request_letters')->insert($chunk);
        }
        
        $this->command->info('Created 100 request letters with summary references successfully.');
    }
}
