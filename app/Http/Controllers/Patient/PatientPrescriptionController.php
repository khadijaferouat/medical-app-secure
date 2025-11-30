<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\Prescription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PatientPrescriptionController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $patient = $user->patient;

        $filter = $request->input('filter', 'all');

        $query = $patient->prescriptions()
            ->with(['doctor', 'medications', 'medicalRecord'])
            ->orderBy('prescription_date', 'desc');

        if ($filter === 'active') {
            $query->where('status', 'active')
                  ->where('valid_until', '>=', now());
        } elseif ($filter === 'expired') {
            $query->where(function($q) {
                $q->where('status', 'expired')
                  ->orWhere('status', 'cancelled')
                  ->orWhere(function($q2) {
                      $q2->where('status', 'active')
                         ->where('valid_until', '<', now());
                  });
            });
        }

        $prescriptions = $query->get()->map(function($prescription) {
            $daysRemaining = $prescription->days_remaining;
            $isActive = $prescription->status === 'active' && $daysRemaining > 0;

            return [
                'id' => $prescription->id,
                'prescription_date' => $prescription->prescription_date->format('d/m/Y'),
                'valid_until' => $prescription->valid_until->format('d/m/Y'),
                'status' => $prescription->status,
                'is_active' => $isActive,
                'days_remaining' => $daysRemaining,
                'doctor_name' => $prescription->doctor->name,
                'doctor_specialty' => $prescription->doctor->specialty ?? 'Médecin',
                'instructions' => $prescription->instructions,
                'medical_record_title' => $prescription->medicalRecord?->title,
                'medications' => $prescription->medications->map(function($med) {
                    return [
                        'id' => $med->id,
                        'name' => $med->name,
                        'dosage' => $med->dosage,
                        'posology' => $med->posology,
                        'duration_days' => $med->duration_days,
                    ];
                })->toArray(), // ← AJOUTÉ ->toArray()
            ];
        });

        $stats = [
            'total' => $patient->prescriptions()->count(),
            'active' => $patient->prescriptions()
                ->where('status', 'active')
                ->where('valid_until', '>=', now())
                ->count(),
            'expired' => $patient->prescriptions()
                ->where(function($q) {
                    $q->where('status', 'expired')
                      ->orWhere('status', 'cancelled')
                      ->orWhere(function($q2) {
                          $q2->where('status', 'active')
                             ->where('valid_until', '<', now());
                      });
                })
                ->count(),
        ];

        return Inertia::render('Patient/MyPrescriptions', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'prescriptions' => $prescriptions,
            'stats' => $stats,
            'currentFilter' => $filter,
        ]);
    }

    public function show($prescriptionId)
    {
        $user = Auth::user();
        $patient = $user->patient;

        $prescription = $patient->prescriptions()
            ->with(['doctor', 'medications', 'medicalRecord'])
            ->findOrFail($prescriptionId);

        $daysRemaining = $prescription->days_remaining;
        $isActive = $prescription->status === 'active' && $daysRemaining > 0;

        return Inertia::render('Patient/PrescriptionDetails', [
            'user' => [
                'id' => $user->id,           // ← AJOUTÉ id
                'name' => $user->name,
                'email' => $user->email,     // ← AJOUTÉ email
            ],
            'id' => $prescription->id,
            'prescription_date' => $prescription->prescription_date->format('d/m/Y'),
            'valid_until' => $prescription->valid_until->format('d/m/Y'),
            'status' => $prescription->status,
            'is_active' => $isActive,
            'days_remaining' => $daysRemaining,
            'doctor_name' => $prescription->doctor->name,
            'doctor_specialty' => $prescription->doctor->specialty ?? 'Médecin',
            'doctor_rpps' => $prescription->doctor->rpps_number,
            'instructions' => $prescription->instructions,
            'medical_record_title' => $prescription->medicalRecord?->title,
            'medical_record_date' => $prescription->medicalRecord?->consultation_date->format('d/m/Y'),
            'medications' => $prescription->medications->map(function($med) {
                return [
                    'id' => $med->id,
                    'name' => $med->name,
                    'dosage' => $med->dosage,
                    'posology' => $med->posology,
                    'duration_days' => $med->duration_days,
                ];
            })->toArray(), // ← AJOUTÉ ->toArray()
            'patient_name' => $user->name,
            'patient_birth_date' => $patient->birth_date->format('d/m/Y'),
            'patient_age' => $patient->age,
        ]);
    }
}