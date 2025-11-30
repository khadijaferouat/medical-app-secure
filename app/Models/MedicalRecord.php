<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class MedicalRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'doctor_id',
        'title',
        'consultation_date',
        'symptoms_encrypted',
        'diagnosis_encrypted',
        'treatment_encrypted',
        'notes_encrypted',
        'is_emergency',
        'consultation_type',
    ];

    protected $casts = [
        'consultation_date' => 'date',
        'is_emergency' => 'boolean',
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

    public function prescription()
    {
        return $this->hasOne(Prescription::class);
    }

    // Mutateurs chiffrement
    public function setSymptomsAttribute($value)
    {
        $this->attributes['symptoms_encrypted'] = Crypt::encryptString($value);
    }

    public function getSymptomsAttribute()
    {
        return !empty($this->attributes['symptoms_encrypted']) 
            ? Crypt::decryptString($this->attributes['symptoms_encrypted']) 
            : '';
    }

    public function setDiagnosisAttribute($value)
    {
        $this->attributes['diagnosis_encrypted'] = Crypt::encryptString($value);
    }

    public function getDiagnosisAttribute()
    {
        return !empty($this->attributes['diagnosis_encrypted']) 
            ? Crypt::decryptString($this->attributes['diagnosis_encrypted']) 
            : '';
    }

    public function setTreatmentAttribute($value)
    {
        $this->attributes['treatment_encrypted'] = Crypt::encryptString($value);
    }

    public function getTreatmentAttribute()
    {
        return !empty($this->attributes['treatment_encrypted']) 
            ? Crypt::decryptString($this->attributes['treatment_encrypted']) 
            : '';
    }

    public function setNotesAttribute($value)
    {
        if (!empty($value)) {
            $this->attributes['notes_encrypted'] = Crypt::encryptString($value);
        }
    }

    public function getNotesAttribute()
    {
        return !empty($this->attributes['notes_encrypted']) 
            ? Crypt::decryptString($this->attributes['notes_encrypted']) 
            : '';
    }
}