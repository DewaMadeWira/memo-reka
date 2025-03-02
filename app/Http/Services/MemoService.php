<?php

namespace App\Http\Services;

use App\Models\MemoLetter;
use App\Models\RequestLetter;
use App\Models\User;
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
    public function index()
    {
        $division = $this->authService->userDivision();
        // $user = Auth::user();
        // $user = User::with('role')->with('division')->where("id", $user->id)->first();
        // $memo = RequestLetter::with('user')->with('status')->with('stages')->with('memo')->where("from_division", $user[0]->division->id)->first();
        // $memo = RequestLetter::with('user')->with('status')->with('stages')->with('memo')->first();
        $memo = RequestLetter::with('user', 'stages', 'stages.status', 'memo')->whereHas('memo', function ($q) use ($division) {
            $q->where('from_division', $division);
        })->get();
        return $memo;
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
        $stages = MemoLetter::with('letter', 'letter.request_stages', 'letter.request_stages.status')->first();
        // return $memo;
        // return $stages;
        $request = RequestLetter::create([
            "request_name" => $request->request_name,
            "user_id" => $user->id,
            // "status_id" => $stages->letter->request_stages[0]->status_id,
            "stages_id" => $stages->letter->request_stages->where('sequence', 1)->first()->id,
            "letter_type_id" => $memo->letter_id,
            "memo_id" => $memo->id,
        ]);
        // $requestCreated = RequestLetter::with('user')->with("memo")->with("status")->with("stages")->get();
        // return to_route('memo.index');
    }
    public function approve($id)
    {
        $request = RequestLetter::with('memo', 'memo.letter.request_stages')->where('memo_id', $id)->first();
        $nextStage = $request->memo->letter->request_stages->where('id', $request->stages_id)->first();
        if ($nextStage->to_stage_id == null) {
            return null;
        }
        $request->update([
            // "stages_id" => $request->stages->to_stage_id,
            "stages_id" => $nextStage->to_stage_id,
        ]);
        $request->save();
    }
    public function reject($id)
    {
        $request = RequestLetter::with('memo', 'memo.letter.request_stages')->where('memo_id', $id)->first();
        $nextStage = $request->memo->letter->request_stages->where('id', $request->stages_id)->first();
        if ($nextStage->rejected_id == null) {
            return to_route('memo.index');
        }

        $request->update([
            "stages_id" => $nextStage->rejected_id,
        ]);
        $request->save();
    }
}
