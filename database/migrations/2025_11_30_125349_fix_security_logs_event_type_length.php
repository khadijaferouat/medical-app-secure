<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('security_logs', function (Blueprint $table) {
            $table->string('event_type', 100)->change(); // Augmenter de 50 à 100
        });
    }

    public function down(): void
    {
        Schema::table('security_logs', function (Blueprint $table) {
            $table->string('event_type', 50)->change();
        });
    }
};