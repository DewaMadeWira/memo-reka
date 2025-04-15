<?php

namespace App\Http\Services;

use App\Models\MemoLetter;
use App\Models\Official;
use App\Models\RequestLetter;
use App\Models\RequestStages;
use App\Models\User;
use Illuminate\Container\Attributes\Log;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;

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
        // $user = Auth::user();
        // $user = User::with('role')->with('division')->where("id", $user->id)->first();
        // $memo = RequestLetter::with('user')->with('status')->with('stages')->with('memo')->where("from_division", $user[0]->division->id)->first();
        // $memo = RequestLetter::with('user')->with('status')->with('stages')->with('memo')->first();
        // All
        // dd($intent);
        // dd($division);

        switch ($intent) {
            case '':
                // $memo = $this->memoService->approve($id);
                // return to_route('memo.index');
                $memo = RequestLetter::with(['user', 'stages' => function ($query) {
                    $query->withTrashed();
                }, 'stages.status', 'memo', 'memo.to_division', 'memo.from_division', 'memo.signatory'])->whereHas('memo', function ($q) use ($division) {
                    $q->where('from_division', $division)
                        ->orWhere('to_division', $division);;
                })->get();

                $memo->each(function ($requestLetter) {
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
                    $requestLetter->progress = RequestStages::withTrashed()->with("request_rejected")->whereIn('id', $progressStages)->get();
                });


                return $memo;
            case 'memo.internal':
                // $memo = RequestLetter::with('user', 'stages', 'stages.status', 'memo', 'memo.to_division', 'memo.to_division', 'memo.signatory')->whereHas('stages', function ($q) {
                //     $q->where('stage_name', "Memo Internal");
                // })->whereHas('memo', function ($q) use ($division) {
                //     $q->where('from_division', $division);
                // })->get();
                $memo = RequestLetter::with(['user', 'stages' => function ($query) {
                    $query->withTrashed();
                }, 'stages.status', 'memo', 'memo.to_division', 'memo.from_division', 'memo.signatory'])->whereHas('memo', function ($q) use ($division) {
                    $q->where('from_division', $division);
                })->get();

                // dd($memo);


                $memo->each(function ($requestLetter) {
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

                    $requestLetter->progress = RequestStages::withTrashed()->with("request_rejected")->whereIn('id', $progressStages)->get();
                });

                return $memo;
            case 'memo.eksternal':
                $memo = RequestLetter::with(['user', 'stages' => function ($query) {
                    $query->withTrashed();
                }, 'stages.status', 'memo', 'memo.to_division', 'memo.from_division', 'memo.signatory'])->whereHas('memo', function ($q) use ($division) {
                    $q->where('to_division', $division);
                })->get();

                // dd($memo);


                $memo->each(function ($requestLetter) {
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

                    $requestLetter->progress = RequestStages::withTrashed()->with("request_rejected")->whereIn('id', $progressStages)->get();
                });

                return $memo;

            case "number":
                $memo = RequestLetter::with(['user', 'stages' => function ($query) {
                    $query->withTrashed();
                }, 'stages.status', 'memo', 'memo.to_division', 'memo.from_division', 'memo.signatory'])->whereHas('memo', function ($q) use ($division) {
                    $q->where('from_division', $division);
                })->latest()->first();

                // $year = date("Y", strtotime($memo->created_at));

                $year = $memo->created_at->format('Y');
                $month = $memo->created_at->format('m');


                // $lastYear = 2025;
                $lastYearlyCounter = 198;

                // $lastMonth = '04'; // format 2 digit
                $lastMonthlyCounter = 27;

                // $result = $this->generateNomorSurat($year, $lastYearlyCounter, $month, $lastMonthlyCounter);

                // dd($result);
                // return ("number");

            default:
                return response()->json(['error' => 'Invalid letter type'], 400);
        }

        // Memo Internal
        // $memo = RequestLetter::with('user', 'stages', 'stages.status', 'memo', 'memo.to_division')->whereHas('memo', function ($q) use ($division) {
        //     $q->where('from_division', $division);
        // })->get();
        // return $memo;

        // Memo External
        // $memo = RequestLetter::with('user', 'stages', 'stages.status', 'memo', 'memo.to_division')->whereHas('stages', function ($q) {
        //     $q->where('stage_name', "Memo Eksternal");
        // })->whereHas('memo', function ($q) use ($division) {
        //     $q->where('from_division', $division);
        // })->get();

        // return $memo;
    }


    public function create($request)
    {

        if (Gate::allows('admin')) {
            abort(403);
        }

        // $division = $this->authService->userDivision();
        // $user = $this->authService->index();
        $user = Auth::user();
        $user = User::with('role')->with('division')->where("id", $user->id)->first();
        $official = Official::where("id", $request->official)->first();
        $manager = User::with('role', 'division')->where("division_id", $user->division_id)->whereHas("role", function ($q) {
            $q->where('role_name', "admin");
        })->first();

        // dd($this->generateNomorSurat($user, $official)->memo_number);
        $memo = MemoLetter::create([
            // 'memo_number' => '1234/MemoNumber/Test',
            'perihal' => $request->perihal,
            'content' => $request->content,
            'signatory' => $manager->id,
            'official_id' => $request->official,
            'letter_id' => 1,
            'from_division' => $user->division->id,
            'to_division' => $request->to_division,
        ]);
        $generatedMemoData = $this->generateNomorSurat($user, $official);
        $memo->update([
            "memo_number" => $generatedMemoData["memo_number"],
            "monthly_counter" => $generatedMemoData["monthly_counter"],
            "yearly_counter" => $generatedMemoData["yearly_counter"],
        ]);
        $stages = RequestStages::where('letter_id', $memo->letter_id)->get();
        $nextStageMap = $stages->pluck('to_stage_id', 'id')->filter();
        $rejectedStageMap = $stages->pluck('rejected_id', 'id')->filter();
        $progressStageMap = $this->extract_progress_stage($nextStageMap->toArray());

        // dd($nextStageMap);
        // dd($progressStageMap);

        $request = RequestLetter::create([
            "request_name" => $request->request_name,
            "user_id" => $user->id,
            // "status_id" => $stages->letter->request_stages[0]->status_id,
            "stages_id" => $stages->where('sequence', 1)->first()->id,
            "letter_type_id" => $memo->letter_id,
            "memo_id" => $memo->id,
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

        // dd($result);
        return $result;
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

        $memoNumber = "$newYearlyCounter.$newMonthlyCounter/REKA/$official->official_code/GEN/{$user->division->division_code}/{$this->convertToRoman($currentMonth)}/$currentYear";

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
    public function approve($id)
    {
        $request = RequestLetter::with('memo')->where('memo_id', $id)->first();
        $nextStageId = json_decode($request->to_stages, true);
        // return response()->json($nextStageId);

        $nextStageId = $nextStageId[$request->stages_id] ?? null;
        if ($nextStageId == null) {
            return to_route('memo.index');
        }
        // return response()->json($nextStageId);
        $request->update([
            // "stages_id" => $request->stages->to_stage_id,
            "stages_id" => $nextStageId,
        ]);
        $request->save();
    }
    public function reject($id)
    {
        $request = RequestLetter::with('memo')->where('memo_id', $id)->first();
        $nextStageId = json_decode($request->rejected_stages, true);
        $nextStageId = $nextStageId[$request->stages_id] ?? null;
        if ($nextStageId == null) {
            return to_route('memo.index');
        }

        $request->update([
            "stages_id" => $nextStageId
        ]);
        $request->save();
    }
}
