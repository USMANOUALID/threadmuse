<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

    private function defaultTemplate(): string
    {
        return "🔥 NEW IPTV FREE TRIAL REQUEST\n\n📌 Type: {type}\n👤 Name: {name}\n📧 Email: {email}\n📱 WhatsApp: {whatsapp}\n🌍 Country: {country}\n☎️ Dial Code: {dial_code}\n📦 Plan: {plan}\n💰 Price: {price}\n📝 Message: {message}\n🌐 IP: {ip}\n🕒 Date: {date}";
    }
}
