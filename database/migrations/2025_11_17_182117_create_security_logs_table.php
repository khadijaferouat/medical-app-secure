<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('security_logs', function (Blueprint $table) {
            $table->id();
            
            // Utilisateur concerné
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            
            // Type d'événement
            $table->enum('event_type', [
                'login_success',
                'login_failed',
                'logout',
                'password_changed',
                'account_locked',
                'account_unlocked',
                'doctor_approved',
                'doctor_rejected',
                'unauthorized_access',
                '2fa_enabled',
                '2fa_disabled',
                'profile_updated'
            ]);
            
            // Détails
            $table->text('description')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            
            // Niveau de risque
            $table->enum('risk_level', ['low', 'medium', 'high', 'critical'])->default('low');
            
            // Métadonnées (JSON)
            $table->json('metadata')->nullable();
            
            $table->timestamps();
            
            // Index
            $table->index('user_id');
            $table->index('event_type');
            $table->index('risk_level');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('security_logs');
    }
};