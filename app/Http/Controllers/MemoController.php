<?php

namespace App\Http\Controllers;

use App\Http\Services\MemoService;
use App\Models\Division;
use App\Models\MemoLetter;
use App\Models\Notification;
use App\Models\Official;
use App\Models\RequestLetter;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
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
    public function index(Request $request)
    {
        // Testing -- IGNORE --
        // $user = Auth::user();
        // $user = User::with('role')->with('division')->where("id", $user->id)->first();
        // $manager = User::with('role', 'division')->where("division_id", $user->division_id)->whereHas("role", function ($q) {
        //     $q->where('role_name', "admin");
        // })->first();
        // return $manager;

        // $manager = Division::with("users", "users.role")->whereHas("users.role", function ($q) use ($user) {
        //     $q->where('role_name', "admin");
        // })->first();


        //Working -- RESTORE THIS AFTER TEST ---
        $intent = $request->get("intent");
        // return $intent;

        // switch ($intent) {
        //     case '':
        //         // $memo = $this->memoService->approve($id);
        //         // return to_route('memo.index');
        //         return "empty intent";
        //     case 'memo.internal':
        //         return "memo internal";
        //     default:
        //         return response()->json(['error' => 'Invalid letter type'], 400);
        // }
        $data = $this->memoService->index($intent);
        // $modifiedData = $data->map(function ($item) {
        //     $stages = json_decode($item->to_stages, true);

        //     if (!$stages || !is_array($stages)) {
        //         $item->progress_stages = [];
        //         return $item;
        //     }

        //     // Extract referenced stages
        //     $referenced = [];
        //     $visited = [];
        //     $key = array_key_first($stages);

        //     while ($key !== null && !in_array($key, $visited)) {
        //         $visited[] = $key; // Mark as visited
        //         if (isset($stages[$key])) {
        //             $referenced[$key] = $stages[$key]; // Store reference
        //             $key = (string) $stages[$key]; // Move to next reference
        //         } else {
        //             break;
        //         }
        //     }

        //     // Append referenced stages to the item
        //     $item->referenced_stages = $referenced;
        //     return $item;
        // });

        // $stages = json_encode($referenced);

        $division = Division::get();
        $official = Official::get();
        $user = Auth::user();
        $user = User::with('role')->with('division')->where("id", $user->id)->first();
        // return $user;
        $notifications = Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Memo/Index', [
            'userData' => $user,
            'request' => $data,
            'division' => $division,
            'official' => $official,
            'notifications' => $notifications,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        //
        if (Gate::allows('admin')) {
            abort(403);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        // if (Gate::allows('admin')) {
        //     abort(403);
        // }
        // $user = Auth::user();
        // $user = User::with('role')->with('division')->where("id", $user->id)->first();
        // $manager = User::with('role', 'division')->where("division_id", $user->division_id)->whereHas("role", function ($q) {
        //     $q->where('role_name', "admin");
        // })->first();
        // // dd($request->official);
        // $memo = MemoLetter::create([
        //     'memo_number' => '1234/MemoNumber/Test',
        //     'perihal' => $request->perihal,
        //     'content' => $request->content,
        //     'signatory' => $manager->id,
        //     'letter_id' => 1,
        //     'official_id' => $request->official,
        //     'from_division' => $user->division->id,
        //     'to_division' => $request->to_division,
        // ]);
        // $stages = MemoLetter::with('letter', 'letter.request_stages', 'letter.request_stages.status')->first();
        // // return $memo;
        // // return $stages;
        // $request = RequestLetter::create([
        //     "request_name" => $request->request_name,
        //     "user_id" => $user->id,
        //     // "status_id" => $stages->letter->request_stages[0]->status_id,
        //     "stages_id" => $stages->letter->request_stages->where('sequence', 1)->first()->id,
        //     "letter_type_id" => $memo->letter_id,
        //     "memo_id" => $memo->id,
        // ]);
        // // $requestCreated = RequestLetter::with('user')->with("memo")->with("status")->with("stages")->get();
        // return to_route('memo.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        // return $id;
        // $request = MemoLetter::with("from_division", "to_division", "signatory")->where("id", $id)->first();
        // return Inertia::render('Pdf/Index', ["data" => $request]);
        // return $request;
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
                'perihal' => 'required|string|max:255',
                'content' => 'required|string|max:255',
            ]);

            // dd($this->generateNomorSurat($user, $official)->memo_number);
            $memo = MemoLetter::where("id", $id)->update([
                // 'memo_number' => '1234/MemoNumber/Test',
                'perihal' => $request->perihal,
                'content' => $request->content,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return redirect()->back()
                ->withErrors(['message' => 'Memo tidak ditemukan.'])
                ->withInput();
        } catch (\Illuminate\Validation\ValidationException $e) {
            // if (isset($e->validator->failed()['division_name']['Unique'])) {
            //     return redirect()->back()
            //         ->withErrors(['message' => 'Terjadi duplikasi data, silahkan coba lagi'])
            //         ->withInput();
            // }
            if (isset($e->validator->failed()['perihal']['Required'])) {
                return redirect()->back()
                    ->withErrors(['message' => 'Perihal tidak boleh kosong'])
                    ->withInput();
            }
            if (isset($e->validator->failed()['content']['Required'])) {
                return redirect()->back()
                    ->withErrors(['message' => 'Isi tidak boleh kosong'])
                    ->withInput();
            }
            return redirect()->back()
                ->withErrors(['message' => 'Terjadi kesalahan saat mengubah Memo.'])
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
    }
}
