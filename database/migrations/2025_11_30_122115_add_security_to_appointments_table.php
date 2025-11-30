<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            // Chiffrer le motif (contient infos médicales sensibles)
            $table->text('reason_encrypted')->nullable()->after('location');
            
            // Score de risque (détection anomalies)
            $table->float('risk_score')->default(0)->after('status');
            
            // IP de création (traçabilité)
            $table->string('created_from_ip')->nullable()->after('risk_score');
            
            // Supprimer l'ancien champ reason non chiffré
            $table->dropColumn('reason');
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->text('reason')->nullable();
            $table->dropColumn(['reason_encrypted', 'risk_score', 'created_from_ip']);
        });
    }
};