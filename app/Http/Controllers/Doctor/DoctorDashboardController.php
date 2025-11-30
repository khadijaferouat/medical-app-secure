<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\AccessAuthorization;
use App\Models\Appointment;
use App\Models\MedicalRecord;
use App\Models\Prescription;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DoctorDashboardController extends Controller
{
    public function index()
    {
        $doctorId = Auth::id();
        $user = Auth::user();

        // Statistiques réelles
        $totalPatients = AccessAuthorization::where('doctor_id', $doctorId)
            ->where('status', 'active')
            ->count();

        $todayAppointments = Appointment::where('doctor_id', $doctorId)
            ->whereDate('appointment_date', today())
            ->where('status', 'scheduled')
            ->count();

        $monthlyRecords = MedicalRecord::where('doctor_id', $doctorId)
            ->whereMonth('consultation_date', now()->month)
            ->count();

        $pendingAuthorizations = AccessAuthorization::where('doctor_id', $doctorId)
            ->where('status', 'active')
            ->where('valid_from', '>', now())
            ->count();

        // Patients du jour
        $todayPatients = Appointment::where('doctor_id', $doctorId)
            ->whereDate('appointment_date', today())
            ->where('status', 'scheduled')
            ->with('patient.user')
            ->orderBy('appointment_date', 'asc')
            ->get()
            ->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'name' => $appointment->patient->user->name,
                    'appointmentTime' => $appointment->appointment_date->format('H:i'),
                    'reason' => $appointment->reason,
                    'phone' => $appointment->patient->phone,
                ];
            });

        // Dossiers récents
        $recentRecords = MedicalRecord::where('doctor_id', $doctorId)
            ->with('patient.user')
            ->latest('consultation_date')
            ->take(5)
            ->get()
            ->map(function ($record) {
                return [
                    'id' => $record->id,
                    'patient_name' => $record->patient->user->name,
                    'patient_id' => $record->patient_id,
                    'title' => $record->title,
                    'date' => $record->consultation_date->format('d/m/Y'),
                    'is_emergency' => $record->is_emergency,
                ];
            });

        $data = [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'specialty' => $user->specialty,
                'rpps_number' => $user->rpps_number
            ],
            'stats' => [
                'totalPatients' => $totalPatients,
                'todayAppointments' => $todayAppointments,
                'monthlyRecords' => $monthlyRecords,
                'pendingAuthorizations' => $pendingAuthorizations
            ],
            'todayPatients' => $todayPatients,
            'recentRecords' => $recentRecords,
        ];

        return Inertia::render('Doctor/Dashboard', $data);
    }
}