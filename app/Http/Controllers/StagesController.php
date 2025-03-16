<?php

namespace App\Http\Controllers;

use App\Models\LetterType;
use App\Models\RequestStages;
use App\Models\RequestStatus;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StagesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //

        $stages = RequestStages::with("status", "request_approved", "request_rejected", "letter_type")->get();
        $statuses = RequestStatus::get();
        $letter = LetterType::get();
        $role = Role::get();
        return Inertia::render('Stages/Index', [
            'data' => $stages,
            'statuses' => $statuses,
            'letter' => $letter,
            'role' => $role,
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
        $intent = $request->get("intent");
        switch ($intent) {
            case 'stages.create':
                // return to_route('memo.index');
                $stages = RequestStages::create([
                    'stage_name' => $request->stage_name,
                    'sequence' => $request->sequence,
                    'to_stage_id' => $request->to_stage_id,
                    'rejected_id' => $request->rejected_id,
                    'letter_id' => $request->letter_id,
                    'approver_id' => $request->approver_id,
                    'status_id' => $request->status_id,
                ]);
                return to_route('stages.index');
            case 'stages.update':

                foreach ($request['data'] as $item) {
                    $updateData = [];
                    if ($item["to_stage_id"] != -2) {
                        $updateData["to_stage_id"] = ($item["to_stage_id"] == -1) ? NULL : $item["to_stage_id"];
                    }

                    // Handle rejected_id
                    if ($item["rejected_id"] != -2) {
                        $updateData["rejected_id"] = ($item["rejected_id"] == -1) ? NULL : $item["rejected_id"];
                    }

                    // Only update if there's data to update
                    if (!empty($updateData)) {
                        RequestStages::where('id', $item["id"])->update($updateData);
                    }
                }
                return to_route('stages.index');
                // dd($request->data);

            default:
                return response()->json(['error' => 'Invalid letter type'], 400);
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
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        RequestStages::find($id)->delete();
        DB::table('request_stages')
            ->where('to_stage_id', $id)
            ->orWhere('rejected_id', $id)
            ->update([
                'to_stage_id' => NULL,
                'rejected_id' => NULL
            ]);
        return to_route('stages.index');
    }
}
