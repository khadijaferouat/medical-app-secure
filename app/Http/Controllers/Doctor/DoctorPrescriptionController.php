<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Prescription;
use App\Models\Medication;
use App\Models\AccessAuthorization;
use App\Models\SecurityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DoctorPrescriptionController extends Controller
{
    /**
     * Afficher le formulaire de création d'ordonnance
     */
    public function create($patientId)
    {
        $doctorId = Auth::id();
        
        // Vérifier l'autorisation d'écriture
        $authorization = AccessAuthorization::where('doctor_id', $doctorId)
            ->where('patient_id', $patientId)
            ->where('status', 'active')
            ->first();

        if (!$authorization || !$authorization->canWrite()) {
            abort(403, 'Vous n\'avez pas l\'autorisation de créer des prescriptions');
        }

        $patient = \App\Models\Patient::with('user')->findOrFail($patientId);

        // Récupérer les dossiers médicaux récents
        $recentRecords = $patient->medicalRecords()
            ->where('doctor_id', $doctorId)
            ->latest('consultation_date')
            ->take(10)
            ->get()
            ->map(function ($record) {
                return [
                    'id' => $record->id,
                    'title' => $record->title,
                    'consultation_date' => $record->consultation_date->format('Y-m-d'),
                ];
            });

        return Inertia::render('Doctor/CreatePrescription', [
            'patient' => [
                'id' => $patient->id,
                'name' => $patient->user->name,
                'age' => $patient->birth_date?->age,
                'blood_type' => $patient->blood_type,
                'allergies' => $patient->allergies,
            ],
            'recentRecords' => $recentRecords
        ]);
    }

    /**
     * Créer une nouvelle prescription
     */
public function store(Request $request, $patientId)
{
    $doctorId = Auth::id();
    
    // Vérifier l'autorisation d'écriture
    $authorization = AccessAuthorization::where('doctor_id', $doctorId)
        ->where('patient_id', $patientId)
        ->where('status', 'active')
        ->first();

    if (!$authorization || !$authorization->canWrite()) {
        return back()->withErrors([
            'error' => 'Vous n\'avez pas l\'autorisation de créer des prescriptions'
        ]);
    }

    $validated = $request->validate([
        'medical_record_id' => 'nullable|exists:medical_records,id',
        'prescription_date' => 'required|date',
        'valid_until' => 'required|date|after:prescription_date',
        'instructions' => 'nullable|string',
        'medications' => 'required|array|min:1',
        'medications.*.name' => 'required|string|max:255',
        'medications.*.dosage' => 'required|string|max:255',
        'medications.*.posology' => 'required|string',
        'medications.*.duration_days' => 'required|integer|min:1|max:365',
    ], [
        'prescription_date.required' => 'La date de prescription est obligatoire',
        'valid_until.required' => 'La date de validité est obligatoire',
        'valid_until.after' => 'La date de validité doit être après la date de prescription',
        'medications.required' => 'Au moins un médicament est requis',
        'medications.*.name.required' => 'Le nom du médicament est obligatoire',
        'medications.*.dosage.required' => 'Le dosage est obligatoire',
        'medications.*.posology.required' => 'La posologie est obligatoire',
        'medications.*.duration_days.required' => 'La durée est obligatoire',
    ]);

    // 🔥 DEBUG : Voir ce qui est envoyé
    Log::info('=== CRÉATION ORDONNANCE ===');
    Log::info('Validated data:', $validated);
    Log::info('Medications count: ' . count($validated['medications']));
    Log::info('Medications:', $validated['medications']);

    DB::beginTransaction();
    
    try {
        $prescription = Prescription::create([
            'medical_record_id' => $validated['medical_record_id'] ?? null,
            'patient_id' => $patientId,
            'doctor_id' => $doctorId,
            'prescription_date' => $validated['prescription_date'],
            'valid_until' => $validated['valid_until'],
            'instructions' => $validated['instructions'] ?? null,
            'status' => 'active',
        ]);

        Log::info('✅ Prescription créée ID: ' . $prescription->id);

        // Créer les médicaments
        $medicationsCreated = 0;
        foreach ($validated['medications'] as $medData) {
            Log::info('Création médicament:', $medData);
            
            $medication = Medication::create([
                'prescription_id' => $prescription->id,
                'name' => $medData['name'],
                'dosage' => $medData['dosage'],
                'posology' => $medData['posology'],
                'duration_days' => $medData['duration_days'],
            ]);
            
            Log::info('✅ Médicament créé ID: ' . $medication->id);
            $medicationsCreated++;
        }

        Log::info("✅ Total médicaments créés : $medicationsCreated");

        // Log de sécurité
        SecurityLog::log(
            'profile_updated',
            $doctorId,
            "Dr. " . Auth::user()->name . " a créé une prescription pour le patient ID {$patientId}",
            'low',
            [
                'prescription_id' => $prescription->id,
                'patient_id' => $patientId,
                'medications_count' => $medicationsCreated
            ]
        );

        DB::commit();

        Log::info('✅ Transaction committed');

        return redirect()->route('doctor.patients.show', $patientId)
            ->with('success', "✅ Ordonnance créée avec succès ($medicationsCreated médicaments)");
            
    } catch (\Exception $e) {
        DB::rollBack();
        Log::error('❌ Erreur création prescription:', [
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'doctor_id' => $doctorId,
            'patient_id' => $patientId
        ]);
        
        return back()->withErrors([
            'error' => 'Une erreur est survenue lors de la création de l\'ordonnance: ' . $e->getMessage()
        ])->withInput();
    }
}

    /**
     * Voir les détails d'une prescription
     */
    public function show($prescriptionId)
    {
        $doctorId = Auth::id();
        
        $prescription = Prescription::with(['patient.user', 'medications', 'medicalRecord'])
            ->findOrFail($prescriptionId);

        // Vérifier que c'est bien le médecin qui a créé cette prescription
        if ($prescription->doctor_id !== $doctorId) {
            abort(403, 'Accès non autorisé');
        }

        return Inertia::render('Doctor/PrescriptionDetails', [
            'prescription' => [
                'id' => $prescription->id,
                'prescription_date' => $prescription->prescription_date->format('Y-m-d'),
                'valid_until' => $prescription->valid_until->format('Y-m-d'),
                'status' => $prescription->status,
                'days_remaining' => $prescription->days_remaining,
                'instructions' => $prescription->instructions,
                'patient_name' => $prescription->patient->user->name,
                'patient_id' => $prescription->patient->id,
                'medications' => $prescription->medications->map(function ($med) {
                    return [
                        'id' => $med->id,
                        'name' => $med->name,
                        'dosage' => $med->dosage,
                        'posology' => $med->posology,
                        'duration_days' => $med->duration_days,
                    ];
                }),
            ]
        ]);
    }

    /**
     * Annuler une prescription
     */
    public function cancel($prescriptionId)
    {
        $doctorId = Auth::id();
        
        $prescription = Prescription::findOrFail($prescriptionId);
        
        // Vérifier que c'est bien le médecin qui a créé cette prescription
        if ($prescription->doctor_id !== $doctorId) {
            abort(403, 'Vous ne pouvez annuler que vos propres prescriptions');
        }

        $prescription->update(['status' => 'cancelled']);

        // Log de sécurité
        SecurityLog::log(
            'profile_updated',
            $doctorId,
            "Dr. " . Auth::user()->name . " a annulé la prescription ID {$prescriptionId}",
            'medium',
            ['prescription_id' => $prescriptionId]
        );

        return back()->with('success', 'Prescription annulée');
    }
}