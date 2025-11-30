<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SecurityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SecurityLogController extends Controller
{
    public function index(Request $request)
    {
        // Filtres
        $eventType = $request->get('event_type');
        $riskLevel = $request->get('risk_level');
        $userId = $request->get('user_id');
        $dateFrom = $request->get('date_from');
        $dateTo = $request->get('date_to');

        // Query
        $query = SecurityLog::with('user')->orderBy('created_at', 'desc');

        if ($eventType) {
            $query->where('event_type', $eventType);
        }

        if ($riskLevel) {
            $query->where('risk_level', $riskLevel);
        }

        if ($userId) {
            $query->where('user_id', $userId);
        }

        if ($dateFrom) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }

        if ($dateTo) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        // Paginer
        $logs = $query->paginate(50)->through(function ($log) {
            return [
                'id' => $log->id,
                'event_type' => $log->event_type,
                'description' => $log->description,
                'user_name' => $log->user ? $log->user->name : 'Système',
                'user_email' => $log->user ? $log->user->email : null,
                'ip_address' => $log->ip_address,
                'risk_level' => $log->risk_level,
                'created_at' => $log->created_at->format('Y-m-d H:i:s'),
                'created_at_human' => $log->created_at->diffForHumans(),
            ];
        });

        // Statistiques
        $stats = [
            'total' => SecurityLog::count(),
            'today' => SecurityLog::whereDate('created_at', today())->count(),
            'high_risk' => SecurityLog::where('risk_level', 'high')->orWhere('risk_level', 'critical')->count(),
            'failed_logins' => SecurityLog::where('event_type', 'login_failed')->whereDate('created_at', '>=', now()->subDays(7))->count(),
        ];

        return Inertia::render('Admin/SecurityLogs', [
            'logs' => $logs,
            'stats' => $stats,
            'filters' => [
                'event_type' => $eventType,
                'risk_level' => $riskLevel,
                'user_id' => $userId,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
            'eventTypes' => [
                'login_success' => 'Connexion réussie',
                'login_failed' => 'Échec de connexion',
                'logout' => 'Déconnexion',
                'password_changed' => 'Mot de passe modifié',
                'account_locked' => 'Compte verrouillé',
                'account_unlocked' => 'Compte déverrouillé',
                'doctor_approved' => 'Médecin approuvé',
                'doctor_rejected' => 'Médecin rejeté',
                'unauthorized_access' => 'Accès non autorisé',
                '2fa_enabled' => '2FA activé',
                '2fa_disabled' => '2FA désactivé',
                'profile_updated' => 'Profil mis à jour',
            ],
            'riskLevels' => [
                'low' => 'Faible',
                'medium' => 'Moyen',
                'high' => 'Élevé',
                'critical' => 'Critique',
            ],
        ]);
    }
}