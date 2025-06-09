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
                $toStageId = $request->to_stage_id == -1 ? null : $request->to_stage_id;
                $rejectedId = $request->rejected_id == -1 ? null : $request->rejected_id;
                $stages = RequestStages::create([
                    'stage_name' => $request->stage_name,
                    'sequence' => $request->sequence,
                    'description' => $request->description,
                    'to_stage_id' => $toStageId,
                    'rejected_id' => $rejectedId,
                    'letter_id' => $request->letter_id,
                    'approver_id' => $request->approver_id,
                    'status_id' => $request->status_id,
                    'requires_file_upload' => $request->boolean('requires_file_upload', false),
                    'is_fixable' => $request->boolean('is_fixable', false),
                    'requires_rejection_reason' => $request->boolean('requires_rejection_reason', false),
                    'is_external' => $request->boolean('is_external', false),
                    'notify_internal_manager' => $request->boolean('notify_internal_manager'),
                    'notify_internal_user' => $request->boolean('notify_internal_user'),
                    'notify_internal' => $request->boolean('notify_internal'),
                    'notify_external' => $request->boolean('notify_external'),
                    'notify_external_manager' => $request->boolean('notify_external_manager'),
                    'notify_external_user' => $request->boolean('notify_external_user'),
                ]);
                // return to_route('admin/manajemen-tahapan-surat.index');
                return to_route('manajemen-tahapan-surat.index');
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

                    // Handle other fields if they exist in the item
                    if (isset($item["stage_name"])) {
                        $updateData["stage_name"] = $item["stage_name"];
                    }
                    if (isset($item["sequence"])) {
                        $updateData["sequence"] = $item["sequence"];
                    }
                    if (isset($item["description"])) {
                        $updateData["description"] = $item["description"];
                    }
                    if (isset($item["letter_id"])) {
                        $updateData["letter_id"] = $item["letter_id"];
                    }
                    if (isset($item["approver_id"])) {
                        $updateData["approver_id"] = $item["approver_id"];
                    }
                    if (isset($item["status_id"])) {
                        $updateData["status_id"] = $item["status_id"];
                    }
                    if (isset($item["requires_file_upload"])) {
                        $updateData["requires_file_upload"] = (bool) $item["requires_file_upload"];
                    }
                    if (isset($item["is_fixable"])) {
                        $updateData["is_fixable"] = (bool) $item["is_fixable"];
                    }
                    if (isset($item["requires_rejection_reason"])) {
                        $updateData["requires_rejection_reason"] = (bool) $item["requires_rejection_reason"];
                    }
                    if (isset($item["is_external"])) {
                        $updateData["is_external"] = (bool) $item["is_external"];
                    }
                    if (array_key_exists("notify_internal_manager", $item)) {
                        $updateData["notify_internal_manager"] = $item["notify_internal_manager"] ? (bool) $item["notify_internal_manager"] : null;
                    }
                    if (array_key_exists("notify_internal_user", $item)) {
                        $updateData["notify_internal_user"] = $item["notify_internal_user"] ? (bool) $item["notify_internal_user"] : null;
                    }
                    if (array_key_exists("notify_internal", $item)) {
                        $updateData["notify_internal"] = $item["notify_internal"] ? (bool) $item["notify_internal"] : null;
                    }
                    if (array_key_exists("notify_external", $item)) {
                        $updateData["notify_external"] = $item["notify_external"] ? (bool) $item["notify_external"] : null;
                    }
                    if (array_key_exists("notify_external_manager", $item)) {
                        $updateData["notify_external_manager"] = $item["notify_external_manager"] ? (bool) $item["notify_external_manager"] : null;
                    }
                    if (array_key_exists("notify_external_user", $item)) {
                        $updateData["notify_external_user"] = $item["notify_external_user"] ? (bool) $item["notify_external_user"] : null;
                    }

                    // Only update if there's data to update
                    if (!empty($updateData)) {
                        RequestStages::where('id', $item["id"])->update($updateData);
                    }
                }
                return to_route('manajemen-tahapan-surat.index');
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
        $toStageId = $request->to_stage_id == -1 ? null : $request->to_stage_id;
        $rejectedId = $request->rejected_id == -1 ? null : $request->rejected_id;

        $stages = RequestStages::where('id', $id)->update([
            'stage_name' => $request->stage_name,
            'sequence' => $request->sequence,
            'description' => $request->description,
            'to_stage_id' => $toStageId,
            'rejected_id' => $rejectedId,
            'letter_id' => $request->letter_id,
            'approver_id' => $request->approver_id,
            'status_id' => $request->status_id,
            'requires_file_upload' => $request->boolean('requires_file_upload', false),
            'is_fixable' => $request->boolean('is_fixable', false),
            'requires_rejection_reason' => $request->boolean('requires_rejection_reason', false),
            'is_external' => $request->boolean('is_external', false),
            'notify_internal_manager' => $request->has('notify_internal_manager') ? $request->boolean('notify_internal_manager') : null,
            'notify_internal_user' => $request->has('notify_internal_user') ? $request->boolean('notify_internal_user') : null,
            'notify_internal' => $request->has('notify_internal') ? $request->boolean('notify_internal') : null,
            'notify_external' => $request->has('notify_external') ? $request->boolean('notify_external') : null,
            'notify_external_manager' => $request->has('notify_external_manager') ? $request->boolean('notify_external_manager') : null,
            'notify_external_user' => $request->has('notify_external_user') ? $request->boolean('notify_external_user') : null,
        ]);
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
        // return to_route('tahapan-surat.index');
    }
}
