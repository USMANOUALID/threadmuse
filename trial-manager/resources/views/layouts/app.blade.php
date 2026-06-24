<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Trial Manager') - Trial Manager</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <div class="fixed inset-0 -z-10 overflow-hidden bg-slate-950">
        <div class="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl"></div>
        <div class="absolute right-[-10%] top-1/4 h-[32rem] w-[32rem] rounded-full bg-indigo-500/10 blur-3xl"></div>
        <div class="absolute bottom-[-20%] left-1/3 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/10 blur-3xl"></div>
    </div>

    <div x-data="{ sidebarOpen: false }" class="min-h-screen lg:flex">
        <aside :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'" class="fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-slate-950/95 p-5 backdrop-blur-xl transition lg:static lg:z-auto">
            <div class="flex items-center justify-between">
                <a href="{{ route('dashboard') }}" class="flex items-center gap-3">
                    <span class="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 font-black text-slate-950 shadow-glow">TM</span>
                    <span>
                        <span class="block text-lg font-bold tracking-tight">Trial Manager</span>
                        <span class="text-xs uppercase tracking-[0.3em] text-cyan-300">Admin OS</span>
                    </span>
                </a>
                <button type="button" class="lg:hidden" @click="sidebarOpen = false">✕</button>
            </div>

            @php
                $nav = [
                    ['label' => 'Dashboard', 'route' => 'dashboard', 'match' => 'dashboard', 'icon' => '▦'],
                    ['label' => 'Trial Requests', 'route' => 'trial-requests.index', 'match' => 'trial-requests.*', 'icon' => '◉'],
                    ['label' => 'Telegram Settings', 'route' => 'settings.telegram', 'match' => 'settings.telegram', 'icon' => '✦'],
                    ['label' => 'Telegram Logs', 'route' => 'telegram.logs', 'match' => 'telegram.logs', 'icon' => '☰'],
                    ['label' => 'WhatsApp Settings', 'route' => 'settings.whatsapp', 'match' => 'settings.whatsapp', 'icon' => '◆'],
                    ['label' => 'WhatsApp Logs', 'route' => 'whatsapp.logs', 'match' => 'whatsapp.logs', 'icon' => '≋'],
                ];
            @endphp

            <nav class="mt-8 space-y-2">
                @foreach ($nav as $item)
                    <a href="{{ route($item['route']) }}" class="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition {{ request()->routeIs($item['match']) ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20' : 'text-slate-300 hover:bg-white/10 hover:text-white' }}">
                        <span class="text-base">{{ $item['icon'] }}</span>
                        {{ $item['label'] }}
                    </a>
                @endforeach
            </nav>

            <div class="mt-auto rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <p class="text-sm font-semibold">{{ auth()->user()->name }}</p>
                <p class="mt-1 text-xs text-slate-400">{{ auth()->user()->email }}</p>
                <form method="POST" action="{{ route('logout') }}" class="mt-4">
                    @csrf
                    <button class="w-full rounded-2xl border border-white/10 px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10">Logout</button>
                </form>
            </div>
        </aside>

        <div class="flex min-h-screen flex-1 flex-col">
            <header class="sticky top-0 z-30 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
                <div class="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <div class="flex items-center gap-3">
                        <button type="button" class="rounded-2xl border border-white/10 p-2 lg:hidden" @click="sidebarOpen = true">☰</button>
                        <div>
                            <p class="text-xs uppercase tracking-[0.3em] text-cyan-300">Free Trial Control Center</p>
                            <h1 class="mt-1 text-xl font-bold text-white sm:text-2xl">@yield('page-title', 'Dashboard')</h1>
                        </div>
                    </div>
                    <a href="{{ route('trial-requests.create') }}" class="hidden sm:inline-flex btn-primary">New Request</a>
                </div>
            </header>

            <main class="flex-1 px-4 py-6 sm:px-6 lg:px-8">
                @if (session('success'))
                    <div class="mb-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm font-medium text-emerald-100">
                        {{ session('success') }}
                    </div>
                @endif

                @if ($errors->any())
                    <div class="mb-6 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                        <p class="font-semibold">Please fix the highlighted fields.</p>
                    </div>
                @endif

                @yield('content')
            </main>
        </div>
    </div>
</body>
</html>
