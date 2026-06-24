<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\TelegramLog;
use App\Models\TrialRequest;
use App\Models\WhatsappLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\View\View;

class SettingsController extends Controller
{
    public function telegram(): View
    {
        return view('settings.telegram', [
            'botToken' => Setting::getValue('telegram_bot_token'),
            'webhookUrl' => Setting::getValue('telegram_webhook_url', route('telegram.webhook')),
        ]);
    }

    public function updateTelegram(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'telegram_bot_token' => ['nullable', 'string', 'max:255'],
            'telegram_webhook_url' => ['nullable', 'url', 'max:255'],
        ]);

        Setting::putMany($data, 'telegram');

        return back()->with('success', 'Telegram settings saved.');
    }

    public function whatsapp(): View
    {
        return view('settings.whatsapp', [
            'adminNumber' => Setting::getValue('whatsapp_admin_number'),
            'template' => Setting::getValue('whatsapp_notification_template', $this->defaultTemplate()),
        ]);
    }

    public function updateWhatsapp(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'whatsapp_admin_number' => ['nullable', 'string', 'max:40'],
            'whatsapp_notification_template' => ['required', 'string'],
        ]);

        Setting::putMany($data, 'whatsapp');

        return back()->with('success', 'WhatsApp settings saved.');
    }

    public function integrations(): View
    {
        return view('settings.integrations', [
            'settings' => [
                'whatsapp_cloud_access_token' => Setting::getValue('whatsapp_cloud_access_token'),
                'whatsapp_phone_number_id' => Setting::getValue('whatsapp_phone_number_id'),
                'whatsapp_business_account_id' => Setting::getValue('whatsapp_business_account_id'),
                'whatsapp_verify_token' => Setting::getValue('whatsapp_verify_token'),
                'whatsapp_test_message_number' => Setting::getValue('whatsapp_test_message_number'),
                'telegram_bot_token' => Setting::getValue('telegram_bot_token'),
                'telegram_webhook_url' => Setting::getValue('telegram_webhook_url', route('telegram.webhook')),
                'notifications_whatsapp_enabled' => Setting::getValue('notifications_whatsapp_enabled', '1') === '1',
                'notifications_telegram_enabled' => Setting::getValue('notifications_telegram_enabled', '1') === '1',
                'notifications_email_enabled' => Setting::getValue('notifications_email_enabled', '0') === '1',
            ],
            'status' => [
                'whatsapp' => Setting::getValue('whatsapp_api_status', 'disconnected'),
                'telegram' => Setting::getValue('telegram_api_status', 'disconnected'),
                'last_response' => Setting::getValue('integrations_last_api_response', 'No API calls have been made yet.'),
                'last_checked_at' => Setting::getValue('integrations_last_connection_check', 'Never'),
            ],
        ]);
    }

    public function updateIntegrations(Request $request): RedirectResponse
    {
        $section = $request->validate([
            'section' => ['required', 'string', 'in:whatsapp,telegram,notifications'],
        ])['section'];

        if ($section === 'whatsapp') {
            $data = $request->validate([
                'whatsapp_cloud_access_token' => ['nullable', 'string'],
                'whatsapp_phone_number_id' => ['nullable', 'string', 'max:255'],
                'whatsapp_business_account_id' => ['nullable', 'string', 'max:255'],
                'whatsapp_verify_token' => ['nullable', 'string', 'max:255'],
                'whatsapp_test_message_number' => ['nullable', 'string', 'max:60'],
            ]);

            Setting::putMany($data, 'integrations');

            return back()->with('success', 'WhatsApp Cloud API settings saved.');
        }

        if ($section === 'telegram') {
            $data = $request->validate([
                'telegram_bot_token' => ['nullable', 'string', 'max:255'],
                'telegram_webhook_url' => ['nullable', 'url', 'max:255'],
            ]);

            Setting::putMany($data, 'telegram');

            return back()->with('success', 'Telegram Bot settings saved.');
        }

        Setting::putMany([
            'notifications_whatsapp_enabled' => $request->boolean('notifications_whatsapp_enabled') ? '1' : '0',
            'notifications_telegram_enabled' => $request->boolean('notifications_telegram_enabled') ? '1' : '0',
            'notifications_email_enabled' => $request->boolean('notifications_email_enabled') ? '1' : '0',
        ], 'notifications');

        return back()->with('success', 'Notification settings saved.');
    }

    public function sendTestWhatsapp(): RedirectResponse
    {
        $accessToken = Setting::getValue('whatsapp_cloud_access_token');
        $phoneNumberId = Setting::getValue('whatsapp_phone_number_id');
        $recipient = Setting::getValue('whatsapp_test_message_number');

        if (! $accessToken || ! $phoneNumberId || ! $recipient) {
            $this->recordIntegrationStatus('whatsapp', false, 'WhatsApp Cloud API token, phone number ID, and test number are required.');

            return back()->withErrors(['integrations' => 'WhatsApp Cloud API token, phone number ID, and test number are required.']);
        }

        $message = 'Trial Manager WhatsApp Cloud API test message sent at '.now()->format('Y-m-d H:i:s');
        $response = Http::withToken($accessToken)
            ->acceptJson()
            ->post("https://graph.facebook.com/v20.0/{$phoneNumberId}/messages", [
                'messaging_product' => 'whatsapp',
                'to' => $recipient,
                'type' => 'text',
                'text' => ['body' => $message],
            ]);

        WhatsappLog::create([
            'recipient' => $recipient,
            'message' => $message,
            'status' => $response->successful() ? 'sent' : 'failed',
            'response' => $this->responsePayload($response),
            'sent_at' => $response->successful() ? now() : null,
        ]);

        $this->recordIntegrationStatus('whatsapp', $response->successful(), $this->formatResponse('WhatsApp test message', $response));

        return back()->with('success', $response->successful() ? 'Test WhatsApp message sent.' : 'Test WhatsApp message failed. Check API status for details.');
    }

    public function setTelegramWebhook(): RedirectResponse
    {
        $botToken = Setting::getValue('telegram_bot_token');
        $webhookUrl = Setting::getValue('telegram_webhook_url', route('telegram.webhook'));

        if (! $botToken || ! $webhookUrl) {
            $this->recordIntegrationStatus('telegram', false, 'Telegram bot token and webhook URL are required.');

            return back()->withErrors(['integrations' => 'Telegram bot token and webhook URL are required.']);
        }

        $response = Http::asForm()->post("https://api.telegram.org/bot{$botToken}/setWebhook", [
            'url' => $webhookUrl,
        ]);

        TelegramLog::create([
            'direction' => 'outgoing',
            'payload' => ['action' => 'setWebhook', 'url' => $webhookUrl],
            'message' => 'Set Telegram webhook',
            'status' => $response->successful() && (bool) data_get($response->json(), 'ok') ? 'connected' : 'failed',
            'error' => $response->successful() ? null : $response->body(),
        ]);

        $connected = $response->successful() && (bool) data_get($response->json(), 'ok');
        $this->recordIntegrationStatus('telegram', $connected, $this->formatResponse('Telegram setWebhook', $response));

        return back()->with('success', $connected ? 'Telegram webhook set.' : 'Telegram webhook setup failed. Check API status for details.');
    }

    public function testTelegram(): RedirectResponse
    {
        $botToken = Setting::getValue('telegram_bot_token');

        if (! $botToken) {
            $this->recordIntegrationStatus('telegram', false, 'Telegram bot token is required.');

            return back()->withErrors(['integrations' => 'Telegram bot token is required.']);
        }

        $response = Http::get("https://api.telegram.org/bot{$botToken}/getMe");
        $connected = $response->successful() && (bool) data_get($response->json(), 'ok');

        TelegramLog::create([
            'direction' => 'outgoing',
            'payload' => ['action' => 'getMe'],
            'message' => 'Test Telegram Bot API connection',
            'status' => $connected ? 'connected' : 'failed',
            'error' => $connected ? null : $response->body(),
        ]);

        $this->recordIntegrationStatus('telegram', $connected, $this->formatResponse('Telegram getMe', $response));

        return back()->with('success', $connected ? 'Telegram Bot API connected.' : 'Telegram Bot API test failed. Check API status for details.');
    }

    public function createTestTrialRequest(): RedirectResponse
    {
        $trialRequest = TrialRequest::create([
            'name' => 'Test Trial User',
            'email' => 'test-trial@example.com',
            'whatsapp' => Setting::getValue('whatsapp_test_message_number', '+10000000000'),
            'country' => 'Test Country',
            'dial_code' => '+1',
            'device' => 'Test Device',
            'plan' => 'Free Trial',
            'message' => 'Created from Integrations quick action.',
            'ip_address' => request()->ip(),
            'status' => TrialRequest::STATUS_PENDING,
        ]);

        $this->recordIntegrationStatus('trial_request', true, "Created test trial request #{$trialRequest->id}.");

        return back()->with('success', 'Test trial request created.');
    }

    public function clearIntegrationLogs(): RedirectResponse
    {
        TelegramLog::query()->delete();
        WhatsappLog::query()->delete();

        $this->recordIntegrationStatus('logs', true, 'Telegram and WhatsApp logs cleared.');

        return back()->with('success', 'Integration logs cleared.');
    }

    private function defaultTemplate(): string
    {
        return "🔥 NEW IPTV FREE TRIAL REQUEST\n\n📌 Type: {type}\n👤 Name: {name}\n📧 Email: {email}\n📱 WhatsApp: {whatsapp}\n🌍 Country: {country}\n☎️ Dial Code: {dial_code}\n📦 Plan: {plan}\n💰 Price: {price}\n📝 Message: {message}\n🌐 IP: {ip}\n🕒 Date: {date}";
    }

    private function recordIntegrationStatus(string $service, bool $connected, string $response): void
    {
        if ($service === 'whatsapp') {
            Setting::setValue('whatsapp_api_status', $connected ? 'connected' : 'disconnected', 'string', 'integrations');
        }

        if ($service === 'telegram') {
            Setting::setValue('telegram_api_status', $connected ? 'connected' : 'disconnected', 'string', 'integrations');
        }

        Setting::setValue('integrations_last_api_response', $response, 'string', 'integrations');
        Setting::setValue('integrations_last_connection_check', now()->format('Y-m-d H:i:s'), 'string', 'integrations');
    }

    private function formatResponse(string $label, mixed $response): string
    {
        return $label.' ['.$response->status().']: '.json_encode($this->responsePayload($response), JSON_PRETTY_PRINT);
    }

    private function responsePayload(mixed $response): array
    {
        return [
            'status' => $response->status(),
            'body' => $response->json() ?? $response->body(),
        ];
    }
}
