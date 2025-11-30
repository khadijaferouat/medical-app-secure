<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\SecurityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class DoctorProfileController extends Controller
{
    /**
     * Afficher le profil du médecin
     */
    public function edit()
    {
        $user = Auth::user();

        if ($user->role !== 'doctor') {
            abort(403, 'Accès non autorisé');
        }

        // Statistiques du médecin
        $stats = [
            'total_patients' => $user->prescriptionsAsDoctor()->distinct('patient_id')->count('patient_id'),
            'total_consultations' => $user->medicalRecordsAsDoctor()->count(),
            'total_prescriptions' => $user->prescriptionsAsDoctor()->count(),
            'active_since' => $user->created_at->format('d/m/Y'),
            'days_active' => $user->created_at->diffInDays(now()),
        ];

        return Inertia::render('Doctor/Profile', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'specialty' => $user->specialty,
                'rpps_number' => $user->rpps_number,
                'status' => $user->status,
                'created_at' => $user->created_at->format('d/m/Y'),
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Mettre à jour le profil
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'doctor') {
            abort(403, 'Accès non autorisé');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'specialty' => 'required|string|max:255',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'specialty' => $validated['specialty'],
        ]);

        // Log de sécurité
        SecurityLog::log(
            'doctor_profile_updated',
            $user->id,
            "Dr. {$user->name} a mis à jour son profil",
            'low',
            ['updated_fields' => array_keys($validated)]
        );

        return back()->with('success', '✅ Profil mis à jour avec succès');
    }

    /**
     * Changer le mot de passe
     */
    public function updatePassword(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'doctor') {
            abort(403, 'Accès non autorisé');
        }

        $validated = $request->validate([
            'current_password' => 'required',
            'password' => ['required', 'confirmed', Password::min(8)->letters()->numbers()->mixedCase()],
        ], [
            'current_password.required' => 'Le mot de passe actuel est requis',
            'password.required' => 'Le nouveau mot de passe est requis',
            'password.confirmed' => 'Les mots de passe ne correspondent pas',
        ]);

        // Vérifier le mot de passe actuel
        if (!Hash::check($validated['current_password'], $user->password)) {
            return back()->withErrors(['current_password' => 'Le mot de passe actuel est incorrect']);
        }

        // Mettre à jour le mot de passe
        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        // Log de sécurité
        SecurityLog::log(
            'doctor_password_changed',
            $user->id,
            "Dr. {$user->name} a changé son mot de passe",
            'medium',
            ['ip' => $request->ip()]
        );

        return back()->with('success', '✅ Mot de passe changé avec succès');
    }
}