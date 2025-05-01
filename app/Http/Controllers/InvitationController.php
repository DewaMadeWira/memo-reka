<?php

namespace App\Http\Controllers;

use App\Http\Services\InvitationService;
use App\Models\Division;
use App\Models\Official;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InvitationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected $invitationService;
    //
    public function __construct(InvitationService $invitationService)
    {
        $this->invitationService = $invitationService;
    }
    public function index(Request $request)
    {
        $intent = $request->get("intent");
        $data = $this->invitationService->index($intent);
        $division = Division::get();
        $official = Official::get();
        $user = Auth::user();
        $user = User::with('role')->with('division')->where("id", $user->id)->first();
        $all_user = User::with("division")->get();

        return Inertia::render('Invitation/Index', [
            'request' => $data,
            'division' => $division,
            'official' => $official,
            'userData' => $user,
            'all_user' => $all_user,
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
