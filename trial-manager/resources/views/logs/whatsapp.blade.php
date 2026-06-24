@extends('layouts.app')

@section('title', 'WhatsApp Logs')
@section('page-title', 'WhatsApp Logs')

@section('content')
    <div class="glass-panel overflow-hidden rounded-3xl">
        <div class="border-b border-white/10 p-5">
            <h2 class="text-lg font-bold text-white">WhatsApp Logs</h2>
            <p class="mt-1 text-sm text-slate-400">Rendered notification messages and delivery status history.</p>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-white/10 text-left text-sm">
                <thead class="bg-white/[0.02] text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                        <th class="px-5 py-4">Time</th>
                        <th class="px-5 py-4">Recipient</th>
                        <th class="px-5 py-4">Request</th>
                        <th class="px-5 py-4">Status</th>
                        <th class="px-5 py-4">Message</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/10">
                    @forelse ($logs as $log)
                        <tr class="align-top hover:bg-white/[0.03]">
                            <td class="px-5 py-4 text-slate-400">{{ $log->created_at->format('Y-m-d H:i:s') }}</td>
                            <td class="px-5 py-4 text-slate-300">{{ $log->recipient ?: 'N/A' }}</td>
                            <td class="px-5 py-4">
                                @if ($log->trialRequest)
                                    <a class="font-semibold text-cyan-300 hover:text-cyan-200" href="{{ route('trial-requests.show', $log->trialRequest) }}">{{ $log->trialRequest->name }}</a>
                                @else
                                    <span class="text-slate-500">N/A</span>
                                @endif
                            </td>
                            <td class="px-5 py-4"><span class="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-xs font-semibold uppercase text-cyan-200">{{ $log->status }}</span></td>
                            <td class="px-5 py-4"><p class="max-w-xl whitespace-pre-wrap text-slate-300">{{ $log->message }}</p></td>
                        </tr>
                    @empty
                        <tr><td colspan="5" class="px-5 py-12 text-center text-slate-500">No WhatsApp logs yet.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        <div class="border-t border-white/10 p-5">{{ $logs->links() }}</div>
    </div>
@endsection
