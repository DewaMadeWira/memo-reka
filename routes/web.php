<?php

use App\Http\Controllers\InvitationController;
use App\Http\Controllers\MemoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RequestController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
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
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Route::get('/request', [RequestController::class, 'index'])->name('request.index');
Route::resource('memo', MemoController::class);
Route::resource('undangan-rapat', InvitationController::class);
Route::resource('request', RequestController::class);

Route::get('pdf', function () {
    return Inertia::render('Pdf/Index', []);
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
