<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\SecurityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DoctorAppointmentController extends Controller
{
    /**
     * Liste des rendez-vous du médecin
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $doctorId = $user->id;
        $filter = $request->get('filter', 'upcoming');
        
        $query = Appointment::where('doctor_id', $doctorId)
            ->with(['patient.user']);

        if ($filter === 'today') {
            $query->whereDate('appointment_date', today());
        } elseif ($filter === 'upcoming') {
            $query->where('appointment_date', '>=', now())
                  ->where('status', 'scheduled');
        } elseif ($filter === 'past') {
            $query->where('appointment_date', '<', now())
                  ->orWhere('status', 'completed')
                  ->orWhere('status', 'cancelled');
        }

        $appointments = $query->orderBy('appointment_date', 'asc')
            ->get()
            ->map(function ($appointment) {
                // Vérifier si RDV créé récemment (moins de 24h)
                $isNew = $appointment->created_at->diffInHours(now()) < 24;

                return [
                    'id' => $appointment->id,
                    'patient_name' => $appointment->patient->user->name,
                    'patient_id' => $appointment->patient->id,
                    'appointment_date' => $appointment->appointment_date->format('d/m/Y'),
                    'appointment_time' => $appointment->appointment_date->format('H:i'),
                    'location' => $appointment->location,
                    'reason' => $appointment->reason,
                    'status' => $appointment->status,
                    'is_today' => $appointment->appointment_date->isToday(),
                    'is_past' => $appointment->appointment_date->isPast(),
                    'is_new' => $isNew,
                    'created_at' => $appointment->created_at->format('d/m/Y à H:i'),
                ];
            });

        // Stats
        $stats = [
            'today_count' => Appointment::where('doctor_id', $doctorId)
                ->whereDate('appointment_date', today())
                ->where('status', 'scheduled')
                ->count(),
            'upcoming_count' => Appointment::where('doctor_id', $doctorId)
                ->where('appointment_date', '>', today())
                ->where('status', 'scheduled')
                ->count(),
            'completed_this_month' => Appointment::where('doctor_id', $doctorId)
                ->whereMonth('appointment_date', now()->month)
                ->where('status', 'completed')
                ->count(),
        ];

        return Inertia::render('Doctor/Appointments', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'appointments' => $appointments,
            'stats' => $stats,
            'filter' => $filter
        ]);
    }

    /**
     * Marquer un rendez-vous comme complété
     */
    public function complete($appointmentId)
    {
        $user = Auth::user();
        $doctorId = $user->id;
        
        $appointment = Appointment::with('patient.user')->findOrFail($appointmentId);
        
        if ($appointment->doctor_id !== $doctorId) {
            abort(403, 'Accès non autorisé');
        }

        // Vérifier que le RDV est bien scheduled
        if ($appointment->status !== 'scheduled') {
            return back()->withErrors([
                'error' => 'Ce rendez-vous ne peut pas être marqué comme complété (statut: ' . $appointment->status . ')'
            ]);
        }

        $appointment->update(['status' => 'completed']);

        // Log de sécurité
        SecurityLog::log(
            'appointment_completed_by_doctor',
            $user->id,
            "Dr. {$user->name} a marqué le RDV avec {$appointment->patient->user->name} comme complété",
            'low',
            [
                'appointment_id' => $appointment->id,
                'patient_id' => $appointment->patient_id,
                'appointment_date' => $appointment->appointment_date->format('Y-m-d H:i:s'),
            ]
        );

        return back()->with('success', '✅ Rendez-vous marqué comme complété');
    }

    /**
     * Annuler un rendez-vous
     */
    public function cancel($appointmentId)
    {
        $user = Auth::user();
        $doctorId = $user->id;
        
        $appointment = Appointment::with('patient.user')->findOrFail($appointmentId);
        
        if ($appointment->doctor_id !== $doctorId) {
            abort(403, 'Accès non autorisé');
        }

        // Vérifier que le RDV est bien scheduled
        if ($appointment->status !== 'scheduled') {
            return back()->withErrors([
                'error' => 'Ce rendez-vous ne peut pas être annulé (statut: ' . $appointment->status . ')'
            ]);
        }

        $appointment->update(['status' => 'cancelled']);

        // Log de sécurité
        SecurityLog::log(
            'appointment_cancelled_by_doctor',
            $user->id,
            "Dr. {$user->name} a annulé le RDV avec {$appointment->patient->user->name} prévu le {$appointment->appointment_date->format('d/m/Y à H:i')}",
            'medium',
            [
                'appointment_id' => $appointment->id,
                'patient_id' => $appointment->patient_id,
                'appointment_date' => $appointment->appointment_date->format('Y-m-d H:i:s'),
            ]
        );

        return back()->with('success', '✅ Rendez-vous annulé');
    }
}