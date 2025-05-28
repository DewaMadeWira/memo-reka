<?php

namespace Database\Seeders;

use App\Models\MemoLetter;
use App\Models\RequestLetter;
use App\Models\RequestStages;
use App\Models\User;
use App\Models\LetterType;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class RequestLetterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if we have the required related models
        $memoLetters = MemoLetter::count();
        $users = User::count();
        $stages = RequestStages::count();

        if ($memoLetters === 0 || $users === 0 || $stages === 0) {
            $this->command->info('Please seed the memo letters, users, and request stages first.');
            return;
        }

        // Get IDs for relations
        $memoIds = MemoLetter::pluck('id')->toArray();
        $userIds = User::pluck('id')->toArray();
        $letterTypeIds = LetterType::pluck('id')->toArray();

        // If no letter types found, use fallback IDs
        if (empty($letterTypeIds)) {
            $letterTypeIds = [1, 2, 3];
        }

        // Get all stages - try to order by id as a fallback for sequence
        $allStages = RequestStages::orderBy('id', 'asc')->get();
        $stagesArray = $allStages->pluck('id')->toArray();

        if (empty($stagesArray)) {
            $this->command->info('No stages found. Please seed request stages first.');
            return;
        }

        // Sample request names
        $requestNames = [
            'Pengajuan Memo Rapat Koordinasi',
            'Permohonan Pengadaan Perangkat Komputer',
            'Pengajuan Dana Pelatihan',
            'Permohonan Penggunaan Ruang Auditorium',
            'Proposal Implementasi Sistem Baru',
            'Permohonan Cuti Tahunan',
            'Pengajuan Biaya Transportasi',
            'Permintaan Anggaran Proyek',
            'Pemesanan Akomodasi Perjalanan Dinas',
            'Pengajuan Penambahan Staff',
            'Permohonan Perpanjangan Kontrak',
            'Pengajuan Renovasi Ruangan',
            'Permohonan Bantuan Teknis',
            'Pengajuan Ijin Lembur',
            'Permohonan Penggantian Peralatan',
        ];

        // Create 100 request letters
        for ($i = 0; $i < 100; $i++) {
            // Get a random memo - each memo may be used for multiple requests
            $memoId = $memoIds[array_rand($memoIds)];
            $memo = MemoLetter::find($memoId);

            // Use the memo's date as the base for the request date
            // Some requests will be made on the same day as the memo
            // Others might be 1-3 days after
            $daysAfterMemo = rand(0, 3);
            $requestDate = Carbon::parse($memo->created_at)->addDays($daysAfterMemo);

            // Get random letter type
            $letterTypeId = $letterTypeIds[array_rand($letterTypeIds)];

            // Select a current stage - simulate being somewhere in the workflow
            $currentStageIndex = rand(0, count($stagesArray) - 1);
            $currentStage = $stagesArray[$currentStageIndex];

            // For to_stages, select 1-2 random stages that aren't the current stage
            $toStages = [];
            $availableToStages = array_diff($stagesArray, [$currentStage]);

            if (!empty($availableToStages)) {
                // Select one random stage
                $randomKey = array_rand($availableToStages);
                $toStages[] = $availableToStages[$randomKey];

                // Sometimes add a second random stage
                if (rand(0, 1) === 1 && count($availableToStages) > 1) {
                    // Remove the first selected stage
                    unset($availableToStages[$randomKey]);
                    $toStages[] = $availableToStages[array_rand($availableToStages)];
                }
            } else {
                // If somehow we have only one stage, use it
                $toStages[] = $currentStage;
            }

            // Create progress stages - randomly select 1-3 stages
            $progressStages = [];
            $numProgressStages = min(3, count($stagesArray));
            $numProgressStages = rand(1, $numProgressStages);

            // If there's only one stage, array_rand returns the index directly, not in an array
            if (count($stagesArray) === 1) {
                $progressStages[] = $stagesArray[0];
            } else {
                $progressIndices = array_rand($stagesArray, $numProgressStages);

                // Make sure progressIndices is always an array
                if (!is_array($progressIndices)) {
                    $progressIndices = [$progressIndices];
                }

                foreach ($progressIndices as $idx) {
                    $progressStages[] = $stagesArray[$idx];
                }
            }

            // For rejected_stages, sometimes add a rejected stage (but always provide a value)
            $rejectedStages = [];  // Default to empty array, not null
            if (rand(0, 3) === 0) { // 25% chance of rejection
                $rejectedIndex = array_rand($stagesArray);
                $rejectedStages[] = $stagesArray[$rejectedIndex];
            }

            // Get a random request name
            $requestName = $requestNames[array_rand($requestNames)] . ' ' . ($i + 1);

            RequestLetter::create([
                'request_name' => $requestName,
                'user_id' => $userIds[array_rand($userIds)],
                'stages_id' => $currentStage,
                'memo_id' => $memoId,
                'invitation_id' => null,
                'letter_type_id' => $letterTypeId,
                'summary_id' => null,
                'to_stages' => json_encode($toStages),
                'rejected_stages' => json_encode($rejectedStages),
                'progress_stages' => json_encode($progressStages),
                'created_at' => $requestDate,
                'updated_at' => $requestDate,
            ]);
        }

        $this->command->info('100 RequestLetters seeded successfully with dates related to their associated memos!');
    }
}
