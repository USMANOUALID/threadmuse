<?php

namespace Tests\Feature;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class IntegrationSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_sensitive_integration_settings_are_encrypted(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);

        $this->actingAs($admin)->post(route('settings.integrations.update'), [
            'section' => 'telegram',
            'telegram_bot_token' => '123456:SECRET',
            'telegram_webhook_url' => 'https://example.com/api/telegram/webhook',
            'telegram_webhook_secret' => 'very-secret-webhook-token',
        ])->assertRedirect();

        $stored = Setting::query()->where('key', 'telegram_bot_token')->firstOrFail();
        $this->assertNotSame('123456:SECRET', $stored->value);
        $this->assertSame('123456:SECRET', Setting::getValue('telegram_bot_token'));
    }
}
