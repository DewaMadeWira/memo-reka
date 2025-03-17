<?php

namespace App\Http\Controllers;

use App\Models\Division;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $user = User::with('role', 'division')->get();
        $role = Role::get();
        $division = Division::get();
        return Inertia::render('User/Index', [
            'users' => $user,
            'role' => $role,
            'division' => $division
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
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role_id' => $request->role,
            'division_id' => $request->divisi,
            'password' => bcrypt($request->password),
        ]);
        // return to_route('admin/manajemen-pengguna.index');
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
        $user = User::where('id', $id)->update([
            'name' => $request->name,
            'email' => $request->email,
            'role_id' => $request->role,
            'division_id' => $request->divisi,
            'password' => bcrypt($request->password),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $user = User::where('id', $id)->delete();
        // return to_route('admin/manajemen-pengguna.index');
    }
}
