<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\SecurityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PatientAccessHistoryController extends Controller
{
    /**
     * Historique des accès au dossier médical
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $patient = $user->patient;

        $filter = $request->input('filter', 'all'); // all, today, week, month
        $doctorFilter = $request->input('doctor_id');

        // Query de base : Récupérer tous les logs concernant ce patient
        $query = SecurityLog::where(function($q) use ($patient) {
            // Logs de création/modification de dossiers médicaux
            $q->where('description', 'like', "%patient ID {$patient->id}%")
              ->orWhere('description', 'like', "%patient {$patient->id}%");
        })
        ->whereIn('event_type', [
            'profile_updated',
            'unauthorized_access',
        ])
        ->with('user')
        ->orderBy('created_at', 'desc');

        // Filtre par date
        if ($filter === 'today') {
            $query->whereDate('created_at', today());
        } elseif ($filter === 'week') {
            $query->where('created_at', '>=', now()->subWeek());
        } elseif ($filter === 'month') {
            $query->where('created_at', '>=', now()->subMonth());
        }

        // Filtre par médecin
        if ($doctorFilter) {
            $query->where('user_id', $doctorFilter);
        }

        $logs = $query->paginate(20)->through(function($log) {
            // Extraire l'action depuis la description
            $action = 'Action non identifiée';
            if (str_contains($log->description, 'créé un dossier médical')) {
                $action = 'Création dossier médical';
            } elseif (str_contains($log->description, 'modifié le dossier médical')) {
                $action = 'Modification dossier médical';
            } elseif (str_contains($log->description, 'supprimé le dossier médical')) {
                $action = 'Suppression dossier médical';
            } elseif (str_contains($log->description, 'créé une prescription')) {
                $action = 'Création ordonnance';
            } elseif (str_contains($log->description, 'annulé la prescription')) {
                $action = 'Annulation ordonnance';
            } elseif (str_contains($log->description, 'a consulté le dossier')) {
                $action = 'Consultation dossier';
            }

            return [
                'id' => $log->id,
                'date' => $log->created_at->format('d/m/Y'),
                'time' => $log->created_at->format('H:i:s'),
                'datetime' => $log->created_at->format('d/m/Y à H:i'),
                'doctor_name' => $log->user ? $log->user->name : 'Système',
                'doctor_id' => $log->user_id,
                'action' => $action,
                'description' => $log->description,
                'risk_level' => $log->risk_level,
                'ip_address' => $log->ip_address,
            ];
        });

        // Liste des médecins pour le filtre
        $authorizedDoctors = $patient->accessAuthorizations()
            ->where('status', 'active')
            ->with('doctor')
            ->get()
            ->map(function($auth) {
                return [
                    'id' => $auth->doctor->id,
                    'name' => $auth->doctor->name,
                ];
            });

        // Statistiques
        $stats = [
            'total_accesses' => SecurityLog::where('description', 'like', "%patient ID {$patient->id}%")
                ->count(),
            'today' => SecurityLog::where('description', 'like', "%patient ID {$patient->id}%")
                ->whereDate('created_at', today())
                ->count(),
            'this_week' => SecurityLog::where('description', 'like', "%patient ID {$patient->id}%")
                ->where('created_at', '>=', now()->subWeek())
                ->count(),
            'this_month' => SecurityLog::where('description', 'like', "%patient ID {$patient->id}%")
                ->where('created_at', '>=', now()->subMonth())
                ->count(),
        ];

        return Inertia::render('Patient/AccessHistory', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'logs' => $logs,
            'authorizedDoctors' => $authorizedDoctors,
            'stats' => $stats,
            'filters' => [
                'current' => $filter,
                'doctor_id' => $doctorFilter,
            ],
        ]);
    }
}