<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\SecurityLog;
use App\Services\AppointmentSecurityService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PatientAppointmentController extends Controller
{
    protected $securityService;

    public function __construct(AppointmentSecurityService $securityService)
    {
        $this->securityService = $securityService;
    }

    /**
     * Liste des rendez-vous du patient
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $patient = $user->patient;

        $filter = $request->input('filter', 'upcoming');

        // Query de base
        $query = $patient->appointments()->with('doctor');

        // Filtres
        if ($filter === 'today') {
            $query->whereDate('appointment_date', today());
        } elseif ($filter === 'upcoming') {
            $query->where('appointment_date', '>=', now())
                  ->where('status', 'scheduled');
        } elseif ($filter === 'past') {
            $query->where(function($q) {
                $q->where('appointment_date', '<', now())
                  ->orWhere('status', 'completed')
                  ->orWhere('status', 'cancelled');
            });
        }

        $appointments = $query->orderBy('appointment_date', 'asc')
            ->get()
            ->map(function($appointment) {
                return [
                    'id' => $appointment->id,
                    'appointment_date' => $appointment->appointment_date->format('d/m/Y'),
                    'appointment_time' => $appointment->appointment_date->format('H:i'),
                    'doctor_name' => $appointment->doctor->name,
                    'doctor_specialty' => $appointment->doctor->specialty ?? 'Médecin',
                    'location' => $appointment->location,
                    'reason' => $appointment->reason,
                    'status' => $appointment->status,
                    'is_today' => $appointment->appointment_date->isToday(),
                    'is_past' => $appointment->appointment_date->isPast(),
                ];
            });

        // Prochain rendez-vous
        $nextAppointment = $patient->appointments()
            ->where('status', 'scheduled')
            ->where('appointment_date', '>=', now())
            ->with('doctor')
            ->orderBy('appointment_date')
            ->first();

        $nextAppointmentData = null;
        if ($nextAppointment) {
            $nextAppointmentData = [
                'id' => $nextAppointment->id,
                'date' => $nextAppointment->appointment_date->format('d/m/Y'),
                'time' => $nextAppointment->appointment_date->format('H:i'),
                'doctor_name' => $nextAppointment->doctor->name,
                'doctor_specialty' => $nextAppointment->doctor->specialty ?? 'Médecin',
                'location' => $nextAppointment->location,
                'reason' => $nextAppointment->reason,
                'days_until' => now()->diffInDays($nextAppointment->appointment_date, false),
            ];
        }

        // Statistiques
        $stats = [
            'total' => $patient->appointments()->count(),
            'today' => $patient->appointments()
                ->whereDate('appointment_date', today())
                ->where('status', 'scheduled')
                ->count(),
            'upcoming' => $patient->appointments()
                ->where('appointment_date', '>', now())
                ->where('status', 'scheduled')
                ->count(),
            'completed' => $patient->appointments()
                ->where('status', 'completed')
                ->count(),
        ];

        return Inertia::render('Patient/Appointments', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'appointments' => $appointments,
            'nextAppointment' => $nextAppointmentData,
            'stats' => $stats,
            'currentFilter' => $filter,
        ]);
    }

    /**
     * Afficher le formulaire de création
     */
    public function create()
    {
        $user = Auth::user();
        $patient = $user->patient;

        // Récupérer les médecins autorisés avec accès écriture
        $authorizedDoctors = $patient->accessAuthorizations()
            ->where('status', 'active')
            ->where('valid_until', '>=', now())
            ->where('access_level', 'write') // Seulement écriture
            ->with('doctor')
            ->get()
            ->map(function($auth) {
                return [
                    'id' => $auth->doctor->id,
                    'name' => $auth->doctor->name,
                    'specialty' => $auth->doctor->specialty ?? 'Médecin généraliste',
                ];
            });

        return Inertia::render('Patient/CreateAppointment', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'authorizedDoctors' => $authorizedDoctors,
        ]);
    }

    /**
     * Créer un rendez-vous (AVEC SÉCURITÉ)
     */
public function store(Request $request)
{
    $user = Auth::user();
    $patient = $user->patient;

    // 🔥 DEBUG : Voir ce qui est envoyé
    \Log::info('=== CRÉATION RDV - DONNÉES REÇUES ===');
    \Log::info('Request data:', $request->all());

    // 1. VALIDATION
    try {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:users,id',
            'appointment_date' => 'required|date|after:now',
            'appointment_time' => 'required|date_format:H:i',
            'location' => 'required|in:cabinet,teleconsultation,domicile',
            'reason' => 'nullable|string|max:1000',
        ], [
            'appointment_date.after' => 'La date doit être dans le futur',
            'location.in' => 'Lieu invalide',
        ]);

        \Log::info('✅ Validation OK:', $validated);

    } catch (\Illuminate\Validation\ValidationException $e) {
        \Log::error('❌ Validation ERREUR:', [
            'errors' => $e->errors(),
            'message' => $e->getMessage(),
        ]);
        throw $e;
    }

    // 2. VÉRIFIER AUTORISATION MÉDECIN
    $authorization = $patient->accessAuthorizations()
        ->where('doctor_id', $validated['doctor_id'])
        ->where('status', 'active')
        ->where('valid_until', '>=', now())
        ->where('access_level', 'write')
        ->first();

    if (!$authorization) {
        \Log::warning('❌ Médecin non autorisé', [
            'doctor_id' => $validated['doctor_id'],
            'patient_id' => $patient->id,
        ]);

        return back()->withErrors([
            'error' => '🚫 Vous devez d\'abord autoriser ce médecin avec accès écriture.'
        ]);
    }

    // 3. VALIDER LES LIMITES (max 3 RDV/jour)
    $limitErrors = $this->securityService->validateLimits($patient);
    if (!empty($limitErrors)) {
        \Log::warning('❌ Limite dépassée:', $limitErrors);
        return back()->withErrors(['error' => $limitErrors[0]]);
    }

    // 4. CALCULER SCORE DE RISQUE
    $riskScore = $this->securityService->calculateRiskScore($patient, $request);
    \Log::info("Score de risque calculé: {$riskScore}");

    // 5. BLOQUER SI SCORE TROP ÉLEVÉ
    if ($riskScore > 100) {
        SecurityLog::log(
            'appointment_blocked',
            $user->id,
            "🚨 Création RDV BLOQUÉE - Score: {$riskScore}",
            'critical',
            ['risk_score' => $riskScore, 'ip' => $request->ip()]
        );

        return back()->withErrors([
            'error' => '🚫 Création bloquée pour raisons de sécurité. Contactez le support.'
        ]);
    }

    DB::beginTransaction();

    try {
        // 6. CRÉER LE RENDEZ-VOUS
        $appointmentDateTime = $validated['appointment_date'] . ' ' . $validated['appointment_time'];

        \Log::info('Création RDV avec:', [
            'patient_id' => $patient->id,
            'doctor_id' => $validated['doctor_id'],
            'appointment_date' => $appointmentDateTime,
            'location' => $validated['location'],
            'reason' => $validated['reason'] ?? '',
        ]);

        $appointment = Appointment::create([
            'patient_id' => $patient->id,
            'doctor_id' => $validated['doctor_id'],
            'appointment_date' => $appointmentDateTime,
            'location' => $validated['location'],
            'reason' => $validated['reason'] ?? '',
            'status' => 'scheduled',
            'risk_score' => $riskScore,
            'created_from_ip' => $request->ip(),
        ]);

        \Log::info("✅ RDV créé ID: {$appointment->id}");

        // 7. LOG SÉCURITÉ
        SecurityLog::log(
            'appointment_created',
            $user->id,
            "Patient {$user->name} a créé un RDV avec Dr. {$authorization->doctor->name} pour le {$appointmentDateTime}",
            $riskScore > 50 ? 'medium' : 'low',
            [
                'appointment_id' => $appointment->id,
                'doctor_id' => $validated['doctor_id'],
                'location' => $validated['location'],
                'risk_score' => $riskScore,
            ]
        );

        // 8. DÉTECTER ANOMALIES
        $this->securityService->detectAnomalies($patient, $riskScore, $request);

        DB::commit();

        \Log::info('✅ RDV créé avec succès');

        return redirect()->route('patient.appointments')
            ->with('success', '✅ Rendez-vous créé avec succès !');

    } catch (\Exception $e) {
        DB::rollBack();
        
        \Log::error('❌ ERREUR CRÉATION RDV:', [
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString(),
        ]);

        return back()->withErrors([
            'error' => 'Une erreur est survenue : ' . $e->getMessage()
        ])->withInput();
    }
}

/**
 * Annuler un rendez-vous
 */
public function cancel($appointmentId)
{
    $user = Auth::user();
    $patient = $user->patient;

    // Récupérer le RDV
    $appointment = $patient->appointments()
        ->where('id', $appointmentId)
        ->firstOrFail();

    // Vérifier que le RDV n'est pas déjà annulé ou complété
    if ($appointment->status !== 'scheduled') {
        return back()->withErrors([
            'error' => 'Ce rendez-vous ne peut pas être annulé (statut: ' . $appointment->status . ')'
        ]);
    }

    // Vérifier que le RDV est dans le futur
    if ($appointment->appointment_date->isPast()) {
        return back()->withErrors([
            'error' => 'Vous ne pouvez pas annuler un rendez-vous passé.'
        ]);
    }

    // Annuler le RDV
    $appointment->update(['status' => 'cancelled']);

    // Log de sécurité
    SecurityLog::log(
        'appointment_cancelled_by_patient',
        $user->id,
        "Patient {$user->name} a annulé son RDV avec Dr. {$appointment->doctor->name} prévu le {$appointment->appointment_date->format('d/m/Y à H:i')}",
        'low',
        [
            'appointment_id' => $appointment->id,
            'doctor_id' => $appointment->doctor_id,
            'appointment_date' => $appointment->appointment_date->format('Y-m-d H:i:s'),
        ]
    );

    return back()->with('success', '✅ Rendez-vous annulé avec succès.');
}
}