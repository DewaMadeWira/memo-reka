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
use App\Models\Setting;
use App\Models\User;
use Illuminate\Container\Attributes\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log as FacadesLog;

class MemoService
{
    protected $authService;
    //
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }
    public function index($intent)
    {
        $division = $this->authService->userDivision();

        switch ($intent) {
            case '':
                $memo = RequestLetter::with(['user', 'stages' => function ($query) {
                    $query->withTrashed();
                }, 'stages.status', 'memo', 'memo.to_division', 'memo.from_division', 'memo.signatory', 'memo.previous_memo', 'memo.images'])->whereHas('memo', function ($q) use ($division) {
                    $q->where('from_division', $division)
                        ->orWhere('to_division', $division);
                })->get();

                // $memo->each(function ($requestLetter) {
                //     // Parse to_stages mapping
                //     $toStagesMap = [];
                //     if (!empty($requestLetter->to_stages)) {
                //         $toStagesMap = json_decode($requestLetter->to_stages, true) ?? [];
                //     }
                //     $rejectedStagesMap = [];
                //     if (!empty($requestLetter->rejected_stages)) {
                //         $rejectedStagesMap = json_decode($requestLetter->rejected_stages, true) ?? [];
                //     }

                //     // Handle progress_stages as before
                //     $progressStages = [];
                //     if (isset($requestLetter->progress_stages)) {
                //         if (is_string($requestLetter->progress_stages)) {
                //             $decoded = json_decode($requestLetter->progress_stages, true);
                //             if (is_array($decoded)) {
                //                 $progressStages = $decoded;
                //             }
                //         } elseif (is_array($requestLetter->progress_stages)) {
                //             $progressStages = $requestLetter->progress_stages;
                //         }
                //     }

                //     // Get actual stage records for progress_stages
                //     if (!empty($progressStages)) {
                //         $requestLetter->progress = RequestStages::withTrashed()
                //             ->with("request_rejected")
                //             ->whereIn('id', $progressStages)
                //             ->when(count($progressStages) > 0, function ($query) use ($progressStages) {
                //                 return $query->orderByRaw("FIELD(id, " . implode(',', $progressStages) . ")");
                //             })
                //             ->get();
                //     } else {
                //         $requestLetter->progress = collect();
                //     }

                //     // Get actual stage records for to_stages (both keys and values)
                //     $toStagesIds = array_unique(array_merge(array_keys($toStagesMap), array_values($toStagesMap)));
                //     $requestLetter->to_stages_records = RequestStages::withTrashed()
                //         ->whereIn('id', $toStagesIds)
                //         ->get()
                //         ->keyBy('id'); // Key by ID for easy lookup

                //     // Get actual stage records for rejected_stages
                //     $rejectedStagesIds = array_keys($rejectedStagesMap);
                //     $requestLetter->rejected_stages_records = RequestStages::withTrashed()
                //         ->whereIn('id', $rejectedStagesIds)
                //         ->get()
                //         ->keyBy('id'); // Key by ID for easy lookup

                //     // Store decoded values for later use
                //     $requestLetter->decoded_to_stages = $toStagesMap;
                //     $requestLetter->decoded_rejected_stages = $rejectedStagesMap;
                //     $requestLetter->decoded_progress_stages = $progressStages;
                // });
                $memo->each(function ($requestLetter) {
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

                $resource = $memo->map(function ($item) {
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


                // return RequestLetterResource::collection($memo);
                // $resource = RequestLetterResource::collection($memo);
                // return $resource->resolve();
                // $resource = $memo->map(function ($item) {
                //     return [
                //         ...(new RequestLetterResource($item))->toArray(request()),
                //         'progress' => $item->progress, // manually add progress here
                //     ];
                // });
                // $resource = $memo->map(function ($item) {
                //     return [
                //         ...(new RequestLetterResource($item))->toArray(request()),
                //         'progress' => $item->progress, // manually add progress here
                //         'raw_to_stages' => $item->to_stages, // raw JSON value
                //         'raw_rejected_stages' => $item->rejected_stages, // raw JSON value
                //         'raw_progress_stages' => $item->progress_stages, // raw JSON value
                //     ];
                // });
                // $resource = $memo->map(function ($item) {
                //     return [
                //         ...(new RequestLetterResource($item))->toArray(request()),
                //         'progress' => $item->progress, // Already includes actual stage records

                //         // Raw JSON values
                //         'raw_to_stages' => $item->to_stages,
                //         'raw_rejected_stages' => $item->rejected_stages,
                //         'raw_progress_stages' => $item->progress_stages,

                //         // Decoded values (arrays)
                //         'decoded_to_stages' => $item->decoded_to_stages,
                //         'decoded_rejected_stages' => $item->decoded_rejected_stages,
                //         'decoded_progress_stages' => $item->decoded_progress_stages,

                //         // Actual stage records
                //         'to_stages_records' => $item->to_stages_records,
                //         'rejected_stages_records' => $item->rejected_stages_records,
                //     ];
                // });




                // return $resource;
                // return $memo;
            case 'memo.internal':
                $memo = RequestLetter::with(['user', 'stages' => function ($query) {
                    $query->withTrashed();
                }, 'stages.status', 'memo', 'memo.to_division', 'memo.from_division', 'memo.signatory', 'memo.previous_memo', 'memo.images'])->whereHas('memo', function ($q) use ($division) {
                    $q->where('from_division', $division);
                })->get();

                $memo->each(function ($requestLetter) {
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

                $resource = $memo->map(function ($item) {
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


                return $resource;

            case 'memo.eksternal':
                $memo = RequestLetter::with(['user', 'stages' => function ($query) {
                    $query->withTrashed();
                }, 'stages.status', 'memo', 'memo.to_division', 'memo.from_division', 'memo.signatory', 'memo.previous_memo', 'memo.images'])->whereHas('memo', function ($q) use ($division) {
                    $q->where('to_division', $division);
                })->get();

                $memo->each(function ($requestLetter) {
                    // Parse to_stages mapping
                    $toStagesMap = [];
                    if (!empty($requestLetter->to_stages)) {
                        $toStagesMap = json_decode($requestLetter->to_stages, true) ?? [];
                    }
                    $rejectedStagesMap = [];
                    if (!empty($requestLetter->rejected_stages)) {
                        $rejectedStagesMap = json_decode($requestLetter->rejected_stages, true) ?? [];
                    }

                    // Override the to_stage_id using the mapping
                    if ($requestLetter->stages && isset($toStagesMap[$requestLetter->stages->id])) {
                        $requestLetter->stages->to_stage_id = $toStagesMap[$requestLetter->stages->id];
                    }

                    // Handle progress_stages with proper ordering
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
                });

                $resource = $memo->map(function ($item) {
                    return [
                        ...(new RequestLetterResource($item))->toArray(request()),
                        'progress' => $item->progress, // manually add progress here
                    ];
                });

                return $resource;

            default:
                return response()->json(['error' => 'Invalid letter type'], 400);
        }
    }


    public function create($request)
    {
        if (Gate::allows('admin')) {
            abort(403);
        }

        $user = Auth::user();
        $user = User::with('role')->with('division')->where("id", $user->id)->first();
        $official = Official::where("id", $request->official)->first();
        $manager = User::with('role', 'division')->where("division_id", $user->division_id)->whereHas("role", function ($q) {
            $q->where('role_name', "admin");
        })->first();

        $memo = MemoLetter::create([
            'perihal' => $request->perihal,
            'content' => $request->content,
            'signatory' => $manager->id,
            'official_id' => $request->official,
            'letter_id' => 1,
            'from_division' => $user->division->id,
            'to_division' => $request->to_division,
            'previous_memo' => $request->previous_memo,
        ]);
        $generatedMemoData = $this->generateNomorSuratDivision($user, $official);
        $letter_number = LetterNumberCounter::where('division_id', $user->division->id)->where('letter_type_id', 1)->first();
        $letter_number->update([
            "monthly_counter" => $generatedMemoData["monthly_counter"],
            "yearly_counter" => $generatedMemoData["yearly_counter"],
        ]);
        $memo->update([
            "memo_number" => $generatedMemoData["memo_number"],
        ]);
        $stages = RequestStages::where('letter_id', $memo->letter_id)->get();
        $nextStageMap = $this->buildConnectedStageMap($stages, 'to_stage_id');
        $rejectedStageMap = $this->buildConnectedStageMap($stages, 'rejected_id');
        $progressStageMap = $this->extract_progress_stage($nextStageMap);


        $requestLetter = RequestLetter::create([
            "request_name" => $request->request_name,
            "user_id" => $user->id,
            "stages_id" => $stages->where('sequence', 1)->first()->id,
            "letter_type_id" => $memo->letter_id,
            "memo_id" => $memo->id,
            "to_stages" => json_encode($nextStageMap),
            "rejected_stages" => json_encode($rejectedStageMap),
            "progress_stages" => json_encode($progressStageMap),
        ]);
        $toDivision = Division::where('id', $request->to_division)->first();
        $toDivisionName = $toDivision->division_code;
        Notification::create([
            'user_id' => $manager->id,
            'title' => 'Persetujuan Dibutuhkan !',
            'message' => "Pegawai meminta persetujuan baru untuk memo " . $request->perihal . " yang akan dikirimkan ke divisi " . $toDivisionName,
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
        $companyCode = Setting::get('company_code', 'REKA');
        $memoNumber = sprintf(
            "%02d.%02d/%s%s/GEN/%s/%s/%s",
            $newYearlyCounter,
            $newMonthlyCounter,
            $companyCode,
            $official->official_code,
            $user->division->division_code,
            $this->convertToRoman($currentMonth),
            $currentYear
        );
        // $memoNumber = sprintf(
        //     "%02d.%02d/REKA%s/GEN/%s/%s/%s",
        //     $newYearlyCounter,
        //     $newMonthlyCounter,
        //     $official->official_code,
        //     $user->division->division_code,
        //     $this->convertToRoman($currentMonth),
        //     $currentYear
        // );
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

    private function sendMemoNotifications(
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
        $isRejected = $request->stages->status_id == 4;
        $memoNumber = $request->memo->memo_number;
        $currentStage = RequestStages::find($request->stages_id);
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
            ? "Memo '{$memoNumber}' telah ditolak, periksa kembali alasan penolakan !"
            : "Memo '{$memoNumber}' telah disetujui dan masuk ke tahap {$nextStageName}";

        // Internal user notifications
        if ($notifyInternalUser) {
            foreach ($internalUsers as $user) {
                SendMemoNotification::dispatch(
                    $user->id,
                    $isRejected ? 'Memo Ditolak!' : 'Memo Disetujui!',
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
                    $isRejected ? 'Memo Ditolak!' : 'Memo Perlu Persetujuan!',
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
                    $isRejected ? 'Memo Ditolak!' : 'Memo Disetujui!',
                    $statusMessage,
                    $request->id
                );
            }

            foreach ($internalManagers as $manager) {
                SendMemoNotification::dispatch(
                    $manager->id,
                    $isRejected ? 'Memo Ditolak!' : 'Memo Perlu Persetujuan!',
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
                    $isRejected ? 'Memo Ditolak!' : 'Memo Disetujui!',
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
                    $isRejected ? 'Memo Ditolak!' : 'Memo Perlu Persetujuan!',
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
                    $isRejected ? 'Memo Ditolak!' : 'Memo Baru Diterima!',
                    $statusMessage,
                    $request->id
                );
            }

            foreach ($externalManagers as $manager) {
                SendMemoNotification::dispatch(
                    $manager->id,
                    $isRejected ? 'Memo Ditolak!' : 'Memo Perlu Persetujuan!',
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
                    $isRejected ? 'Memo Ditolak!' : 'Status Memo Diperbarui!',
                    $statusMessage,
                    $request->id
                );
            }
        }

        // Handle internal workflow notifications
        // if (!$isNextStageExternal) {
        //     if ($request->stages->status_id == 4) {
        //         // 2. Negative Internal Flow - rejection notification
        //         dd("negative internal", $internalUsers);
        //         // foreach ($internalUsers as $user) {
        //         //     SendMemoNotification::dispatch(
        //         //         $user->id,
        //         //         'Memo Ditolak!',
        //         //         "Memo '{$memoNumber}' telah ditolak dengan alasan: {$rejectionReason}. Silakan perbaiki dan kirim kembali.",
        //         //         $request->id
        //         //     );
        //         // }
        //     } else {
        //         // 1. Full Positive Internal Flow - memo approved notification
        //         dd("full positive internal", $internalUsers, $internalManagers);
        //         foreach ($internalUsers as $user) {
        //             SendMemoNotification::dispatch(
        //                 $user->id,
        //                 'Memo Disetujui!',
        //                 "Memo '{$memoNumber}' telah disetujui dan masuk ke tahap {$nextStageName}.",
        //                 $request->id
        //             );
        //         }

        //         // 1 & 2. Both internal flows - notify managers about new memo
        //         foreach ($internalManagers as $manager) {
        //             SendMemoNotification::dispatch(
        //                 $manager->id,
        //                 'Memo Perlu Persetujuan!',
        //                 "Memo '{$memoNumber}' memerlukan persetujuan Anda. Silakan periksa.",
        //                 $request->id
        //             );
        //         }
        //     }

        //     // Don't notify external users during internal stages
        //     return;
        // }

        // // Handle external workflow notifications
        // if ($request->stages->status_id == 4) {

        //     // 5. Half Negative External - notify external users about rejected work
        //     dd("half negative external - notify external user and ",  $externalUsers);
        //     foreach ($externalUsers as $user) {
        //         SendMemoNotification::dispatch(
        //             $user->id,
        //             'Hasil Kerja Memo Ditolak!',
        //             "Hasil kerja untuk memo '{$memoNumber}' ditolak dengan alasan: {$rejectionReason}. Silakan perbaiki.",
        //             $request->id
        //         );
        //     }
        // } else if ($request->stages->status_id == 6) {
        //     // 4. Full Negative External - notify internal users and managers about rejection
        //     dd("full negative external - notify internal user and manager", $internalUsers, $internalManagers);
        //     foreach ($internalUsers as $user) {
        //         SendMemoNotification::dispatch(
        //             $user->id,
        //             'Memo Ditolak!',
        //             "Memo '{$memoNumber}' telah ditolak oleh divisi tujuan. {$rejectionReason}",
        //             $request->id
        //         );
        //     }

        //     foreach ($internalManagers as $manager) {
        //         SendMemoNotification::dispatch(
        //             $manager->id,
        //             'Memo Ditolak!',
        //             "Memo '{$memoNumber}' telah ditolak oleh divisi tujuan. {$rejectionReason}",
        //             $request->id
        //         );
        //     }
        // } else {
        //     // 3. Full Positive External & 5. Half Negative External - work notification
        //     // Determine if memo is being worked on or completed based on stage
        //     $isBeingWorkedOn = $request->stages->id == 4; // ID for "Memo Eksternal Dikerjakan"
        //     $isComplete = $request->stages->id == 6; // ID for "Memo Eksternal Selesai"

        //     // Notify internal stakeholders
        //     foreach ($internalUsers as $user) {
        //         if ($isBeingWorkedOn) {
        //             SendMemoNotification::dispatch(
        //                 $user->id,
        //                 'Memo Sedang Dikerjakan!',
        //                 "Memo '{$memoNumber}' sedang dikerjakan oleh divisi tujuan.",
        //                 $request->id
        //             );
        //         } elseif ($isComplete) {
        //             SendMemoNotification::dispatch(
        //                 $user->id,
        //                 'Memo Selesai Dikerjakan!',
        //                 "Memo '{$memoNumber}' telah selesai dikerjakan oleh divisi tujuan.",
        //                 $request->id
        //             );
        //         } else {
        //             SendMemoNotification::dispatch(
        //                 $user->id,
        //                 'Memo Berhasil Dikirim!',
        //                 "Memo '{$memoNumber}' telah berhasil dikirim ke divisi tujuan.",
        //                 $request->id
        //             );
        //         }
        //     }

        //     foreach ($internalManagers as $manager) {
        //         if ($isBeingWorkedOn) {
        //             SendMemoNotification::dispatch(
        //                 $manager->id,
        //                 'Memo Sedang Dikerjakan!',
        //                 "Memo '{$memoNumber}' sedang dikerjakan oleh divisi tujuan.",
        //                 $request->id
        //             );
        //         } elseif ($isComplete) {
        //             SendMemoNotification::dispatch(
        //                 $manager->id,
        //                 'Memo Selesai Dikerjakan!',
        //                 "Memo '{$memoNumber}' telah selesai dikerjakan oleh divisi tujuan.",
        //                 $request->id
        //             );
        //         } else {
        //             SendMemoNotification::dispatch(
        //                 $manager->id,
        //                 'Memo Berhasil Dikirim!',
        //                 "Memo '{$memoNumber}' telah berhasil dikirim ke divisi tujuan.",
        //                 $request->id
        //             );
        //         }
        //     }

        //     // Notify external users
        //     foreach ($externalUsers as $user) {
        //         if ($request->stages->id == 3) { // "Memo Internal Disetujui" - memo accepted by manager
        //             SendMemoNotification::dispatch(
        //                 $user->id,
        //                 'Memo Baru Diterima!',
        //                 "Memo '{$memoNumber}' telah diterima oleh divisi Anda dan memerlukan perhatian.",
        //                 $request->id
        //             );
        //         } elseif ($request->stages->id == 15) { // "Menunggu Persetujuan Manajer Eksternal" - work completed by user
        //             SendMemoNotification::dispatch(
        //                 $user->id,
        //                 'Memo Menunggu Persetujuan!',
        //                 "Hasil kerja untuk memo '{$memoNumber}' telah diselesaikan dan menunggu persetujuan manajer.",
        //                 $request->id
        //             );
        //         }
        //     }

        //     // Notify external managers
        //     foreach ($externalManagers as $manager) {
        //         if ($request->stages->id == 3) { // "Memo Internal Disetujui" - new memo received
        //             SendMemoNotification::dispatch(
        //                 $manager->id,
        //                 'Memo Perlu Persetujuan!',
        //                 "Memo '{$memoNumber}' telah dikirim ke divisi Anda dan memerlukan persetujuan.",
        //                 $request->id
        //             );
        //         } elseif ($request->stages->id == 15) { // "Menunggu Persetujuan Manajer Eksternal" - work completed by user
        //             SendMemoNotification::dispatch(
        //                 $manager->id,
        //                 'Memo Perlu Persetujuan!',
        //                 "Hasil kerja untuk memo '{$memoNumber}' telah diselesaikan dan memerlukan persetujuan Anda.",
        //                 $request->id
        //             );
        //         } elseif ($request->stages->id == 4) { // "Memo Eksternal Dikerjakan" - after repair
        //             SendMemoNotification::dispatch(
        //                 $manager->id,
        //                 'Memo Telah Diperbaiki!',
        //                 "Memo '{$memoNumber}' telah diperbaiki dan siap untuk ditinjau kembali.",
        //                 $request->id
        //             );
        //         }
        //     }
        // }
    }


    public function approve($id)
    {
        $request = RequestLetter::with(['memo', 'user', 'memo.from_division', 'memo.to_division', 'stages'])->where('memo_id', $id)->first();

        $nextStageId = json_decode($request->to_stages, true);
        $nextStageId = $nextStageId[$request->stages_id] ?? null;

        if ($nextStageId == null) {
            return to_route('memo.index');
        }

        MemoLetter::where('id', $id)->update([
            'rejection_reason' => NULL
        ]);

        // Get the next stage information BEFORE updating the request
        $nextStage = RequestStages::withTrashed()->find($nextStageId);
        $isNextStageExternal = $nextStage ? $nextStage->is_external : false;
        $currentStageName = $request->stages->stage_name;
        $nextStageName = $nextStage ? $nextStage->stage_name : 'final stage';

        // Update the request with new stage ID
        $request->update([
            "stages_id" => $nextStageId,
        ]);
        $request->save();
        $request->refresh(); // Refresh the model to get updated relationships

        // Get user groups who need notifications
        $internalUsers = User::where('division_id', $request->memo->from_division)
            ->where('role_id', '!=', 1) // Non-managers
            ->get();

        $internalManagers = User::where('division_id', $request->memo->from_division)
            ->where('role_id', 1) // Managers
            ->get();

        $externalUsers = User::where('division_id', $request->memo->to_division)
            ->where('role_id', '!=', 1) // Non-managers
            ->get();

        $externalManagers = User::where('division_id', $request->memo->to_division)
            ->where('role_id', 1) // Managers
            ->get();


        $this->sendMemoNotifications(
            $request,
            $nextStage->stage_name,
            $isNextStageExternal,
            $internalUsers,
            $internalManagers,
            $externalUsers,
            $externalManagers
        );
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
        $request_letter = RequestLetter::with('memo')->where('memo_id', $id)->first();
        $nextStageId = json_decode($request_letter->rejected_stages, true);
        $nextStageId = $nextStageId[$request_letter->stages_id] ?? null;
        if ($nextStageId == null) {
            return to_route('memo.index');
        }

        // dd($request_letter->memo->id);
        MemoImage::where('memo_letter_id', $request_letter->memo->id)->get()->each(function ($image) {
            $image->delete();
        });

        MemoLetter::where('id', $id)->update([
            'file_path' => NULL,
            'rejection_reason' => 'Memo ditolak oleh ' . Auth::user()->name . ' karena ' . "\n\n" . $request->rejection_reason
        ]);
        $nextStage = RequestStages::find($nextStageId);
        $isNextStageExternal = $nextStage ? $nextStage->is_external : false;

        $request_letter->update([
            "stages_id" => $nextStageId
        ]);
        $request_letter->save();


        // Get the next stage information BEFORE updating the request
        // $currentStageName = $request->stages->stage_name;
        // $nextStageName = $nextStage ? $nextStage->stage_name : 'final stage';
        // dd($request);

        // Get user groups who need notifications
        $internalUsers = User::where('division_id', $request_letter->memo->from_division)
            ->where('role_id', '!=', 1) // Non-managers
            ->get();

        $internalManagers = User::where('division_id', $request_letter->memo->from_division)
            ->where('role_id', 1) // Managers
            ->get();

        $externalUsers = User::where('division_id', $request_letter->memo->to_division)
            ->where('role_id', '!=', 1) // Non-managers
            ->get();

        $externalManagers = User::where('division_id', $request_letter->memo->to_division)
            ->where('role_id', 1) // Managers
            ->get();
        $this->sendMemoNotifications(
            $request_letter,
            $nextStage->stage_name,
            $isNextStageExternal,
            $internalUsers,
            $internalManagers,
            $externalUsers,
            $externalManagers
        );

        // // NOTIFICATION
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
