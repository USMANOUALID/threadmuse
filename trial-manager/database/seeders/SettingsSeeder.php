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
            'telegram_api_status' => 'disconnected',
        ], 'telegram');

        Setting::putMany([
            'whatsapp_admin_number' => '+212648883065',
            'whatsapp_notification_template' => "🔥 NEW IPTV FREE TRIAL REQUEST\n\n📌 Type: {type}\n👤 Name: {name}\n📧 Email: {email}\n📱 WhatsApp: {whatsapp}\n🌍 Country: {country}\n☎️ Dial Code: {dial_code}\n📦 Plan: {plan}\n💰 Price: {price}\n📝 Message: {message}\n🌐 IP: {ip}\n🕒 Date: {date}",
            'whatsapp_cloud_access_token' => '',
            'whatsapp_phone_number_id' => '',
            'whatsapp_business_account_id' => '',
            'whatsapp_verify_token' => '',
            'whatsapp_test_message_number' => '+212648883065',
            'whatsapp_api_status' => 'disconnected',
        ], 'whatsapp');

        Setting::putMany([
            'notifications_whatsapp_enabled' => '1',
            'notifications_telegram_enabled' => '1',
            'notifications_email_enabled' => '0',
        ], 'notifications');

        Setting::putMany([
            'integrations_last_api_response' => 'No API calls have been made yet.',
            'integrations_last_connection_check' => 'Never',
        ], 'integrations');
    }
}
