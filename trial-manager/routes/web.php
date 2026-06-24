<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\IntegrationController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\TelegramController;
use App\Http\Controllers\TrialRequestController;
use App\Http\Controllers\WhatsappController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function (): void {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.store');
});

Route::middleware(['auth', 'admin'])->group(function (): void {
    Route::get('/', fn () => redirect()->route('dashboard'));
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    Route::resource('trial-requests', TrialRequestController::class);
    Route::post('/trial-requests/{trial_request}/approve', [TrialRequestController::class, 'approve'])->name('trial-requests.approve');
    Route::post('/trial-requests/{trial_request}/reject', [TrialRequestController::class, 'reject'])->name('trial-requests.reject');
    Route::post('/trial-requests/{trial_request}/processed', [TrialRequestController::class, 'markProcessed'])->name('trial-requests.processed');
    Route::post('/trial-requests/{trial_request}/whatsapp', [TrialRequestController::class, 'sendWhatsappNotification'])->name('trial-requests.whatsapp');

    Route::get('/settings/telegram', [SettingsController::class, 'telegram'])->name('settings.telegram');
    Route::post('/settings/telegram', [SettingsController::class, 'updateTelegram'])->name('settings.telegram.update');
    Route::get('/settings/whatsapp', [SettingsController::class, 'whatsapp'])->name('settings.whatsapp');
    Route::post('/settings/whatsapp', [SettingsController::class, 'updateWhatsapp'])->name('settings.whatsapp.update');
    Route::get('/settings/integrations', [IntegrationController::class, 'index'])->name('settings.integrations');
    Route::post('/settings/integrations', [IntegrationController::class, 'update'])->name('settings.integrations.update');
    Route::post('/settings/integrations/whatsapp/test', [IntegrationController::class, 'sendTestWhatsapp'])->name('settings.integrations.whatsapp.test');
    Route::post('/settings/integrations/telegram/webhook', [IntegrationController::class, 'setTelegramWebhook'])->name('settings.integrations.telegram.webhook');
    Route::post('/settings/integrations/telegram/test', [IntegrationController::class, 'testTelegram'])->name('settings.integrations.telegram.test');
    Route::post('/settings/integrations/trial-request/test', [IntegrationController::class, 'createTestTrialRequest'])->name('settings.integrations.trial-request.test');
    Route::post('/settings/integrations/logs/clear', [IntegrationController::class, 'clearLogs'])->name('settings.integrations.logs.clear');

    Route::get('/logs/telegram', [TelegramController::class, 'index'])->name('telegram.logs');
    Route::get('/logs/whatsapp', [WhatsappController::class, 'index'])->name('whatsapp.logs');

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});
