<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\SecurityLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Route;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthenticatedSessionController extends Controller
{
    /**
     * Afficher le formulaire de connexion
     */
    public function create()
    {
        return Inertia::render('Auth/Login', [
            'status' => session('status'),
        ]);
    }

    /**
     * Traiter la connexion
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $email = $request->input('email');
        $user = \App\Models\User::where('email', $email)->first();

        // Tentative de connexion
        if (Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            $request->session()->regenerate();

            $user = Auth::user();

            // ✅ LOG : Connexion réussie
            SecurityLog::log(
                'login_success',
                $user->id,
                "Connexion réussie pour {$user->name} ({$user->role})",
                'low'
            );

            // Si 2FA activé, ne pas connecter directement
            if ($user->google2fa_enabled) {
                auth()->logout();
                
                session([
                    '2fa:user:id' => $user->id,
                    '2fa:remember' => $request->boolean('remember'),
                ]);

                return redirect()->route('2fa.challenge');
            }

            // Redirection selon le rôle
            if ($user->role === 'admin') {
                return redirect()->intended('/admin/dashboard');
            } elseif ($user->role === 'doctor') {
                return redirect()->intended('/doctor/dashboard');
            } else {
                return redirect()->intended('/patient/dashboard');
            }
        }

        // ✅ LOG : Échec de connexion
        SecurityLog::log(
            'login_failed',
            $user ? $user->id : null,
            "Échec de connexion pour {$email}",
            'medium'
        );

        // Si échec
        throw ValidationException::withMessages([
            'email' => 'Les identifiants fournis sont incorrects.',
        ]);
    }

    /**
     * Déconnexion
     */
    public function destroy(Request $request)
    {
        // ✅ LOG : Déconnexion
        if (Auth::check()) {
            SecurityLog::log(
                'logout',
                Auth::id(),
                "Déconnexion de " . Auth::user()->name,
                'low'
            );
        }

        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}