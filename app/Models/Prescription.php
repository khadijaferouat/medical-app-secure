<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class Prescription extends Model
{
    use HasFactory;

    protected $fillable = [
        'medical_record_id',
        'patient_id',
        'doctor_id',
        'prescription_date',
        'valid_until',
        'instructions_encrypted',
        'status',
    ];

    protected $casts = [
        'prescription_date' => 'date',
        'valid_until' => 'date',
    ];

    // Relations
    public function medicalRecord()
    {
        return $this->belongsTo(MedicalRecord::class);
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function medications()
    {
        return $this->hasMany(Medication::class);
    }

    // Mutateurs
    public function setInstructionsAttribute($value)
    {
        if (!empty($value)) {
            $this->attributes['instructions_encrypted'] = Crypt::encryptString($value);
        }
    }

    public function getInstructionsAttribute()
    {
        return !empty($this->attributes['instructions_encrypted']) 
            ? Crypt::decryptString($this->attributes['instructions_encrypted']) 
            : '';
    }

    // Helper
    public function getDaysRemainingAttribute()
    {
        return now()->diffInDays($this->valid_until, false);
    }

    public function isActive()
    {
        return $this->status === 'active' && $this->valid_until->isFuture();
    }
}