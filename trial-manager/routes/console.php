<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('trial-manager:summary', function (): void {
    $this->info('Trial Manager is ready.');
})->purpose('Show Trial Manager status.');
