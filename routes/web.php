<?php

use App\Http\Controllers\DivisionManagementController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\MemoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\RoleManagementController;
use App\Http\Controllers\StagesController;
use App\Http\Controllers\UserManagementController;
use App\Models\MemoLetter;
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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::middleware('can:manage-profile')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });


    Route::middleware('can:manage-users')->group(function () {
        Route::resource('admin/manajemen-pengguna', UserManagementController::class);
    });
});

// Route::get('/request', [RequestController::class, 'index'])->name('request.index');
Route::resource('admin/manajemen-role', RoleManagementController::class);
Route::resource('admin/manajemen-divisi', DivisionManagementController::class);
Route::resource('memo', MemoController::class);
Route::resource('undangan-rapat', InvitationController::class);
Route::resource('request', RequestController::class);
Route::resource('stages', StagesController::class);

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
