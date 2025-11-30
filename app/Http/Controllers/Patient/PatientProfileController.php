<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\SecurityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Crypt;


class PatientProfileController extends Controller
{
    public function edit()
    {
        $user = Auth::user();
        $patient = $user->patient;

        return Inertia::render('Patient/Profile', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'patient' => [
                'id' => $patient->id,
                'birth_date' => $patient->birth_date?->format('Y-m-d'),
                'phone' => $patient->phone,
                'gender' => $patient->gender,
                'address' => $patient->address,
                'city' => $patient->city,
                'postal_code' => $patient->postal_code,
                'blood_type' => $patient->blood_type,
                'allergies' => $patient->allergies ?? [],
                'medical_history' => $patient->medical_history ?? [],
                'current_treatments' => $patient->current_treatments ?? [],
            ]
        ]);
    }

public function update(Request $request)
{
    $user = Auth::user();
    $patient = $user->patient;

    $validated = $request->validate([
        'phone' => 'nullable|string|max:20',
        'gender' => 'nullable|in:M,F,Other',
        'address' => 'nullable|string|max:255',
        'city' => 'nullable|string|max:100',
        'postal_code' => 'nullable|string|max:10',
        'blood_type' => 'nullable|string|max:5',
        'allergies' => 'nullable|array',
        'allergies.*' => 'string|max:255',
        'medical_history' => 'nullable|array',
        'medical_history.*' => 'string|max:255',
        'current_treatments' => 'nullable|array',
        'current_treatments.*' => 'string|max:255',
    ], [
        'phone.max' => 'Le téléphone ne doit pas dépasser 20 caractères',
        'gender.in' => 'Le sexe doit être M, F ou Other',
        'address.max' => 'L\'adresse ne doit pas dépasser 255 caractères',
        'city.max' => 'La ville ne doit pas dépasser 100 caractères',
        'postal_code.max' => 'Le code postal ne doit pas dépasser 10 caractères',
        'blood_type.max' => 'Le groupe sanguin ne doit pas dépasser 5 caractères',
    ]);

    DB::beginTransaction();
    
    try {
        // 🔥 IMPORTANT : Forcer les mutateurs en assignant directement
        $patient->phone = $validated['phone'] ?? $patient->phone;
        $patient->gender = $validated['gender'] ?? $patient->gender;
        $patient->address = $validated['address'] ?? $patient->address;
        $patient->city = $validated['city'] ?? $patient->city;
        $patient->postal_code = $validated['postal_code'] ?? $patient->postal_code;
        $patient->blood_type = $validated['blood_type'] ?? $patient->blood_type;
        
        // 🔥 ALLERGIES : Chiffrement manuel
        if (isset($validated['allergies']) && !empty($validated['allergies'])) {
            $patient->allergies_encrypted = Crypt::encryptString(json_encode($validated['allergies']));
        } else {
            $patient->allergies_encrypted = null;
        }
        
        // 🔥 ANTÉCÉDENTS : Chiffrement manuel
        if (isset($validated['medical_history']) && !empty($validated['medical_history'])) {
            $patient->medical_history_encrypted = Crypt::encryptString(json_encode($validated['medical_history']));
        } else {
            $patient->medical_history_encrypted = null;
        }
        
        // 🔥 TRAITEMENTS : Chiffrement manuel
        if (isset($validated['current_treatments']) && !empty($validated['current_treatments'])) {
            $patient->current_treatments_encrypted = Crypt::encryptString(json_encode($validated['current_treatments']));
        } else {
            $patient->current_treatments_encrypted = null;
        }
        
        $patient->save();

        // Log de sécurité
        SecurityLog::log(
            'profile_updated',
            $user->id,
            "Le patient {$user->name} a mis à jour son profil",
            'low'
        );

        DB::commit();

        return back()->with('success', '✅ Profil mis à jour avec succès');
        
    } catch (\Exception $e) {
        DB::rollBack();
        \Log::error('Erreur mise à jour profil patient:', [
            'error' => $e->getMessage(),
            'user_id' => $user->id
        ]);
        return back()->withErrors(['error' => 'Une erreur est survenue : ' . $e->getMessage()]);
    }
}
}