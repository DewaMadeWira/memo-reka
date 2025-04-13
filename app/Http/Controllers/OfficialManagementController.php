<?php

namespace App\Http\Controllers;

use App\Models\Official;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OfficialManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $official = Official::all();
        // dd($official);
        return Inertia::render('Management/Official/Index', [
            'data' => $official
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
                'official_code' => 'required|string|max:255|unique:officials,official_code',
                'official_name' => 'required|string|max:255|unique:officials,official_name',
            ]);

            // Create the role
            $role = Official::create([
                'official_code' => $validated['official_code'],
                'official_name' => $validated['official_name'],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Handle validation errors, specifically for duplicates
            if (isset($e->validator->failed()['official_name']['Unique'])) {
                return redirect()->back()
                    ->withErrors(['message' => 'Terjadi duplikasi data, silahkan coba lagi'])
                    ->withInput();
            }
            if (isset($e->validator->failed()['official_code']['Unique'])) {
                return redirect()->back()
                    ->withErrors(['message' => 'Terjadi duplikasi data, silahkan coba lagi'])
                    ->withInput();
            }
            if (isset($e->validator->failed()['official_name']['Required'])) {
                return redirect()->back()
                    ->withErrors(['message' => 'Nama Pejabat tidak boleh kosong'])
                    ->withInput();
            }
            if (isset($e->validator->failed()['official_code']['Required'])) {
                return redirect()->back()
                    ->withErrors(['message' => 'Kode Pejabat tidak boleh kosong'])
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
            // Validate the request
            $validated = $request->validate([
                'official_code' => 'required|string|max:255|unique:officials,official_code',
                'official_name' => 'required|string|max:255|unique:officials,official_name',
            ]);

            // Create the role
            $role = Official::where('id', $id)->update([
                'official_code' => $validated['official_code'],
                'official_name' => $validated['official_name'],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Handle validation errors, specifically for duplicates
            if (isset($e->validator->failed()['official_name']['Unique'])) {
                return redirect()->back()
                    ->withErrors(['message' => 'Terjadi duplikasi data, silahkan coba lagi'])
                    ->withInput();
            }
            if (isset($e->validator->failed()['official_code']['Unique'])) {
                return redirect()->back()
                    ->withErrors(['message' => 'Terjadi duplikasi data, silahkan coba lagi'])
                    ->withInput();
            }
            if (isset($e->validator->failed()['official_name']['Required'])) {
                return redirect()->back()
                    ->withErrors(['message' => 'Nama Pejabat tidak boleh kosong'])
                    ->withInput();
            }
            if (isset($e->validator->failed()['official_code']['Required'])) {
                return redirect()->back()
                    ->withErrors(['message' => 'Kode Pejabat tidak boleh kosong'])
                    ->withInput();
            }

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
            $official = Official::findOrFail($id);


            // Delete the offici$official
            $official->delete();
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // return redirect()->back()->with('error', 'Role not found');
            return redirect()->back()
                ->withErrors(['message' => 'Pejabat tidak ditemukan.'])
                ->withInput();
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['message' => 'Terjadi kesalahan saat menghapus pejabat.'])
                ->withInput();
        }
    }
}
