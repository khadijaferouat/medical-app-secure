<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Administrateur',
            'email' => 'admin@medical-app.com',
            'password' => Hash::make('Admin@2025!'),
            'role' => 'admin',
            'status' => 'active',
            'email_verified_at' => now()
        ]);

        $this->command->info('✅ Administrateur créé avec succès');
        $this->command->info('Email: admin@medical-app.com');
        $this->command->info('Password: Admin@2025!');
    }
}
