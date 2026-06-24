<?php

namespace Tests\Feature;

use App\Models\Setting;
use App\Services\IntegrationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class WhatsappSendTest extends TestCase
{
    use RefreshDatabase;

    public function test_whatsapp_cloud_api_send_creates_sent_log(): void
    {
        Http::fake([
            'graph.facebook.com/*' => Http::response(['messages' => [['id' => 'wamid.test']]], 200),
        ]);

        Setting::setValue('whatsapp_cloud_access_token', 'token', 'string', 'integrations');
        Setting::setValue('whatsapp_phone_number_id', '1234567890', 'string', 'integrations');

        $log = app(IntegrationService::class)->sendWhatsappMessage('+15555550100', 'Hello');

        $this->assertSame('sent', $log->status);
        Http::assertSent(fn ($request) => str_contains($request->url(), 'graph.facebook.com/v20.0/1234567890/messages'));
    }

    public function test_whatsapp_cloud_api_error_creates_failed_log(): void
    {
        Http::fake([
            'graph.facebook.com/*' => Http::response(['error' => ['message' => 'Invalid token']], 401),
        ]);

        Setting::setValue('whatsapp_cloud_access_token', 'bad-token', 'string', 'integrations');
        Setting::setValue('whatsapp_phone_number_id', '1234567890', 'string', 'integrations');

        $log = app(IntegrationService::class)->sendWhatsappMessage('+15555550100', 'Hello');

        $this->assertSame('failed', $log->status);
    }
}
