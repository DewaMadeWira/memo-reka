<?php

namespace App\Http\Services;

use App\Jobs\SendMemoNotification;
use App\Models\InvitationLetter;
use App\Models\LetterNumberCounter;
use App\Models\MeetingAttendees;
use App\Models\MemoLetter;
use App\Models\Official;
use App\Models\RequestLetter;
use App\Models\RequestStages;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;

class InvitationService
{
    protected $authService;
    //
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }
    public function index($intent)
    {
        $user = Auth::user();
        $user = User::with('role')->with('division')->where("id", $user->id)->first();
        $division = $this->authService->userDivision();

        switch ($intent) {
            case '':
                // $invite = $this->index('all');

                // $invite = RequestLetter::with('user', 'stages', 'stages.status', 'invite')->whereHas('invite', function ($q) use ($user) {
                //     $q->where('from_division', $user->division->id);
                // })->get();

                $invite = RequestLetter::with(['user', 'stages' => function ($query) {
                    $query->withTrashed();
                }, 'stages.status', 'invite', 'invite.to_division', 'invite.from_division', 'invite.signatory', 'invite.attendees.user'])->whereHas('invite', function ($q) use ($division) {
                    $q->where('from_division', $division)
                        ->orWhere('to_division', $division);;
                })->get();

                $invite->each(function ($requestLetter) {
                    // Handle different possible types of progress_stages
                    $progressStages = [];

                    if (isset($requestLetter->progress_stages)) {
                        if (is_string($requestLetter->progress_stages)) {
                            // Try to decode JSON string
                            $decoded = json_decode($requestLetter->progress_stages, true);
                            if (is_array($decoded)) {
                                $progressStages = $decoded;
                            }
                        } elseif (is_array($requestLetter->progress_stages)) {
                            $progressStages = $requestLetter->progress_stages;
                        }
                    }

                    // Now use the properly formatted array
                    // $requestLetter->progress = RequestStages::withTrashed()->with("request_rejected")->whereIn('id', $progressStages)->orderByRaw("FIELD(id, " . implode(',', $progressStages) . ")")->get();
                    if (!empty($progressStages)) {
                        $requestLetter->progress = RequestStages::withTrashed()
                            ->with("request_rejected")
                            ->whereIn('id', $progressStages)
                            ->when(count($progressStages) > 0, function ($query) use ($progressStages) {
                                // Only apply the ordering if there are items in the array
                                return $query->orderByRaw("FIELD(id, " . implode(',', $progressStages) . ")");
                            })
                            ->get();
                    } else {
                        $requestLetter->progress = collect(); // Empty collection if no progress stages
                    }
                    // return $requestLetter;
                    // error_log($requestLetter);
                });
                return $invite;

            case 'invitation.internal':
                // $invite = $this->index('all');

                // $invite = RequestLetter::with('user', 'stages', 'stages.status', 'invite')->whereHas('invite', function ($q) use ($user) {
                //     $q->where('from_division', $user->division->id);
                // })->get();

                $invite = RequestLetter::with(['user', 'stages' => function ($query) {
                    $query->withTrashed();
                }, 'stages.status', 'invite', 'invite.to_division', 'invite.from_division', 'invite.signatory', 'invite.attendees.user'])->whereHas('invite', function ($q) use ($division) {
                    $q->where('from_division', $division);
                })->get();

                $invite->each(function ($requestLetter) {
                    // Handle different possible types of progress_stages
                    $progressStages = [];

                    if (isset($requestLetter->progress_stages)) {
                        if (is_string($requestLetter->progress_stages)) {
                            // Try to decode JSON string
                            $decoded = json_decode($requestLetter->progress_stages, true);
                            if (is_array($decoded)) {
                                $progressStages = $decoded;
                            }
                        } elseif (is_array($requestLetter->progress_stages)) {
                            $progressStages = $requestLetter->progress_stages;
                        }
                    }

                    // Now use the properly formatted array
                    // $requestLetter->progress = RequestStages::withTrashed()->with("request_rejected")->whereIn('id', $progressStages)->orderByRaw("FIELD(id, " . implode(',', $progressStages) . ")")->get();
                    if (!empty($progressStages)) {
                        $requestLetter->progress = RequestStages::withTrashed()
                            ->with("request_rejected")
                            ->whereIn('id', $progressStages)
                            ->when(count($progressStages) > 0, function ($query) use ($progressStages) {
                                // Only apply the ordering if there are items in the array
                                return $query->orderByRaw("FIELD(id, " . implode(',', $progressStages) . ")");
                            })
                            ->get();
                    } else {
                        $requestLetter->progress = collect(); // Empty collection if no progress stages
                    }
                    // return $requestLetter;
                    // error_log($requestLetter);
                });
                return $invite;

            case 'invitation.eksternal':

                // $invite = RequestLetter::with('user', 'stages', 'stages.status', 'invite')->whereHas('invite', function ($q) use ($user) {
                //     $q->where('from_division', $user->division->id);
                // })->get();

                $invite = RequestLetter::with(['user', 'stages' => function ($query) {
                    $query->withTrashed();
                }, 'stages.status', 'invite', 'invite.to_division', 'invite.from_division', 'invite.signatory', 'invite.attendees.user'])->whereHas('invite', function ($q) use ($division) {
                    $q->where('to_division', $division);
                })->get();

                $invite->each(function ($requestLetter) {
                    // Handle different possible types of progress_stages
                    $progressStages = [];

                    if (isset($requestLetter->progress_stages)) {
                        if (is_string($requestLetter->progress_stages)) {
                            // Try to decode JSON string
                            $decoded = json_decode($requestLetter->progress_stages, true);
                            if (is_array($decoded)) {
                                $progressStages = $decoded;
                            }
                        } elseif (is_array($requestLetter->progress_stages)) {
                            $progressStages = $requestLetter->progress_stages;
                        }
                    }

                    // Now use the properly formatted array
                    // $requestLetter->progress = RequestStages::withTrashed()->with("request_rejected")->whereIn('id', $progressStages)->orderByRaw("FIELD(id, " . implode(',', $progressStages) . ")")->get();
                    if (!empty($progressStages)) {
                        $requestLetter->progress = RequestStages::withTrashed()
                            ->with("request_rejected")
                            ->whereIn('id', $progressStages)
                            ->when(count($progressStages) > 0, function ($query) use ($progressStages) {
                                // Only apply the ordering if there are items in the array
                                return $query->orderByRaw("FIELD(id, " . implode(',', $progressStages) . ")");
                            })
                            ->get();
                    } else {
                        $requestLetter->progress = collect(); // Empty collection if no progress stages
                    }
                    // return $requestLetter;
                    // error_log($requestLetter);
                });
                return $invite;


            default:
                $invite = $this->index('all');
                break;
        }
    }
    public function create($request)
    {

        $user = Auth::user();
        $user = User::with('role')->with('division')->where("id", $user->id)->first();
        $official = Official::where("id", $request->official)->first();
        $manager = User::with('role', 'division')->where("division_id", $user->division_id)->whereHas("role", function ($q) {
            $q->where('role_name', "admin");
        })->first();

        // dd($request->content);

        $invite = InvitationLetter::create([
            // 'invitation_name' => "Test Invitation",
            'invitation_number' => "1234",
            'perihal' => $request->perihal,
            'content' => $request->content,
            'signatory' => $manager->id,
            'official_id' => $request->official,
            'from_division' => $user->division->id,
            'to_division' => $request->to_division,
            'letter_id' => 2,
            'hari_tanggal' => $request->hari_tanggal,
            'waktu' => $request->waktu,
            'tempat' => $request->tempat,
            'agenda' => $request->agenda,
        ]);

        foreach ($request->invited_users as $userId) {
            MeetingAttendees::create([
                'invitation_letter_id' => $invite->id,
                'user_id' => $userId,
            ]);
        }
        $generatedInviteData = $this->generateNomorSuratDivision($user, $official);
        $letter_number = LetterNumberCounter::where('division_id', $user->division->id)->where('letter_type_id', 2)->first();
        $letter_number->update([
            "monthly_counter" => $generatedInviteData["monthly_counter"],
            "yearly_counter" => $generatedInviteData["yearly_counter"],
        ]);
        $invite->update([
            "invitation_number" => $generatedInviteData["invitation_number"],
        ]);

        // $stages = InvitationLetter::with('letter', 'letter.request_stages', 'letter.request_stages.status')->first();

        $stages = RequestStages::where('letter_id', $invite->letter_id)->get();
        $nextStageMap = $stages->pluck('to_stage_id', 'id')->filter();
        $rejectedStageMap = $stages->pluck('rejected_id', 'id')->filter();
        $progressStageMap = $this->extract_progress_stage($nextStageMap->toArray());
        // return $stages;
        // $stages_id = $stages->letter->request_stages->where('sequence', 1)->first()->id;
        // $stages_id = $stages->letter->request_stages;

        // $request = RequestLetter::create([
        //     "request_name" => "Test Request Baru Invitation",
        //     "user_id" => $user->id,
        //     // "status_id" => $stages->letter->request_stages[0]->status_id,
        //     "stages_id" => $stages->letter->request_stages->where('sequence', 1)->first()->id,
        //     "letter_type_id" => $invite->letter_id,
        //     "invitation_id" => $invite->id,
        // ]);
        $stages = RequestStages::where('letter_id', $invite->letter_id)->get();
        $nextStageMap = $stages->pluck('to_stage_id', 'id')->filter();
        $rejectedStageMap = $stages->pluck('rejected_id', 'id')->filter();
        $progressStageMap = $this->extract_progress_stage($nextStageMap->toArray());

        $request = RequestLetter::create([
            "request_name" => $request->request_name,
            "user_id" => $user->id,
            // "status_id" => $stages->letter->request_stages[0]->status_id,
            "stages_id" => $stages->where('sequence', 1)->first()->id,
            "letter_type_id" => $invite->letter_id,
            "invitation_id" => $invite->id,
            "to_stages" => $nextStageMap->toJson(),
            "rejected_stages" => $rejectedStageMap->toJson(),
            "progress_stages" => json_encode($progressStageMap),
        ]);
    }
    public function extract_progress_stage($to_stages)
    {

        $result = [];
        if (empty($to_stages)) {
            return $result;
        }
        $visited = [];
        $currentKey = array_key_first($to_stages); // Start from the first key


        // while ($currentKey !== null && isset($to_stages[$currentKey]) && !in_array($currentKey, $visited)) {
        //     $visited[] = $currentKey; // Avoid infinite loops
        //     $result[] = (int) $currentKey; // Store the current key (stage ID)
        //     $nextKey = (string) $to_stages[$currentKey]; // Move to the next reference

        //     if (!in_array($nextKey, $result)) {
        //         $result[] = (int) $nextKey; // Store the next stage ID
        //     }

        //     $currentKey = $nextKey;
        // }
        while ($currentKey !== null && isset($to_stages[$currentKey]) && !in_array($currentKey, $visited)) {
            $visited[] = $currentKey; // Avoid infinite loops
            $result[] = (int) $currentKey; // Store the current key (stage ID)
            $currentKey = (string) $to_stages[$currentKey]; // Move to the next reference
        }

        // Add the last referenced stage ID only if it's not already in the result
        if ($currentKey !== null && !in_array((int) $currentKey, $result)) {
            $result[] = (int) $currentKey;
        }

        error_log(json_encode($result));
        // dd($result);
        return $result;
    }
    public function generateNomorSuratDivision($user, $official)
    {
        $number = LetterNumberCounter::with(['division'])->where('division_id', $user->division->id)->where('letter_type_id', 2)->first();

        $currentYear = date("Y");
        $currentMonth = date("m");

        if (empty($number)) {
            // $newYearlyCounter = 1;
            // $newMonthlyCounter = 1;
            $number = new LetterNumberCounter();
            $number->division_id = $user->division->id;
            $number->letter_type_id = 2;
            $number->monthly_counter = 1;
            $number->yearly_counter = 1;
            $number->save();
            $newYearlyCounter = 1;
            $newMonthlyCounter = 1;
        } else {
            $lastYear = $number->updated_at->format('Y');
            $lastYearlyCounter = $number->yearly_counter;
            $lastMonth = $number->updated_at->format('m');
            $lastMonthlyCounter = $number->monthly_counter;
            if ($lastYear != $currentYear) {
                // $newYear = $currentYear;

                error_log($lastYear);
                error_log("called not same year");
                $newYearlyCounter = 1;
            } else {
                // $newYear = $lastYear;

                error_log($lastYear);
                error_log("called same year");
                $newYearlyCounter = $lastYearlyCounter + 1;

                // dd($newYearlyCounter, $lastYearlyCounter);
            }


            // if ($lastMonth != $currentMonth) {
            if ($lastMonth != $currentMonth || $lastYear != $currentYear) {
                // dd("not empty", $currentMonth, $lastMonth, $currentYear, $lastYear);
                error_log($lastMonth);

                error_log("called not same month weird");
                $newMonth = $currentMonth;
                $newMonthlyCounter = 1;
            } else {
                error_log($lastMonth);
                error_log("called same month");
                $newMonth = $lastMonth;
                $newMonthlyCounter = $lastMonthlyCounter + 1;
            }
        }
        $invitationNumber = sprintf(
            "%02d.%02d/REKA%s/GEN/%s/%s/%s",
            $newYearlyCounter,
            $newMonthlyCounter,
            $official->official_code,
            $user->division->division_code,
            $this->convertToRoman($currentMonth),
            $currentYear
        );
        return [
            'invitation_number' => $invitationNumber,
            'yearly_counter' => $newYearlyCounter,
            'monthly_counter' => $newMonthlyCounter
        ];
    }
    public function generateNomorSurat($user, $official)
    {

        // dd($user);

        $invite = RequestLetter::with(['user', 'stages' => function ($query) {
            $query->withTrashed();
        }, 'stages.status', 'invite', 'invite.to_division', 'invite.from_division', 'invite.signatory'])->whereHas('invite', function ($q) use ($user) {
            $q->where('from_division', $user->division->id);
        })->latest()->first();

        // dd($memo);

        $currentYear = date("Y");
        $currentMonth = date("m");

        if (empty($invite)) {
            $newYearlyCounter = 1;
            $newMonthlyCounter = 1;
        } else {

            $lastYear = $invite->created_at->format('Y');
            $lastYearlyCounter = $invite->invite->yearly_counter;
            $lastMonth = $invite->created_at->format('m');
            $lastMonthlyCounter = $invite->invite->monthly_counter;

            // dd($lastMonthlyCounter);
            if ($lastYear != $currentYear) {
                // $newYear = $currentYear;

                error_log($lastYear);
                error_log("called not same year");
                $newYearlyCounter = 1;
            } else {
                // $newYear = $lastYear;

                error_log($lastYear);
                error_log("called same year");
                $newYearlyCounter = $lastYearlyCounter + 1;

                // dd($newYearlyCounter, $lastYearlyCounter);
            }


            // if ($lastMonth != $currentMonth) {
            if ($lastMonth != $currentMonth || $lastYear != $currentYear) {
                // dd("not empty", $currentMonth, $lastMonth, $currentYear, $lastYear);
                error_log($lastMonth);

                error_log("called not same month weird");
                $newMonth = $currentMonth;
                $newMonthlyCounter = 1;
            } else {
                error_log($lastMonth);
                error_log("called same month");
                $newMonth = $lastMonth;
                $newMonthlyCounter = $lastMonthlyCounter + 1;
            }
        }

        // $nomorBulanan = sprintf("%03d/%s/%s", $newMonthlyCounter, $newMonth, $newYear);
        // $nomorTahunan = sprintf("%03d/%s", $newYearlyCounter, $newYear);

        // $inviteNumber = "$newYearlyCounter.$newMonthlyCounter/REKA$official->official_code/GEN/{$user->division->division_code}/{$this->convertToRoman($currentMonth)}/$currentYear";
        $inviteNumber = sprintf(
            "%02d.%02d/REKA%s/GEN/%s/%s/%s",
            $newYearlyCounter,
            $newMonthlyCounter,
            $official->official_code,
            $user->division->division_code,
            $this->convertToRoman($currentMonth),
            $currentYear
        );

        // dd($newMonthlyCounter, $newYearlyCounter);
        return [
            // 'nomor_bulanan' => $nomorBulanan,
            // 'nomor_tahunan' => $nomorTahunan,
            // 'year' => $newYear,
            // 'month' => $newMonth,
            'invitation_number' => $inviteNumber,
            'yearly_counter' => $newYearlyCounter,
            'monthly_counter' => $newMonthlyCounter
        ];
    }
    private function convertToRoman($number)
    {
        $map = [
            '01' => 'I',
            '02' => 'II',
            '03' => 'III',
            '04' => 'IV',
            '05' => 'V',
            '06' => 'VI',
            '07' => 'VII',
            '08' => 'VIII',
            '09' => 'IX',
            '10' => 'X',
            '11' => 'XI',
            '12' => 'XII'
        ];

        return $map[$number] ?? $number;
    }
    public function approve($id)
    {
        $request = RequestLetter::with('invite')->where('invitation_id', $id)->first();
        $nextStageId = json_decode($request->to_stages, true);
        // return response()->json($nextStageId);

        $nextStageId = $nextStageId[$request->stages_id] ?? null;
        if ($nextStageId == null) {
            return to_route('undangan-rapat.index');
        }
        InvitationLetter::where('id', $id)->update([
            'rejection_reason' => NULL
        ]);
        $request->update([
            "stages_id" => $nextStageId,
        ]);
        $request->save();
        $invitedUser = MeetingAttendees::where('invitation_letter_id', $id)->get();
        // dd($request->invite->invitation_number);
        foreach ($invitedUser as $user) {
            SendMemoNotification::dispatch(
                $user->user_id,
                'Undangan Rapat',
                "Anda telah diundang ke undangan rapat dengan nomor '{$request->invite->invitation_number}' . Periksa undangan tersebut.",
                $request->id
            );
        }
    }
    public function reject($id, Request $request)
    {
        $request_letter = RequestLetter::with('invite')->where('invitation_id', $id)->first();
        $nextStageId = json_decode($request_letter->rejected_stages, true);
        $nextStageId = $nextStageId[$request_letter->stages_id] ?? null;
        if ($nextStageId == null) {
            return to_route('undangan-rapat.index');
        }
        InvitationLetter::where('id', $id)->update([
            'rejection_reason' => 'Undangan rapat ditolak oleh ' . Auth::user()->name . ' karena ' . "\n\n" . $request->rejection_reason
        ]);

        $request_letter->update([
            "stages_id" => $nextStageId,
        ]);
        $request_letter->save();
    }
}
