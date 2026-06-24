@extends('layouts.app')

@section('title', 'Dashboard')
@section('page-title', 'Dashboard')

@section('content')
    @php
        $cards = [
            ['label' => 'Total Requests', 'value' => $stats['total'], 'accent' => 'from-cyan-300 to-blue-500', 'hint' => 'All captured leads'],
            ['label' => 'Pending Requests', 'value' => $stats['pending'], 'accent' => 'from-amber-300 to-orange-500', 'hint' => 'Needs review'],
            ['label' => 'Approved Requests', 'value' => $stats['approved'], 'accent' => 'from-emerald-300 to-teal-500', 'hint' => 'Ready to activate'],
            ['label' => 'Rejected Requests', 'value' => $stats['rejected'], 'accent' => 'from-rose-300 to-pink-500', 'hint' => 'Declined leads'],
            ['label' => "Today's Requests", 'value' => $stats['today'], 'accent' => 'from-violet-300 to-indigo-500', 'hint' => 'New today'],
        ];
    @endphp

    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        @foreach ($cards as $card)
            <div class="glass-panel overflow-hidden rounded-3xl p-5">
                <div class="flex items-start justify-between gap-4">
                    <div>
                        <p class="text-sm font-medium text-slate-400">{{ $card['label'] }}</p>
                        <p class="mt-3 text-4xl font-black tracking-tight text-white">{{ number_format($card['value']) }}</p>
                    </div>
                    <span class="h-12 w-12 rounded-2xl bg-gradient-to-br {{ $card['accent'] }} opacity-90 shadow-lg"></span>
                </div>
                <p class="mt-4 text-xs uppercase tracking-[0.25em] text-slate-500">{{ $card['hint'] }}</p>
            </div>
        @endforeach
    </section>

    <section class="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div class="glass-panel rounded-3xl p-6">
            <div class="flex items-center justify-between gap-4">
                <div>
                    <h2 class="text-lg font-bold text-white">Recent Requests</h2>
                    <p class="mt-1 text-sm text-slate-400">Latest trial submissions from Telegram and manual entry.</p>
                </div>
                <a href="{{ route('trial-requests.index') }}" class="btn-muted">View all</a>
            </div>

            <div class="mt-6 overflow-x-auto">
                <table class="min-w-full divide-y divide-white/10 text-left text-sm">
                    <thead class="text-xs uppercase tracking-wider text-slate-500">
                        <tr>
                            <th class="py-3 pr-4">Lead</th>
                            <th class="px-4 py-3">Plan</th>
                            <th class="px-4 py-3">Country</th>
                            <th class="px-4 py-3">Status</th>
                            <th class="py-3 pl-4 text-right">Date</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10">
                        @forelse ($recentRequests as $trialRequest)
                            <tr class="hover:bg-white/[0.03]">
                                <td class="py-4 pr-4">
                                    <a href="{{ route('trial-requests.show', $trialRequest) }}" class="font-semibold text-white hover:text-cyan-300">{{ $trialRequest->name }}</a>
                                    <p class="text-xs text-slate-500">{{ $trialRequest->email ?: $trialRequest->whatsapp }}</p>
                                </td>
                                <td class="px-4 py-4 text-slate-300">{{ $trialRequest->plan }}</td>
                                <td class="px-4 py-4 text-slate-300">{{ $trialRequest->country ?: 'N/A' }}</td>
                                <td class="px-4 py-4"><x-status-badge :status="$trialRequest->status" /></td>
                                <td class="py-4 pl-4 text-right text-slate-400">{{ $trialRequest->created_at->format('M d, H:i') }}</td>
                            </tr>
                        @empty
                            <tr><td colspan="5" class="py-10 text-center text-slate-500">No requests yet.</td></tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        <div class="glass-panel rounded-3xl p-6">
            <h2 class="text-lg font-bold text-white">Telegram Intake</h2>
            <p class="mt-1 text-sm text-slate-400">Send your bot webhook to this endpoint to create requests automatically.</p>
            <div class="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 font-mono text-sm text-cyan-100 break-all">
                {{ route('telegram.webhook') }}
            </div>
            <div class="mt-6 space-y-4">
                <div class="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                    <p class="text-sm font-semibold text-white">Supported payloads</p>
                    <p class="mt-1 text-sm text-slate-400">Direct JSON fields or Telegram message text containing Name, Email, WhatsApp, Country, Dial Code, Plan, Message, and IP.</p>
                </div>
                <a href="{{ route('settings.telegram') }}" class="btn-primary w-full">Configure Telegram</a>
            </div>
        </div>
    </section>
@endsection
