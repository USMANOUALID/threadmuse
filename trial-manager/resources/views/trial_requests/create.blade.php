@extends('layouts.app')

@section('title', 'Create Trial Request')
@section('page-title', 'Create Trial Request')

@section('content')
    <div class="mx-auto max-w-5xl glass-panel rounded-3xl p-6">
        <form method="POST" action="{{ route('trial-requests.store') }}">
            @include('trial_requests._form')
        </form>
    </div>
@endsection
