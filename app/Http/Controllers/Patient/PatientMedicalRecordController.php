<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PatientMedicalRecordController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $patient = $user->patient;

        // Consultations
        $consultations = $patient->medicalRecords()
            ->with('doctor')
            ->orderBy('consultation_date', 'desc')
            ->get()
            ->map(function($record) {
                return [
                    'id' => $record->id,
                    'title' => $record->title,
                    'date' => $record->consultation_date->format('d/m/Y'),
                    'doctor_name' => $record->doctor->name,
                    'doctor_specialty' => $record->doctor->specialty ?? 'Médecin',
                    'symptoms' => $record->symptoms,
                    'diagnosis' => $record->diagnosis,
                    'treatment' => $record->treatment,
                ];
            });

        // Ordonnances
        $prescriptions = $patient->prescriptions()
            ->with(['doctor', 'medications'])
            ->orderBy('prescription_date', 'desc')
            ->get()
            ->map(function($prescription) {
                $daysRemaining = $prescription->days_remaining;
                
                return [
                    'id' => $prescription->id,
                    'date' => $prescription->prescription_date->format('d/m/Y'),
                    'doctor_name' => $prescription->doctor->name,
                    'status' => $prescription->status,
                    'days_remaining' => $daysRemaining,
                    'medications' => $prescription->medications->map(function($med) {
                        return [
                            'name' => $med->name,
                            'dosage' => $med->dosage,
                            'posology' => $med->posology,
                        ];
                    }),
                ];
            });

        return Inertia::render('Patient/MyMedicalRecord', [
            'patient' => [
                'name' => $user->name,
                'birth_date' => $patient->birth_date->format('d/m/Y'),
                'age' => $patient->age,
                'gender' => $patient->gender,
                'blood_type' => $patient->blood_type,
                'allergies' => $patient->allergies ?? [],
                'medical_history' => $patient->medical_history ?? [],
                'current_treatments' => $patient->current_treatments ?? [],
            ],
            'consultations' => $consultations,
            'prescriptions' => $prescriptions,
        ]);
    }
}