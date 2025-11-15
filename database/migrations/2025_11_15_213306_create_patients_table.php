<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Informations personnelles
            $table->date('birth_date');
            $table->string('phone')->nullable();
            $table->enum('gender', ['M', 'F', 'Other'])->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('postal_code')->nullable();
            
            // Informations médicales (chiffrées)
            $table->string('blood_type')->nullable();
            $table->text('allergies_encrypted')->nullable();
            $table->text('medical_history_encrypted')->nullable();
            $table->text('current_treatments_encrypted')->nullable();
            
            // Médecin traitant
            $table->foreignId('assigned_doctor_id')
                  ->nullable()
                  ->constrained('users')
                  ->onDelete('set null');
            
            $table->timestamps();
            
            // Index
            $table->index('user_id');
            $table->index('assigned_doctor_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};