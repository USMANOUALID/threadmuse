<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WhatsappLog extends Model
{
    protected $fillable = [
        'trial_request_id',
        'recipient',
        'message',
        'status',
        'response',
        'sent_at',
    ];

    protected function casts(): array
    {
        return [
            'response' => 'array',
            'sent_at' => 'datetime',
        ];
    }

    public function trialRequest()
    {
        return $this->belongsTo(TrialRequest::class);
    }
}
