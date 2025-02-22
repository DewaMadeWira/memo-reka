<?php

namespace App\Http\Services;

use App\Models\MemoLetter;
use App\Models\RequestLetter;
use App\Models\User;
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
    public function create()
    {

        // if (Gate::allows('admin')) {
        //     abort(403);
        // }

        $division = $this->authService->userDivision();
        $user = $this->authService->index();
        $memo = MemoLetter::create([
            'memo_number' => '1234',
            'letter_id' => 1,
            'from_division' => $division,
            'to_division' => 2
        ]);
        $stages = MemoLetter::with('letter', 'letter.request_stages', 'letter.request_stages.status')->first();
        $request = RequestLetter::create([
            "request_name" => "Test Request Baru",
            "user_id" => $user->id,
            // "status_id" => $stages->letter->request_stages[0]->status_id,
            "stages_id" => $stages->letter->request_stages->where('sequence', 1)->first()->id,
            "letter_type_id" => $memo->letter_id,
            "memo_id" => $memo->id,
        ]);
    }
}
