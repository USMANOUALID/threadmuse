@csrf
<div class="grid gap-5 md:grid-cols-2">
    <div>
        <label class="text-sm font-semibold text-slate-300" for="name">Name</label>
        <input class="input-dark mt-2" id="name" name="name" value="{{ old('name', $user->name) }}" required>
        @error('name') <p class="mt-2 text-sm text-rose-300">{{ $message }}</p> @enderror
    </div>

    <div>
        <label class="text-sm font-semibold text-slate-300" for="email">Email</label>
        <input class="input-dark mt-2" id="email" type="email" name="email" value="{{ old('email', $user->email) }}" required>
        @error('email') <p class="mt-2 text-sm text-rose-300">{{ $message }}</p> @enderror
    </div>

    <div>
        <label class="text-sm font-semibold text-slate-300" for="password">Password</label>
        <input class="input-dark mt-2" id="password" type="password" name="password" @if (! $user->exists) required @endif>
        <p class="mt-2 text-xs text-slate-500">{{ $user->exists ? 'Leave blank to keep the current password.' : 'Minimum 8 characters.' }}</p>
        @error('password') <p class="mt-2 text-sm text-rose-300">{{ $message }}</p> @enderror
    </div>

    <div>
        <label class="text-sm font-semibold text-slate-300" for="role">Role</label>
        <select class="input-dark mt-2" id="role" name="role" required>
            @foreach ($roles as $role)
                <option value="{{ $role }}" @selected(old('role', $user->role) === $role)>{{ ucfirst($role) }}</option>
            @endforeach
        </select>
        @error('role') <p class="mt-2 text-sm text-rose-300">{{ $message }}</p> @enderror
    </div>
</div>

<div class="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
    <a href="{{ route('users.index') }}" class="btn-muted">Cancel</a>
    <button class="btn-primary">Save User</button>
</div>
