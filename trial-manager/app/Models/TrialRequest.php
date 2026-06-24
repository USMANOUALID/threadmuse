<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrialRequest extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_PROCESSED = 'processed';

    public const STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_APPROVED,
        self::STATUS_REJECTED,
        self::STATUS_PROCESSED,
    ];

    protected $fillable = [
        'name',
        'email',
        'whatsapp',
        'country',
        'dial_code',
        'device',
        'plan',
        'message',
        'ip_address',
        'status',
        'approved_at',
        'rejected_at',
        'processed_at',
    ];

    protected function casts(): array
    {
        return [
            'approved_at' => 'datetime',
            'rejected_at' => 'datetime',
            'processed_at' => 'datetime',
        ];
    }

    public function whatsappLogs()
    {
        return $this->hasMany(WhatsappLog::class);
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (! $term) {
            return $query;
        }

        return $query->where(function (Builder $query) use ($term): void {
            $query->where('name', 'like', "%{$term}%")
                ->orWhere('email', 'like', "%{$term}%")
                ->orWhere('whatsapp', 'like', "%{$term}%")
                ->orWhere('country', 'like', "%{$term}%")
                ->orWhere('plan', 'like', "%{$term}%")
                ->orWhere('ip_address', 'like', "%{$term}%");
        });
    }

    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['status'] ?? null, fn (Builder $query, string $status) => $query->where('status', $status))
            ->when($filters['country'] ?? null, fn (Builder $query, string $country) => $query->where('country', 'like', "%{$country}%"))
            ->when($filters['plan'] ?? null, fn (Builder $query, string $plan) => $query->where('plan', $plan));
    }

    public function statusTone(): string
    {
        return match ($this->status) {
            self::STATUS_APPROVED => 'emerald',
            self::STATUS_REJECTED => 'rose',
            self::STATUS_PROCESSED => 'sky',
            default => 'amber',
        };
    }
}
