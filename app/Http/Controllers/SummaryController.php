<?php

namespace App\Http\Controllers;

use App\Http\Services\SummaryService;
use App\Models\Division;
use App\Models\RequestLetter;
use App\Models\SummaryLetter;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File as FacadesFile;
use Inertia\Inertia;

class SummaryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected $summaryService;
    //
    public function __construct(SummaryService $summaryService)
    {
        $this->summaryService = $summaryService;
    }
    public function index(Request $request)
    {
        //
        $intent = $request->get("intent");
        $data = $this->summaryService->index($intent);
        $division = Division::get();
        $user = Auth::user();
        $user = User::with('role')->with('division')->where("id", $user->id)->first();

        $invite = RequestLetter::with(['user', 'stages' => function ($query) {
            $query->withTrashed();
        }, 'stages.status', 'invite', 'invite.to_division', 'invite.from_division', 'invite.signatory', 'invite.attendees.user'])->whereHas('invite', function ($q) use ($division, $user) {
            $q->where('from_division', $user->division->id)
                ->orWhere('to_division', $user->division->id);
        })->get();

        // dd($invite);


        return Inertia::render('Summary/Index', [
            'userData' => $user,
            'request' => $data,
            'division' => $division,
            'invite' => $invite,
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
        // $file = $request->file("file");
        // $ext = $file->getClientOriginalExtension();
        // $filename = rand(100000000, 999999999) . '.' . $ext;
        // Storage::disk('local')->put('risalah-rapat/' . $filename, FacadesFile::get($file));

        // // dd($this->generateNomorSurat($user, $official)->memo_number);
        // $summary = SummaryLetter::where("id", $id)->update([
        //     // 'memo_number' => '1234/MemoNumber/Test',
        //     'file_path' => $filename,
        // ]);

        // $intent = $request->get("intent");
        // switch ($intent) {
        //     case '':
        //         try {

        //             // $validated = $request->validate([
        //             //     'perihal' => 'required|string|max:255',
        //             //     'content' => 'required|string|max:255',
        //             // ]);

        //             // $file = $request->file("file");
        //             // $ext = $file->getClientOriginalExtension();
        //             // $filename = rand(100000000, 999999999) . '.' . $ext;
        //             // Storage::disk('local')->put('risalah-rapat/' . $filename, FacadesFile::get($file));

        //             // // dd($this->generateNomorSurat($user, $official)->memo_number);
        //             // $summary = SummaryLetter::where("id", $id)->update([
        //             //     // 'memo_number' => '1234/MemoNumber/Test',
        //             //     'file_path' => $filename,
        //             // ]);
        //         } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        //             return redirect()->back()
        //                 ->withErrors(['message' => 'Risalah Rapat tidak ditemukan.'])
        //                 ->withInput();
        //         } catch (\Illuminate\Validation\ValidationException $e) {
        //             // if (isset($e->validator->failed()['division_name']['Unique'])) {
        //             //     return redirect()->back()
        //             //         ->withErrors(['message' => 'Terjadi duplikasi data, silahkan coba lagi'])
        //             //         ->withInput();
        //             // }
        //             if (isset($e->validator->failed()['file_path']['Required'])) {
        //                 return redirect()->back()
        //                     ->withErrors(['message' => 'File tidak boleh kosong'])
        //                     ->withInput();
        //             }
        //             return redirect()->back()
        //                 ->withErrors(['message' => 'Terjadi kesalahan saat mengubah Undangan Rapat.'])
        //                 ->withInput();

        //             // Re-throw other validation errors to be handled by the framework
        //             throw $e;
        //         }
        //         break;
        //     // case 'memo.notification':
        //     //     // dd("called");
        //     //     $notification = Notification::where("id", $id)->update([
        //     //         'is_read' => true,
        //     //     ]);
        //     //     // return redirect()->back()->with('success', 'Notifikasi telah dibaca.');
        //     //     break;
        //     default:
        //         return response()->json(['error' => 'Invalid intent'], 400);
        // }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
