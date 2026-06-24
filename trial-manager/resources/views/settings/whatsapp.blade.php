@extends('layouts.app')

@section('title', 'WhatsApp Settings')
@section('page-title', 'WhatsApp Settings')

@section('content')
    <div class="grid gap-6 xl:grid-cols-[1fr_420px]">
        <section class="glass-panel rounded-3xl p-6">
            <h2 class="text-xl font-bold text-white">WhatsApp Notifications</h2>
            <p class="mt-2 text-sm text-slate-400">Configure the admin recipient and reusable notification template. Use placeholders to personalize each message.</p>

            <form method="POST" action="{{ route('settings.whatsapp.update') }}" class="mt-6 space-y-5">
                @csrf
                <div>
                    <label class="text-sm font-semibold text-slate-300" for="whatsapp_admin_number">Admin WhatsApp Number</label>
                    <input class="input-dark mt-2" id="whatsapp_admin_number" name="whatsapp_admin_number" value="{{ old('whatsapp_admin_number', $adminNumber) }}" placeholder="+212648883065">
                    @error('whatsapp_admin_number') <p class="mt-2 text-sm text-rose-300">{{ $message }}</p> @enderror
                </div>
                <div>
                    <label class="text-sm font-semibold text-slate-300" for="whatsapp_notification_template">Notification Template</label>
                    <textarea class="input-dark mt-2 min-h-80 font-mono text-sm" id="whatsapp_notification_template" name="whatsapp_notification_template" required>{{ old('whatsapp_notification_template', $template) }}</textarea>
                    @error('whatsapp_notification_template') <p class="mt-2 text-sm text-rose-300">{{ $message }}</p> @enderror
                </div>
                <button class="btn-primary">Save WhatsApp Settings</button>
            </form>
        </section>

        <aside class="glass-panel rounded-3xl p-6">
            <h3 class="font-bold text-white">Available Placeholders</h3>
            <div class="mt-4 grid grid-cols-2 gap-2 text-sm">
                @foreach (['{type}', '{name}', '{email}', '{whatsapp}', '{country}', '{dial_code}', '{device}', '{plan}', '{price}', '{message}', '{ip}', '{date}'] as $placeholder)
                    <code class="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-cyan-200">{{ $placeholder }}</code>
                @endforeach
            </div>
            <p class="mt-5 text-sm text-slate-400">The Send WhatsApp Notification button currently logs the rendered message, ready to connect to a provider such as WhatsApp Cloud API.</p>
        </aside>
    </div>
@endsection
