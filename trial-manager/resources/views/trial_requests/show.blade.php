@extends('layouts.app')

@section('title', 'Request Details')
@section('page-title', 'Request Details')

@section('content')
    <div class="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section class="glass-panel rounded-3xl p-6">
            <div class="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div class="flex items-center gap-3">
                        <h2 class="text-3xl font-black tracking-tight text-white">{{ $trialRequest->name }}</h2>
                        <x-status-badge :status="$trialRequest->status" />
                    </div>
                    <p class="mt-2 text-slate-400">Created {{ $trialRequest->created_at->format('Y-m-d H:i:s') }}</p>
                </div>
                <a href="{{ route('trial-requests.edit', $trialRequest) }}" class="btn-muted">Edit</a>
            </div>

            @php
                $fields = [
                    'Email' => $trialRequest->email ?: 'N/A',
                    'WhatsApp' => $trialRequest->whatsapp,
                    'Country' => $trialRequest->country ?: 'N/A',
                    'Dial Code' => $trialRequest->dial_code ?: 'N/A',
                    'Device' => $trialRequest->device ?: 'N/A',
                    'Plan' => $trialRequest->plan,
                    'IP Address' => $trialRequest->ip_address ?: 'N/A',
                    'Created Date' => $trialRequest->created_at->format('Y-m-d H:i:s'),
                ];
            @endphp

            <div class="mt-6 grid gap-4 md:grid-cols-2">
                @foreach ($fields as $label => $value)
                    <div class="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                        <p class="text-xs uppercase tracking-[0.25em] text-slate-500">{{ $label }}</p>
                        <p class="mt-2 font-semibold text-white break-all">{{ $value }}</p>
                    </div>
                @endforeach
            </div>

            <div class="mt-6 rounded-2xl border border-white/10 bg-slate-950/50 p-5">
                <p class="text-xs uppercase tracking-[0.25em] text-slate-500">Message</p>
                <p class="mt-3 whitespace-pre-wrap text-slate-200">{{ $trialRequest->message ?: 'No message provided.' }}</p>
            </div>
        </section>

        <aside class="space-y-6">
            <div class="glass-panel rounded-3xl p-6">
                <h3 class="text-lg font-bold text-white">Actions</h3>
                <div class="mt-5 grid gap-3">
                    <form method="POST" action="{{ route('trial-requests.approve', $trialRequest) }}">@csrf<button class="btn-primary w-full">Approve</button></form>
                    <form method="POST" action="{{ route('trial-requests.reject', $trialRequest) }}">@csrf<button class="btn-danger w-full">Reject</button></form>
                    <form method="POST" action="{{ route('trial-requests.processed', $trialRequest) }}">@csrf<button class="btn-muted w-full">Mark Processed</button></form>
                    <form method="POST" action="{{ route('trial-requests.whatsapp', $trialRequest) }}">@csrf<button class="btn-muted w-full">Send WhatsApp Notification</button></form>
                    <form method="POST" action="{{ route('trial-requests.destroy', $trialRequest) }}" onsubmit="return confirm('Delete this trial request?')">
                        @csrf @method('DELETE')
                        <button class="btn-danger w-full">Delete</button>
                    </form>
                </div>
            </div>

            <div class="glass-panel rounded-3xl p-6">
                <h3 class="text-lg font-bold text-white">WhatsApp Logs</h3>
                <div class="mt-4 space-y-3">
                    @forelse ($trialRequest->whatsappLogs as $log)
                        <div class="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                            <div class="flex items-center justify-between gap-3">
                                <p class="font-semibold text-white">{{ $log->recipient }}</p>
                                <span class="text-xs uppercase tracking-wider text-cyan-300">{{ $log->status }}</span>
                            </div>
                            <p class="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-slate-400">{{ $log->message }}</p>
                            <p class="mt-2 text-xs text-slate-500">{{ $log->created_at->format('Y-m-d H:i') }}</p>
                        </div>
                    @empty
                        <p class="text-sm text-slate-500">No WhatsApp notifications yet.</p>
                    @endforelse
                </div>
            </div>
        </aside>
    </div>
@endsection
