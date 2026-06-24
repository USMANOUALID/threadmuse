@extends('layouts.app')

@section('title', 'Trial Requests')
@section('page-title', 'Trial Requests')

@section('content')
    <div class="glass-panel rounded-3xl p-5">
        <form method="GET" class="grid gap-3 lg:grid-cols-[1fr_180px_180px_180px_auto]">
            <input class="input-dark" name="search" value="{{ $filters['search'] ?? '' }}" placeholder="Search name, email, WhatsApp, country, IP...">
            <select class="input-dark" name="status">
                <option value="">All statuses</option>
                @foreach ($statuses as $status)
                    <option value="{{ $status }}" @selected(($filters['status'] ?? '') === $status)>{{ ucfirst($status) }}</option>
                @endforeach
            </select>
            <select class="input-dark" name="plan">
                <option value="">All plans</option>
                @foreach ($plans as $plan)
                    <option value="{{ $plan }}" @selected(($filters['plan'] ?? '') === $plan)>{{ $plan }}</option>
                @endforeach
            </select>
            <input class="input-dark" name="country" value="{{ $filters['country'] ?? '' }}" placeholder="Country">
            <button class="btn-primary">Filter</button>
        </form>
    </div>

    <div class="mt-6 glass-panel overflow-hidden rounded-3xl">
        <div class="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h2 class="text-lg font-bold text-white">All Requests</h2>
                <p class="mt-1 text-sm text-slate-400">{{ $trialRequests->total() }} matching requests</p>
            </div>
            <a href="{{ route('trial-requests.create') }}" class="btn-primary">Add Request</a>
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-white/10 text-left text-sm">
                <thead class="bg-white/[0.02] text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                        <th class="px-5 py-4">Lead</th>
                        <th class="px-5 py-4">WhatsApp</th>
                        <th class="px-5 py-4">Country</th>
                        <th class="px-5 py-4">Device</th>
                        <th class="px-5 py-4">Plan</th>
                        <th class="px-5 py-4">Status</th>
                        <th class="px-5 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/10">
                    @forelse ($trialRequests as $trialRequest)
                        <tr class="hover:bg-white/[0.03]">
                            <td class="px-5 py-4">
                                <a href="{{ route('trial-requests.show', $trialRequest) }}" class="font-semibold text-white hover:text-cyan-300">{{ $trialRequest->name }}</a>
                                <p class="text-xs text-slate-500">{{ $trialRequest->email ?: 'No email' }}</p>
                            </td>
                            <td class="px-5 py-4 text-slate-300">{{ $trialRequest->whatsapp }}</td>
                            <td class="px-5 py-4 text-slate-300">{{ $trialRequest->country ?: 'N/A' }}</td>
                            <td class="px-5 py-4 text-slate-300">{{ $trialRequest->device ?: 'N/A' }}</td>
                            <td class="px-5 py-4 text-slate-300">{{ $trialRequest->plan }}</td>
                            <td class="px-5 py-4"><x-status-badge :status="$trialRequest->status" /></td>
                            <td class="px-5 py-4">
                                <div class="flex justify-end gap-2">
                                    <a class="btn-muted px-3 py-2" href="{{ route('trial-requests.show', $trialRequest) }}">View</a>
                                    <a class="btn-muted px-3 py-2" href="{{ route('trial-requests.edit', $trialRequest) }}">Edit</a>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr><td colspan="7" class="px-5 py-12 text-center text-slate-500">No trial requests found.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div class="border-t border-white/10 p-5">
            {{ $trialRequests->links() }}
        </div>
    </div>
@endsection
