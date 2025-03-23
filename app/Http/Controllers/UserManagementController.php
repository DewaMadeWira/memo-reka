<?php

namespace App\Http\Controllers;

use App\Models\Division;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

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
        return Inertia::render('Management/User/Index', [
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
            'role_id' => $request->role_id,
            'division_id' => $request->division_id,
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
        // $user = User::where('id', $id)->update([
        //     'name' => $request->name,
        //     'email' => $request->email,
        //     'role_id' => $request->role_id,
        //     'division_id' => $request->division_id,
        //     'password' => bcrypt($request->password),
        // ]);
        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255|unique:users,email,' . $id,
            'role_id' => 'sometimes|integer|exists:roles,id',
            'division_id' => 'sometimes|integer|exists:divisions,id',
            'password' => 'sometimes|nullable|string|min:6|confirmed',
        ]);
        // return response()->json($request);
        // return response()->json($validatedData);
        if ($request->has('password') && $request->password !== null) {
            $validatedData['password'] = bcrypt($request->password);
        } else {
            unset($validatedData['password']);
        }
        // Log::info('Validated Data:', $validatedData);
        User::where('id', $id)->update($validatedData);
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
