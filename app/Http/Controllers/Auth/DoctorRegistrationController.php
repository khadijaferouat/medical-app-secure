<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\SecurityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;

class DoctorRegistrationController extends Controller
{
    public function create()
    {
        return inertia('Auth/RegisterDoctor');
    }

    public function store(Request $request)
    {
        Log::info('========== DÉBUT INSCRIPTION MÉDECIN ==========');
        Log::info('Toutes les données:', $request->all());
        
        try {
            // Validation
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
                'rpps_number' => 'required|string|size:11|unique:users',
                'specialty' => 'required|string|max:255',
                'diploma' => 'required|file|mimes:pdf|max:5120',
            ], [
                'name.required' => 'Le nom complet est obligatoire',
                'email.required' => 'L\'email est obligatoire',
                'email.unique' => 'Cet email est déjà utilisé',
                'password.required' => 'Le mot de passe est obligatoire',
                'password.confirmed' => 'Les mots de passe ne correspondent pas',
                'rpps_number.required' => 'Le numéro RPPS est obligatoire',
                'rpps_number.size' => 'Le numéro RPPS doit contenir exactement 11 chiffres',
                'rpps_number.unique' => 'Ce numéro RPPS est déjà enregistré',
                'specialty.required' => 'La spécialité est obligatoire',
                'diploma.required' => 'Le diplôme est obligatoire',
                'diploma.mimes' => 'Le diplôme doit être un fichier PDF',
                'diploma.max' => 'Le diplôme ne doit pas dépasser 5 Mo',
            ]);

            // Upload du diplôme
            $diplomaPath = null;
            if ($request->hasFile('diploma')) {
                $diplomaPath = $request->file('diploma')->store('diplomas', 'public');
                Log::info('Diplôme uploadé:', ['path' => $diplomaPath]);
            }

            // Créer l'utilisateur avec statut "pending"
            $doctor = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'doctor',
                'status' => 'pending',
                'rpps_number' => $request->rpps_number,
                'specialty' => $request->specialty,
                'diploma_path' => $diplomaPath,
            ]);

            Log::info('✅✅✅ MÉDECIN CRÉÉ AVEC SUCCÈS !', [
                'id' => $doctor->id,
                'email' => $doctor->email,
                'name' => $doctor->name,
                'diploma_path' => $doctor->diploma_path
            ]);

            // ✅ LOG DE SÉCURITÉ : Nouvelle demande médecin
            SecurityLog::log(
                'doctor_approved',
                $doctor->id,
                "Nouvelle demande de compte médecin : Dr. {$doctor->name} ({$doctor->specialty})",
                'low',
                [
                    'rpps' => $doctor->rpps_number,
                    'specialty' => $doctor->specialty,
                ]
            );

            // TODO: Notifier les admins
            // $admins = User::where('role', 'admin')->get();
            // Notification::send($admins, new NewDoctorRegistration($doctor));

            return redirect()->route('login')->with('success', 
                'Votre demande a été envoyée avec succès ! Un administrateur va l\'examiner. Vous recevrez un email de confirmation.'
            );
            
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