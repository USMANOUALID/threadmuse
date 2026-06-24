@extends('layouts.app')

@section('title', 'Telegram Settings')
@section('page-title', 'Telegram Settings')

@section('content')
    <div class="grid gap-6 xl:grid-cols-[1fr_420px]">
        <section class="glass-panel rounded-3xl p-6">
            <h2 class="text-xl font-bold text-white">Bot Configuration</h2>
            <p class="mt-2 text-sm text-slate-400">Store your Telegram bot token and webhook URL for incoming free trial requests.</p>

            <form method="POST" action="{{ route('settings.telegram.update') }}" class="mt-6 space-y-5">
                @csrf
                <div>
                    <label class="text-sm font-semibold text-slate-300" for="telegram_bot_token">Telegram Bot Token</label>
                    <input class="input-dark mt-2" id="telegram_bot_token" name="telegram_bot_token" value="{{ old('telegram_bot_token', $botToken) }}" placeholder="123456:ABC-DEF...">
                    @error('telegram_bot_token') <p class="mt-2 text-sm text-rose-300">{{ $message }}</p> @enderror
                </div>
                <div>
                    <label class="text-sm font-semibold text-slate-300" for="telegram_webhook_url">Webhook URL</label>
                    <input class="input-dark mt-2" id="telegram_webhook_url" name="telegram_webhook_url" value="{{ old('telegram_webhook_url', $webhookUrl) }}">
                    @error('telegram_webhook_url') <p class="mt-2 text-sm text-rose-300">{{ $message }}</p> @enderror
                </div>
                <button class="btn-primary">Save Telegram Settings</button>
            </form>
        </section>

        <aside class="space-y-6">
            <div class="glass-panel rounded-3xl p-6">
                <h3 class="font-bold text-white">Webhook Endpoint</h3>
                <p class="mt-2 text-sm text-slate-400">Use this endpoint in Telegram BotFather or your bot hosting layer.</p>
                <div class="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 font-mono text-sm text-cyan-100 break-all">{{ route('telegram.webhook') }}</div>
            </div>
            <div class="glass-panel rounded-3xl p-6">
                <h3 class="font-bold text-white">Accepted Direct JSON</h3>
                <pre class="mt-4 overflow-auto rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-xs text-slate-300">{
  "name": "Ali Ali",
  "email": "amalaoui37@gmail.com",
  "whatsapp": "+212648883065",
  "country": "Morocco",
  "dial_code": "+212",
  "device": "Smart TV",
  "plan": "Free Trial",
  "message": "",
  "ip_address": "41.140.174.78"
}</pre>
            </div>
        </aside>
    </div>
@endsection
