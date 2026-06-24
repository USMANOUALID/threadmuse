@extends('layouts.app')

@section('title', 'Integrations')
@section('page-title', 'Settings → Integrations')

@section('content')
    @php
        $statusClass = fn (string $value) => $value === 'connected'
            ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
            : 'border-rose-400/30 bg-rose-400/10 text-rose-200';

        $toggleClass = 'rounded border-white/10 bg-slate-950 text-cyan-400 focus:ring-cyan-400/30';
    @endphp

    <div class="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div class="space-y-6">
            <section class="glass-panel rounded-3xl p-6">
                <div class="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p class="text-xs uppercase tracking-[0.3em] text-cyan-300">WhatsApp Cloud API</p>
                        <h2 class="mt-2 text-xl font-bold text-white">WhatsApp Connection</h2>
                        <p class="mt-1 text-sm text-slate-400">Store Meta WhatsApp Cloud API credentials and send a real test message.</p>
                    </div>
                    <span class="inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider {{ $statusClass($status['whatsapp']) }}">
                        {{ $status['whatsapp'] === 'connected' ? 'Connected' : 'Disconnected' }}
                    </span>
                </div>

                <form method="POST" action="{{ route('settings.integrations.update') }}" class="mt-6 grid gap-5 md:grid-cols-2">
                    @csrf
                    <input type="hidden" name="section" value="whatsapp">

                    <div class="md:col-span-2">
                        <label class="text-sm font-semibold text-slate-300" for="whatsapp_cloud_access_token">Access Token</label>
                        <textarea class="input-dark mt-2 min-h-28 font-mono text-sm" id="whatsapp_cloud_access_token" name="whatsapp_cloud_access_token" placeholder="EAAB...">{{ old('whatsapp_cloud_access_token', $settings['whatsapp_cloud_access_token']) }}</textarea>
                    </div>

                    <div>
                        <label class="text-sm font-semibold text-slate-300" for="whatsapp_phone_number_id">Phone Number ID</label>
                        <input class="input-dark mt-2" id="whatsapp_phone_number_id" name="whatsapp_phone_number_id" value="{{ old('whatsapp_phone_number_id', $settings['whatsapp_phone_number_id']) }}" placeholder="123456789012345">
                    </div>

                    <div>
                        <label class="text-sm font-semibold text-slate-300" for="whatsapp_business_account_id">Business Account ID</label>
                        <input class="input-dark mt-2" id="whatsapp_business_account_id" name="whatsapp_business_account_id" value="{{ old('whatsapp_business_account_id', $settings['whatsapp_business_account_id']) }}" placeholder="123456789012345">
                    </div>

                    <div>
                        <label class="text-sm font-semibold text-slate-300" for="whatsapp_verify_token">Verify Token</label>
                        <input class="input-dark mt-2" id="whatsapp_verify_token" name="whatsapp_verify_token" value="{{ old('whatsapp_verify_token', $settings['whatsapp_verify_token']) }}" placeholder="your-webhook-verify-token">
                    </div>

                    <div>
                        <label class="text-sm font-semibold text-slate-300" for="whatsapp_test_message_number">Test Number</label>
                        <input class="input-dark mt-2" id="whatsapp_test_message_number" name="whatsapp_test_message_number" value="{{ old('whatsapp_test_message_number', $settings['whatsapp_test_message_number']) }}" placeholder="+212648883065">
                    </div>

                    <div class="flex flex-col gap-3 md:col-span-2 sm:flex-row sm:justify-end">
                        <button class="btn-muted">Save WhatsApp Settings</button>
                    </div>
                </form>

                <form method="POST" action="{{ route('settings.integrations.whatsapp.test') }}" class="mt-3 flex justify-end">
                    @csrf
                    <button class="btn-primary">Send Test Message</button>
                </form>
            </section>

            <section class="glass-panel rounded-3xl p-6">
                <div class="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p class="text-xs uppercase tracking-[0.3em] text-cyan-300">Telegram Bot</p>
                        <h2 class="mt-2 text-xl font-bold text-white">Telegram Connection</h2>
                        <p class="mt-1 text-sm text-slate-400">Store the bot token, set the webhook, and test Telegram Bot API connectivity.</p>
                    </div>
                    <span class="inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider {{ $statusClass($status['telegram']) }}">
                        {{ $status['telegram'] === 'connected' ? 'Connected' : 'Disconnected' }}
                    </span>
                </div>

                <form method="POST" action="{{ route('settings.integrations.update') }}" class="mt-6 grid gap-5 md:grid-cols-2">
                    @csrf
                    <input type="hidden" name="section" value="telegram">

                    <div>
                        <label class="text-sm font-semibold text-slate-300" for="telegram_bot_token">Bot Token</label>
                        <input class="input-dark mt-2" id="telegram_bot_token" name="telegram_bot_token" value="{{ old('telegram_bot_token', $settings['telegram_bot_token']) }}" placeholder="123456:ABC-DEF...">
                    </div>

                    <div>
                        <label class="text-sm font-semibold text-slate-300" for="telegram_webhook_url">Webhook URL</label>
                        <input class="input-dark mt-2" id="telegram_webhook_url" name="telegram_webhook_url" value="{{ old('telegram_webhook_url', $settings['telegram_webhook_url']) }}">
                    </div>

                    <div class="md:col-span-2">
                        <label class="text-sm font-semibold text-slate-300" for="telegram_webhook_secret">Webhook Secret</label>
                        <input class="input-dark mt-2" id="telegram_webhook_secret" name="telegram_webhook_secret" value="{{ old('telegram_webhook_secret', $settings['telegram_webhook_secret']) }}" placeholder="minimum-16-character-secret">
                        <p class="mt-2 text-xs text-slate-500">Telegram sends this as X-Telegram-Bot-Api-Secret-Token and unauthorized webhook calls are rejected.</p>
                    </div>

                    <div class="flex flex-col gap-3 md:col-span-2 sm:flex-row sm:justify-end">
                        <button class="btn-muted">Save Telegram Settings</button>
                    </div>
                </form>

                <div class="mt-3 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <form method="POST" action="{{ route('settings.integrations.telegram.webhook') }}">
                        @csrf
                        <button class="btn-primary w-full sm:w-auto">Set Webhook</button>
                    </form>
                    <form method="POST" action="{{ route('settings.integrations.telegram.test') }}">
                        @csrf
                        <button class="btn-muted w-full sm:w-auto">Test Bot</button>
                    </form>
                </div>
            </section>

            <section class="glass-panel rounded-3xl p-6">
                <div class="border-b border-white/10 pb-5">
                    <p class="text-xs uppercase tracking-[0.3em] text-cyan-300">Notifications</p>
                    <h2 class="mt-2 text-xl font-bold text-white">Notification Channels</h2>
                    <p class="mt-1 text-sm text-slate-400">Enable or disable outbound notifications per channel.</p>
                </div>

                <form method="POST" action="{{ route('settings.integrations.update') }}" class="mt-6 space-y-4">
                    @csrf
                    <input type="hidden" name="section" value="notifications">

                    <label class="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                        <span>
                            <span class="block font-semibold text-white">Enable WhatsApp notifications</span>
                            <span class="text-sm text-slate-400">Allow WhatsApp notifications for trial request workflows.</span>
                        </span>
                        <input type="checkbox" name="notifications_whatsapp_enabled" value="1" class="{{ $toggleClass }}" @checked($settings['notifications_whatsapp_enabled'])>
                    </label>

                    <label class="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                        <span>
                            <span class="block font-semibold text-white">Enable Telegram notifications</span>
                            <span class="text-sm text-slate-400">Allow Telegram notifications and bot status messages.</span>
                        </span>
                        <input type="checkbox" name="notifications_telegram_enabled" value="1" class="{{ $toggleClass }}" @checked($settings['notifications_telegram_enabled'])>
                    </label>

                    <label class="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                        <span>
                            <span class="block font-semibold text-white">Enable Email notifications</span>
                            <span class="text-sm text-slate-400">Allow email notifications when mail transport is configured.</span>
                        </span>
                        <input type="checkbox" name="notifications_email_enabled" value="1" class="{{ $toggleClass }}" @checked($settings['notifications_email_enabled'])>
                    </label>

                    <div class="flex justify-end">
                        <button class="btn-primary">Save Notification Settings</button>
                    </div>
                </form>
            </section>
        </div>

        <aside class="space-y-6">
            <section class="glass-panel rounded-3xl p-6">
                <p class="text-xs uppercase tracking-[0.3em] text-cyan-300">API Status</p>
                <h2 class="mt-2 text-xl font-bold text-white">Connection Health</h2>

                <div class="mt-5 space-y-3">
                    <div class="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                        <div class="flex items-center justify-between gap-3">
                            <span class="font-semibold text-white">WhatsApp API</span>
                            <span class="rounded-full border px-2.5 py-1 text-xs font-semibold uppercase {{ $statusClass($status['whatsapp']) }}">
                                {{ $status['whatsapp'] }}
                            </span>
                        </div>
                    </div>

                    <div class="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                        <div class="flex items-center justify-between gap-3">
                            <span class="font-semibold text-white">Telegram Bot</span>
                            <span class="rounded-full border px-2.5 py-1 text-xs font-semibold uppercase {{ $statusClass($status['telegram']) }}">
                                {{ $status['telegram'] }}
                            </span>
                        </div>
                    </div>

                    <div class="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                        <p class="text-xs uppercase tracking-[0.25em] text-slate-500">Last Connection Check</p>
                        <p class="mt-2 font-semibold text-white">{{ $status['last_checked_at'] }}</p>
                    </div>

                    <div class="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                        <p class="text-xs uppercase tracking-[0.25em] text-slate-500">Last API Response</p>
                        <pre class="mt-2 max-h-72 overflow-auto whitespace-pre-wrap text-xs text-slate-300">{{ $status['last_response'] }}</pre>
                    </div>
                </div>
            </section>

            <section class="glass-panel rounded-3xl p-6">
                <p class="text-xs uppercase tracking-[0.3em] text-cyan-300">Quick Actions</p>
                <h2 class="mt-2 text-xl font-bold text-white">Run Integration Tasks</h2>
                <div class="mt-5 grid gap-3">
                    <form method="POST" action="{{ route('settings.integrations.whatsapp.test') }}">
                        @csrf
                        <button class="btn-primary w-full">Send Test WhatsApp</button>
                    </form>

                    <form method="POST" action="{{ route('settings.integrations.telegram.test') }}">
                        @csrf
                        <button class="btn-muted w-full">Send Test Telegram</button>
                    </form>

                    <form method="POST" action="{{ route('settings.integrations.trial-request.test') }}">
                        @csrf
                        <button class="btn-muted w-full">Create Test Trial Request</button>
                    </form>

                    <form method="POST" action="{{ route('settings.integrations.logs.clear') }}" onsubmit="return confirm('Clear Telegram and WhatsApp logs?')">
                        @csrf
                        <button class="btn-danger w-full">Clear Logs</button>
                    </form>
                </div>
            </section>
        </aside>
    </div>
@endsection
