<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\WhatsappLog;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class WhatsappWebhookController extends Controller
{
    public function verify(Request $request): Response
    {
        $mode = $request->query('hub_mode') ?? $request->query('hub.mode');
        $token = $request->query('hub_verify_token') ?? $request->query('hub.verify_token');
        $challenge = $request->query('hub_challenge') ?? $request->query('hub.challenge');
        $verifyToken = Setting::getValue('whatsapp_verify_token');

        if ($mode === 'subscribe' && $verifyToken && hash_equals((string) $verifyToken, (string) $token)) {
            return response((string) $challenge, 200)->header('Content-Type', 'text/plain');
        }

        return response('Forbidden', 403)->header('Content-Type', 'text/plain');
    }

    public function handle(Request $request): Response
    {
        WhatsappLog::create([
            'recipient' => data_get($request->all(), 'entry.0.changes.0.value.metadata.display_phone_number'),
            'message' => 'WhatsApp webhook callback received.',
            'status' => data_get($request->all(), 'entry.0.changes.0.value.statuses.0.status', 'webhook_received'),
            'response' => $request->all(),
            'sent_at' => null,
        ]);

        return response('OK', 200)->header('Content-Type', 'text/plain');
    }
}
