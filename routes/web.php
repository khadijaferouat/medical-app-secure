<?php

use App\Http\Controllers\ProfileController;
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
// Routes Auth (MOCK - Personne 1)

Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');

Route::post('/login', function () {
    // MOCK - À remplacer plus tard
    return response()->json([
        'message' => 'Login MOCK - Backend pas encore prêt',
        'user' => [
            'id' => 1,
            'name' => 'Dr. Martin',
            'role' => 'doctor'
        ]
    ]);
})->name('login.store');

Route::get('/register', function () {
    return Inertia::render('Auth/Register');
})->name('register');

Route::post('/register', function () {
    // MOCK
    return response()->json([
        'message' => 'Registration MOCK',
        'redirect' => '/patient/dashboard'
    ]);
})->name('register.store');

Route::get('/register/doctor', function () {
    return Inertia::render('Auth/RegisterDoctor');
})->name('register.doctor');

Route::post('/register/doctor', function () {
    // MOCK
    return response()->json([
        'message' => 'Demande envoyée (MOCK)',
        'request_id' => 1
    ]);
})->name('register.doctor.store');

Route::post('/logout', function () {
    // MOCK
    return response()->json([
        'message' => 'Logout MOCK',
        'redirect' => '/login'
    ]);
})->name('logout');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
