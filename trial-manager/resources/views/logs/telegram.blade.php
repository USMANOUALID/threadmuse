@extends('layouts.app')

@section('title', 'Telegram Logs')
@section('page-title', 'Telegram Logs')

@section('content')
    <div class="glass-panel overflow-hidden rounded-3xl">
        <div class="border-b border-white/10 p-5">
            <h2 class="text-lg font-bold text-white">Telegram Webhook Logs</h2>
            <p class="mt-1 text-sm text-slate-400">Every incoming Telegram update is recorded with payload, status, and errors.</p>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-white/10 text-left text-sm">
                <thead class="bg-white/[0.02] text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                        <th class="px-5 py-4">Time</th>
                        <th class="px-5 py-4">Direction</th>
                        <th class="px-5 py-4">Update</th>
                        <th class="px-5 py-4">Status</th>
                        <th class="px-5 py-4">Message</th>
                        <th class="px-5 py-4">Error</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/10">
                    @forelse ($logs as $log)
                        <tr class="align-top hover:bg-white/[0.03]">
                            <td class="px-5 py-4 text-slate-400">{{ $log->created_at->format('Y-m-d H:i:s') }}</td>
                            <td class="px-5 py-4 text-slate-300">{{ $log->direction }}</td>
                            <td class="px-5 py-4 font-mono text-slate-300">{{ $log->update_id ?: 'N/A' }}</td>
                            <td class="px-5 py-4"><span class="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-xs font-semibold uppercase text-cyan-200">{{ $log->status }}</span></td>
                            <td class="px-5 py-4"><p class="max-w-md whitespace-pre-wrap text-slate-300">{{ $log->message ?: 'N/A' }}</p></td>
                            <td class="px-5 py-4 text-rose-300">{{ $log->error ?: 'N/A' }}</td>
                        </tr>
                    @empty
                        <tr><td colspan="6" class="px-5 py-12 text-center text-slate-500">No Telegram logs yet.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        <div class="border-t border-white/10 p-5">{{ $logs->links() }}</div>
    </div>
@endsection
