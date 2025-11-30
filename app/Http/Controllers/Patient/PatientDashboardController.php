<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PatientDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $patient = $user->patient;

        // Prochain rendez-vous
        $nextAppointment = $patient->appointments()
            ->where('status', 'scheduled')
            ->where('appointment_date', '>=', now())
            ->orderBy('appointment_date')
            ->with('doctor')
            ->first();

        // Stats
        $stats = [
            'total_consultations' => $patient->medicalRecords()->count(),
            'active_prescriptions' => $patient->prescriptions()
                ->where('status', 'active')
                ->where('valid_until', '>=', now())
                ->count(),
            'authorized_doctors' => $patient->accessAuthorizations()
                ->where('status', 'active')
                ->where('valid_until', '>=', now())
                ->count(),
            'pending_appointments' => $patient->appointments()
                ->where('status', 'scheduled')
                ->where('appointment_date', '>=', now())
                ->count(),
        ];

        // Consultations récentes (5 dernières)
        $recentConsultations = $patient->medicalRecords()
            ->with('doctor')
            ->orderBy('consultation_date', 'desc')
            ->take(5)
            ->get()
            ->map(function($record) {
                return [
                    'id' => $record->id,
                    'title' => $record->title,
                    'date' => $record->consultation_date->format('d/m/Y'),
                    'doctor_name' => $record->doctor->name,
                    'doctor_specialty' => $record->doctor->specialty ?? 'Médecin',
                ];
            });

        // Médecins autorisés
        $authorizedDoctors = $patient->accessAuthorizations()
            ->where('status', 'active')
            ->where('valid_until', '>=', now())
            ->with('doctor')
            ->get()
            ->map(function($auth) {
                return [
                    'id' => $auth->doctor->id,
                    'name' => $auth->doctor->name,
                    'specialty' => $auth->doctor->specialty ?? 'Médecin',
                    'access_level' => $auth->access_level,
                    'authorized_since' => $auth->valid_from->format('d/m/Y'),
                ];
            });

        // Dernière consultation
        $lastConsultation = $patient->medicalRecords()
            ->with('doctor')
            ->orderBy('consultation_date', 'desc')
            ->first();

        $data = [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email
            ],
            'nextAppointment' => $nextAppointment ? [
                'date' => $nextAppointment->appointment_date->format('d/m/Y'),
                'time' => $nextAppointment->appointment_date->format('H:i'),
                'doctor_name' => $nextAppointment->doctor->name,
                'doctor_specialty' => $nextAppointment->doctor->specialty ?? 'Médecin',
                'location' => $nextAppointment->location,
                'reason' => $nextAppointment->reason,
            ] : null,
            'healthSummary' => [
                'blood_type' => $patient->blood_type,
                'allergies' => $patient->allergies ?? [],
                'current_treatments' => $patient->current_treatments ?? [],
                'last_consultation_date' => $lastConsultation ? $lastConsultation->consultation_date->format('d/m/Y') : null,
                'last_consultation_doctor' => $lastConsultation ? $lastConsultation->doctor->name : null,
            ],
            'stats' => $stats,
            'recentConsultations' => $recentConsultations,
            'authorizedDoctors' => $authorizedDoctors,
        ];

        return Inertia::render('Patient/Dashboard', $data);
    }
}