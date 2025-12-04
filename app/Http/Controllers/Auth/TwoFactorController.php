<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\SecurityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorController extends Controller
{
    protected $google2fa;

    public function __construct()
    {
        $this->google2fa = new Google2FA();
    }

    /**
     * Afficher la page d'activation 2FA
     */
    public function show()
    {
        $user = Auth::user();

        if ($user->google2fa_enabled) {
            return redirect()->back()->with('info', 'Le 2FA est déjà activé');
        }

        // Générer un secret
        $secret = $this->google2fa->generateSecretKey();

        // Générer le QR Code
        $qrCodeUrl = $this->google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $secret
        );

        return Inertia::render('Auth/Setup2FA', [
            'qrCodeUrl' => $qrCodeUrl,
            'secret' => $secret,
        ]);
    }

    /**
     * Activer le 2FA
     */
    public function enable(Request $request)
    {
        $request->validate([
            'secret' => 'required',
            'one_time_password' => 'required|digits:6',
        ]);

        $user = Auth::user();

        // Vérifier le code OTP
        $valid = $this->google2fa->verifyKey($request->secret, $request->one_time_password);

        if (!$valid) {
            return back()->withErrors(['one_time_password' => 'Code invalide']);
        }

        // Générer des codes de récupération
        $recoveryCodes = $this->generateRecoveryCodes();

        // Activer 2FA
        $user->update([
            'google2fa_secret' => encrypt($request->secret),
            'google2fa_enabled' => true,
            'recovery_codes' => encrypt(json_encode($recoveryCodes)),
        ]);

        // Log de sécurité
        SecurityLog::log(
            '2fa_enabled',
            $user->id,
            "{$user->name} a activé l'authentification à deux facteurs",
            'low'
        );

        return Inertia::render('Auth/RecoveryCodes', [
            'recoveryCodes' => $recoveryCodes,
        ]);
    }

    /**
     * Désactiver le 2FA
     */
    public function disable(Request $request)
    {
        $request->validate([
            'password' => 'required',
        ]);

        $user = Auth::user();

        // Vérifier le mot de passe
        if (!Hash::check($request->password, $user->password)) {
            return back()->withErrors(['password' => 'Mot de passe incorrect']);
        }

        $user->update([
            'google2fa_secret' => null,
            'google2fa_enabled' => false,
            'recovery_codes' => null,
        ]);

        // Log de sécurité
        SecurityLog::log(
            '2fa_disabled',
            $user->id,
            "{$user->name} a désactivé l'authentification à deux facteurs",
            'medium'
        );

        return redirect()->back()->with('success', '2FA désactivé avec succès');
    }

    /**
     * Afficher le challenge 2FA lors du login
     */
    public function challenge()
    {
        if (!session()->has('2fa:user:id')) {
            return redirect()->route('login');
        }

        return Inertia::render('Auth/TwoFactorChallenge');
    }

    /**
     * Vérifier le code 2FA lors du login
     */
    public function verify(Request $request)
    {
        $request->validate([
            'one_time_password' => 'required',
        ]);

        $userId = session('2fa:user:id');
        $remember = session('2fa:remember');

        if (!$userId) {
            return redirect()->route('login');
        }

        $user = \App\Models\User::find($userId);

        if (!$user) {
            return redirect()->route('login');
        }

        $secret = decrypt($user->google2fa_secret);

        // Vérifier le code OTP
        $valid = $this->google2fa->verifyKey($secret, $request->one_time_password);

        if (!$valid) {
            // Vérifier si c'est un code de récupération
            if ($this->useRecoveryCode($user, $request->one_time_password)) {
                $valid = true;
            }
        }

        if (!$valid) {
            return back()->withErrors(['one_time_password' => 'Code invalide']);
        }

        // Connecter l'utilisateur
        Auth::login($user, $remember);

        session()->forget(['2fa:user:id', '2fa:remember']);

        // Log de sécurité
        SecurityLog::log(
            'login_success',
            $user->id,
            "Connexion réussie avec 2FA pour {$user->name}",
            'low'
        );

        // Redirection selon le rôle
        if ($user->role === 'admin') {
            return redirect()->intended('/admin/dashboard');
        } elseif ($user->role === 'doctor') {
            return redirect()->intended('/doctor/dashboard');
        } else {
            return redirect()->intended('/patient/dashboard');
        }
    }

    /**
     * Générer des codes de récupération
     */
    protected function generateRecoveryCodes()
    {
        $codes = [];
        for ($i = 0; $i < 8; $i++) {
            $codes[] = Str::random(10);
        }
        return $codes;
    }

    /**
     * Utiliser un code de récupération
     */
    protected function useRecoveryCode($user, $code)
    {
        $recoveryCodes = json_decode(decrypt($user->recovery_codes), true);

        if (!in_array($code, $recoveryCodes)) {
            return false;
        }

        // Retirer le code utilisé
        $recoveryCodes = array_diff($recoveryCodes, [$code]);

        $user->update([
            'recovery_codes' => encrypt(json_encode(array_values($recoveryCodes))),
        ]);

        // Log de sécurité
        SecurityLog::log(
            'recovery_code_used',
            $user->id,
            "{$user->name} a utilisé un code de récupération pour se connecter",
            'medium'
        );

        return true;
    }
}