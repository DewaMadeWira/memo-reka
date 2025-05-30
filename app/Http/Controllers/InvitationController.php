<?php

namespace App\Http\Controllers;

use App\Http\Services\InvitationService;
use App\Models\Division;
use App\Models\InvitationLetter;
use App\Models\InvitedUser;
use App\Models\Official;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InvitationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected $invitationService;
    //
    public function __construct(InvitationService $invitationService)
    {
        $this->invitationService = $invitationService;
    }
    public function index(Request $request)
    {
        $intent = $request->get("intent");
        $data = $this->invitationService->index($intent);
        $division = Division::get();
        $official = Official::get();
        $user = Auth::user();
        $user = User::with('role')->with('division')->where("id", $user->id)->first();
        $all_user = InvitedUser::with("division", "official")->get();

        return Inertia::render('Invitation/Index', [
            'request' => $data,
            'division' => $division,
            'official' => $official,
            'userData' => $user,
            'all_user' => $all_user,
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
        try {

            $validated = $request->validate([
                'perihal' => 'required|string|max:255',
                'content' => 'required|string|max:255',
                'hari_tanggal' => 'required|string|max:255',
                'waktu' => 'required|string|max:255',
                'tempat' => 'required|string|max:255',
                'agenda' => 'required|string|max:255',
            ]);

            // dd($request->perihal);

            // dd($this->generateNomorSurat($user, $official)->memo_number);
            $invite = InvitationLetter::where("id", $id)->update([
                // 'memo_number' => '1234/MemoNumber/Test',
                'perihal' => $request->perihal,
                'content' => $request->content,
                'hari_tanggal' => $request->hari_tanggal,
                'waktu' => $request->waktu,
                'tempat' => $request->tempat,
                'agenda' => $request->agenda,
            ]);
            // return response()->json([
            //     'success' => true,
            //     'message' => 'Undangan Rapat berhasil diubah',
            //     'data' => InvitationLetter::find($id)
            // ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return redirect()->back()
                ->withErrors(['message' => 'Undangan Rapat tidak ditemukan.'])
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
            if (isset($e->validator->failed()['hari_tanggal']['Required'])) {
                return redirect()->back()
                    ->withErrors(['message' => 'Hari Tanggal tidak boleh kosong'])
                    ->withInput();
            }
            if (isset($e->validator->failed()['waktu']['Required'])) {
                return redirect()->back()
                    ->withErrors(['message' => 'Waktu tidak boleh kosong'])
                    ->withInput();
            }
            if (isset($e->validator->failed()['tempat']['Required'])) {
                return redirect()->back()
                    ->withErrors(['message' => 'Tempat tidak boleh kosong'])
                    ->withInput();
            }
            if (isset($e->validator->failed()['agenda']['Required'])) {
                return redirect()->back()
                    ->withErrors(['message' => 'Agenda tidak boleh kosong'])
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
