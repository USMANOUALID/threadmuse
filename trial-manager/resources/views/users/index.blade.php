@extends('layouts.app')

@section('title', 'Users')
@section('page-title', 'User Management')

@section('content')
    <div class="glass-panel overflow-hidden rounded-3xl">
        <div class="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h2 class="text-lg font-bold text-white">Users</h2>
                <p class="mt-1 text-sm text-slate-400">Manage admin, manager, and support users.</p>
            </div>
            <a href="{{ route('users.create') }}" class="btn-primary">Create User</a>
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-white/10 text-left text-sm">
                <thead class="bg-white/[0.02] text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                        <th class="px-5 py-4">Name</th>
                        <th class="px-5 py-4">Email</th>
                        <th class="px-5 py-4">Role</th>
                        <th class="px-5 py-4">Created</th>
                        <th class="px-5 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/10">
                    @forelse ($users as $user)
                        <tr class="hover:bg-white/[0.03]">
                            <td class="px-5 py-4 font-semibold text-white">{{ $user->name }}</td>
                            <td class="px-5 py-4 text-slate-300">{{ $user->email }}</td>
                            <td class="px-5 py-4"><span class="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-xs font-semibold uppercase text-cyan-200">{{ $user->role }}</span></td>
                            <td class="px-5 py-4 text-slate-400">{{ $user->created_at->format('Y-m-d H:i') }}</td>
                            <td class="px-5 py-4">
                                <div class="flex justify-end gap-2">
                                    <a class="btn-muted px-3 py-2" href="{{ route('users.edit', $user) }}">Edit</a>
                                    @if (! $user->is(auth()->user()))
                                        <form method="POST" action="{{ route('users.destroy', $user) }}" onsubmit="return confirm('Delete this user?')">
                                            @csrf @method('DELETE')
                                            <button class="btn-danger px-3 py-2">Delete</button>
                                        </form>
                                    @endif
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr><td colspan="5" class="px-5 py-12 text-center text-slate-500">No users found.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div class="border-t border-white/10 p-5">{{ $users->links() }}</div>
    </div>
@endsection
