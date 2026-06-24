<?php

use App\Http\Controllers\TelegramController;
use App\Http\Controllers\WhatsappWebhookController;
use Illuminate\Support\Facades\Route;

Route::post('/telegram/webhook', [TelegramController::class, 'webhook'])
    ->middleware('throttle:telegram-webhook')
    ->name('telegram.webhook');

Route::get('/whatsapp/webhook', [WhatsappWebhookController::class, 'verify'])
    ->middleware('throttle:public-api')
    ->name('whatsapp.webhook.verify');

Route::post('/whatsapp/webhook', [WhatsappWebhookController::class, 'handle'])
    ->middleware('throttle:public-api')
    ->name('whatsapp.webhook.handle');
