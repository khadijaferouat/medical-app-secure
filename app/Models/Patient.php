<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class Patient extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'birth_date',
        'phone',
        'gender',
        'address',
        'city',
        'postal_code',
        'blood_type',
        'allergies_encrypted',
        'medical_history_encrypted',
        'current_treatments_encrypted',
        'assigned_doctor_id',
    ];

    protected $casts = [
        'birth_date' => 'date',
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assignedDoctor()
    {
        return $this->belongsTo(User::class, 'assigned_doctor_id');
    }

    public function medicalRecords()
    {
        return $this->hasMany(MedicalRecord::class);
    }

    public function prescriptions()
    {
        return $this->hasMany(Prescription::class);
    }

    public function accessAuthorizations()
    {
        return $this->hasMany(AccessAuthorization::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    // Mutateurs pour chiffrement
    public function setAllergiesAttribute($value)
    {
        if (!empty($value)) {
            $this->attributes['allergies_encrypted'] = Crypt::encryptString(
                is_array($value) ? json_encode($value) : $value
            );
        }
    }

    public function getAllergiesAttribute()
    {
        if (empty($this->attributes['allergies_encrypted'])) {
            return [];
        }
        
        $decrypted = Crypt::decryptString($this->attributes['allergies_encrypted']);
        $decoded = json_decode($decrypted, true);
        return $decoded ?? [$decrypted];
    }

    public function setMedicalHistoryAttribute($value)
    {
        if (!empty($value)) {
            $this->attributes['medical_history_encrypted'] = Crypt::encryptString(
                is_array($value) ? json_encode($value) : $value
            );
        }
    }

    public function getMedicalHistoryAttribute()
    {
        if (empty($this->attributes['medical_history_encrypted'])) {
            return [];
        }
        
        $decrypted = Crypt::decryptString($this->attributes['medical_history_encrypted']);
        $decoded = json_decode($decrypted, true);
        return $decoded ?? [$decrypted];
    }

    public function setCurrentTreatmentsAttribute($value)
    {
        if (!empty($value)) {
            $this->attributes['current_treatments_encrypted'] = Crypt::encryptString(
                is_array($value) ? json_encode($value) : $value
            );
        }
    }

    public function getCurrentTreatmentsAttribute()
    {
        if (empty($this->attributes['current_treatments_encrypted'])) {
            return [];
        }
        
        $decrypted = Crypt::decryptString($this->attributes['current_treatments_encrypted']);
        $decoded = json_decode($decrypted, true);
        return $decoded ?? [$decrypted];
    }

    // Helper
    public function getAgeAttribute()
    {
        return $this->birth_date->age;
    }
}