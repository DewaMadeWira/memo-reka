<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $role = Role::get();
        return Inertia::render(
            'Management/Role/Index',
            ['roles' => $role]
        );
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
        try {
            // Validate the request
            $validated = $request->validate([
                'role_name' => 'required|string|max:255|unique:roles,role_name',
            ]);

            // Create the role
            $role = Role::create([
                'role_name' => $validated['role_name'],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Handle validation errors, specifically for duplicates
            if (isset($e->validator->failed()['role_name']['Unique'])) {
                return redirect()->back()
                    ->withErrors(['message' => 'Terjadi duplikasi data, silahkan coba lagi'])
                    ->withInput();
            }
            if (isset($e->validator->failed()['role_name']['Required'])) {
                return redirect()->back()
                    ->withErrors(['message' => 'Nama role tidak boleh kosong'])
                    ->withInput();
            }

            // Re-throw other validation errors to be handled by the framework
            throw $e;
        }
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
        try {
            $validated = $request->validate([
                'role_name' => 'required|string|max:255|unique:roles,role_name',
            ]);
            Role::where('id', $id)->update(['role_name' => $validated["role_name"]]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // return redirect()->back()->with('error', 'Role not found');
            return redirect()->back()
                ->withErrors(['message' => 'Role tidak ditemukan.'])
                ->withInput();
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Handle validation errors, specifically for duplicates
            if (isset($e->validator->failed()['role_name']['Unique'])) {
                return redirect()->back()
                    ->withErrors(['message' => 'Terjadi duplikasi data, silahkan coba lagi'])
                    ->withInput();
            }
            return redirect()->back()
                ->withErrors(['message' => 'Terjadi kesalahan saat mengubah role.'])
                ->withInput();

            // Re-throw other validation errors to be handled by the framework
            throw $e;
        }

        // catch (\Exception $e) {
        // } 

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $role = Role::findOrFail($id);


            // Delete the role
            $role->delete();
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // return redirect()->back()->with('error', 'Role not found');
            return redirect()->back()
                ->withErrors(['message' => 'Role tidak ditemukan.'])
                ->withInput();
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['message' => 'Terjadi kesalahan saat menghapus role.'])
                ->withInput();
        }
    }
}
