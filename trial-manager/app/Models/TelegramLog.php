<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TelegramLog extends Model
{
    protected $fillable = [
        'direction',
        'update_id',
        'payload',
        'message',
        'status',
        'error',
    ];

    protected function casts(): array
    {
        return [
            'payload' => 'array',
        ];
    }
}
