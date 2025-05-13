<?php

namespace App\Http\Controllers;

use App\Http\Services\SummaryService;
use App\Models\Division;
use App\Models\SummaryLetter;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SummaryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected $summaryService;
    //
    public function __construct(SummaryService $summaryService)
    {
        $this->summaryService = $summaryService;
    }
    public function index(Request $request)
    {
        //
        $intent = $request->get("intent");
        $data = $this->summaryService->index($intent);
        $division = Division::get();
        $user = Auth::user();
        $user = User::with('role')->with('division')->where("id", $user->id)->first();

        return Inertia::render('Summary/Index', [
            'userData' => $user,
            'request' => $data,
            'division' => $division,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
    public function show(string $id)
    {
        //
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
