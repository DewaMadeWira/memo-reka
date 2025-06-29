<?php

namespace App\Http\Services;

use App\Http\Resources\RequestLetterResource;
use App\Jobs\SendMemoNotification;
use App\Models\Division;
use App\Models\InvitationLetter;
use App\Models\LetterNumberCounter;
use App\Models\MeetingAttendees;
use App\Models\MemoLetter;
use App\Models\Notification;
use App\Models\Official;
use App\Models\RequestLetter;
use App\Models\RequestStages;
use App\Models\Setting;
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
                $invite = RequestLetter::with(['user', 'stages' => function ($query) {
                    $query->withTrashed();
                }, 'stages.status', 'invite', 'invite.to_division', 'invite.from_division', 'invite.signatory', 'invite.attendees.user', 'invite.attendees.user.official'])->whereHas('invite', function ($q) use ($division) {
                    $q->where('from_division', $division)
                        ->orWhere('to_division', $division);
                })->get();

                $invite->each(function ($requestLetter) {
                    // Parse to_stages mapping
                    $toStagesMap = [];
                    if (!empty($requestLetter->to_stages)) {
                        $toStagesMap = json_decode($requestLetter->to_stages, true) ?? [];
                    }
                    $rejectedStagesMap = [];
                    if (!empty($requestLetter->rejected_stages)) {
                        $rejectedStagesMap = json_decode($requestLetter->rejected_stages, true) ?? [];
                    }

                    // Handle progress_stages as before
                    $progressStages = [];
                    if (isset($requestLetter->progress_stages)) {
                        if (is_string($requestLetter->progress_stages)) {
                            $decoded = json_decode($requestLetter->progress_stages, true);
                            if (is_array($decoded)) {
                                $progressStages = $decoded;
                            }
                        } elseif (is_array($requestLetter->progress_stages)) {
                            $progressStages = $requestLetter->progress_stages;
                        }
                    }

                    // Get actual stage records for progress_stages
                    if (!empty($progressStages)) {
                        $requestLetter->progress = RequestStages::withTrashed()
                            ->with("request_rejected")
                            ->whereIn('id', $progressStages)
                            ->when(count($progressStages) > 0, function ($query) use ($progressStages) {
                                return $query->orderByRaw("FIELD(id, " . implode(',', $progressStages) . ")");
                            })
                            ->get();
                    } else {
                        $requestLetter->progress = collect();
                    }

                    // Get all unique stage IDs from to_stages (both keys and values)
                    $allToStageIds = array_unique(array_merge(
                        array_keys($toStagesMap),
                        array_filter(array_values($toStagesMap)) // filter out null values
                    ));

                    // Get all unique stage IDs from rejected_stages (both keys and values)  
                    $allRejectedStageIds = array_unique(array_merge(
                        array_keys($rejectedStagesMap),
                        array_filter(array_values($rejectedStagesMap)) // filter out null values
                    ));

                    // Fetch stage records for to_stages
                    $toStageRecords = RequestStages::withTrashed()
                        ->whereIn('id', $allToStageIds)
                        ->get()
                        ->keyBy('id');

                    // Fetch stage records for rejected_stages
                    $rejectedStageRecords = RequestStages::withTrashed()
                        ->whereIn('id', $allRejectedStageIds)
                        ->get()
                        ->keyBy('id');

                    // Build to_stages with actual stage records - BUILD ARRAY FIRST, THEN ASSIGN
                    $toStagesWithRecords = [];
                    foreach ($toStagesMap as $fromStageId => $toStageId) {
                        $toStagesWithRecords[] = [
                            'from_stage_id' => $fromStageId,
                            'to_stage_id' => $toStageId,
                            'from_stage' => $toStageRecords->get($fromStageId),
                            'to_stage' => $toStageId ? $toStageRecords->get($toStageId) : null,
                        ];
                    }
                    $requestLetter->to_stages_with_records = $toStagesWithRecords;

                    // Build rejected_stages with actual stage records - BUILD ARRAY FIRST, THEN ASSIGN
                    $rejectedStagesWithRecords = [];
                    foreach ($rejectedStagesMap as $fromStageId => $rejectedStageId) {
                        $rejectedStagesWithRecords[] = [
                            'from_stage_id' => $fromStageId,
                            'rejected_stage_id' => $rejectedStageId,
                            'from_stage' => $rejectedStageRecords->get($fromStageId),
                            'rejected_stage' => $rejectedStageId ? $rejectedStageRecords->get($rejectedStageId) : null,
                        ];
                    }
                    $requestLetter->rejected_stages_with_records = $rejectedStagesWithRecords;

                    // Store all stage records for easy lookup
                    $requestLetter->all_to_stage_records = $toStageRecords;
                    $requestLetter->all_rejected_stage_records = $rejectedStageRecords;

                    // Store decoded values for later use
                    $requestLetter->decoded_to_stages = $toStagesMap;
                    $requestLetter->decoded_rejected_stages = $rejectedStagesMap;
                    $requestLetter->decoded_progress_stages = $progressStages;
                });

                $resource = $invite->map(function ($item) {
                    return [
                        ...(new RequestLetterResource($item))->toArray(request()),
                        'progress' => $item->progress, // Already includes actual stage records in order

                        // Raw JSON values
                        'raw_to_stages' => $item->to_stages,
                        'raw_rejected_stages' => $item->rejected_stages,
                        'raw_progress_stages' => $item->progress_stages,

                        // Decoded values (arrays/objects)
                        'decoded_to_stages' => $item->decoded_to_stages,
                        'decoded_rejected_stages' => $item->decoded_rejected_stages,
                        'decoded_progress_stages' => $item->decoded_progress_stages,

                        // Stage records with relationships (both key and value data)
                        'to_stages_with_records' => $item->to_stages_with_records,
                        'rejected_stages_with_records' => $item->rejected_stages_with_records,

                        // All stage records for easy lookup
                        'all_to_stage_records' => $item->all_to_stage_records,
                        'all_rejected_stage_records' => $item->all_rejected_stage_records,
                    ];
                });


                return $resource;

            case 'invitation.internal':
                $invite = RequestLetter::with(['user', 'stages' => function ($query) {
                    $query->withTrashed();
                }, 'stages.status', 'invite', 'invite.to_division', 'invite.from_division', 'invite.signatory', 'invite.attendees.user', 'invite.attendees.user.official'])->whereHas('invite', function ($q) use ($division) {
                    $q->where('from_division', $division);
                })->get();

                $invite->each(function ($requestLetter) {
                    // Parse to_stages mapping
                    $toStagesMap = [];
                    if (!empty($requestLetter->to_stages)) {
                        $toStagesMap = json_decode($requestLetter->to_stages, true) ?? [];
                    }
                    $rejectedStagesMap = [];
                    if (!empty($requestLetter->rejected_stages)) {
                        $rejectedStagesMap = json_decode($requestLetter->rejected_stages, true) ?? [];
                    }

                    // Handle progress_stages as before
                    $progressStages = [];
                    if (isset($requestLetter->progress_stages)) {
                        if (is_string($requestLetter->progress_stages)) {
                            $decoded = json_decode($requestLetter->progress_stages, true);
                            if (is_array($decoded)) {
                                $progressStages = $decoded;
                            }
                        } elseif (is_array($requestLetter->progress_stages)) {
                            $progressStages = $requestLetter->progress_stages;
                        }
                    }

                    // Get actual stage records for progress_stages
                    if (!empty($progressStages)) {
                        $requestLetter->progress = RequestStages::withTrashed()
                            ->with("request_rejected")
                            ->whereIn('id', $progressStages)
                            ->when(count($progressStages) > 0, function ($query) use ($progressStages) {
                                return $query->orderByRaw("FIELD(id, " . implode(',', $progressStages) . ")");
                            })
                            ->get();
                    } else {
                        $requestLetter->progress = collect();
                    }

                    // Get all unique stage IDs from to_stages (both keys and values)
                    $allToStageIds = array_unique(array_merge(
                        array_keys($toStagesMap),
                        array_filter(array_values($toStagesMap)) // filter out null values
                    ));

                    // Get all unique stage IDs from rejected_stages (both keys and values)  
                    $allRejectedStageIds = array_unique(array_merge(
                        array_keys($rejectedStagesMap),
                        array_filter(array_values($rejectedStagesMap)) // filter out null values
                    ));

                    // Fetch stage records for to_stages
                    $toStageRecords = RequestStages::withTrashed()
                        ->whereIn('id', $allToStageIds)
                        ->get()
                        ->keyBy('id');

                    // Fetch stage records for rejected_stages
                    $rejectedStageRecords = RequestStages::withTrashed()
                        ->whereIn('id', $allRejectedStageIds)
                        ->get()
                        ->keyBy('id');

                    // Build to_stages with actual stage records - BUILD ARRAY FIRST, THEN ASSIGN
                    $toStagesWithRecords = [];
                    foreach ($toStagesMap as $fromStageId => $toStageId) {
                        $toStagesWithRecords[] = [
                            'from_stage_id' => $fromStageId,
                            'to_stage_id' => $toStageId,
                            'from_stage' => $toStageRecords->get($fromStageId),
                            'to_stage' => $toStageId ? $toStageRecords->get($toStageId) : null,
                        ];
                    }
                    $requestLetter->to_stages_with_records = $toStagesWithRecords;

                    // Build rejected_stages with actual stage records - BUILD ARRAY FIRST, THEN ASSIGN
                    $rejectedStagesWithRecords = [];
                    foreach ($rejectedStagesMap as $fromStageId => $rejectedStageId) {
                        $rejectedStagesWithRecords[] = [
                            'from_stage_id' => $fromStageId,
                            'rejected_stage_id' => $rejectedStageId,
                            'from_stage' => $rejectedStageRecords->get($fromStageId),
                            'rejected_stage' => $rejectedStageId ? $rejectedStageRecords->get($rejectedStageId) : null,
                        ];
                    }
                    $requestLetter->rejected_stages_with_records = $rejectedStagesWithRecords;

                    // Store all stage records for easy lookup
                    $requestLetter->all_to_stage_records = $toStageRecords;
                    $requestLetter->all_rejected_stage_records = $rejectedStageRecords;

                    // Store decoded values for later use
                    $requestLetter->decoded_to_stages = $toStagesMap;
                    $requestLetter->decoded_rejected_stages = $rejectedStagesMap;
                    $requestLetter->decoded_progress_stages = $progressStages;
                });

                $resource = $invite->map(function ($item) {
                    return [
                        ...(new RequestLetterResource($item))->toArray(request()),
                        'progress' => $item->progress, // Already includes actual stage records in order

                        // Raw JSON values
                        'raw_to_stages' => $item->to_stages,
                        'raw_rejected_stages' => $item->rejected_stages,
                        'raw_progress_stages' => $item->progress_stages,

                        // Decoded values (arrays/objects)
                        'decoded_to_stages' => $item->decoded_to_stages,
                        'decoded_rejected_stages' => $item->decoded_rejected_stages,
                        'decoded_progress_stages' => $item->decoded_progress_stages,

                        // Stage records with relationships (both key and value data)
                        'to_stages_with_records' => $item->to_stages_with_records,
                        'rejected_stages_with_records' => $item->rejected_stages_with_records,

                        // All stage records for easy lookup
                        'all_to_stage_records' => $item->all_to_stage_records,
                        'all_rejected_stage_records' => $item->all_rejected_stage_records,
                    ];
                });

                return $resource;

            case 'invitation.eksternal':
                $invite = RequestLetter::with(['user', 'stages' => function ($query) {
                    $query->withTrashed();
                }, 'stages.status', 'invite', 'invite.to_division', 'invite.from_division', 'invite.signatory', 'invite.attendees.user', 'invite.attendees.user.official'])->whereHas('invite', function ($q) use ($division) {
                    $q->where('to_division', $division);
                })->get();

                $invite->each(function ($requestLetter) {
                    // Parse to_stages mapping
                    $toStagesMap = [];
                    if (!empty($requestLetter->to_stages)) {
                        $toStagesMap = json_decode($requestLetter->to_stages, true) ?? [];
                    }
                    $rejectedStagesMap = [];
                    if (!empty($requestLetter->rejected_stages)) {
                        $rejectedStagesMap = json_decode($requestLetter->rejected_stages, true) ?? [];
                    }

                    // Handle progress_stages as before
                    $progressStages = [];
                    if (isset($requestLetter->progress_stages)) {
                        if (is_string($requestLetter->progress_stages)) {
                            $decoded = json_decode($requestLetter->progress_stages, true);
                            if (is_array($decoded)) {
                                $progressStages = $decoded;
                            }
                        } elseif (is_array($requestLetter->progress_stages)) {
                            $progressStages = $requestLetter->progress_stages;
                        }
                    }

                    // Get actual stage records for progress_stages
                    if (!empty($progressStages)) {
                        $requestLetter->progress = RequestStages::withTrashed()
                            ->with("request_rejected")
                            ->whereIn('id', $progressStages)
                            ->when(count($progressStages) > 0, function ($query) use ($progressStages) {
                                return $query->orderByRaw("FIELD(id, " . implode(',', $progressStages) . ")");
                            })
                            ->get();
                    } else {
                        $requestLetter->progress = collect();
                    }

                    // Get all unique stage IDs from to_stages (both keys and values)
                    $allToStageIds = array_unique(array_merge(
                        array_keys($toStagesMap),
                        array_filter(array_values($toStagesMap)) // filter out null values
                    ));

                    // Get all unique stage IDs from rejected_stages (both keys and values)  
                    $allRejectedStageIds = array_unique(array_merge(
                        array_keys($rejectedStagesMap),
                        array_filter(array_values($rejectedStagesMap)) // filter out null values
                    ));

                    // Fetch stage records for to_stages
                    $toStageRecords = RequestStages::withTrashed()
                        ->whereIn('id', $allToStageIds)
                        ->get()
                        ->keyBy('id');

                    // Fetch stage records for rejected_stages
                    $rejectedStageRecords = RequestStages::withTrashed()
                        ->whereIn('id', $allRejectedStageIds)
                        ->get()
                        ->keyBy('id');

                    // Build to_stages with actual stage records - BUILD ARRAY FIRST, THEN ASSIGN
                    $toStagesWithRecords = [];
                    foreach ($toStagesMap as $fromStageId => $toStageId) {
                        $toStagesWithRecords[] = [
                            'from_stage_id' => $fromStageId,
                            'to_stage_id' => $toStageId,
                            'from_stage' => $toStageRecords->get($fromStageId),
                            'to_stage' => $toStageId ? $toStageRecords->get($toStageId) : null,
                        ];
                    }
                    $requestLetter->to_stages_with_records = $toStagesWithRecords;

                    // Build rejected_stages with actual stage records - BUILD ARRAY FIRST, THEN ASSIGN
                    $rejectedStagesWithRecords = [];
                    foreach ($rejectedStagesMap as $fromStageId => $rejectedStageId) {
                        $rejectedStagesWithRecords[] = [
                            'from_stage_id' => $fromStageId,
                            'rejected_stage_id' => $rejectedStageId,
                            'from_stage' => $rejectedStageRecords->get($fromStageId),
                            'rejected_stage' => $rejectedStageId ? $rejectedStageRecords->get($rejectedStageId) : null,
                        ];
                    }
                    $requestLetter->rejected_stages_with_records = $rejectedStagesWithRecords;

                    // Store all stage records for easy lookup
                    $requestLetter->all_to_stage_records = $toStageRecords;
                    $requestLetter->all_rejected_stage_records = $rejectedStageRecords;

                    // Store decoded values for later use
                    $requestLetter->decoded_to_stages = $toStagesMap;
                    $requestLetter->decoded_rejected_stages = $rejectedStagesMap;
                    $requestLetter->decoded_progress_stages = $progressStages;
                });

                $resource = $invite->map(function ($item) {
                    return [
                        ...(new RequestLetterResource($item))->toArray(request()),
                        'progress' => $item->progress, // Already includes actual stage records in order

                        // Raw JSON values
                        'raw_to_stages' => $item->to_stages,
                        'raw_rejected_stages' => $item->rejected_stages,
                        'raw_progress_stages' => $item->progress_stages,

                        // Decoded values (arrays/objects)
                        'decoded_to_stages' => $item->decoded_to_stages,
                        'decoded_rejected_stages' => $item->decoded_rejected_stages,
                        'decoded_progress_stages' => $item->decoded_progress_stages,

                        // Stage records with relationships (both key and value data)
                        'to_stages_with_records' => $item->to_stages_with_records,
                        'rejected_stages_with_records' => $item->rejected_stages_with_records,

                        // All stage records for easy lookup
                        'all_to_stage_records' => $item->all_to_stage_records,
                        'all_rejected_stage_records' => $item->all_rejected_stage_records,
                    ];
                });


                return $resource;

            default:
                return response()->json(['error' => 'Invalid letter type'], 400);
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


        $invite = InvitationLetter::create([
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


        $stages = RequestStages::where('letter_id', $invite->letter_id)->get();
        $nextStageMap = $this->buildConnectedStageMap($stages, 'to_stage_id');
        $rejectedStageMap = $this->buildConnectedStageMap($stages, 'rejected_id');
        $progressStageMap = $this->extract_progress_stage($nextStageMap);

        $request_letter = RequestLetter::create([
            "request_name" => $request->request_name,
            "user_id" => $user->id,
            // "status_id" => $stages->letter->request_stages[0]->status_id,
            "stages_id" => $stages->where('sequence', 1)->first()->id,
            "letter_type_id" => $invite->letter_id,
            "invitation_id" => $invite->id,
            "to_stages" => json_encode($nextStageMap),
            "rejected_stages" => json_encode($rejectedStageMap),
            "progress_stages" => json_encode($progressStageMap),
        ]);

        $toDivision = Division::where('id', $invite->to_division)->first();
        $toDivisionName = $toDivision->division_code;
        Notification::create([
            'user_id' => $manager->id,
            'title' => 'Persetujuan Dibutuhkan !',
            'message' => "Pegawai meminta persetujuan baru untuk undangan rapat " . $request->perihal . " yang akan dikirimkan ke divisi " . $toDivisionName,
            'related_request_id' => $request->id,
        ]);
    }
    public function extract_progress_stage($to_stages)
    {
        $result = [];
        if (empty($to_stages)) {
            return $result;
        }

        // Find the starting stage (the one that is not referenced by any other stage)
        $referencedStages = array_values($to_stages);
        $startingStage = null;

        foreach (array_keys($to_stages) as $stageId) {
            if (!in_array($stageId, $referencedStages)) {
                $startingStage = $stageId;
                break;
            }
        }

        // If no starting stage found, fall back to the first key
        if ($startingStage === null) {
            $startingStage = array_key_first($to_stages);
        }

        $visited = [];
        $currentKey = (string) $startingStage;

        while ($currentKey !== null && isset($to_stages[$currentKey]) && !in_array($currentKey, $visited)) {
            $visited[] = $currentKey;
            $result[] = (int) $currentKey;
            $currentKey = (string) $to_stages[$currentKey];
        }

        if ($currentKey !== null && !in_array((int) $currentKey, $result)) {
            $result[] = (int) $currentKey;
        }

        error_log('Invitation progress stages order: ' . json_encode($result));
        return $result;
    }

    private function buildConnectedStageMap($stages, $fieldName)
    {
        // Sort stages by sequence first to ensure proper order
        $sortedStages = $stages->sortBy('sequence');
        $fullMap = $sortedStages->pluck($fieldName, 'id')->toArray();

        if (empty($fullMap)) {
            return [];
        }

        $connectedMap = [];
        $processedStages = [];

        // Process stages in sequence order
        foreach ($sortedStages as $stage) {
            $stageId = $stage->id;
            $nextStageId = $fullMap[$stageId];

            if (in_array($stageId, $processedStages) || $nextStageId === null) {
                continue;
            }

            $currentStageId = $stageId;

            while (
                $currentStageId !== null &&
                array_key_exists($currentStageId, $fullMap) &&
                !in_array($currentStageId, $processedStages)
            ) {
                $nextStageId = $fullMap[$currentStageId];
                $processedStages[] = $currentStageId;

                if ($nextStageId !== null) {
                    $connectedMap[$currentStageId] = $nextStageId;
                    $currentStageId = $nextStageId;
                } else {
                    break;
                }
            }
        }

        return $connectedMap;
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

        $companyCode = Setting::get('company_code', 'REKA');
        $invitationNumber = sprintf(
            "%02d.%02d/%s%s/GEN/%s/%s/%s",
            $newYearlyCounter,
            $newMonthlyCounter,
            $companyCode,
            $official->official_code,
            $user->division->division_code,
            $this->convertToRoman($currentMonth),
            $currentYear
        );

        // $invitationNumber = sprintf(
        //     "%02d.%02d/REKA%s/GEN/%s/%s/%s",
        //     $newYearlyCounter,
        //     $newMonthlyCounter,
        //     $official->official_code,
        //     $user->division->division_code,
        //     $this->convertToRoman($currentMonth),
        //     $currentYear
        // );
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
    private function sendInvitationNotifications(
        $request,
        $nextStageName,
        $isNextStageExternal,
        $internalUsers,
        $internalManagers,
        $externalUsers,
        $externalManagers,
        $isRejected = false,
        $rejectionReason = null
    ) {
        // dd($request);
        // $this->info($request.print_r());i
        // $this->info('My variable: ' . print_r($request, true));
        $output = new \Symfony\Component\Console\Output\ConsoleOutput();
        $isRejected = $request->stages->status_id == 4;
        $invitationNumber = $request->invite->invitation_number;
        $currentStage = RequestStages::find($request->stages_id);
        $output->writeln($currentStage);

        $output->writeln("----------------------");
        // dd("mamamia");
        // dd($currentStage);

        // Get notification settings from the current stage
        $notifyInternalManager = $currentStage->notify_internal_manager ?? false;
        $notifyInternalUser = $currentStage->notify_internal_user ?? false;
        $notifyInternal = $currentStage->notify_internal ?? false;
        $notifyExternal = $currentStage->notify_external ?? false;
        $notifyExternalManager = $currentStage->notify_external_manager ?? false;
        $notifyExternalUser = $currentStage->notify_external_user ?? false;
        $notifyCreator = $currentStage->notify_creator ?? false;

        // Determine message content based on status (approved/rejected)
        $statusMessage = $isRejected
            ? "Undangan Rapat'{$invitationNumber}' telah ditolak, periksa kembali alasan penolakan !"
            : "Undangan Rapat'{$invitationNumber}' telah disetujui dan masuk ke tahap {$nextStageName}";

        // Internal user notifications
        $output->writeln($internalUsers);
        if ($notifyInternalUser) {
            foreach ($internalUsers as $user) {
                SendMemoNotification::dispatch(
                    $user->id,
                    $isRejected ? 'Undangan Rapat Ditolak!' : 'Undangan Rapat Disetujui!',
                    $statusMessage,
                    $request->id
                );
            }
        }

        // Internal manager notifications
        if ($notifyInternalManager) {
            foreach ($internalManagers as $manager) {
                SendMemoNotification::dispatch(
                    $manager->id,
                    $isRejected ? 'Undangan Rapat Ditolak!' : 'Undangan Rapat Perlu Persetujuan!',
                    $statusMessage,
                    $request->id
                );
            }
        }

        // General internal notifications (sends to both users and managers)
        if ($notifyInternal) {
            foreach ($internalUsers as $user) {
                SendMemoNotification::dispatch(
                    $user->id,
                    $isRejected ? 'Undangan Rapat Ditolak!' : 'Undangan Rapat Disetujui!',
                    $statusMessage,
                    $request->id
                );
            }

            foreach ($internalManagers as $manager) {
                SendMemoNotification::dispatch(
                    $manager->id,
                    $isRejected ? 'Undangan Rapat Ditolak!' : 'Undangan Rapat Perlu Persetujuan!',
                    $statusMessage,
                    $request->id
                );
            }
        }

        // External user notifications
        if ($notifyExternalUser) {
            foreach ($externalUsers as $user) {
                SendMemoNotification::dispatch(
                    $user->id,
                    $isRejected ? 'Undangan Rapat Ditolak!' : 'Undangan RapatDisetujui!',
                    $statusMessage,
                    $request->id
                );
            }
        }

        // External manager notifications
        if ($notifyExternalManager) {
            foreach ($externalManagers as $manager) {
                SendMemoNotification::dispatch(
                    $manager->id,
                    $isRejected ? 'Undangan Rapat Ditolak!' : 'Undangan RapatPerlu Persetujuan!',
                    $statusMessage,
                    $request->id
                );
            }
        }

        // General external notifications (sends to both users and managers)
        if ($notifyExternal) {
            foreach ($externalUsers as $user) {
                SendMemoNotification::dispatch(
                    $user->id,
                    $isRejected ? 'Undangan Rapat Ditolak!' : 'Undangan Rapat Baru Diterima!',
                    $statusMessage,
                    $request->id
                );
            }

            foreach ($externalManagers as $manager) {
                SendMemoNotification::dispatch(
                    $manager->id,
                    $isRejected ? 'Undangan Rapat Ditolak!' : 'Undangan Rapat Perlu Persetujuan!',
                    $statusMessage,
                    $request->id
                );
            }
        }

        // Notify creator specifically if needed
        if ($notifyCreator) {
            // Find the creator (user who created the memo)
            $creator = User::find($request->user_id);
            if ($creator) {
                SendMemoNotification::dispatch(
                    $creator->id,
                    $isRejected ? 'Undangan Rapat Ditolak!' : 'Status Undangan Rapat Diperbarui!',
                    $statusMessage,
                    $request->id
                );
            }
        }
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
        // foreach ($invitedUser as $user) {
        //     SendMemoNotification::dispatch(
        //         $user->user_id,
        //         'Undangan Rapat',
        //         "Anda telah diundang ke undangan rapat dengan nomor '{$request->invite->invitation_number}' . Periksa undangan tersebut.",
        //         $request->id
        //     );
        // }
        // Get user groups who need notifications

        $internalUsers = User::where('division_id', $request->invite->from_division)
            ->where('role_id', '!=', 1) // Non-managers
            ->get();
        // dd($internalUsers);

        $internalManagers = User::where('division_id', $request->invite->from_division)
            ->where('role_id', 1) // Managers
            ->get();

        $externalUsers = User::where('division_id', $request->invite->to_division)
            ->where('role_id', '!=', 1) // Non-managers
            ->get();

        $externalManagers = User::where('division_id', $request->invite->to_division)
            ->where('role_id', 1) // Managers
            ->get();
        $nextStage = RequestStages::withTrashed()->find($nextStageId);
        $isNextStageExternal = $nextStage ? $nextStage->is_external : false;
        $this->sendInvitationNotifications(
            $request,
            $nextStage->stage_name,
            $isNextStageExternal,
            $internalUsers,
            $internalManagers,
            $externalUsers,
            $externalManagers
        );
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
        $internalUsers = User::where('division_id', $request_letter->invite->from_division)
            ->where('role_id', '!=', 1) // Non-managers
            ->get();

        $internalManagers = User::where('division_id', $request_letter->invite->from_division)
            ->where('role_id', 1) // Managers
            ->get();

        $externalUsers = User::where('division_id', $request_letter->invite->to_division)
            ->where('role_id', '!=', 1) // Non-managers
            ->get();

        $externalManagers = User::where('division_id', $request_letter->invite->to_division)
            ->where('role_id', 1) // Managers
            ->get();
        $nextStage = RequestStages::withTrashed()->find($nextStageId);
        $isNextStageExternal = $nextStage ? $nextStage->is_external : false;
        $this->sendInvitationNotifications(
            $request_letter,
            $nextStage->stage_name,
            $isNextStageExternal,
            $internalUsers,
            $internalManagers,
            $externalUsers,
            $externalManagers
        );
    }
}
