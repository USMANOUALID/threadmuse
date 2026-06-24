@csrf
<div class="grid gap-5 md:grid-cols-2">
    <div>
        <label class="text-sm font-semibold text-slate-300" for="name">Name</label>
        <input class="input-dark mt-2" id="name" name="name" value="{{ old('name', $trialRequest->name) }}" required>
        @error('name') <p class="mt-2 text-sm text-rose-300">{{ $message }}</p> @enderror
    </div>
    <div>
        <label class="text-sm font-semibold text-slate-300" for="email">Email</label>
        <input class="input-dark mt-2" id="email" name="email" type="email" value="{{ old('email', $trialRequest->email) }}">
        @error('email') <p class="mt-2 text-sm text-rose-300">{{ $message }}</p> @enderror
    </div>
    <div>
        <label class="text-sm font-semibold text-slate-300" for="whatsapp">WhatsApp</label>
        <input class="input-dark mt-2" id="whatsapp" name="whatsapp" value="{{ old('whatsapp', $trialRequest->whatsapp) }}" required>
        @error('whatsapp') <p class="mt-2 text-sm text-rose-300">{{ $message }}</p> @enderror
    </div>
    <div>
        <label class="text-sm font-semibold text-slate-300" for="country">Country</label>
        <input class="input-dark mt-2" id="country" name="country" value="{{ old('country', $trialRequest->country) }}">
        @error('country') <p class="mt-2 text-sm text-rose-300">{{ $message }}</p> @enderror
    </div>
    <div>
        <label class="text-sm font-semibold text-slate-300" for="dial_code">Dial Code</label>
        <input class="input-dark mt-2" id="dial_code" name="dial_code" value="{{ old('dial_code', $trialRequest->dial_code) }}">
        @error('dial_code') <p class="mt-2 text-sm text-rose-300">{{ $message }}</p> @enderror
    </div>
    <div>
        <label class="text-sm font-semibold text-slate-300" for="device">Device</label>
        <input class="input-dark mt-2" id="device" name="device" value="{{ old('device', $trialRequest->device) }}">
        @error('device') <p class="mt-2 text-sm text-rose-300">{{ $message }}</p> @enderror
    </div>
    <div>
        <label class="text-sm font-semibold text-slate-300" for="plan">Plan</label>
        <input class="input-dark mt-2" id="plan" name="plan" value="{{ old('plan', $trialRequest->plan) }}" required>
        @error('plan') <p class="mt-2 text-sm text-rose-300">{{ $message }}</p> @enderror
    </div>
    <div>
        <label class="text-sm font-semibold text-slate-300" for="status">Status</label>
        <select class="input-dark mt-2" id="status" name="status" required>
            @foreach ($statuses as $status)
                <option value="{{ $status }}" @selected(old('status', $trialRequest->status) === $status)>{{ ucfirst($status) }}</option>
            @endforeach
        </select>
        @error('status') <p class="mt-2 text-sm text-rose-300">{{ $message }}</p> @enderror
    </div>
    <div>
        <label class="text-sm font-semibold text-slate-300" for="ip_address">IP Address</label>
        <input class="input-dark mt-2" id="ip_address" name="ip_address" value="{{ old('ip_address', $trialRequest->ip_address) }}">
        @error('ip_address') <p class="mt-2 text-sm text-rose-300">{{ $message }}</p> @enderror
    </div>
    <div class="md:col-span-2">
        <label class="text-sm font-semibold text-slate-300" for="message">Message</label>
        <textarea class="input-dark mt-2 min-h-32" id="message" name="message">{{ old('message', $trialRequest->message) }}</textarea>
        @error('message') <p class="mt-2 text-sm text-rose-300">{{ $message }}</p> @enderror
    </div>
</div>

<div class="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
    <a href="{{ route('trial-requests.index') }}" class="btn-muted">Cancel</a>
    <button class="btn-primary">Save Request</button>
</div>
