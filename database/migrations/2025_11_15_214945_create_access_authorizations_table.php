<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('access_authorizations', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('patient_id')->constrained('patients')->onDelete('cascade');
            $table->foreignId('doctor_id')->constrained('users')->onDelete('cascade');
            
            // Niveau d'accès
            $table->enum('access_level', ['read', 'write'])->default('read');
            
            // Période de validité
            $table->date('valid_from');
            $table->date('valid_until')->nullable();
            
            // Statut
            $table->enum('status', ['active', 'revoked', 'expired'])->default('active');
            
            // Raison (optionnel)
            $table->string('reason')->nullable();
            
            $table->timestamps();
            
            // Index
            $table->index('patient_id');
            $table->index('doctor_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('access_authorizations');
    }
};