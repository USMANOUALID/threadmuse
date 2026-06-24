@extends('layouts.app')

@section('title', 'Create User')
@section('page-title', 'Create User')

@section('content')
    <div class="mx-auto max-w-4xl glass-panel rounded-3xl p-6">
        <form method="POST" action="{{ route('users.store') }}">
            @include('users._form')
        </form>
    </div>
@endsection
