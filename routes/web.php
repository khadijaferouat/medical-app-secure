<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\DoctorRegistrationController;
use App\Http\Controllers\Auth\PatientRegistrationController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\SecurityLogController;
use App\Http\Controllers\Doctor\DoctorDashboardController;
use App\Http\Controllers\Doctor\DoctorPatientController;
use App\Http\Controllers\Doctor\DoctorMedicalRecordController;
use App\Http\Controllers\Doctor\DoctorPrescriptionController;
use App\Http\Controllers\Doctor\DoctorAppointmentController;
use App\Http\Controllers\Patient\PatientDashboardController;
use App\Http\Controllers\Patient\PatientProfileController;
use App\Http\Controllers\Patient\PatientMedicalRecordController;
use App\Notifications\DoctorAccountApproved;
use App\Notifications\DoctorAccountRejected;
use Illuminate\Support\Facades\Storage;
use App\Models\SecurityLog;
use App\Http\Controllers\Auth\TwoFactorController;
use App\Http\Controllers\Patient\PatientAccessController;
use App\Http\Controllers\Patient\PatientPrescriptionController;
use App\Http\Controllers\Patient\PatientAppointmentController;
use App\Http\Controllers\Patient\PatientDoctorController;
use App\Http\Controllers\Patient\PatientAccessHistoryController;

/*
|--------------------------------------------------------------------------
| Web Routes - Medical App Secure
|--------------------------------------------------------------------------
*/

// ============================================
// PAGE D'ACCUEIL
// ============================================

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

// ============================================
// ROUTES AUTHENTIFICATION (RÉELLES)
// ============================================

Route::get('/login', [AuthenticatedSessionController::class, 'create'])
    ->middleware('guest')
    ->name('login');

Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware('guest');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

// Routes d'inscription PATIENT
Route::get('/register', [PatientRegistrationController::class, 'create'])
    ->middleware('guest')
    ->name('register');

Route::post('/register', [PatientRegistrationController::class, 'store'])
    ->middleware('guest');

// Routes d'inscription MÉDECIN
Route::get('/register/doctor', [DoctorRegistrationController::class, 'create'])
    ->middleware('guest')
    ->name('register.doctor');

Route::post('/register/doctor', [DoctorRegistrationController::class, 'store'])
    ->middleware('guest');

// Mot de passe oublié
Route::get('/forgot-password', function () {
    return Inertia::render('Auth/ForgotPassword');
})->middleware('guest')->name('password.request');

Route::get('/reset-password/{token}', function ($token) {
    return Inertia::render('Auth/ResetPassword', ['token' => $token]);
})->middleware('guest')->name('password.reset');

// ============================================
// ROUTES ADMIN (Protégées)
// ============================================

Route::prefix('admin')->middleware('auth')->group(function () {
    
    // Dashboard Admin
    Route::get('/dashboard', function () {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Accès non autorisé');
        }

        return Inertia::render('Admin/Dashboard', [
            'user' => Auth::user(),
            'stats' => [
                'total_users' => \App\Models\User::count(),
                'total_doctors' => \App\Models\User::where('role', 'doctor')->where('status', 'active')->count(),
                'total_patients' => \App\Models\User::where('role', 'patient')->count(),
                'pending_doctor_requests' => \App\Models\User::where('role', 'doctor')
                    ->where('status', 'pending')->count(),
            ],
            'recentActivity' => [],
            'pendingRequests' => \App\Models\User::where('role', 'doctor')
                ->where('status', 'pending')
                ->get()
                ->map(fn($user) => [
                    'id' => $user->id,
                    'doctor_name' => $user->name,
                    'email' => $user->email,
                    'specialty' => $user->specialty,
                    'rpps_number' => $user->rpps_number,
                    'requested_at' => $user->created_at->format('Y-m-d H:i:s')
                ]),
        ]);
    })->name('admin.dashboard');

    // Gestion des utilisateurs
    Route::get('/users', function () {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Accès non autorisé');
        }

        $users = \App\Models\User::all()->map(function($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
                'specialty' => $user->specialty,
                'created_at' => $user->created_at->format('Y-m-d'),
            ];
        });

        return Inertia::render('Admin/UserManagement', [
            'users' => $users,
            'filters' => [
                'roles' => ['admin', 'doctor', 'patient'],
                'statuses' => ['active', 'inactive', 'pending']
            ]
        ]);
    })->name('admin.users');

    // Demandes de médecins
    Route::get('/doctors/requests', function () {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Accès non autorisé');
        }

        $requests = \App\Models\User::where('role', 'doctor')
            ->where('status', 'pending')
            ->get()
            ->map(fn($user) => [
                'id' => $user->id,
                'doctor_name' => $user->name,
                'email' => $user->email,
                'specialty' => $user->specialty,
                'rpps_number' => $user->rpps_number,
                'diploma_path' => $user->diploma_path,
                'requested_at' => $user->created_at->format('Y-m-d H:i:s')
            ]);

        return Inertia::render('Admin/DoctorRequests', [
            'requests' => $requests
        ]);
    })->name('admin.doctors.requests');

    // Approuver une demande médecin
    Route::post('/doctors/{id}/approve', function ($id) {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Accès non autorisé');
        }

        $doctor = \App\Models\User::findOrFail($id);
        
        if ($doctor->role !== 'doctor' || $doctor->status !== 'pending') {
            return back()->with('error', 'Cette demande n\'est pas valide');
        }

        // Activer le compte
        $doctor->update(['status' => 'active']);

        // LOG : Médecin approuvé
        SecurityLog::log(
            'doctor_approved',
            Auth::id(),
            "Admin a approuvé le compte de Dr. {$doctor->name} ({$doctor->specialty})",
            'low',
            ['doctor_id' => $doctor->id, 'doctor_email' => $doctor->email]
        );

        // Envoyer l'email au médecin
        $doctor->notify(new DoctorAccountApproved());

        return redirect()->route('admin.doctors.requests')
            ->with('success', "✅ Le compte de Dr. {$doctor->name} a été validé ! Un email lui a été envoyé.");
    })->name('admin.doctors.approve');

    // Rejeter une demande médecin
    Route::post('/doctors/{id}/reject', function ($id, Request $request) {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Accès non autorisé');
        }

        $doctor = \App\Models\User::findOrFail($id);
        
        if ($doctor->role !== 'doctor' || $doctor->status !== 'pending') {
            return back()->with('error', 'Cette demande n\'est pas valide');
        }

        $reason = $request->input('reason', 'Non spécifié');

        // LOG : Médecin rejeté
        SecurityLog::log(
            'doctor_rejected',
            Auth::id(),
            "Admin a rejeté le compte de {$doctor->name}. Raison : {$reason}",
            'medium',
            ['doctor_id' => $doctor->id, 'doctor_email' => $doctor->email, 'reason' => $reason]
        );

        // Envoyer l'email de rejet AVANT de supprimer
        $doctor->notify(new DoctorAccountRejected($reason));

        // Supprimer le diplôme si uploadé
        if ($doctor->diploma_path) {
            Storage::disk('public')->delete($doctor->diploma_path);
        }

        // Supprimer le compte
        $doctor->delete();

        return redirect()->route('admin.doctors.requests')
            ->with('success', "❌ La demande de {$doctor->name} a été rejetée. Un email lui a été envoyé.");
    })->name('admin.doctors.reject');

    // Logs de sécurité
    Route::get('/security-logs', [SecurityLogController::class, 'index'])
        ->name('admin.security-logs');

});

// ============================================
// ROUTES DOCTOR (Protégées)
// ============================================

Route::prefix('doctor')->middleware('auth')->group(function () {
    
    // Dashboard
    Route::get('/dashboard', [DoctorDashboardController::class, 'index'])
        ->name('doctor.dashboard');

    // Patients
    Route::get('/patients', [DoctorPatientController::class, 'index'])
        ->name('doctor.patients');
    
    Route::get('/patients/{patient}', [DoctorPatientController::class, 'show'])
        ->name('doctor.patients.show');

    // Dossiers Médicaux
    Route::get('/patients/{patient}/record/create', [DoctorMedicalRecordController::class, 'create'])
        ->name('doctor.patients.record.create');
    
    Route::post('/patients/{patient}/record', [DoctorMedicalRecordController::class, 'store'])
        ->name('doctor.patients.record.store');
    
    Route::get('/medical-records/{record}/edit', [DoctorMedicalRecordController::class, 'edit'])
        ->name('doctor.medical-records.edit');
    
    Route::put('/medical-records/{record}', [DoctorMedicalRecordController::class, 'update'])
        ->name('doctor.medical-records.update');
    
    Route::delete('/medical-records/{record}', [DoctorMedicalRecordController::class, 'destroy'])
        ->name('doctor.medical-records.destroy');

    // Prescriptions
    Route::get('/patients/{patient}/prescription/create', [DoctorPrescriptionController::class, 'create'])
        ->name('doctor.patients.prescription.create');
    
    Route::post('/patients/{patient}/prescription', [DoctorPrescriptionController::class, 'store'])
        ->name('doctor.patients.prescription.store');
    
    Route::get('/prescriptions/{prescription}', [DoctorPrescriptionController::class, 'show'])
        ->name('doctor.prescriptions.show');
    
    Route::post('/prescriptions/{prescription}/cancel', [DoctorPrescriptionController::class, 'cancel'])
        ->name('doctor.prescriptions.cancel');

    // Rendez-vous
    Route::get('/appointments', [DoctorAppointmentController::class, 'index'])
        ->name('doctor.appointments');
    
    Route::post('/appointments/{appointment}/complete', [DoctorAppointmentController::class, 'complete'])
        ->name('doctor.appointments.complete');
    
    Route::post('/appointments/{appointment}/cancel', [DoctorAppointmentController::class, 'cancel'])
        ->name('doctor.appointments.cancel');

    // Profil
    Route::get('/profile', [App\Http\Controllers\Doctor\DoctorProfileController::class, 'edit'])
        ->name('doctor.profile');

    Route::put('/profile', [App\Http\Controllers\Doctor\DoctorProfileController::class, 'update'])
        ->name('doctor.profile.update');

    Route::put('/profile/password', [App\Http\Controllers\Doctor\DoctorProfileController::class, 'updatePassword'])
        ->name('doctor.profile.password');

// Activité
Route::get('/activity', function () {
    if (Auth::user()->role !== 'doctor') {
        abort(403, 'Accès non autorisé');
    }
    
    $user = Auth::user();
    $doctorId = $user->id;
    
    // Dossiers médicaux
    $recentRecords = \App\Models\MedicalRecord::where('doctor_id', $doctorId)
        ->with('patient.user')
        ->latest('created_at')
        ->take(10)
        ->get()
        ->map(function ($record) {
            if (!$record->patient || !$record->patient->user) {
                return null;
            }
            
            return [
                'type' => 'medical_record',
                'icon' => '📋',
                'title' => "Dossier médical créé",
                'description' => "Pour {$record->patient->user->name}: {$record->title}",
                'date' => $record->created_at->format('d/m/Y à H:i'),
                'link' => route('doctor.patients.show', $record->patient_id)
            ];
        })
        ->filter()
        ->values(); // ← Ajouter values()
    
    // Ordonnances
    $recentPrescriptions = \App\Models\Prescription::where('doctor_id', $doctorId)
        ->with('patient.user')
        ->latest('created_at')
        ->take(10)
        ->get()
        ->map(function ($prescription) {
            if (!$prescription->patient || !$prescription->patient->user) {
                return null;
            }
            
            return [
                'type' => 'prescription',
                'icon' => '💊',
                'title' => "Ordonnance créée",
                'description' => "Pour {$prescription->patient->user->name}",
                'date' => $prescription->created_at->format('d/m/Y à H:i'),
                'link' => route('doctor.patients.show', $prescription->patient_id)
            ];
        })
        ->filter()
        ->values(); // ← Ajouter values()
    
    // Rendez-vous complétés/annulés
    $recentAppointments = \App\Models\Appointment::where('doctor_id', $doctorId)
        ->whereIn('status', ['completed', 'cancelled'])
        ->with('patient.user')
        ->latest('updated_at')
        ->take(10)
        ->get()
        ->map(function ($appointment) {
            if (!$appointment->patient || !$appointment->patient->user) {
                return null;
            }
            
            $status = $appointment->status === 'completed' ? 'complété' : 'annulé';
            
            return [
                'type' => 'appointment',
                'icon' => $appointment->status === 'completed' ? '✅' : '❌',
                'title' => "Rendez-vous {$status}",
                'description' => "Avec {$appointment->patient->user->name} le {$appointment->appointment_date->format('d/m/Y à H:i')}",
                'date' => $appointment->updated_at->format('d/m/Y à H:i'),
                'link' => route('doctor.patients.show', $appointment->patient_id)
            ];
        })
        ->filter()
        ->values(); // ← Ajouter values()
    
    // Fusionner toutes les collections en une seule
    $allActivity = collect()
        ->merge($recentRecords)
        ->merge($recentPrescriptions)
        ->merge($recentAppointments);
    
    // Trier et limiter
    $activity = $allActivity
        ->sortByDesc('date')
        ->take(20)
        ->values();

    return Inertia::render('Doctor/Activity', [
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'specialty' => $user->specialty,
        ],
        'activity' => $activity
    ]);
})->name('doctor.activity');

});

// ============================================
// ROUTES PATIENT (Protégées)
// ============================================

Route::prefix('patient')->middleware('auth')->group(function () {
    
    // Dashboard
    Route::get('/dashboard', [PatientDashboardController::class, 'index'])
        ->name('patient.dashboard');

    // Dossier médical
    Route::get('/medical-record', [PatientMedicalRecordController::class, 'index'])
        ->name('patient.medical-record');

    // Profil
    Route::get('/profile', [PatientProfileController::class, 'edit'])
        ->name('patient.profile');
    
    Route::put('/profile', [PatientProfileController::class, 'update'])
        ->name('patient.profile.update');

    // Ordonnances
    Route::get('/prescriptions', [PatientPrescriptionController::class, 'index'])
        ->name('patient.prescriptions');

    Route::get('/prescriptions/{prescription}', [PatientPrescriptionController::class, 'show'])
        ->name('patient.prescriptions.show');

    // Rendez-vous
    Route::get('/appointments', [PatientAppointmentController::class, 'index'])
        ->name('patient.appointments');

    Route::get('/appointments/create', [PatientAppointmentController::class, 'create'])
        ->name('patient.appointments.create');

    Route::post('/appointments', [PatientAppointmentController::class, 'store'])
        ->middleware('throttle:20,60')
        ->name('patient.appointments.store');

    Route::post('/appointments/{appointment}/cancel', [PatientAppointmentController::class, 'cancel'])
        ->name('patient.appointments.cancel');

    // Gestion des accès
    Route::get('/access-management', [PatientAccessController::class, 'index'])
        ->name('patient.access-management');

    Route::post('/doctors/{doctor}/authorize', [PatientAccessController::class, 'authorize'])
        ->name('patient.doctors.authorize');

    Route::post('/authorizations/{authorization}/revoke', [PatientAccessController::class, 'revoke'])
        ->name('patient.authorizations.revoke');

    // Historique des accès
    Route::get('/access-history', [PatientAccessHistoryController::class, 'index'])
        ->name('patient.access-history');

    // Mes médecins
    Route::get('/doctors', [PatientDoctorController::class, 'index'])
        ->name('patient.doctors');
});