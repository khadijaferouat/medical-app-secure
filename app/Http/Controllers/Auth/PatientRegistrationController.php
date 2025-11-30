<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Patient;
use App\Models\SecurityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules;

class PatientRegistrationController extends Controller
{
    public function create()
    {
        return inertia('Auth/Register');
    }

    public function store(Request $request)
    {
        Log::info('========== DÉBUT INSCRIPTION PATIENT ==========');
        Log::info('Toutes les données:', $request->all());
        
        try {
            // Validation
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
                'birth_date' => 'required|date|before:today',
                'phone' => 'nullable|string|max:20',
            ], [
                'name.required' => 'Le nom complet est obligatoire',
                'email.required' => 'L\'email est obligatoire',
                'email.unique' => 'Cet email est déjà utilisé',
                'password.required' => 'Le mot de passe est obligatoire',
                'password.confirmed' => 'Les mots de passe ne correspondent pas',
                'birth_date.required' => 'La date de naissance est obligatoire',
                'birth_date.before' => 'La date de naissance doit être dans le passé',
            ]);

            // Utiliser une transaction pour créer User et Patient ensemble
            DB::beginTransaction();
            
            try {
                // Créer l'utilisateur
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'role' => 'patient',
                    'status' => 'active', // Les patients sont actifs immédiatement
                ]);

                Log::info('✅ User créé:', ['id' => $user->id]);

                // Créer le profil patient
                $patient = Patient::create([
                    'user_id' => $user->id,
                    'birth_date' => $request->birth_date,
                    'phone' => $request->phone,
                    'gender' => null,
                    'blood_type' => null,
                    'allergies' => [],
                    'medical_history' => [],
                    'current_treatments' => [],
                ]);

                Log::info('✅ Patient créé:', ['id' => $patient->id]);

                // ✅ LOG DE SÉCURITÉ : Nouveau patient inscrit
                SecurityLog::log(
                    'profile_updated',
                    $user->id,
                    "Nouveau patient inscrit : {$user->name}",
                    'low'
                );

                DB::commit();

                Log::info('✅✅✅ PATIENT INSCRIT AVEC SUCCÈS !', [
                    'user_id' => $user->id,
                    'patient_id' => $patient->id,
                    'email' => $user->email,
                    'name' => $user->name
                ]);

                // Connecter automatiquement le patient
                auth()->login($user);

                // ✅ LOG DE SÉCURITÉ : Connexion automatique
                SecurityLog::log(
                    'login_success',
                    $user->id,
                    "Connexion automatique après inscription pour {$user->name}",
                    'low'
                );

                return redirect()->route('patient.dashboard')->with('success', 
                    'Bienvenue ! Votre compte a été créé avec succès.'
                );
                
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Erreur de validation:', $e->errors());
            throw $e;
        } catch (\Exception $e) {
            Log::error('❌❌❌ ERREUR LORS DE LA CRÉATION:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            
            return back()->withErrors([
                'error' => 'Une erreur est survenue. Veuillez réessayer.'
            ])->withInput();
        }
    }
}