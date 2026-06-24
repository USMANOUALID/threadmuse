@props(['status' => 'pending'])
@php
    $tones = [
        'pending' => 'border-amber-400/30 bg-amber-400/10 text-amber-200',
        'approved' => 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
        'rejected' => 'border-rose-400/30 bg-rose-400/10 text-rose-200',
        'processed' => 'border-sky-400/30 bg-sky-400/10 text-sky-200',
    ];
@endphp
<span {{ $attributes->merge(['class' => 'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide '.($tones[$status] ?? $tones['pending'])]) }}>
    {{ $status }}
</span>
