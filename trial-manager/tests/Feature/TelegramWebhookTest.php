<?php

namespace Tests\Feature;

use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TelegramWebhookTest extends TestCase
{
    use RefreshDatabase;

    public function test_telegram_webhook_rejects_missing_secret(): void
    {
        Setting::setValue('telegram_webhook_secret', 'super-secret-token', 'string', 'telegram');

        $this->postJson(route('telegram.webhook'), [
            'name' => 'Ali',
            'whatsapp' => '+15555550100',
        ])->assertForbidden();
    }

    public function test_telegram_webhook_accepts_valid_secret_and_creates_request(): void
    {
        Setting::setValue('telegram_webhook_secret', 'super-secret-token', 'string', 'telegram');

        $this->withHeader('X-Telegram-Bot-Api-Secret-Token', 'super-secret-token')
            ->postJson(route('telegram.webhook'), [
                'name' => 'Ali',
                'email' => 'ali@example.com',
                'whatsapp' => '+15555550100',
                'plan' => 'Free Trial',
            ])->assertOk();

        $this->assertDatabaseHas('trial_requests', ['name' => 'Ali', 'whatsapp' => '+15555550100']);
    }
}
