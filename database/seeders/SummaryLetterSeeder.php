<?php

namespace Database\Seeders;

use App\Models\InvitationLetter;
use App\Models\SummaryLetter;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SummaryLetterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if we have invitation letters
        $invitationCount = InvitationLetter::count();

        if ($invitationCount == 0) {
            $this->command->error('Please make sure you have data in InvitationLetters table!');
            return;
        }

        // Get invitation IDs
        $invitationIds = InvitationLetter::pluck('id')->toArray();

        // Create 100 summary letters
        $summaryLetters = [];

        for ($i = 1; $i <= 100; $i++) {
            $invitationId = $invitationIds[array_rand($invitationIds)];
            $invitation = InvitationLetter::find($invitationId);

            // Generate a random date within the last 30 days
            $randomDate = Carbon::now()->subDays(rand(0, 30));

            // Create a summary based on invitation data
            $summaryLetters[] = [
                'invitation_id' => $invitationId,
                'file_path' => 'summaries/summary_' . $invitationId . '_' . date('Ymd') . '.pdf',
                'judul_rapat' => 'Summary: ' . $invitation->perihal,
                'rangkuman_rapat' => $this->generateSummary($invitation->agenda),
                'rejection_reason' => rand(1, 10) > 8 ? $this->getRandomRejectionReason() : null,
                'created_at' => $randomDate,
                'updated_at' => $randomDate->copy()->addHours(rand(1, 5))
            ];
        }

        // Insert in chunks to avoid memory issues
        foreach (array_chunk($summaryLetters, 20) as $chunk) {
            DB::table('summary_letters')->insert($chunk);
        }

        $this->command->info('Created 100 summary letters successfully.');
    }

    /**
     * Generate a summary based on the invitation agenda
     */
    private function generateSummary(string $agenda = null): string
    {
        $agendaItems = [
            "A comprehensive discussion was held regarding the meeting agenda items.",
            "All participants actively contributed to the discussion with valuable insights.",
            "Key decisions were made by consensus after thorough deliberation.",
            "Action items were assigned with clear deadlines and responsibilities.",
            "Challenges were identified and strategies were developed to address them.",
            "Progress on previous action items was reviewed and documented.",
            "New initiatives were proposed and approved for implementation.",
            "Budget allocations were reviewed and adjusted as needed.",
            "Team performance metrics were analyzed and areas for improvement identified.",
            "Future meeting schedule was confirmed and preliminary agenda items were noted."
        ];

        // Create a summary with 3-5 random points
        $summary = "Meeting Summary:\n\n";
        $numPoints = rand(3, 5);
        $usedIndexes = [];

        for ($i = 0; $i < $numPoints; $i++) {
            // Make sure we don't repeat points
            do {
                $index = array_rand($agendaItems);
            } while (in_array($index, $usedIndexes));

            $usedIndexes[] = $index;
            $summary .= "- " . $agendaItems[$index] . "\n";
        }

        // Add a conclusion
        $summary .= "\nConclusion: The meeting was productive and all agenda items were addressed successfully.";

        return $summary;
    }

    /**
     * Get a random rejection reason
     */
    private function getRandomRejectionReason(): string
    {
        $reasons = [
            "Incomplete information provided in the meeting summary.",
            "Inaccurate representation of the discussions held during the meeting.",
            "Key decisions not properly documented in the summary.",
            "Missing action items and responsible parties.",
            "Format does not comply with organizational standards.",
            "Confidential information improperly disclosed in the summary.",
            "Requires additional details on specific agenda items.",
            "Inconsistencies between meeting minutes and summary provided.",
            "Summary fails to capture the conclusions reached during the meeting."
        ];

        return $reasons[array_rand($reasons)];
    }
}
