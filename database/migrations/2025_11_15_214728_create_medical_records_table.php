<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medical_records', function (Blueprint $table) {
            $table->id();
            
            // Relations
            $table->foreignId('patient_id')->constrained('patients')->onDelete('cascade');
            $table->foreignId('doctor_id')->constrained('users')->onDelete('cascade');
            
            // Informations consultation
            $table->string('title');
            $table->date('consultation_date');
            
            // Données chiffrées
            $table->text('symptoms_encrypted');
            $table->text('diagnosis_encrypted');
            $table->text('treatment_encrypted');
            $table->text('notes_encrypted')->nullable();
            
            // Métadonnées
            $table->boolean('is_emergency')->default(false);
            $table->string('consultation_type')->nullable();
            
            $table->timestamps();
            
            // Index
            $table->index('patient_id');
            $table->index('doctor_id');
            $table->index('consultation_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medical_records');
    }
};