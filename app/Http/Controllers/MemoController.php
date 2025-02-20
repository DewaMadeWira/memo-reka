<?php

namespace App\Http\Controllers;

use App\Models\InvitationLetter;
use App\Models\MemoLetter;
use App\Models\RequestLetter;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class MemoController extends Controller
{
    //
    public function index()
    {

        $user = Auth::user();
        $user = User::with('role')->with('division')->where("id", $user->id)->first();
        // $memo = RequestLetter::with('user')->with('status')->with('stages')->with('memo')->where("from_division", $user[0]->division->id)->first();
        // $memo = RequestLetter::with('user')->with('status')->with('stages')->with('memo')->first();
        $memo = RequestLetter::with('user', 'stages', 'stages.status', 'memo')->whereHas('memo', function ($q) use ($user) {
            $q->where('from_division', $user->division->id);
        })->get();
        // return $memo;
        return Inertia::render('Memo', [
            'request' => $memo
        ]);
    }
    public function approve($id)
    {

        if (!Gate::allows('admin')) {
            abort(403);
        }
        // $request = RequestLetter::with('stages', 'memo')->whereHas('memo', function ($q) use ($id) {
        //     $q->where('id', $id);
        // })->first();
        $request = RequestLetter::with('memo', 'memo.letter.request_stages')->where('memo_id', $id)->first();
        $nextStage = $request->memo->letter->request_stages->where('id', $request->stages_id)->first();
        // dd($nextStage->to_stage_id);
        // return $nextStage->to_stage_id;
        // return $nextStage;
        // dump($request, $nextStage);
        // dd($nextStage);
        // Log::info($request);
        if ($nextStage->to_stage_id == null) {
            return to_route('memo.index');
        }

        $request->update([
            // "stages_id" => $request->stages->to_stage_id,
            "stages_id" => $nextStage->to_stage_id,
        ]);
        $request->save();
        return to_route('memo.index');
        // return $request;
    }
    public function approveInvite($id)
    {

        if (!Gate::allows('admin')) {
            abort(403);
        }
        // $request = RequestLetter::with('stages', 'memo')->whereHas('memo', function ($q) use ($id) {
        //     $q->where('id', $id);
        // })->first();
        $request = RequestLetter::with('invite', 'invite.letter.request_stages')->where('invitation_id', $id)->first();
        // $request = RequestLetter::with('invite')->where('invitation_id', $id)->first();
        // $request = RequestLetter::with('invite')->first();
        $nextStage = $request->invite->letter->request_stages->where('id', $request->stages_id)->first();
        // dd($nextStage->to_stage_id);
        // return $nextStage->to_stage_id;
        // return $nextStage;
        // dump($request, $nextStage);
        // dd($request);
        // Log::info($request);
        // if ($nextStage->to_stage_id == null) {
        //     return to_route('memo.index');
        // }
        // return $request;
        // return $nextStage;

        $request->update([
            // "stages_id" => $request->stages->to_stage_id,
            "stages_id" => $nextStage->to_stage_id,
        ]);
        $request->save();
        // return to_route('memo.index');
        return $request;
    }
    public function reject($id)
    {
        if (!Gate::allows('admin')) {
            abort(403);
        }
        $request = RequestLetter::with('memo', 'memo.letter.request_stages')->where('memo_id', $id)->first();
        $nextStage = $request->memo->letter->request_stages->where('id', $request->stages_id)->first();
        // dd($nextStage->to_stage_id);
        // return $nextStage->to_stage_id;
        if ($nextStage->rejected_id == null) {
            return to_route('memo.index');
        }

        $request->update([
            // "stages_id" => $request->stages->to_stage_id,
            "stages_id" => $nextStage->rejected_id,
        ]);
        $request->save();
        // return $nextStage;
        return to_route('memo.index');
        // return $nextStage;
    }
    public function create()
    {
        if (Gate::allows('admin')) {
            abort(403);
        }

        $user = Auth::user();
        $user = User::with('role')->with('division')->where("id", $user->id)->first();
        // Create Memo
        // Create memo assign stages
        // Can add try catch
        $memo = MemoLetter::create([
            'memo_number' => '1234',
            'letter_id' => 1,
            'from_division' => $user->division->id,
            'to_division' => 2
        ]);
        $stages = MemoLetter::with('letter', 'letter.request_stages', 'letter.request_stages.status')->first();
        // return $memo;
        // return $stages;
        $request = RequestLetter::create([
            "request_name" => "Test Request Baru",
            "user_id" => $user->id,
            // "status_id" => $stages->letter->request_stages[0]->status_id,
            "stages_id" => $stages->letter->request_stages->where('sequence', 1)->id,
            "letter_type_id" => $memo->letter_id,
            "memo_id" => $memo->id,
        ]);
        // $requestCreated = RequestLetter::with('user')->with("memo")->with("status")->with("stages")->get();
        return to_route('memo.index');
        // return $requestCreated;
    }
    public function createInvite()
    {
        if (Gate::allows('admin')) {
            abort(403);
        }

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
        return $request;
        // return $stages_id;
    }
    public function show(Request $request)
    {
        return Inertia::render("Memo", [
            'memo' => 'memo test'
        ]);
    }
}
