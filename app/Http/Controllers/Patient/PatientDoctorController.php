<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PatientDoctorController extends Controller
{
    /**
     * Liste des médecins autorisés
     */
    public function index()
    {
        $user = Auth::user();
        $patient = $user->patient;

        // Récupérer les médecins autorisés avec statistiques
        $doctors = $patient->accessAuthorizations()
            ->where('status', 'active')
            ->where('valid_until', '>=', now())
            ->with('doctor')
            ->get()
            ->map(function($auth) use ($patient) {
                $doctor = $auth->doctor;
                
                // Statistiques pour ce médecin
                $consultationsCount = $patient->medicalRecords()
                    ->where('doctor_id', $doctor->id)
                    ->count();
                
                $prescriptionsCount = $patient->prescriptions()
                    ->where('doctor_id', $doctor->id)
                    ->count();
                
                $lastConsultation = $patient->medicalRecords()
                    ->where('doctor_id', $doctor->id)
                    ->latest('consultation_date')
                    ->first();

                return [
                    'id' => $doctor->id,
                    'name' => $doctor->name,
                    'email' => $doctor->email,
                    'specialty' => $doctor->specialty ?? 'Médecin généraliste',
                    'rpps_number' => $doctor->rpps_number,
                    'access_level' => $auth->access_level,
                    'authorized_since' => $auth->valid_from->format('d/m/Y'),
                    'valid_until' => $auth->valid_until->format('d/m/Y'),
                    'days_remaining' => now()->diffInDays($auth->valid_until, false),
                    'reason' => $auth->reason,
                    'consultations_count' => $consultationsCount,
                    'prescriptions_count' => $prescriptionsCount,
                    'last_consultation_date' => $lastConsultation ? $lastConsultation->consultation_date->format('d/m/Y') : null,
                ];
            });

        // Statistiques globales
        $stats = [
            'total_doctors' => $doctors->count(),
            'write_access' => $doctors->where('access_level', 'write')->count(),
            'read_access' => $doctors->where('access_level', 'read')->count(),
            'total_consultations' => $patient->medicalRecords()->count(),
        ];

        return Inertia::render('Patient/MyDoctors', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'doctors' => $doctors,
            'stats' => $stats,
        ]);
    }
}