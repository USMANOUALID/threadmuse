<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Login - Trial Manager</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="min-h-screen bg-slate-950 text-slate-100">
    <div class="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
        <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,.24),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,.22),transparent_35%)]"></div>
        <div class="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
            <div class="text-center">
                <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-300 to-blue-600 text-2xl font-black text-slate-950 shadow-glow">TM</div>
                <h1 class="mt-6 text-3xl font-black tracking-tight">Trial Manager</h1>
                <p class="mt-2 text-sm text-slate-400">Secure admin access for your free trial pipeline.</p>
            </div>

            <form method="POST" action="{{ route('login.store') }}" class="mt-8 space-y-5">
                @csrf
                <div>
                    <label class="text-sm font-semibold text-slate-300" for="email">Email</label>
                    <input id="email" name="email" type="email" value="{{ old('email') }}" required autofocus class="input-dark mt-2">
                    @error('email') <p class="mt-2 text-sm text-rose-300">{{ $message }}</p> @enderror
                </div>
                <div>
                    <label class="text-sm font-semibold text-slate-300" for="password">Password</label>
                    <input id="password" name="password" type="password" required class="input-dark mt-2">
                    @error('password') <p class="mt-2 text-sm text-rose-300">{{ $message }}</p> @enderror
                </div>
                <label class="flex items-center gap-3 text-sm text-slate-400">
                    <input type="checkbox" name="remember" class="rounded border-white/10 bg-slate-950 text-cyan-400 focus:ring-cyan-400/30">
                    Remember this device
                </label>
                <button class="btn-primary w-full py-3">Login</button>
            </form>
        </div>
    </div>
</body>
</html>
