<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email',191)->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');

                        // Rôle et statut

            $table->enum('role', ['admin', 'doctor', 'patient'])
                  ->default('patient');
            $table->enum('status', ['active', 'inactive', 'pending'])
                  ->default('active');
  
                              // Champs médecin
            $table->string('rpps_number')->nullable()->unique();
            $table->string('specialty')->nullable();
            $table->string('diploma_path')->nullable();

               // 2FA
             $table->text('google2fa_secret')->nullable();
            $table->boolean('google2fa_enabled')->default(false);
            $table->text('recovery_codes')->nullable();
            
               // Sécurité
                     $table->integer('failed_login_attempts')->default(0);
            $table->timestamp('locked_until')->nullable();
            $table->ipAddress('last_login_ip')->nullable();
            $table->timestamp('last_login_at')->nullable();
            
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
  

                        // Index
            $table->index('role');
            $table->index('status');
            $table->index('email');
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');

    }
};
