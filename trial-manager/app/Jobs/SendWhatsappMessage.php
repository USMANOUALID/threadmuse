<?php

namespace App\Jobs;

use App\Models\TrialRequest;
use App\Services\IntegrationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendWhatsappMessage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(
        public readonly string $recipient,
        public readonly string $message,
        public readonly ?int $trialRequestId = null,
        public readonly bool $respectNotificationToggle = true,
    ) {
    }

    public function handle(IntegrationService $integrations): void
    {
        $trialRequest = $this->trialRequestId ? TrialRequest::query()->find($this->trialRequestId) : null;

        $integrations->sendWhatsappMessage(
            $this->recipient,
            $this->message,
            $trialRequest,
            $this->respectNotificationToggle,
        );
    }
}
