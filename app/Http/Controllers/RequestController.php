<?php

namespace App\Http\Controllers;

use App\Models\MemoLetter;
use App\Models\RequestLetter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $user = Auth::user();
        return $user;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();
        // Create Memo
        // Can add try catch
        $memo = MemoLetter::create([
            'memo_number' => '1234',
            'letter_id' => 1,
            'from_division' => 1,
            'to_division' => 2
        ]);
        $request = RequestLetter::create([
            "request_name" => "Test Request",
            "user_id" => $user->id,
            "status_id" => 1,
            "stages_id" => 1,
        ]);
        $requestCreated = RequestLetter::with('user')->with("status")->with("stages")->get();
        return $requestCreated;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    // public function show(string $id)
    public function show()
    {
        //
        $requestCreated = RequestLetter::with('user')->with("status")->with("stages")->with("stages.letter_type")->with("stages.letter_type.memo")->first();
        return $requestCreated;
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
