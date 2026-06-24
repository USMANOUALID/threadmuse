<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        Setting::putMany([
            'telegram_bot_token' => '',
            'telegram_webhook_url' => url('/api/telegram/webhook'),
        ], 'telegram');

        Setting::putMany([
            'whatsapp_admin_number' => '+212648883065',
            'whatsapp_notification_template' => "🔥 NEW IPTV FREE TRIAL REQUEST\n\n📌 Type: {type}\n👤 Name: {name}\n📧 Email: {email}\n📱 WhatsApp: {whatsapp}\n🌍 Country: {country}\n☎️ Dial Code: {dial_code}\n📦 Plan: {plan}\n💰 Price: {price}\n📝 Message: {message}\n🌐 IP: {ip}\n🕒 Date: {date}",
        ], 'whatsapp');
    }
}
