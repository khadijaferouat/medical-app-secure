<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Page d'accueil
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// ============================================
// ROUTES AUTH (MOCK - Personne 1)
// ============================================

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

// ============================================
// ROUTES DOCTOR (MOCK - Personne 2)
// ============================================

Route::prefix('doctor')->middleware(['auth', 'role:doctor'])->group(function () {
    
    Route::get('/dashboard', function () {
        return Inertia::render('Doctor/Dashboard', [
            'user' => [
                'id' => 1,
                'name' => 'Dr. Martin',
                'email' => 'dr.martin@example.com',
                'specialty' => 'Cardiologue',
                'rpps_number' => '12345678901'
            ],
            'stats' => [
                'totalPatients' => 45,
                'todayAppointments' => 8,
                'monthlyRecords' => 23,
                'pendingAuthorizations' => 3
            ],
            'todayPatients' => [
                [
                    'id' => 1,
                    'name' => 'Jean Dupont',
                    'appointmentTime' => '09:00',
                    'reason' => 'Consultation de suivi',
                    'phone' => '0612345678'
                ],
                [
                    'id' => 2,
                    'name' => 'Marie Laurent',
                    'appointmentTime' => '10:30',
                    'reason' => 'Première consultation',
                    'phone' => '0698765432'
                ]
            ],
            'recentRecords' => [
                [
                    'id' => 10,
                    'patient_id' => 1,
                    'patient_name' => 'Pierre Martin',
                    'title' => 'Consultation cardiologique',
                    'date' => '2024-11-14',
                    'is_emergency' => false
                ]
            ]
        ]);
    })->name('doctor.dashboard');

    Route::get('/patients', function () {
        return Inertia::render('Doctor/PatientList', [
            'patients' => [
                [
                    'id' => 1,
                    'name' => 'Jean Dupont',
                    'birth_date' => '1980-05-15',
                    'blood_type' => 'O+',
                    'last_visit' => '2024-11-10',
                    'has_authorization' => true,
                    'authorization_level' => 'write',
                    'phone' => '0612345678',
                    'email' => 'jean@example.com'
                ]
            ]
        ]);
    })->name('doctor.patients');

});

// ============================================
// ROUTES PATIENT (MOCK - Personne 2)
// ============================================

Route::prefix('patient')->middleware(['auth', 'role:patient'])->group(function () {
    
    Route::get('/dashboard', function () {
        return Inertia::render('Patient/Dashboard', [
            'user' => [
                'id' => 5,
                'name' => 'Jean Dupont',
                'email' => 'jean@example.com'
            ],
            'nextAppointment' => [
                'id' => 1,
                'date' => '2024-11-20',
                'time' => '14:30',
                'doctor_name' => 'Dr. Martin',
                'doctor_specialty' => 'Cardiologue',
                'location' => 'Cabinet Médical, 123 Rue de la Santé',
                'reason' => 'Consultation de suivi'
            ],
            'healthSummary' => [
                'blood_type' => 'O+',
                'allergies' => ['Pénicilline', 'Pollen'],
                'current_treatments' => ['Aspirine 100mg'],
                'last_consultation_date' => '2024-11-10',
                'last_consultation_doctor' => 'Dr. Martin'
            ]
        ]);
    })->name('patient.dashboard');

    Route::get('/medical-record', function () {
        return Inertia::render('Patient/MyMedicalRecord', [
            'patient' => [
                'id' => 5,
                'name' => 'Jean Dupont',
                'birth_date' => '1980-05-15',
                'age' => 44,
                'blood_type' => 'O+',
                'allergies' => ['Pénicilline', 'Pollen']
            ],
            'consultations' => [
                [
                    'id' => 10,
                    'date' => '2024-11-10',
                    'doctor_name' => 'Dr. Martin',
                    'title' => 'Consultation annuelle'
                ]
            ]
        ]);
    })->name('patient.medical-record');

});

// ============================================
// ROUTES ANCIENNES (Laravel Breeze)
// ============================================

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


require __DIR__.'/auth.php';
