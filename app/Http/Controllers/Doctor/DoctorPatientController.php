<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\AccessAuthorization;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DoctorPatientController extends Controller
{
    /**
     * Liste des patients du médecin
     */
    public function index(Request $request)
    {
        $doctorId = Auth::id();
        
        // Récupérer les patients avec autorisation d'accès active
        $authorizations = AccessAuthorization::where('doctor_id', $doctorId)
            ->where('status', 'active')
            ->with(['patient.user', 'patient.medicalRecords'])
            ->get();

        $patients = $authorizations->map(function ($auth) {
            $patient = $auth->patient;
            $user = $patient->user;
            
            // Dernière consultation
            $lastVisit = $patient->medicalRecords()
                ->where('doctor_id', Auth::id())
                ->latest('consultation_date')
                ->first();

            return [
                'id' => $patient->id,
                'user_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'birth_date' => $patient->birth_date?->format('Y-m-d'),
                'age' => $patient->birth_date?->age,
                'phone' => $patient->phone,
                'blood_type' => $patient->blood_type,
                'gender' => $patient->gender,
                'last_visit' => $lastVisit ? $lastVisit->consultation_date->format('Y-m-d') : null,
                'authorization_level' => $auth->access_level,
                'authorization_valid_until' => $auth->valid_until?->format('Y-m-d'),
            ];
        });

        return Inertia::render('Doctor/PatientList', [
            'patients' => $patients
        ]);
    }

    /**
     * Détails d'un patient spécifique
     */
    public function show($patientId)
    {
        $doctorId = Auth::id();
        
        // Vérifier l'autorisation d'accès
        $authorization = AccessAuthorization::where('doctor_id', $doctorId)
            ->where('patient_id', $patientId)
            ->where('status', 'active')
            ->first();

        if (!$authorization || !$authorization->isActive()) {
            abort(403, 'Vous n\'avez pas l\'autorisation d\'accéder à ce dossier patient');
        }

        $patient = Patient::with(['user', 'medicalRecords.doctor', 'prescriptions.medications'])
            ->findOrFail($patientId);

        $user = $patient->user;

        // Filtrer les dossiers médicaux accessibles (seulement ceux créés par ce médecin)
        $medicalRecords = $patient->medicalRecords()
            ->where('doctor_id', $doctorId)
            ->with('doctor')
            ->latest('consultation_date')
            ->get()
            ->map(function ($record) {
                return [
                    'id' => $record->id,
                    'title' => $record->title,
                    'consultation_date' => $record->consultation_date->format('Y-m-d'),
                    'symptoms' => $record->symptoms,
                    'diagnosis' => $record->diagnosis,
                    'treatment' => $record->treatment,
                    'notes' => $record->notes,
                    'is_emergency' => $record->is_emergency,
                    'consultation_type' => $record->consultation_type,
                ];
            });

        // Prescriptions
        $prescriptions = $patient->prescriptions()
            ->where('doctor_id', $doctorId)
            ->with('medications')
            ->latest('prescription_date')
            ->get()
            ->map(function ($prescription) {
                return [
                    'id' => $prescription->id,
                    'prescription_date' => $prescription->prescription_date->format('Y-m-d'),
                    'valid_until' => $prescription->valid_until->format('Y-m-d'),
                    'status' => $prescription->status,
                    'days_remaining' => $prescription->days_remaining,
                    'instructions' => $prescription->instructions,
                    'medications' => $prescription->medications->map(function ($med) {
                        return [
                            'id' => $med->id,
                            'name' => $med->name,
                            'dosage' => $med->dosage,
                            'posology' => $med->posology,
                            'duration_days' => $med->duration_days,
                        ];
                    }),
                ];
            });

        return Inertia::render('Doctor/PatientDetails', [
            'patient' => [
                'id' => $patient->id,
                'name' => $user->name,
                'email' => $user->email,
                'birth_date' => $patient->birth_date?->format('Y-m-d'),
                'age' => $patient->birth_date?->age,
                'phone' => $patient->phone,
                'blood_type' => $patient->blood_type,
                'gender' => $patient->gender,
                'address' => $patient->address,
                'city' => $patient->city,
                'postal_code' => $patient->postal_code,
                'allergies' => $patient->allergies,
                'medical_history' => $patient->medical_history,
                'current_treatments' => $patient->current_treatments,
            ],
            'authorization' => [
                'access_level' => $authorization->access_level,
                'valid_until' => $authorization->valid_until?->format('Y-m-d'),
                'can_write' => $authorization->canWrite(),
            ],
            'medicalRecords' => $medicalRecords,
            'prescriptions' => $prescriptions,
        ]);
    }
}