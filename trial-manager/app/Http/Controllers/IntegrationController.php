<?php

namespace App\Http\Controllers;

use App\Services\IntegrationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use RuntimeException;

class IntegrationController extends Controller
{
    public function __construct(private readonly IntegrationService $integrations)
    {
    }

    public function index(): View
    {
        return view('settings.integrations', [
            'settings' => $this->integrations->settings(),
            'status' => $this->integrations->status(),
        ]);
    }

    public function update(Request $request): RedirectResponse
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

            $this->integrations->saveWhatsappSettings($data);

            return back()->with('success', 'WhatsApp Cloud API settings saved.');
        }

        if ($section === 'telegram') {
            $data = $request->validate([
                'telegram_bot_token' => ['nullable', 'string', 'max:255'],
                'telegram_webhook_url' => ['nullable', 'url', 'max:255'],
            ]);

            $this->integrations->saveTelegramSettings($data);

            return back()->with('success', 'Telegram Bot settings saved.');
        }

        $this->integrations->saveNotificationSettings($request->only([
            'notifications_whatsapp_enabled',
            'notifications_telegram_enabled',
            'notifications_email_enabled',
        ]));

        return back()->with('success', 'Notification settings saved.');
    }

    public function sendTestWhatsapp(): RedirectResponse
    {
        try {
            $log = $this->integrations->sendTestWhatsapp();
        } catch (RuntimeException $exception) {
            return back()->withErrors(['integrations' => $exception->getMessage()]);
        }

        return back()->with('success', $log->status === 'sent'
            ? 'Test WhatsApp message sent through Meta Graph API.'
            : 'Test WhatsApp message failed. Check API status for details.');
    }

    public function setTelegramWebhook(): RedirectResponse
    {
        try {
            $connected = $this->integrations->setTelegramWebhook();
        } catch (RuntimeException $exception) {
            return back()->withErrors(['integrations' => $exception->getMessage()]);
        }

        return back()->with('success', $connected
            ? 'Telegram webhook set.'
            : 'Telegram webhook setup failed. Check API status for details.');
    }

    public function testTelegram(): RedirectResponse
    {
        try {
            $connected = $this->integrations->testTelegramBot();
        } catch (RuntimeException $exception) {
            return back()->withErrors(['integrations' => $exception->getMessage()]);
        }

        return back()->with('success', $connected
            ? 'Telegram Bot API connected.'
            : 'Telegram Bot API test failed. Check API status for details.');
    }

    public function createTestTrialRequest(): RedirectResponse
    {
        $this->integrations->createTestTrialRequest();

        return back()->with('success', 'Test trial request created.');
    }

    public function clearLogs(): RedirectResponse
    {
        $this->integrations->clearLogs();

        return back()->with('success', 'Integration logs cleared.');
    }
}
