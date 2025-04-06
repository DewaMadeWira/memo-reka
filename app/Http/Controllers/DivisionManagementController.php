<?php

namespace App\Http\Controllers;

use App\Models\Division;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DivisionManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $division = Division::get();
        return Inertia::render('Management/Division/Index', [
            'divisions' => $division
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
        try {
            // Validate the request
            $validated = $request->validate([
                'division_name' => 'required|string|max:255|unique:divisions,division_name',
            ]);

            // Create the role
            $role = Division::create([
                'division_name' => $validated['division_name'],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Handle validation errors, specifically for duplicates
            if (isset($e->validator->failed()['division_name']['Unique'])) {
                return redirect()->back()
                    ->withErrors(['message' => 'Terjadi duplikasi data, silahkan coba lagi'])
                    ->withInput();
            }
            if (isset($e->validator->failed()['division_name']['Required'])) {
                return redirect()->back()
                    ->withErrors(['message' => 'Nama divisi tidak boleh kosong'])
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
                'division_name' => 'required|string|max:255|unique:roles,role_name',
            ]);
            Division::where('id', $id)->update(['division_name' => $validated["division_name"]]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return redirect()->back()
                ->withErrors(['message' => 'Divisi tidak ditemukan.'])
                ->withInput();
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Handle validation errors, specifically for duplicates
            if (isset($e->validator->failed()['division_name']['Unique'])) {
                return redirect()->back()
                    ->withErrors(['message' => 'Terjadi duplikasi data, silahkan coba lagi'])
                    ->withInput();
            }
            if (isset($e->validator->failed()['division_name']['Required'])) {
                return redirect()->back()
                    ->withErrors(['message' => 'Nama divisi tidak boleh kosong'])
                    ->withInput();
            }
            return redirect()->back()
                ->withErrors(['message' => 'Terjadi kesalahan saat mengubah role.'])
                ->withInput();

            // Re-throw other validation errors to be handled by the framework
            throw $e;
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        try {
            $role = Division::findOrFail($id);


            // Delete the role
            $role->delete();
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // return redirect()->back()->with('error', 'Role not found');
            return redirect()->back()
                ->withErrors(['message' => 'Divisi tidak ditemukan.'])
                ->withInput();
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['message' => 'Terjadi kesalahan saat menghapus divisi.'])
                ->withInput();
        }
    }
}
