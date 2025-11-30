<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Vraies statistiques de la BDD
        $stats = [
            'total_users' => User::count(),
            'total_doctors' => User::where('role', 'doctor')->where('status', 'active')->count(),
            'total_patients' => User::where('role', 'patient')->count(),
            'pending_doctor_requests' => User::where('role', 'doctor')->where('status', 'pending')->count(),
        ];

        $data = [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email
            ],
            'stats' => $stats,
            'recentActivity' => [],
            'pendingRequests' => []
        ];

        return Inertia::render('Admin/Dashboard', $data);
    }
}