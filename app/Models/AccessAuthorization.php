<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccessAuthorization extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'doctor_id',
        'access_level',
        'valid_from',
        'valid_until',
        'status',
        'reason',
    ];

    protected $casts = [
        'valid_from' => 'date',
        'valid_until' => 'date',
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

    // Helpers
    public function isActive()
    {
        if ($this->status !== 'active') {
            return false;
        }

        $now = now();
        
        if ($this->valid_from->isFuture()) {
            return false;
        }

        if ($this->valid_until && $this->valid_until->isPast()) {
            return false;
        }

        return true;
    }

    public function canWrite()
    {
        return $this->isActive() && $this->access_level === 'write';
    }

    public function canRead()
    {
        return $this->isActive();
    }
}