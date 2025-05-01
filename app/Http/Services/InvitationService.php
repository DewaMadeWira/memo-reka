<?php

namespace App\Http\Services;

use App\Models\InvitationLetter;
use App\Models\MeetingAttendees;
use App\Models\MemoLetter;
use App\Models\RequestLetter;
use App\Models\RequestStages;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;

class InvitationService
{
    protected $authService;
    //
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }
    public function index($intent)
    {

        switch ($intent) {
            case '':
                // $invite = $this->index('all');
                $user = Auth::user();
                $user = User::with('role')->with('division')->where("id", $user->id)->first();
                $division = $this->authService->userDivision();

                // $invite = RequestLetter::with('user', 'stages', 'stages.status', 'invite')->whereHas('invite', function ($q) use ($user) {
                //     $q->where('from_division', $user->division->id);
                // })->get();

                $invite = RequestLetter::with(['user', 'stages' => function ($query) {
                    $query->withTrashed();
                }, 'stages.status', 'invite', 'invite.to_division', 'invite.from_division', 'invite.signatory', 'invite.attendees.user'])->whereHas('invite', function ($q) use ($division) {
                    $q->where('from_division', $division)
                        ->orWhere('to_division', $division);;
                })->get();

                $invite->each(function ($requestLetter) {
                    // Handle different possible types of progress_stages
                    $progressStages = [];

                    if (isset($requestLetter->progress_stages)) {
                        if (is_string($requestLetter->progress_stages)) {
                            // Try to decode JSON string
                            $decoded = json_decode($requestLetter->progress_stages, true);
                            if (is_array($decoded)) {
                                $progressStages = $decoded;
                            }
                        } elseif (is_array($requestLetter->progress_stages)) {
                            $progressStages = $requestLetter->progress_stages;
                        }
                    }

                    // Now use the properly formatted array
                    // $requestLetter->progress = RequestStages::withTrashed()->with("request_rejected")->whereIn('id', $progressStages)->orderByRaw("FIELD(id, " . implode(',', $progressStages) . ")")->get();
                    if (!empty($progressStages)) {
                        $requestLetter->progress = RequestStages::withTrashed()
                            ->with("request_rejected")
                            ->whereIn('id', $progressStages)
                            ->when(count($progressStages) > 0, function ($query) use ($progressStages) {
                                // Only apply the ordering if there are items in the array
                                return $query->orderByRaw("FIELD(id, " . implode(',', $progressStages) . ")");
                            })
                            ->get();
                    } else {
                        $requestLetter->progress = collect(); // Empty collection if no progress stages
                    }
                    // return $requestLetter;
                    // error_log($requestLetter);
                });
                return $invite;

            case 'invitation.internal':
                // $invite = $this->index('all');
                $user = Auth::user();
                $user = User::with('role')->with('division')->where("id", $user->id)->first();
                $division = $this->authService->userDivision();

                // $invite = RequestLetter::with('user', 'stages', 'stages.status', 'invite')->whereHas('invite', function ($q) use ($user) {
                //     $q->where('from_division', $user->division->id);
                // })->get();

                $invite = RequestLetter::with(['user', 'stages' => function ($query) {
                    $query->withTrashed();
                }, 'stages.status', 'invite', 'invite.to_division', 'invite.from_division', 'invite.signatory', 'invite.attendees.user'])->whereHas('invite', function ($q) use ($division) {
                    $q->where('from_division', $division);
                })->get();

                $invite->each(function ($requestLetter) {
                    // Handle different possible types of progress_stages
                    $progressStages = [];

                    if (isset($requestLetter->progress_stages)) {
                        if (is_string($requestLetter->progress_stages)) {
                            // Try to decode JSON string
                            $decoded = json_decode($requestLetter->progress_stages, true);
                            if (is_array($decoded)) {
                                $progressStages = $decoded;
                            }
                        } elseif (is_array($requestLetter->progress_stages)) {
                            $progressStages = $requestLetter->progress_stages;
                        }
                    }

                    // Now use the properly formatted array
                    // $requestLetter->progress = RequestStages::withTrashed()->with("request_rejected")->whereIn('id', $progressStages)->orderByRaw("FIELD(id, " . implode(',', $progressStages) . ")")->get();
                    if (!empty($progressStages)) {
                        $requestLetter->progress = RequestStages::withTrashed()
                            ->with("request_rejected")
                            ->whereIn('id', $progressStages)
                            ->when(count($progressStages) > 0, function ($query) use ($progressStages) {
                                // Only apply the ordering if there are items in the array
                                return $query->orderByRaw("FIELD(id, " . implode(',', $progressStages) . ")");
                            })
                            ->get();
                    } else {
                        $requestLetter->progress = collect(); // Empty collection if no progress stages
                    }
                    // return $requestLetter;
                    // error_log($requestLetter);
                });
                return $invite;

            case 'invitation.external':
                $user = Auth::user();
                $user = User::with('role')->with('division')->where("id", $user->id)->first();
                $division = $this->authService->userDivision();

                // $invite = RequestLetter::with('user', 'stages', 'stages.status', 'invite')->whereHas('invite', function ($q) use ($user) {
                //     $q->where('from_division', $user->division->id);
                // })->get();

                $invite = RequestLetter::with(['user', 'stages' => function ($query) {
                    $query->withTrashed();
                }, 'stages.status', 'invite', 'invite.to_division', 'invite.from_division', 'invite.signatory', 'invite.attendees.user'])->whereHas('invite', function ($q) use ($division) {
                    $q->where('to_division', $division);
                })->get();

                $invite->each(function ($requestLetter) {
                    // Handle different possible types of progress_stages
                    $progressStages = [];

                    if (isset($requestLetter->progress_stages)) {
                        if (is_string($requestLetter->progress_stages)) {
                            // Try to decode JSON string
                            $decoded = json_decode($requestLetter->progress_stages, true);
                            if (is_array($decoded)) {
                                $progressStages = $decoded;
                            }
                        } elseif (is_array($requestLetter->progress_stages)) {
                            $progressStages = $requestLetter->progress_stages;
                        }
                    }

                    // Now use the properly formatted array
                    // $requestLetter->progress = RequestStages::withTrashed()->with("request_rejected")->whereIn('id', $progressStages)->orderByRaw("FIELD(id, " . implode(',', $progressStages) . ")")->get();
                    if (!empty($progressStages)) {
                        $requestLetter->progress = RequestStages::withTrashed()
                            ->with("request_rejected")
                            ->whereIn('id', $progressStages)
                            ->when(count($progressStages) > 0, function ($query) use ($progressStages) {
                                // Only apply the ordering if there are items in the array
                                return $query->orderByRaw("FIELD(id, " . implode(',', $progressStages) . ")");
                            })
                            ->get();
                    } else {
                        $requestLetter->progress = collect(); // Empty collection if no progress stages
                    }
                    // return $requestLetter;
                    // error_log($requestLetter);
                });
                return $invite;


            default:
                $invite = $this->index('all');
                break;
        }
    }
    public function create($request)
    {

        $user = Auth::user();
        $user = User::with('role')->with('division')->where("id", $user->id)->first();

        $manager = User::with('role', 'division')->where("division_id", $user->division_id)->whereHas("role", function ($q) {
            $q->where('role_name', "admin");
        })->first();

        // dd($request->content);

        $invite = InvitationLetter::create([
            // 'invitation_name' => "Test Invitation",
            'invitation_number' => "1234",
            'perihal' => $request->perihal,
            'content' => $request->content,
            'signatory' => $manager->id,
            'official_id' => $request->official,
            'from_division' => $user->division->id,
            'to_division' => $request->to_division,
            'letter_id' => 2,
            'hari_tanggal' => $request->hari_tanggal,
            'waktu' => $request->waktu,
            'tempat' => $request->tempat,
            'agenda' => $request->agenda,
        ]);

        foreach ($request->invited_users as $userId) {
            MeetingAttendees::create([
                'invitation_letter_id' => $invite->id,
                'user_id' => $userId,
            ]);
        }

        // $stages = InvitationLetter::with('letter', 'letter.request_stages', 'letter.request_stages.status')->first();

        $stages = RequestStages::where('letter_id', $invite->letter_id)->get();
        $nextStageMap = $stages->pluck('to_stage_id', 'id')->filter();
        $rejectedStageMap = $stages->pluck('rejected_id', 'id')->filter();
        $progressStageMap = $this->extract_progress_stage($nextStageMap->toArray());
        // return $stages;
        // $stages_id = $stages->letter->request_stages->where('sequence', 1)->first()->id;
        // $stages_id = $stages->letter->request_stages;

        // $request = RequestLetter::create([
        //     "request_name" => "Test Request Baru Invitation",
        //     "user_id" => $user->id,
        //     // "status_id" => $stages->letter->request_stages[0]->status_id,
        //     "stages_id" => $stages->letter->request_stages->where('sequence', 1)->first()->id,
        //     "letter_type_id" => $invite->letter_id,
        //     "invitation_id" => $invite->id,
        // ]);
        $request = RequestLetter::create([
            "request_name" => $request->request_name,
            "user_id" => $user->id,
            // "status_id" => $stages->letter->request_stages[0]->status_id,
            "stages_id" => $stages->where('sequence', 1)->first()->id,
            "letter_type_id" => $invite->letter_id,
            "invitation_id" => $invite->id,
            "to_stages" => $nextStageMap->toJson(),
            "rejected_stages" => $rejectedStageMap->toJson(),
            "progress_stages" => json_encode($progressStageMap),
        ]);
    }
    public function extract_progress_stage($to_stages)
    {

        $result = [];
        if (empty($to_stages)) {
            return $result;
        }
        $visited = [];
        $currentKey = array_key_first($to_stages); // Start from the first key


        // while ($currentKey !== null && isset($to_stages[$currentKey]) && !in_array($currentKey, $visited)) {
        //     $visited[] = $currentKey; // Avoid infinite loops
        //     $result[] = (int) $currentKey; // Store the current key (stage ID)
        //     $nextKey = (string) $to_stages[$currentKey]; // Move to the next reference

        //     if (!in_array($nextKey, $result)) {
        //         $result[] = (int) $nextKey; // Store the next stage ID
        //     }

        //     $currentKey = $nextKey;
        // }
        while ($currentKey !== null && isset($to_stages[$currentKey]) && !in_array($currentKey, $visited)) {
            $visited[] = $currentKey; // Avoid infinite loops
            $result[] = (int) $currentKey; // Store the current key (stage ID)
            $currentKey = (string) $to_stages[$currentKey]; // Move to the next reference
        }

        // Add the last referenced stage ID only if it's not already in the result
        if ($currentKey !== null && !in_array((int) $currentKey, $result)) {
            $result[] = (int) $currentKey;
        }

        error_log(json_encode($result));
        // dd($result);
        return $result;
    }
    public function approve($id)
    {
        $request = RequestLetter::with('invite', 'invite.letter.request_stages')->where('invitation_id', $id)->first();
        $nextStage = $request->invite->letter->request_stages->where('id', $request->stages_id)->first();
        if ($nextStage->to_stage_id == null) {
            return to_route('undangan-rapat.index');
        }
        $request->update([
            "stages_id" => $nextStage->to_stage_id,
        ]);
        $request->save();
    }
    public function reject($id)
    {
        $request = RequestLetter::with('invite', 'invite.letter.request_stages')->where('invitation_id', $id)->first();
        $nextStage = $request->invite->letter->request_stages->where('id', $request->stages_id)->first();
        // dd($nextStage->to_stage_id);
        // return $nextStage->to_stage_id;
        if ($nextStage->rejected_id == null) {
            return to_route('undangan-rapat.index');
        }

        $request->update([
            // "stages_id" => $request->stages->to_stage_id,
            "stages_id" => $nextStage->rejected_id,
        ]);
        $request->save();
    }
}
