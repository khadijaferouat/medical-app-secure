<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\AccessAuthorization;
use App\Models\User;
use App\Models\SecurityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PatientAccessController extends Controller
{
    /**
     * Afficher la page de gestion des accès
     */
    public function index()
    {
        $user = Auth::user();
        $patient = $user->patient;

        // Liste de TOUS les médecins actifs
        $availableDoctors = User::where('role', 'doctor')
            ->where('status', 'active')
            ->select('id', 'name', 'email', 'specialty', 'rpps_number')
            ->orderBy('name')
            ->get()
            ->map(function($doctor) use ($patient) {
                // Vérifier si déjà autorisé
                $authorization = $patient->accessAuthorizations()
                    ->where('doctor_id', $doctor->id)
                    ->where('status', 'active')
                    ->where('valid_until', '>=', now())
                    ->first();

                return [
                    'id' => $doctor->id,
                    'name' => $doctor->name,
                    'email' => $doctor->email,
                    'specialty' => $doctor->specialty ?? 'Médecin',
                    'rpps_number' => $doctor->rpps_number,
                    'is_authorized' => $authorization ? true : false,
                    'authorization_id' => $authorization?->id,
                    'access_level' => $authorization?->access_level,
                    'valid_until' => $authorization?->valid_until->format('d/m/Y'),
                ];
            });

        // Liste des autorisations actives
        $activeAuthorizations = $patient->accessAuthorizations()
            ->where('status', 'active')
            ->where('valid_until', '>=', now())
            ->with('doctor')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($auth) {
                return [
                    'id' => $auth->id,
                    'doctor_id' => $auth->doctor->id,
                    'doctor_name' => $auth->doctor->name,
                    'doctor_specialty' => $auth->doctor->specialty ?? 'Médecin',
                    'access_level' => $auth->access_level,
                    'valid_from' => $auth->valid_from->format('d/m/Y'),
                    'valid_until' => $auth->valid_until->format('d/m/Y'),
                    'reason' => $auth->reason,
                    'days_remaining' => now()->diffInDays($auth->valid_until, false),
                ];
            });

        return Inertia::render('Patient/AccessManagement', [
            'availableDoctors' => $availableDoctors,
            'activeAuthorizations' => $activeAuthorizations,
        ]);
    }

    /**
     * Autoriser un médecin
     */
    public function authorize(Request $request, $doctorId)
    {
        $user = Auth::user();
        $patient = $user->patient;

        // Validation
        $validated = $request->validate([
            'access_level' => 'required|in:read,write',
            'duration_months' => 'required|integer|min:1|max:60',
            'reason' => 'nullable|string|max:500',
        ], [
            'access_level.required' => 'Le niveau d\'accès est obligatoire',
            'access_level.in' => 'Le niveau d\'accès doit être "read" ou "write"',
            'duration_months.required' => 'La durée est obligatoire',
            'duration_months.integer' => 'La durée doit être un nombre',
            'duration_months.min' => 'La durée minimum est 1 mois',
            'duration_months.max' => 'La durée maximum est 60 mois (5 ans)',
        ]);

        // Vérifier que le médecin existe
        $doctor = User::where('id', $doctorId)
            ->where('role', 'doctor')
            ->where('status', 'active')
            ->first();

        if (!$doctor) {
            return back()->withErrors(['error' => 'Médecin introuvable ou inactif']);
        }

        // Vérifier si une autorisation active existe déjà
        $existingAuth = $patient->accessAuthorizations()
            ->where('doctor_id', $doctorId)
            ->where('status', 'active')
            ->where('valid_until', '>=', now())
            ->first();

        if ($existingAuth) {
            return back()->withErrors(['error' => 'Ce médecin a déjà accès à votre dossier']);
        }

        DB::beginTransaction();

        try {
            // Créer l'autorisation
            $authorization = AccessAuthorization::create([
                'patient_id' => $patient->id,
                'doctor_id' => $doctorId,
                'access_level' => $validated['access_level'],
                'valid_from' => now(),
                'valid_until' => now()->addMonths($validated['duration_months']),
                'status' => 'active',
                'reason' => $validated['reason'] ?? 'Autorisation patient',
            ]);

            // Log de sécurité
            SecurityLog::log(
                'profile_updated',
                $user->id,
                "Le patient {$user->name} a autorisé Dr. {$doctor->name} (niveau: {$validated['access_level']}, durée: {$validated['duration_months']} mois)",
                'low',
                [
                    'doctor_id' => $doctorId,
                    'doctor_name' => $doctor->name,
                    'access_level' => $validated['access_level'],
                    'duration_months' => $validated['duration_months'],
                ]
            );

            DB::commit();

            return back()->with('success', "✅ Dr. {$doctor->name} a maintenant accès à votre dossier médical");

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erreur autorisation médecin:', [
                'error' => $e->getMessage(),
                'patient_id' => $patient->id,
                'doctor_id' => $doctorId,
            ]);
            return back()->withErrors(['error' => 'Une erreur est survenue lors de l\'autorisation']);
        }
    }

    /**
     * Révoquer une autorisation
     */
    public function revoke($authorizationId)
    {
        $user = Auth::user();
        $patient = $user->patient;

        // Trouver l'autorisation
        $authorization = AccessAuthorization::where('id', $authorizationId)
            ->where('patient_id', $patient->id)
            ->where('status', 'active')
            ->with('doctor')
            ->first();

        if (!$authorization) {
            return back()->withErrors(['error' => 'Autorisation introuvable ou déjà révoquée']);
        }

        DB::beginTransaction();

        try {
            // Révoquer l'autorisation
            $authorization->update([
                'status' => 'revoked',
                'valid_until' => now(), // Expire immédiatement
            ]);

            // Log de sécurité
            SecurityLog::log(
                'profile_updated',
                $user->id,
                "Le patient {$user->name} a révoqué l'accès de Dr. {$authorization->doctor->name}",
                'medium',
                [
                    'doctor_id' => $authorization->doctor_id,
                    'doctor_name' => $authorization->doctor->name,
                    'previous_access_level' => $authorization->access_level,
                ]
            );

            DB::commit();

            return back()->with('success', "✅ L'accès de Dr. {$authorization->doctor->name} a été révoqué");

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erreur révocation autorisation:', [
                'error' => $e->getMessage(),
                'authorization_id' => $authorizationId,
            ]);
            return back()->withErrors(['error' => 'Une erreur est survenue lors de la révocation']);
        }
    }
}