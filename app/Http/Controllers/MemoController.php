<?php

namespace App\Http\Controllers;

use App\Http\Services\MemoService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected $memoService;
    //
    public function __construct(MemoService $memoService)
    {
        $this->memoService = $memoService;
    }
    public function index()
    {
        //
        $data = $this->memoService->index();

        return Inertia::render('Memo/Index', [
            'request' => $data
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
