@extends('layouts.app')

@section('title', 'Edit User')
@section('page-title', 'Edit User')

@section('content')
    <div class="mx-auto max-w-4xl glass-panel rounded-3xl p-6">
        <form method="POST" action="{{ route('users.update', $user) }}">
            @method('PUT')
            @include('users._form')
        </form>
    </div>
@endsection
