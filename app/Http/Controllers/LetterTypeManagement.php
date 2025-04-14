<?php

namespace App\Http\Controllers;

use App\Http\Middleware\HandleInertiaRequests;
use App\Models\LetterType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LetterTypeManagement extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $letterType = LetterType::get();
        // dd($letterType);
        return Inertia::render('Management/LetterType/Index', [
            'data' => $letterType,
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
        // dd($request);
        try {
            // Validate the request
            $validated = $request->validate([
                'letter_type_name' => 'required|string|max:255|unique:letter_types,letter_name',
            ]);

            // Create the role
            $letterType = LetterType::create([
                'letter_name' => $validated['letter_type_name'],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Handle validation errors, specifically for duplicates
            if (isset($e->validator->failed()['letter_type_name']['Unique'])) {
                return redirect()->back()
                    ->withErrors(['message' => 'Terjadi duplikasi data, silahkan coba lagi'])
                    ->withInput();
            }
            if (isset($e->validator->failed()['letter_name']['Required'])) {
                return redirect()->back()
                    ->withErrors(['message' => 'Nama tipe surat tidak boleh kosong'])
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
                'letter_type_name' => 'required|string|max:255|unique:roles,role_name',
            ]);
            LetterType::where('id', $id)->update(['letter_name' => $validated["letter_type_name"]]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // return redirect()->back()->with('error', 'Role not found');
            return redirect()->back()
                ->withErrors(['message' => 'Tipe surat tidak ditemukan.'])
                ->withInput();
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Handle validation errors, specifically for duplicates
            if (isset($e->validator->failed()['letter_name']['Unique'])) {
                return redirect()->back()
                    ->withErrors(['message' => 'Terjadi duplikasi data, silahkan coba lagi'])
                    ->withInput();
            }
            return redirect()->back()
                ->withErrors(['message' => 'Terjadi kesalahan saat mengubah tipe surat.'])
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
            $letterType = LetterType::findOrFail($id);


            // Delete the role
            $letterType->delete();
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // return redirect()->back()->with('error', 'Role not found');
            return redirect()->back()
                ->withErrors(['message' => 'Tipe surat tidak ditemukan.'])
                ->withInput();
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['message' => 'Terjadi kesalahan saat menghapus tipe surat.'])
                ->withInput();
        }
    }
}
