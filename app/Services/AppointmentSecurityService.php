<?php

namespace App\Services;

use App\Models\SecurityLog;
use App\Models\Patient;
use Illuminate\Http\Request;

class AppointmentSecurityService
{
    /**
     * Calculer le score de risque pour une création de RDV
     */
    public function calculateRiskScore(Patient $patient, Request $request): float
    {
        $riskScore = 0;

        // 1. Heure de création suspecte (23h-5h = +30 points)
        $hour = now()->hour;
        if ($hour >= 23 || $hour <= 5) {
            $riskScore += 30;
            \Log::warning("RDV créé heure suspecte", [
                'patient_id' => $patient->id,
                'hour' => $hour
            ]);
        }

        // 2. Trop de RDV créés aujourd'hui (+20 par RDV)
        $todayAppointments = $patient->appointments()
            ->whereDate('created_at', today())
            ->count();
        
        if ($todayAppointments >= 1) {
            $riskScore += ($todayAppointments * 20);
        }

        // 3. IP suspecte (+50 points)
        if ($this->isSuspiciousIP($request->ip())) {
            $riskScore += 50;
            \Log::warning("RDV créé depuis IP suspecte", [
                'patient_id' => $patient->id,
                'ip' => $request->ip()
            ]);
        }

        // 4. User agent suspect (bot) (+40 points)
        if ($this->isBotUserAgent($request->userAgent())) {
            $riskScore += 40;
        }

        return $riskScore;
    }

    /**
     * Vérifier si l'IP est suspecte
     */
    private function isSuspiciousIP(string $ip): bool
    {
        // IPs locales sont OK
        if (in_array($ip, ['127.0.0.1', '::1', 'localhost'])) {
            return false;
        }

        // Liste noire d'IPs connues (VPN suspects, proxies)
        $blacklistedIPs = [
            // Ajouter IPs suspectes ici si besoin
        ];

        if (in_array($ip, $blacklistedIPs)) {
            return true;
        }

        return false;
    }

    /**
     * Détecter si c'est un bot
     */
    private function isBotUserAgent(?string $userAgent): bool
    {
        if (empty($userAgent)) {
            return true; // Pas de user agent = suspect
        }

        $botPatterns = [
            'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget'
        ];

        foreach ($botPatterns as $pattern) {
            if (stripos($userAgent, $pattern) !== false) {
                return true;
            }
        }

        return false;
    }

    /**
     * Détecter anomalies et alerter admin si nécessaire
     */
    public function detectAnomalies(Patient $patient, float $riskScore, Request $request): void
    {
        // Si score > 70 → Alerte admin
        if ($riskScore > 70) {
            $this->alertAdmin('high_risk_appointment', $patient, $riskScore, $request);
        }

        // Détection : Plus de 10 RDV en 24h
        $last24hAppointments = $patient->appointments()
            ->where('created_at', '>=', now()->subDay())
            ->count();

        if ($last24hAppointments >= 10) {
            $this->alertAdmin('mass_appointment_creation', $patient, $riskScore, $request);
        }
    }

    /**
     * Alerter l'admin
     */
    private function alertAdmin(string $eventType, Patient $patient, float $riskScore, Request $request): void
    {
        SecurityLog::log(
            'appointment_security_alert',
            $patient->user_id,
            "🚨 ALERTE SÉCURITÉ : {$eventType} - Patient {$patient->user->name} - Score: {$riskScore}",
            'high',
            [
                'event_type' => $eventType,
                'patient_id' => $patient->id,
                'risk_score' => $riskScore,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]
        );

        // Optionnel : Envoyer email à l'admin
        // Mail::to('admin@medical-app.com')->send(new SecurityAlert(...));
    }

    /**
     * Valider les limites de création
     */
    public function validateLimits(Patient $patient): array
    {
        $errors = [];

        // Max 3 RDV par jour
        $todayAppointments = $patient->appointments()
            ->whereDate('appointment_date', today())
            ->where('status', 'scheduled')
            ->count();

        if ($todayAppointments >= 3) {
            $errors[] = 'Vous ne pouvez pas créer plus de 3 rendez-vous par jour.';
        }

        return $errors;
    }
}