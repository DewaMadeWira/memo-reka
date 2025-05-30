<?php

namespace Database\Seeders;

use App\Models\Division;
use App\Models\InvitationLetter;
use App\Models\LetterType;
use App\Models\Official;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InvitationLetterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if we have required data in the related tables
        $divisionCount = Division::count();
        $letterTypeCount = LetterType::count();
        $userCount = User::count();
        $officialCount = Official::count();

        if ($divisionCount == 0 || $letterTypeCount == 0 || $userCount == 0 || $officialCount == 0) {
            $this->command->error('Please make sure you have data in Divisions, LetterTypes, Users, and Officials tables!');
            return;
        }

        // Get IDs from related tables
        $divisionIds = Division::pluck('id')->toArray();
        $letterTypeIds = LetterType::pluck('id')->toArray();
        $userIds = User::pluck('id')->toArray();
        $officialIds = Official::pluck('id')->toArray();

        // Create 100 invitation letters
        $invitationLetters = [];
        $now = Carbon::now();
        
        for ($i = 1; $i <= 100; $i++) {
            $randomDate = Carbon::now()->subDays(rand(0, 30));
            $yearly_counter = $i;
            $monthly_counter = rand(1, 20);
            
            $invitationLetters[] = [
                'invitation_number' => 'INV/' . $yearly_counter . '/' . $monthly_counter . '/' . $randomDate->format('Y'),
                'monthly_counter' => $monthly_counter,
                'yearly_counter' => $yearly_counter,
                'letter_id' => $letterTypeIds[array_rand($letterTypeIds)],
                'from_division' => $divisionIds[array_rand($divisionIds)],
                'to_division' => $divisionIds[array_rand($divisionIds)],
                'perihal' => 'Meeting about ' . $this->getRandomSubject(),
                'content' => 'We would like to invite you to attend a meeting regarding ' . $this->getRandomSubject() . '. Your presence is highly appreciated.',
                'signatory' => $userIds[array_rand($userIds)],
                'official_id' => $officialIds[array_rand($officialIds)],
                'hari_tanggal' => $randomDate->format('Y-m-d'),
                'waktu' => sprintf('%02d:%02d', rand(8, 17), rand(0, 59)),
                'tempat' => $this->getRandomLocation(),
                'agenda' => $this->getRandomAgenda(),
                'created_at' => $randomDate,
                'updated_at' => $randomDate,
            ];
        }

        // Insert in chunks to avoid memory issues
        foreach (array_chunk($invitationLetters, 20) as $chunk) {
            DB::table('invitation_letters')->insert($chunk);
        }
    }
    
    private function getRandomSubject()
    {
        $subjects = [
            'Budget Planning', 'Project Timeline', 'Quarterly Review', 
            'New Product Launch', 'Marketing Strategy', 'Team Building', 
            'Annual Report', 'Performance Evaluation', 'System Upgrade',
            'Client Presentation'
        ];
        return $subjects[array_rand($subjects)];
    }
    
    private function getRandomLocation()
    {
        $locations = [
            'Conference Room A', 'Conference Room B', 'Meeting Room 101', 
            'Executive Boardroom', 'Auditorium', 'Training Center', 
            'Innovation Lab', 'Virtual Meeting (Zoom)', 'Office Cafeteria',
            'Rooftop Garden'
        ];
        return $locations[array_rand($locations)];
    }
    
    private function getRandomAgenda()
    {
        $agendas = [
            'Review previous meeting notes, Discuss current projects, Plan next steps',
            'Presentation of quarterly results, Budget allocation, Future plans',
            'Team updates, Project status review, Resource allocation',
            'New policy introduction, Team feedback, Implementation timeline',
            'Client project briefing, Task assignment, Deadline setting',
            'Performance review, Goal setting, Career development plan',
            'Product demonstration, Feedback collection, Improvement suggestions',
            'Strategic planning, Market analysis, Competitive positioning',
            'Training session, Skill development, Knowledge sharing',
            'Brainstorming session, Problem solving, Innovation ideas'
        ];
        return $agendas[array_rand($agendas)];
    }
}
