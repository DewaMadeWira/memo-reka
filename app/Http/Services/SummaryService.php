<?php

namespace App\Http\Services;

use App\Http\Resources\RequestLetterResource;
use App\Jobs\SendMemoNotification;
use App\Models\Division;
use App\Models\LetterNumberCounter;
use App\Models\MemoImage;
use App\Models\MemoLetter;
use App\Models\Notification;
use App\Models\Official;
use App\Models\RequestLetter;
use App\Models\RequestStages;
use App\Models\SummaryLetter;
use App\Models\User;
use Illuminate\Container\Attributes\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File as FacadesFile;

class SummaryService
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
                $summary = RequestLetter::with(['user', 'stages' => function ($query) {
                    $query->withTrashed();
                }, 'stages.status', 'summary', 'summary.invite', 'summary.invite.to_division', 'summary.invite.from_division'])->whereHas('summary.invite', function ($q) use ($division) {
                    $q->where('from_division', $division)
                        ->orWhere('to_division', $division);
                })->get();

                $summary->each(function ($requestLetter) {
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

                $resource = $summary->map(function ($item) {
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

            case 'risalah.internal':
                $summary = RequestLetter::with(['user', 'stages' => function ($query) {
                    $query->withTrashed();
                }, 'stages.status', 'summary', 'summary.invite', 'summary.invite.to_division', 'summary.invite.from_division'])->whereHas('summary.invite', function ($q) use ($division) {
                    $q->where('from_division', $division);
                })->get();

                $summary->each(function ($requestLetter) {
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

                $resource = $summary->map(function ($item) {
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

            case 'risalah.eksternal':
                $summary = RequestLetter::with(['user', 'stages' => function ($query) {
                    $query->withTrashed();
                }, 'stages.status', 'summary', 'summary.invite', 'summary.invite.to_division', 'summary.invite.from_division'])->whereHas('summary.invite', function ($q) use ($division) {
                    $q->where('to_division', $division);
                })->get();

                $summary->each(function ($requestLetter) {
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

                $resource = $summary->map(function ($item) {
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

            case "number":
                $memo = RequestLetter::with(['user', 'stages' => function ($query) {
                    $query->withTrashed();
                }, 'stages.status', 'memo', 'memo.to_division', 'memo.from_division', 'memo.signatory'])->whereHas('memo', function ($q) use ($division) {
                    $q->where('from_division', $division);
                })->latest()->first();

                $year = $memo->created_at->format('Y');
                $month = $memo->created_at->format('m');

                $lastYearlyCounter = 198;
                $lastMonthlyCounter = 27;

                break;

            default:
                return response()->json(['error' => 'Invalid letter type'], 400);
        }
    }


    public function create($request)
    {

        // if (Gate::allows('admin')) {
        //     abort(403);
        // }
        // dd($request);

        // $division = $this->authService->userDivision();
        // $user = $this->authService->index();

        $user = Auth::user();
        $user = User::with('role')->with('division')->where("id", $user->id)->first();
        $manager = User::with('role', 'division')->where("division_id", $user->division_id)->whereHas("role", function ($q) {
            $q->where('role_name', "admin");
        })->first();

        $file = $request->file("file");
        // dd($file);
        $ext = $file->getClientOriginalExtension();
        $filename = rand(100000000, 999999999) . '.' . $ext;
        Storage::disk('local')->put('risalah-rapat/' . $filename, FacadesFile::get($file));

        // dd($this->generateNomorSurat($user, $official)->memo_number);
        $summary = SummaryLetter::create([
            // 'memo_number' => '1234/MemoNumber/Test',
            'invitation_id' => $request->invitation_id,
            'file_path' => $filename,
            'judul_rapat' => $request->judul_rapat,
            'rangkuman_rapat' => $request->rangkuman_rapat,
        ]);
        $summary = SummaryLetter::with('invite')->findOrFail($summary->id);

        // dd($summary);
        $stages = RequestStages::where('letter_id', 3)->get();
        $nextStageMap = $this->buildConnectedStageMap($stages, 'to_stage_id');
        $rejectedStageMap = $this->buildConnectedStageMap($stages, 'rejected_id');
        $progressStageMap = $this->extract_progress_stage($nextStageMap);

        // dd($nextStageMap);
        // dd($progressStageMap);
        // dd($stages);

        $requestLetter = RequestLetter::create([
            "request_name" => $request->request_name,
            "user_id" => $user->id,
            // "status_id" => $stages->letter->request_stages[0]->status_id,
            "stages_id" => $stages->where('sequence', 1)->first()->id,
            "letter_type_id" => 3,
            "summary_id" => $summary->id,
            "to_stages" => json_encode($nextStageMap),
            "rejected_stages" => json_encode($rejectedStageMap),
            "progress_stages" => json_encode($progressStageMap),
        ]);
        // dd($summary);
        // $summaryInvite = SummaryLetter::with('invite')
        $toDivision = Division::where('id', $summary->invite->to_division)->first();
        $toDivisionName = $toDivision->division_code;
        Notification::create([
            'user_id' => $manager->id,
            'title' => 'Persetujuan Dibutuhkan !',
            'message' => "Pegawai meminta persetujuan baru untuk Risalah Rapat " . $request->perihal . " yang akan dikirimkan ke divisi " . $toDivisionName,
            'related_request_id' => $requestLetter->id,
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
        $number = LetterNumberCounter::with(['division'])->where('division_id', $user->division->id)->where('letter_type_id', 1)->first();

        $currentYear = date("Y");
        $currentMonth = date("m");

        if (empty($number)) {
            // $newYearlyCounter = 1;
            // $newMonthlyCounter = 1;
            $number = new LetterNumberCounter();
            $number->division_id = $user->division->id;
            $number->letter_type_id = 1;
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
        $memoNumber = sprintf(
            "%02d.%02d/REKA%s/GEN/%s/%s/%s",
            $newYearlyCounter,
            $newMonthlyCounter,
            $official->official_code,
            $user->division->division_code,
            $this->convertToRoman($currentMonth),
            $currentYear
        );
        return [
            'memo_number' => $memoNumber,
            'yearly_counter' => $newYearlyCounter,
            'monthly_counter' => $newMonthlyCounter
        ];
    }
    public function generateNomorSurat($user, $official)
    {

        // dd($user);

        $memo = RequestLetter::with(['user', 'stages' => function ($query) {
            $query->withTrashed();
        }, 'stages.status', 'memo', 'memo.to_division', 'memo.from_division', 'memo.signatory'])->whereHas('memo', function ($q) use ($user) {
            $q->where('from_division', $user->division->id);
        })->latest()->first();

        // dd($memo);

        $currentYear = date("Y");
        $currentMonth = date("m");

        if (empty($memo)) {
            $newYearlyCounter = 1;
            $newMonthlyCounter = 1;
        } else {

            $lastYear = $memo->created_at->format('Y');
            $lastYearlyCounter = $memo->memo->yearly_counter;
            $lastMonth = $memo->created_at->format('m');
            $lastMonthlyCounter = $memo->memo->monthly_counter;

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

        // $memoNumber = "$newYearlyCounter.$newMonthlyCounter/REKA$official->official_code/GEN/{$user->division->division_code}/{$this->convertToRoman($currentMonth)}/$currentYear";

        $memoNumber = sprintf(
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
            'memo_number' => $memoNumber,
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
        $invitationNumber = $request->summary->invite->invitation_number;
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
            ? "Risalah Rapat'{$invitationNumber}' telah ditolak, periksa kembali alasan penolakan !"
            : "Risalah Rapat'{$invitationNumber}' telah disetujui dan masuk ke tahap {$nextStageName}";

        // Internal user notifications
        $output->writeln($internalUsers);
        if ($notifyInternalUser) {
            foreach ($internalUsers as $user) {
                SendMemoNotification::dispatch(
                    $user->id,
                    $isRejected ? 'Risalah Rapat Ditolak!' : 'Risalah Rapat Disetujui!',
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
                    $isRejected ? 'Risalah Rapat Ditolak!' : 'Risalah Rapat Perlu Persetujuan!',
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
                    $isRejected ? 'Risalah Rapat Ditolak!' : 'Risalah Rapat Disetujui!',
                    $statusMessage,
                    $request->id
                );
            }

            foreach ($internalManagers as $manager) {
                SendMemoNotification::dispatch(
                    $manager->id,
                    $isRejected ? 'Risalah Rapat Ditolak!' : 'Risalah Rapat Perlu Persetujuan!',
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
                    $isRejected ? 'Risalah Rapat Ditolak!' : 'Risalah RapatDisetujui!',
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
                    $isRejected ? 'Risalah Rapat Ditolak!' : 'Risalah RapatPerlu Persetujuan!',
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
                    $isRejected ? 'Risalah Rapat Ditolak!' : 'Risalah Rapat Baru Diterima!',
                    $statusMessage,
                    $request->id
                );
            }

            foreach ($externalManagers as $manager) {
                SendMemoNotification::dispatch(
                    $manager->id,
                    $isRejected ? 'Risalah Rapat Ditolak!' : 'Risalah Rapat Perlu Persetujuan!',
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
                    $isRejected ? 'Risalah Rapat Ditolak!' : 'Status Risalah Rapat Diperbarui!',
                    $statusMessage,
                    $request->id
                );
            }
        }
    }


    public function approve($id)
    {
        // dd("mamamia");
        $request = RequestLetter::with(['summary', 'user', 'stages'])->where('summary_id', $id)->first();


        $nextStageId = json_decode($request->to_stages, true);
        $nextStageId = $nextStageId[$request->stages_id] ?? null;

        if ($nextStageId == null) {
            return to_route('risalah-rapat.index');
        }

        SummaryLetter::where('id', $id)->update([
            'rejection_reason' => NULL
        ]);

        // Get the next stage information BEFORE updating the request
        $nextStage = RequestStages::find($nextStageId);
        $isNextStageExternal = $nextStage ? $nextStage->is_external : false;
        $currentStageName = $request->stages->stage_name;
        $nextStageName = $nextStage ? $nextStage->stage_name : 'final stage';


        // Update the request with new stage ID
        $request->update([
            "stages_id" => $nextStageId,
        ]);
        $request->save();
        $request->refresh(); // Refresh the model to get updated relationships

        $internalUsers = User::where('division_id', $request->summary->from_division)
            ->where('role_id', '!=', 1) // Non-managers
            ->get();
        // dd($internalUsers);

        $internalManagers = User::where('division_id', $request->summary->from_division)
            ->where('role_id', 1) // Managers
            ->get();

        $externalUsers = User::where('division_id', $request->summary->to_division)
            ->where('role_id', '!=', 1) // Non-managers
            ->get();

        $externalManagers = User::where('division_id', $request->summary->to_division)
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
        // Get user groups who need notifications
        // $internalUsers = User::where('division_id', $request->memo->from_division)
        //     ->where('role_id', '!=', 1) // Non-managers
        //     ->get();

        // $internalManagers = User::where('division_id', $request->memo->from_division)
        //     ->where('role_id', 1) // Managers
        //     ->get();

        // $externalUsers = User::where('division_id', $request->memo->to_division)
        //     ->where('role_id', '!=', 1) // Non-managers
        //     ->get();

        // $externalManagers = User::where('division_id', $request->memo->to_division)
        //     ->where('role_id', 1) // Managers
        //     ->get();


        // $this->sendMemoNotifications(
        //     $request,
        //     $nextStage->stage_name,
        //     $isNextStageExternal,
        //     $internalUsers,
        //     $internalManagers,
        //     $externalUsers,
        //     $externalManagers
        // );
    }


    // Determine who to notify based on the NEXT stage (which is now the current stage)
    // if (!$isNextStageExternal) {
    //     // Internal stage - notify internal users
    //     foreach ($internalUsers as $user) {
    //         Notification::create([
    //             'user_id' => $user->id,
    //             'title' => 'Memo Updated!',
    //             'message' => "Memo '{$request->memo->memo_number}' berhasil disetujui dan masuk ke tahap {$nextStageName}.",
    //             'related_request_id' => $request->id,
    //         ]);
    //     }
    //     foreach ($internalManagers as $user) {
    //         Notification::create([
    //             'user_id' => $user->id,
    //             'title' => 'Memo Perlu Persetujuan!',
    //             'message' => "Memo '{$request->memo->memo_number}' berhasil disetujui dan memerlukan persetujuan selanjutnya.",
    //             'related_request_id' => $request->id,
    //         ]);
    //     }
    // } else {
    //     // External stage - notify external users who need to take action
    //     foreach ($externalUsers as $user) {
    //         Notification::create([
    //             'user_id' => $user->id,
    //             'title' => 'Memo Baru Diterima!',
    //             'message' => "Memo '{$request->memo->memo_number}' telah dikirim ke divisi Anda dan memerlukan perhatian.",
    //             'related_request_id' => $request->id,
    //         ]);
    //     }
    //     foreach ($externalManagers as $user) {
    //         Notification::create([
    //             'user_id' => $user->id,
    //             'title' => 'Memo Perlu Persetujuan!',
    //             'message' => "Memo '{$request->memo->memo_number}' telah dikirim ke divisi Anda dan memerlukan persetujuan.",
    //             'related_request_id' => $request->id,
    //         ]);
    //     }

    //     // Also notify internal users so they know the memo has moved to external stage
    //     foreach ($internalUsers as $user) {
    //         Notification::create([
    //             'user_id' => $user->id,
    //             'title' => 'Memo Berhasil Dikirim!',
    //             'message' => "Memo '{$request->memo->memo_number}' telah berhasil dikirim ke divisi tujuan.",
    //             'related_request_id' => $request->id,
    //         ]);
    //     }
    //     foreach ($internalManagers as $user) {
    //         Notification::create([
    //             'user_id' => $user->id,
    //             'title' => 'Memo Berhasil Dikirim!',
    //             'message' => "Memo '{$request->memo->memo_number}' telah berhasil dikirim ke divisi tujuan.",
    //             'related_request_id' => $request->id,
    //         ]);
    //     }
    // }




    // $request = RequestLetter::with(['memo', 'user'])->where('memo_id', $id)->first();
    // $nextStageId = json_decode($request->to_stages, true);
    // // return response()->json($nextStageId);

    // $nextStageId = $nextStageId[$request->stages_id] ?? null;
    // if ($nextStageId == null) {
    //     return to_route('memo.index');
    // }
    // MemoLetter::where('id', $id)->update([
    //     'rejection_reason' => NULL
    // ]);
    // // return response()->json($nextStageId);
    // $request->update([
    //     // "stages_id" => $request->stages->to_stage_id,
    //     "stages_id" => $nextStageId,
    // ]);
    // $request->save();

    // // NOTIFICATION
    // $fromDivisionId = $request->memo->from_division;
    // $toDivisionId = $request->memo->to_division;

    // $fromDivisionUsers = User::where('division_id', $fromDivisionId)->get();
    // $toDivisionUsers = User::where('division_id', $toDivisionId)->get();

    // $allInvolvedUsers = $fromDivisionUsers->merge($toDivisionUsers);

    // $currentStage = RequestStages::find($nextStageId);
    // $stageName = $currentStage ? $currentStage->stage_name : 'next stage';

    // foreach ($allInvolvedUsers as $user) {
    //     Notification::create([
    //         'user_id' => $user->id,
    //         'title' => 'Memo Updated!',
    //         'message' => "Memo '{$request->memo->memo_number}' berhasil disetujui dan masuk ke tahap {$stageName}. silahkan cek memo tersebut.",
    //         'related_request_id' => $request->id,
    //     ]);
    // }
    // }
    public function reject($id, Request $request)
    {
        $request_letter = RequestLetter::with('summary')->where('summary_id', $id)->first();
        $nextStageId = json_decode($request_letter->rejected_stages, true);
        $nextStageId = $nextStageId[$request_letter->stages_id] ?? null;
        if ($nextStageId == null) {
            return to_route('risalah-rapat.index');
        }


        SummaryLetter::where('id', $id)->update([
            'file_path' => NULL,
            'rejection_reason' => 'Memo ditolak oleh ' . Auth::user()->name . ' karena ' . "\n\n" . $request->rejection_reason
        ]);

        $request_letter->update([
            "stages_id" => $nextStageId
        ]);
        $request_letter->save();
        $internalUsers = User::where('division_id', $request_letter->summary->from_division)
            ->where('role_id', '!=', 1) // Non-managers
            ->get();

        $internalManagers = User::where('division_id', $request_letter->summary->from_division)
            ->where('role_id', 1) // Managers
            ->get();

        $externalUsers = User::where('division_id', $request_letter->summary->to_division)
            ->where('role_id', '!=', 1) // Non-managers
            ->get();

        $externalManagers = User::where('division_id', $request_letter->summary->to_division)
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

        // NOTIFICATION
        // $fromDivisionId = $request_letter->memo->from_division;
        // $toDivisionId = $request_letter->memo->to_division;

        // $fromDivisionUsers = User::where('division_id', $fromDivisionId)->get();
        // $toDivisionUsers = User::where('division_id', $toDivisionId)->get();

        // $allInvolvedUsers = $fromDivisionUsers->merge($toDivisionUsers);

        // $currentStage = RequestStages::find($nextStageId);
        // $stageName = $currentStage ? $currentStage->stage_name : 'next stage';

        // $userReject = Auth::user()->name;
        // foreach ($allInvolvedUsers as $user) {
        //     Notification::create([
        //         'user_id' => $user->id,
        //         'title' => 'Memo Updated!',
        //         'message' => "Memo '{$request_letter->memo->memo_number}' telah ditolak oleh '{$userReject}' dan masuk ke tahap {$stageName}. silahkan cek memo tersebut.",
        //         'related_request_id' => $request_letter->id,
        //     ]);
        // }
    }
}
