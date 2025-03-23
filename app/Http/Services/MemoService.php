<?php

namespace App\Http\Services;

use App\Models\MemoLetter;
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

        switch ($intent) {
            case '':
                // $memo = $this->memoService->approve($id);
                // return to_route('memo.index');
                $memo = RequestLetter::with(['user', 'stages' => function ($query) {
                    $query->withTrashed();
                }, 'stages.status', 'memo', 'memo.to_division'])->whereHas('memo', function ($q) use ($division) {
                    $q->where('from_division', $division);
                })->get();

                $memo->each(function ($requestLetter) {
                    $requestLetter->progress = RequestStages::withTrashed()->whereIn('id', $requestLetter->progress_stages ?? [])->get();
                });

                // Request With Progress Stages
                // dd($memo);
                // $requests = RequestLetter::all(); // Fetch all requests
                // $allStageIds = collect($memo->pluck('progress_stages'))
                //     ->filter()
                //     ->flatMap(fn($map) => array_merge(array_keys(json_decode($map, true) ?? []), array_values(json_decode($map, true) ?? [])))
                //     ->unique()
                //     ->toArray(); // Collect all unique stage IDs

                // $stages = RequestStages::whereIn('id', $allStageIds)->get()->keyBy('id'); // Fetch all stages at once


                // $memo->transform(function ($item) use ($stages) {
                //     $stagesMap = json_decode($item->progress_stages, true) ?? []; // Ensure it's an array

                //     $item->progress_stages = collect($stagesMap)->mapWithKeys(function ($to, $from) use ($stages) {
                //         return [
                //             $from => [
                //                 'from' => $stages[$from] ?? null,
                //                 'to' => $stages[$to] ?? null,
                //             ]
                //         ];
                //     });

                //     return $item;
                // });

                // dd($requests);

                return $memo;
            case 'memo.internal':
                $memo = RequestLetter::with('user', 'stages', 'stages.status', 'memo', 'memo.to_division')->whereHas('stages', function ($q) {
                    $q->where('stage_name', "Memo Internal");
                })->whereHas('memo', function ($q) use ($division) {
                    $q->where('from_division', $division);
                })->get();

                return $memo;
            case 'memo.eksternal':
                $memo = RequestLetter::with('user', 'stages', 'stages.status', 'memo', 'memo.to_division')->whereHas('stages', function ($q) {
                    $q->where('stage_name', "Memo Eksternal");
                })->whereHas('memo', function ($q) use ($division) {
                    $q->where('from_division', $division);
                })->get();

                return $memo;
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
        $manager = User::with('role', 'division')->where("division_id", $user->division_id)->whereHas("role", function ($q) {
            $q->where('role_name', "admin");
        })->first();
        $memo = MemoLetter::create([
            'memo_number' => '1234/MemoNumber/Test',
            'perihal' => $request->perihal,
            'content' => $request->content,
            'signatory' => $manager->id,
            'letter_id' => 1,
            'from_division' => $user->division->id,
            'to_division' => $request->to_division,
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
