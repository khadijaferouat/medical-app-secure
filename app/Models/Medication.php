<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class Medication extends Model
{
    use HasFactory;

    protected $fillable = [
        'prescription_id',
        'name',
        'dosage',
        'posology',  // ← CHANGÉ : Utiliser posology (pas posology_encrypted)
        'duration_days',
    ];

    // Relations
    public function prescription()
    {
        return $this->belongsTo(Prescription::class);
    }

    // Mutateurs pour le chiffrement
    public function setPosologyAttribute($value)
    {
        if (!empty($value)) {
            $this->attributes['posology_encrypted'] = Crypt::encryptString($value);
        } else {
            $this->attributes['posology_encrypted'] = null;
        }
    }

    public function getPosologyAttribute()
    {
        if (empty($this->attributes['posology_encrypted'])) {
            return '';
        }
        
        try {
            return Crypt::decryptString($this->attributes['posology_encrypted']);
        } catch (\Exception $e) {
            \Log::error('Erreur déchiffrement posology:', ['error' => $e->getMessage()]);
            return '';
        }
    }
}