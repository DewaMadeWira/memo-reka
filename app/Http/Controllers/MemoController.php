<?php

namespace App\Http\Controllers;

use App\Models\MemoLetter;
use App\Models\RequestLetter;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
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
        $memo = RequestLetter::with('user', 'status', 'stages', 'memo')->whereHas('memo', function ($q) use ($user) {
            $q->where('from_division', $user->division->id);
        })->get();
        // return $memo;
        return Inertia::render('Memo', [
            'memo' => $memo
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
        $request = RequestLetter::with('stages', 'memo')->where('memo_id', $id)->first();

        $request->update([
            "status_id" => 2,
            "stages_id" => $request->stages->to_stage_id,
        ]);
        $request->save();
        return $request;
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
        $stages = MemoLetter::with('letter')->with('letter.request_stages')->first();
        // return $memo;
        $request = RequestLetter::create([
            "request_name" => "Test Request Baru",
            "user_id" => $user->id,
            "status_id" => 1,
            "stages_id" => $stages->letter->request_stages[0]->id,
            "letter_type_id" => $memo->letter_id,
            "memo_id" => $memo->id,
        ]);
        $requestCreated = RequestLetter::with('user')->with("memo")->with("status")->with("stages")->get();
        return to_route('memo.index');
        // return $requestCreated;
    }
    public function show(Request $request)
    {
        return Inertia::render("Memo", [
            'memo' => 'memo test'
        ]);
    }
}
