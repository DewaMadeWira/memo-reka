<?php

namespace App\Http\Controllers;

use App\Models\Division;
use App\Models\InvitedUser;
use App\Models\Official;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvitedUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $invitedUsers = InvitedUser::with(['division', 'official'])->get();
        $divisions = Division::all();
        $officials = Official::all();

        return Inertia::render('Management/InvitedUser/Index', [
            'invitedUsers' => $invitedUsers,
            'division' => $divisions,
            'official' => $officials,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_pengguna' => 'required|string|max:255',
            'division_id' => 'required|exists:divisions,id',
            'official_id' => 'required|exists:officials,id',
        ]);

        InvitedUser::create($validated);

        return redirect()->back();
    }

    /**
     * Display the specified resource.
     */
    public function show(InvitedUser $invitedUser)
    {
        return $invitedUser->load(['division', 'official']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nama_pengguna' => 'sometimes|string|max:255',
            'division_id' => 'sometimes|exists:divisions,id',
            'official_id' => 'sometimes|exists:officials,id',
        ]);


        $invitedUser = InvitedUser::findOrFail($id);
        $invitedUser->update($validated);

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $invitedUser = InvitedUser::findOrFail($id);
        $invitedUser->delete();

        return redirect()->back();
    }
}
