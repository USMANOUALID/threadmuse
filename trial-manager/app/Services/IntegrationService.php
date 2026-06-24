<?php

namespace App\Services;

use App\Models\Setting;
use App\Models\TelegramLog;
use App\Models\TrialRequest;
use App\Models\WhatsappLog;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Throwable;

class IntegrationService
{
    public function settings(): array
    {
        return [
            'whatsapp_cloud_access_token' => Setting::getValue('whatsapp_cloud_access_token'),
            'whatsapp_phone_number_id' => Setting::getValue('whatsapp_phone_number_id'),
            'whatsapp_business_account_id' => Setting::getValue('whatsapp_business_account_id'),
            'whatsapp_verify_token' => Setting::getValue('whatsapp_verify_token'),
            'whatsapp_test_message_number' => Setting::getValue('whatsapp_test_message_number'),
            'telegram_bot_token' => Setting::getValue('telegram_bot_token'),
            'telegram_webhook_url' => Setting::getValue('telegram_webhook_url', route('telegram.webhook')),
            'telegram_webhook_secret' => Setting::getValue('telegram_webhook_secret'),
            'notifications_whatsapp_enabled' => Setting::getValue('notifications_whatsapp_enabled', '1') === '1',
            'notifications_telegram_enabled' => Setting::getValue('notifications_telegram_enabled', '1') === '1',
            'notifications_email_enabled' => Setting::getValue('notifications_email_enabled', '0') === '1',
        ];
    }

    public function status(): array
    {
        return [
            'whatsapp' => Setting::getValue('whatsapp_api_status', 'disconnected'),
            'telegram' => Setting::getValue('telegram_api_status', 'disconnected'),
            'last_response' => Setting::getValue('integrations_last_api_response', 'No API calls have been made yet.'),
            'last_checked_at' => Setting::getValue('integrations_last_connection_check', 'Never'),
        ];
    }

    public function saveWhatsappSettings(array $data): void
    {
        Setting::putMany($data, 'integrations');
    }

    public function saveTelegramSettings(array $data): void
    {
        Setting::putMany($data, 'telegram');
    }

    public function saveNotificationSettings(array $data): void
    {
        Setting::putMany([
            'notifications_whatsapp_enabled' => ! empty($data['notifications_whatsapp_enabled']) ? '1' : '0',
            'notifications_telegram_enabled' => ! empty($data['notifications_telegram_enabled']) ? '1' : '0',
            'notifications_email_enabled' => ! empty($data['notifications_email_enabled']) ? '1' : '0',
        ], 'notifications');
    }

    public function sendTestWhatsapp(): WhatsappLog
    {
        $recipient = Setting::getValue('whatsapp_test_message_number');

        if (! $recipient) {
            throw new RuntimeException('A WhatsApp test number is required.');
        }

        return $this->sendWhatsappMessage(
            $recipient,
            'Trial Manager WhatsApp Cloud API test message sent at '.now()->format('Y-m-d H:i:s')
        );
    }

    public function sendWhatsappMessage(string $recipient, string $message, ?TrialRequest $trialRequest = null, bool $respectNotificationToggle = false): WhatsappLog
    {
        if ($respectNotificationToggle && Setting::getValue('notifications_whatsapp_enabled', '1') !== '1') {
            throw new RuntimeException('WhatsApp notifications are disabled in Integrations settings.');
        }

        $accessToken = Setting::getValue('whatsapp_cloud_access_token');
        $phoneNumberId = Setting::getValue('whatsapp_phone_number_id');

        if (! $accessToken || ! $phoneNumberId) {
            $log = $this->createWhatsappFailureLog(
                $recipient,
                $message,
                $trialRequest,
                'WhatsApp Cloud API access token and phone number ID are required.'
            );

            $this->recordIntegrationStatus('whatsapp', false, 'WhatsApp Cloud API access token and phone number ID are required.');

            return $log;
        }

        try {
            $response = Http::withToken($accessToken)
                ->acceptJson()
                ->post("https://graph.facebook.com/v20.0/{$phoneNumberId}/messages", [
                    'messaging_product' => 'whatsapp',
                    'to' => $recipient,
                    'type' => 'text',
                    'text' => ['body' => $message],
                ]);
        } catch (Throwable $exception) {
            $log = $this->createWhatsappFailureLog($recipient, $message, $trialRequest, $exception->getMessage());
            $this->recordIntegrationStatus('whatsapp', false, 'WhatsApp Cloud API request failed: '.$exception->getMessage());

            return $log;
        }

        $log = WhatsappLog::create([
            'trial_request_id' => $trialRequest?->id,
            'recipient' => $recipient,
            'message' => $message,
            'status' => $response->successful() ? 'sent' : 'failed',
            'response' => $this->responsePayload($response),
            'sent_at' => $response->successful() ? now() : null,
        ]);

        $this->recordIntegrationStatus('whatsapp', $response->successful(), $this->formatResponse('WhatsApp Cloud API send message', $response));

        return $log;
    }

    public function setTelegramWebhook(): bool
    {
        $botToken = Setting::getValue('telegram_bot_token');
        $webhookUrl = Setting::getValue('telegram_webhook_url', route('telegram.webhook'));
        $webhookSecret = Setting::getValue('telegram_webhook_secret');

        if (! $botToken || ! $webhookUrl || ! $webhookSecret) {
            $this->recordIntegrationStatus('telegram', false, 'Telegram bot token, webhook URL, and webhook secret are required.');

            throw new RuntimeException('Telegram bot token, webhook URL, and webhook secret are required.');
        }

        $response = Http::asForm()->post("https://api.telegram.org/bot{$botToken}/setWebhook", [
            'url' => $webhookUrl,
            'secret_token' => $webhookSecret,
        ]);

        $connected = $response->successful() && (bool) data_get($response->json(), 'ok');

        TelegramLog::create([
            'direction' => 'outgoing',
            'payload' => ['action' => 'setWebhook', 'url' => $webhookUrl],
            'message' => 'Set Telegram webhook',
            'status' => $connected ? 'connected' : 'failed',
            'error' => $connected ? null : $response->body(),
        ]);

        $this->recordIntegrationStatus('telegram', $connected, $this->formatResponse('Telegram setWebhook', $response));

        return $connected;
    }

    public function testTelegramBot(): bool
    {
        $botToken = Setting::getValue('telegram_bot_token');

        if (! $botToken) {
            $this->recordIntegrationStatus('telegram', false, 'Telegram bot token is required.');

            throw new RuntimeException('Telegram bot token is required.');
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

        return $connected;
    }

    public function createTestTrialRequest(): TrialRequest
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

        return $trialRequest;
    }

    public function clearLogs(): void
    {
        TelegramLog::query()->delete();
        WhatsappLog::query()->delete();

        $this->recordIntegrationStatus('logs', true, 'Telegram and WhatsApp logs cleared.');
    }

    private function createWhatsappFailureLog(string $recipient, string $message, ?TrialRequest $trialRequest, string $error): WhatsappLog
    {
        return WhatsappLog::create([
            'trial_request_id' => $trialRequest?->id,
            'recipient' => $recipient,
            'message' => $message,
            'status' => 'failed',
            'response' => ['error' => $error],
            'sent_at' => null,
        ]);
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

    private function formatResponse(string $label, Response $response): string
    {
        return $label.' ['.$response->status().']: '.json_encode($this->responsePayload($response), JSON_PRETTY_PRINT);
    }

    private function responsePayload(Response $response): array
    {
        return [
            'status' => $response->status(),
            'body' => $response->json() ?? $response->body(),
        ];
    }
}
