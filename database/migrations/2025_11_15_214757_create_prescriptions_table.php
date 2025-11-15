<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prescriptions', function (Blueprint $table) {
            $table->id();
            
            // Relations
            $table->foreignId('medical_record_id')
                  ->nullable()
                  ->constrained('medical_records')
                  ->onDelete('set null');
            $table->foreignId('patient_id')->constrained('patients')->onDelete('cascade');
            $table->foreignId('doctor_id')->constrained('users')->onDelete('cascade');
            
            // Informations ordonnance
            $table->date('prescription_date');
            $table->date('valid_until');
            $table->text('instructions_encrypted')->nullable();
            
            // Statut
            $table->enum('status', ['active', 'expired', 'cancelled'])->default('active');
            
            $table->timestamps();
            
            // Index
            $table->index('patient_id');
            $table->index('doctor_id');
            $table->index('status');
            $table->index('valid_until');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prescriptions');
    }
};