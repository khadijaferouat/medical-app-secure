<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'doctor_id',
        'appointment_date',
        'location',
        'reason', // Virtual, sera chiffré dans reason_encrypted
        'status',
        'risk_score',
        'created_from_ip',
    ];

    protected $casts = [
        'appointment_date' => 'datetime',
        'risk_score' => 'float',
    ];

    // Relations
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    // 🔐 MUTATEURS POUR CHIFFREMENT
    public function setReasonAttribute($value)
    {
        if (!empty($value)) {
            $this->attributes['reason_encrypted'] = Crypt::encryptString($value);
        } else {
            $this->attributes['reason_encrypted'] = null;
        }
    }

    public function getReasonAttribute()
    {
        if (empty($this->attributes['reason_encrypted'])) {
            return '';
        }
        
        try {
            return Crypt::decryptString($this->attributes['reason_encrypted']);
        } catch (\Exception $e) {
            \Log::error('Erreur déchiffrement reason:', ['error' => $e->getMessage()]);
            return '';
        }
    }

    // Scopes
    public function scopeToday($query)
    {
        return $query->whereDate('appointment_date', today());
    }

    public function scopeUpcoming($query)
    {
        return $query->where('appointment_date', '>=', now())
                     ->where('status', 'scheduled')
                     ->orderBy('appointment_date');
    }

    public function scopePast($query)
    {
        return $query->where(function($q) {
            $q->where('appointment_date', '<', now())
              ->orWhere('status', 'completed')
              ->orWhere('status', 'cancelled');
        });
    }
}