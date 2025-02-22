<?php

namespace App\Http\Services;

use App\Models\InvitationLetter;
use App\Models\MemoLetter;
use App\Models\RequestLetter;
use App\Models\User;
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
    public function index()
    {
        $user = Auth::user();
        $user = User::with('role')->with('division')->where("id", $user->id)->first();
        $invite = RequestLetter::with('user', 'stages', 'stages.status', 'invite')->whereHas('invite', function ($q) use ($user) {
            $q->where('from_division', $user->division->id);
        })->get();
        return $invite;
    }
    public function create()
    {

        $user = Auth::user();
        $user = User::with('role')->with('division')->where("id", $user->id)->first();

        $invite = InvitationLetter::create([
            'invitation_name' => "Test Invitation",
            'invitation_number' => "1234",
            'from_division' => $user->division->id,
            'to_division' => 2,
            'letter_id' => 2,
        ]);
        $stages = InvitationLetter::with('letter', 'letter.request_stages', 'letter.request_stages.status')->first();
        // return $stages;
        // $stages_id = $stages->letter->request_stages->where('sequence', 1)->first()->id;
        // $stages_id = $stages->letter->request_stages;

        $request = RequestLetter::create([
            "request_name" => "Test Request Baru Invitation",
            "user_id" => $user->id,
            // "status_id" => $stages->letter->request_stages[0]->status_id,
            "stages_id" => $stages->letter->request_stages->where('sequence', 1)->first()->id,
            "letter_type_id" => $invite->letter_id,
            "invitation_id" => $invite->id,
        ]);
    }
    public function approve($id)
    {
        $request = RequestLetter::with('invite', 'invite.letter.request_stages')->where('invitation_id', $id)->first();
        $nextStage = $request->invite->letter->request_stages->where('id', $request->stages_id)->first();
        if ($nextStage->to_stage_id == null) {
            return to_route('undangan-rapat.index');
        }
        $request->update([
            "stages_id" => $nextStage->to_stage_id,
        ]);
        $request->save();
    }
    public function reject($id)
    {
        $request = RequestLetter::with('invite', 'invite.letter.request_stages')->where('invitation_id', $id)->first();
        $nextStage = $request->invite->letter->request_stages->where('id', $request->stages_id)->first();
        // dd($nextStage->to_stage_id);
        // return $nextStage->to_stage_id;
        if ($nextStage->rejected_id == null) {
            return to_route('undangan-rapat.index');
        }

        $request->update([
            // "stages_id" => $request->stages->to_stage_id,
            "stages_id" => $nextStage->rejected_id,
        ]);
        $request->save();
    }
}
