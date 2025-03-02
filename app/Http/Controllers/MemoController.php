<?php

namespace App\Http\Controllers;

use App\Http\Services\MemoService;
use App\Models\Division;
use App\Models\MemoLetter;
use App\Models\RequestLetter;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class MemoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected $memoService;
    //
    public function __construct(MemoService $memoService)
    {
        $this->memoService = $memoService;
    }
    public function index()
    {
        // Testing -- IGNORE --
        // $user = Auth::user();
        // $user = User::with('role')->with('division')->where("id", $user->id)->first();
        // $manager = User::with('role', 'division')->where("division_id", $user->division_id)->whereHas("role", function ($q) {
        //     $q->where('role_name', "admin");
        // })->first();
        // return $manager;

        // $manager = Division::with("users", "users.role")->whereHas("users.role", function ($q) use ($user) {
        //     $q->where('role_name', "admin");
        // })->first();


        //Working -- RESTORE THIS AFTER TEST ---
        $data = $this->memoService->index();
        $division = Division::get();

        return Inertia::render('Memo/Index', [
            'request' => $data,
            'division' => $division
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        //
        if (Gate::allows('admin')) {
            abort(403);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        if (Gate::allows('admin')) {
            abort(403);
        }
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
        return to_route('memo.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        // return $id;
        $request = MemoLetter::with("from_division", "to_division", "signatory")->where("id", $id)->first();
        return Inertia::render('Pdf/Index', ["data" => $request]);
        return $request;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
