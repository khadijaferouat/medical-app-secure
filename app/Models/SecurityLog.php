<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SecurityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'event_type',
        'description',
        'ip_address',
        'user_agent',
        'risk_level',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'created_at' => 'datetime',
    ];

    // Relation
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Helper pour créer un log
    public static function log(
        string $eventType,
        ?int $userId = null,
        ?string $description = null,
        string $riskLevel = 'low',
        ?array $metadata = null
    ) {
        return self::create([
            'user_id' => $userId ?? auth()->id(),
            'event_type' => $eventType,
            'description' => $description,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'risk_level' => $riskLevel,
            'metadata' => $metadata,
        ]);
    }
}