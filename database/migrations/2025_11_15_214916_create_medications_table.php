<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medications', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('prescription_id')
                  ->constrained('prescriptions')
                  ->onDelete('cascade');
            
            $table->string('name');
            $table->string('dosage');
            $table->text('posology_encrypted');
            $table->integer('duration_days');
            
            $table->timestamps();
            
            // Index
            $table->index('prescription_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medications');
    }
};