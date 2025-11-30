<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\MedicalRecord;
use App\Models\AccessAuthorization;
use App\Models\SecurityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DoctorMedicalRecordController extends Controller
{
    /**
     * Afficher le formulaire de création d'un dossier médical
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
            abort(403, 'Vous n\'avez pas l\'autorisation d\'écrire dans ce dossier');
        }

        $patient = \App\Models\Patient::with('user')->findOrFail($patientId);

        return Inertia::render('Doctor/CreateMedicalRecord', [
            'patient' => [
                'id' => $patient->id,
                'name' => $patient->user->name,
                'age' => $patient->birth_date?->age,
                'blood_type' => $patient->blood_type,
            ]
        ]);
    }

    /**
     * Créer un nouveau dossier médical
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
                'error' => 'Vous n\'avez pas l\'autorisation d\'écrire dans ce dossier'
            ]);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'consultation_date' => 'required|date',
            'symptoms' => 'required|string',
            'diagnosis' => 'required|string',
            'treatment' => 'required|string',
            'notes' => 'nullable|string',
            'is_emergency' => 'boolean',
            'consultation_type' => 'nullable|string|max:255',
        ], [
            'title.required' => 'Le titre est obligatoire',
            'consultation_date.required' => 'La date de consultation est obligatoire',
            'symptoms.required' => 'Les symptômes sont obligatoires',
            'diagnosis.required' => 'Le diagnostic est obligatoire',
            'treatment.required' => 'Le traitement est obligatoire',
        ]);

        DB::beginTransaction();
        
        try {
            $medicalRecord = MedicalRecord::create([
                'patient_id' => $patientId,
                'doctor_id' => $doctorId,
                'title' => $validated['title'],
                'consultation_date' => $validated['consultation_date'],
                'symptoms' => $validated['symptoms'],
                'diagnosis' => $validated['diagnosis'],
                'treatment' => $validated['treatment'],
                'notes' => $validated['notes'] ?? null,
                'is_emergency' => $validated['is_emergency'] ?? false,
                'consultation_type' => $validated['consultation_type'] ?? null,
            ]);

            // Log de sécurité
            SecurityLog::log(
                'profile_updated',
                $doctorId,
                "Dr. " . Auth::user()->name . " a créé un dossier médical pour le patient ID {$patientId}",
                'low',
                ['medical_record_id' => $medicalRecord->id, 'patient_id' => $patientId]
            );

            DB::commit();

            return redirect()->route('doctor.patients.show', $patientId)
                ->with('success', '✅ Dossier médical créé avec succès');
                
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur création dossier médical:', [
                'message' => $e->getMessage(),
                'doctor_id' => $doctorId,
                'patient_id' => $patientId
            ]);
            
            return back()->withErrors([
                'error' => 'Une erreur est survenue lors de la création du dossier'
            ])->withInput();
        }
    }

    /**
     * Afficher le formulaire de modification
     */
    public function edit($recordId)
    {
        $doctorId = Auth::id();
        
        $medicalRecord = MedicalRecord::with('patient.user')->findOrFail($recordId);
        
        // Vérifier que c'est bien le médecin qui a créé ce dossier
        if ($medicalRecord->doctor_id !== $doctorId) {
            abort(403, 'Vous ne pouvez modifier que vos propres dossiers');
        }

        // Vérifier l'autorisation d'écriture
        $authorization = AccessAuthorization::where('doctor_id', $doctorId)
            ->where('patient_id', $medicalRecord->patient_id)
            ->where('status', 'active')
            ->first();

        if (!$authorization || !$authorization->canWrite()) {
            abort(403, 'Vous n\'avez plus l\'autorisation d\'écrire dans ce dossier');
        }

        return Inertia::render('Doctor/EditMedicalRecord', [
            'medicalRecord' => [
                'id' => $medicalRecord->id,
                'title' => $medicalRecord->title,
                'consultation_date' => $medicalRecord->consultation_date->format('Y-m-d'),
                'symptoms' => $medicalRecord->symptoms,
                'diagnosis' => $medicalRecord->diagnosis,
                'treatment' => $medicalRecord->treatment,
                'notes' => $medicalRecord->notes,
                'is_emergency' => $medicalRecord->is_emergency,
                'consultation_type' => $medicalRecord->consultation_type,
            ],
            'patient' => [
                'id' => $medicalRecord->patient->id,
                'name' => $medicalRecord->patient->user->name,
            ]
        ]);
    }

    /**
     * Mettre à jour un dossier médical
     */
    public function update(Request $request, $recordId)
    {
        $doctorId = Auth::id();
        
        $medicalRecord = MedicalRecord::findOrFail($recordId);
        
        // Vérifier que c'est bien le médecin qui a créé ce dossier
        if ($medicalRecord->doctor_id !== $doctorId) {
            abort(403, 'Vous ne pouvez modifier que vos propres dossiers');
        }

        // Vérifier l'autorisation d'écriture
        $authorization = AccessAuthorization::where('doctor_id', $doctorId)
            ->where('patient_id', $medicalRecord->patient_id)
            ->where('status', 'active')
            ->first();

        if (!$authorization || !$authorization->canWrite()) {
            return back()->withErrors([
                'error' => 'Vous n\'avez plus l\'autorisation d\'écrire dans ce dossier'
            ]);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'symptoms' => 'required|string',
            'diagnosis' => 'required|string',
            'treatment' => 'required|string',
            'notes' => 'nullable|string',
            'is_emergency' => 'boolean',
            'consultation_type' => 'nullable|string|max:255',
        ]);

        $medicalRecord->update($validated);

        // Log de sécurité
        SecurityLog::log(
            'profile_updated',
            $doctorId,
            "Dr. " . Auth::user()->name . " a modifié le dossier médical ID {$recordId}",
            'low',
            ['medical_record_id' => $recordId]
        );

        return redirect()->route('doctor.patients.show', $medicalRecord->patient_id)
            ->with('success', '✅ Dossier médical mis à jour');
    }

    /**
     * Supprimer un dossier médical
     */
    public function destroy($recordId)
    {
        $doctorId = Auth::id();
        
        $medicalRecord = MedicalRecord::findOrFail($recordId);
        
        // Vérifier que c'est bien le médecin qui a créé ce dossier
        if ($medicalRecord->doctor_id !== $doctorId) {
            abort(403, 'Vous ne pouvez supprimer que vos propres dossiers');
        }

        $patientId = $medicalRecord->patient_id;

        $medicalRecord->delete();

        // Log de sécurité
        SecurityLog::log(
            'profile_updated',
            $doctorId,
            "Dr. " . Auth::user()->name . " a supprimé le dossier médical ID {$recordId}",
            'medium',
            ['medical_record_id' => $recordId, 'patient_id' => $patientId]
        );

        return redirect()->route('doctor.patients.show', $patientId)
            ->with('success', 'Dossier médical supprimé');
    }
}