<?php

namespace App\Http\Controllers;

use App\Http\Services\InvitationService;
use App\Models\LetterType;
use App\Models\MemoLetter;
use App\Models\RequestLetter;
use App\Models\RequestStages;
use App\Models\User;
use App\Http\Services\MemoService;
use App\Http\Services\SummaryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class RequestController extends Controller
{
    protected $memoService, $invitationService, $summaryService;
    //
    public function __construct(MemoService $memoService, InvitationService $invitationService, SummaryService $summaryService)
    {
        $this->memoService = $memoService;
        $this->invitationService = $invitationService;
        $this->summaryService = $summaryService;
    }

    public function index(Request $request)
    {
        // $intent = $request->get("intent");
        // // $data = null;

        // switch ($intent) {
        //     case 'memo.index':
        //         $data = $this->memoService->index();
        //         return Inertia::render('Memo', [
        //             'request' => $data
        //         ]);

        //     default:
        //         return response()->json(['error' => 'Invalid letter type'], 400);
        // }
        // return $intent;
        //
        // $user = Auth::user();
        // $user = User::with('role')->with('division')->where("id", $user->id)->get();
        // return $user;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $intent = $request->get("intent");
        $user = Auth::user();
        // Create Memo
        // Create memo assign stages
        // Can add try catch
        switch ($intent) {
            case 'memo.create':


            default:
                return response()->json(['error' => 'Invalid letter type'], 400);
        }
        $memo = MemoLetter::create([
            'memo_number' => '1234',
            'letter_id' => 1,
            'from_division' => 1,
            'to_division' => 2,

        ]);
        $stages = MemoLetter::with('letter')->with('letter.request_stages')->get();
        // return $memo;
        $request = RequestLetter::create([
            "request_name" => "Test Request Baru",
            "user_id" => $user->id,
            "status_id" => 1,
            "stages_id" => $stages[0]->letter->request_stages[0]->id,
            "letter_type_id" => $memo->letter_id,
            "memo_id" => $memo->id,
        ]);
        $requestCreated = RequestLetter::with('user')->with("memo")->with("status")->with("stages")->get();
        return $requestCreated;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        // $id = $request->id;
        if (Gate::allows('admin')) {
            abort(403);
        }
        $intent = $request->get("intent");
        // Create Memo
        // Create memo assign stages
        // Can add try catch
        switch ($intent) {
            case 'memo.create':
                $memo = $this->memoService->create($request);
                // dd($request);
                return $memo;
                // return to_route('memo.index');
            case 'invitation.create':
                // dd($request);
                $invitation = $this->invitationService->create($request);
                return $invitation;
                // return to_route('undangan-rapat.index');
            case 'summary.create':
                // dd($request);
                $summary = $this->summaryService->create($request);
                return $summary;
                // return to_route('undangan-rapat.index');

            default:
                return response()->json(['error' => 'Invalid letter type'], 400);
        }
        // $request = RequestLetter::with('stages')->find($id);

        // $request->update([
        //     "status_id" => 2,
        //     "stages_id" => $request->stages->to_stage_id,
        // ]);
        // $request->save();
        // return $request;
    }

    /**
     * Display the specified resource.
     */
    // public function show(string $id)
    public function show()
    {
        // $stages = MemoLetter::with('letter')->with('letter.request_stages')->get();
        // $stages = LetterType::with('request_stages')->get();
        // $stages = RequestStages::with('letter_type')->get();
        $stages = RequestLetter::with('status')->with('stages')->with('memo')->get();

        return $stages;
        // return $stages[0]->letter->request_stages[0]->id;
        //
        // $requestCreated = RequestLetter::with('user')->with("status")->with("stages")->with("stages.letter_type")->with("stages.letter_type.memo")->first();
        // return $requestCreated;
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
    public function update(Request $request, $id)
    {
        // if (!Gate::allows('admin')) {
        //     abort(403);
        // }
        $intent = $request->get("intent");
        switch ($intent) {
            case 'memo.approve':
                $memo = $this->memoService->approve($id);
                return $memo;
                // return to_route('memo.index');
            case 'memo.reject':
                $memo = $this->memoService->reject($id, $request);
                return to_route('memo.index');
            case 'invitation.approve':
                $invite = $this->invitationService->approve($id);
                return to_route('undangan-rapat.index');
            case 'invitation.reject':
                $invite = $this->invitationService->reject($id, $request);
                return to_route('undangan-rapat.index');
            case 'summary.approve':
                // dd('mamamia');
                $summary = $this->summaryService->approve($id);
                return to_route('risalah-rapat.index');
            case 'summary.reject':
                $summary = $this->summaryService->reject($id, $request);
                return to_route('risalah-rapat.index');

            default:
                return response()->json(['error' => 'Invalid letter type'], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
