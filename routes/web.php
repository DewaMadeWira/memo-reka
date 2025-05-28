<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DivisionManagementController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\InvitedUserController;
use App\Http\Controllers\LetterTypeManagement;
use App\Http\Controllers\MemoController;
use App\Http\Controllers\OfficialManagementController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\RoleManagementController;
use App\Http\Controllers\ServeImageController;
use App\Http\Controllers\StagesController;
use App\Http\Controllers\SummaryController;
use App\Http\Controllers\UserManagementController;
use App\Models\InvitationLetter;
use App\Models\MemoImage;
use App\Models\MemoLetter;
use App\Models\SummaryLetter;
use Faker\Core\File;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File as FacadesFile;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::middleware('can:manage-profile')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });


    Route::middleware('can:admin-privilege')->group(function () {
        Route::resource('admin/manajemen-pengguna', UserManagementController::class);
        Route::resource('admin/manajemen-pejabat', OfficialManagementController::class);
        Route::resource('admin/manajemen-tahapan-surat', StagesController::class);
        Route::resource('admin/manajemen-role', RoleManagementController::class);
        Route::resource('admin/manajemen-divisi', DivisionManagementController::class);
        Route::resource('admin/manajemen-tipe-surat', LetterTypeManagement::class);
        Route::resource('admin/manajemen-pengguna-undangan', InvitedUserController::class)
            ->except(['create', 'edit']);
    });
    Route::post('risalah-rapat/update/{id}', function (Request $request, $id) {

        $file = $request->file("file");
        $ext = $file->getClientOriginalExtension();
        $filename = rand(100000000, 999999999) . '.' . $ext;
        Storage::disk('local')->put('risalah-rapat/' . $filename, FacadesFile::get($file));

        // dd($this->generateNomorSurat($user, $official)->memo_number);
        $summary = SummaryLetter::where("id", $id)->update([
            // 'memo_number' => '1234/MemoNumber/Test',
            'file_path' => $filename,
            'judul_rapat' => $request->judul_rapat,
            'rangkuman_rapat' => $request->rangkuman_rapat,
        ]);
    });
    Route::post('upload-bukti', function (Request $request) {
        // Set timeout to a larger value for big uploads
        set_time_limit(300); // 5 minutes

        try {
            // Validate the request
            $request->validate([
                'images' => 'required|array',
                'images.*' => 'required|file|max:10240', // 10MB per file limit
                'memo_id' => 'required|exists:memo_letters,id',
            ]);

            $memo_id = $request['memo_id'];
            $memo = MemoLetter::findOrFail($memo_id);

            $uploadedFiles = [];

            // Process each uploaded file
            foreach ($request->file('images') as $file) {
                // Generate a unique filename
                $ext = $file->getClientOriginalExtension();
                $filename = rand(100000000, 999999999) . '.' . $ext;

                // Store the file
                Storage::disk('local')->put('private/bukti-memo/' . $filename, FacadesFile::get($file));

                MemoImage::create([
                    'memo_letter_id' => $memo_id,
                    'file_path' => $filename,
                    'file_name' => $file->getClientOriginalName(),
                    'file_type' => $file->getMimeType(),
                    'file_size' => $file->getSize()
                ]);

                $uploadedFiles[] = $filename;
            }

            // return response()->json([
            //     'message' => 'Files uploaded successfully',
            //     'files' => $uploadedFiles
            // ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            // Log::error('File upload error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Upload failed: ' . $e->getMessage()
            ], 500);
        }
    });

    Route::post('delete-evidence-multiple', [MemoController::class, 'deleteEvidenceMultiple']);



    Route::resource('memo', MemoController::class);
    Route::resource('undangan-rapat', InvitationController::class);
    Route::resource('risalah-rapat', SummaryController::class);
    Route::get('/memo-file/{filename}', [ServeImageController::class, 'show'])->name('memo.file');
    Route::get('/risalah-file/{filename}', [ServeImageController::class, 'show_pdf'])->name('risalah-rapat.file');
});

// Route::get('/request', [RequestController::class, 'index'])->name('request.index');
// Route::resource('undangan-rapat', InvitationController::class);
Route::resource('request', RequestController::class);
// Route::resource('stages', StagesController::class);

Route::get('pdf', function () {

    $request = MemoLetter::with("from_division", "to_division", "signatory")->first();
    // return $request;
    // dd($request);
    return Inertia::render('Pdf/Index', ["data" => $request]);
});
Route::get('upload', function () {

    return Inertia::render('Upload/Index');
});
Route::post('upload', function (Request $request) {
    $file = $request['pdf'];
    $ext = $file->getClientOriginalExtension();
    $filename = rand(100000000, 999999999) . '.' . $ext;
    Storage::disk('local')->put('private/' . $filename, FacadesFile::get($file));
    // $data['file'] = $filename;
    // dd($file);
    return $file;
});

Route::get('/invite-test', function () {
    $invitation = InvitationLetter::with("attendees.user")->first();
    // dd($invitation);
    return $invitation;
});

Route::get('/test-unauthorized', function () {
    throw new \Illuminate\Auth\Access\AuthorizationException('This is a test unauthorized exception');
})->middleware('auth');

// Route::get('/memo', [MemoController::class, 'index'])->name('memo.index');
// Route::post('/memo', [MemoController::class, 'create'])->name('memo.create');
// Route::post('/memo-approve/{id}', [MemoController::class, 'approve'])->name('memo.approve');
// Route::post('/memo-reject/{id}', [MemoController::class, 'reject'])->name('memo.reject');

// invitation
// Route::get('/invite-all', [MemoController::class, 'indexInvite'])->name('invite.index');
// Route::post('/invite', [MemoController::class, 'createInvite'])->name('memo.create-invite');
// Route::post('/invite-approve/{id}', [MemoController::class, 'approveInvite'])->name('invite.approve-invite');
// Route::post('/invite-reject/{id}', [MemoController::class, 'rejectInvite'])->name('invite.reject-invite');

// Test
Route::middleware('auth')->group(function () {});
// Route::get('/user', [RequestController::class, 'index'])->name('user.index');
// Route::get('/memo', [RequestController::class, 'create'])->name('user.create');
// Route::get('/memo-show', [RequestController::class, 'show'])->name('memo.show');
// Route::get('/memo-approve/{id}', [RequestController::class, 'store'])->name('memo.store');
// Route::get('/memo-view', [MemoController::class, 'show'])->name('memo.show');



require __DIR__ . '/auth.php';
