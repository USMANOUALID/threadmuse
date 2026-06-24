<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\Setting;
use App\Models\TelegramLog;
use App\Models\TrialRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\View\View;
use Throwable;

class TelegramController extends Controller
{
    public function index(): View
    {
        return view('logs.telegram', [
            'logs' => TelegramLog::latest()->paginate(15),
        ]);
    }

    public function webhook(Request $request): JsonResponse
    {
        $secret = Setting::getValue('telegram_webhook_secret');
        $providedSecret = (string) $request->header('X-Telegram-Bot-Api-Secret-Token', '');

        if (! $secret || ! hash_equals((string) $secret, $providedSecret)) {
            TelegramLog::create([
                'direction' => 'incoming',
                'update_id' => Arr::get($request->all(), 'update_id'),
                'payload' => ['ip' => $request->ip(), 'reason' => 'invalid webhook secret'],
                'message' => 'Unauthorized Telegram webhook request',
                'status' => 'unauthorized',
                'error' => 'Invalid or missing X-Telegram-Bot-Api-Secret-Token header.',
            ]);

            return response()->json(['ok' => false, 'error' => 'Unauthorized.'], 403);
        }

        $payload = $request->all();
        $log = TelegramLog::create([
            'direction' => 'incoming',
            'update_id' => Arr::get($payload, 'update_id'),
            'payload' => $payload,
            'message' => Arr::get($payload, 'message.text') ?? Arr::get($payload, 'channel_post.text'),
            'status' => 'received',
        ]);

        try {
            $data = $this->extractTrialRequestData($request);

            if (! $data) {
                $log->update(['status' => 'ignored', 'error' => 'No trial request fields were found.']);

                return response()->json(['ok' => true, 'status' => 'ignored']);
            }

            $trialRequest = TrialRequest::create($data + [
                'status' => TrialRequest::STATUS_PENDING,
                'ip_address' => $data['ip_address'] ?? $request->ip(),
            ]);

            Notification::create([
                'type' => 'trial_request.created_from_telegram',
                'channel' => 'telegram',
                'title' => 'Telegram trial request received',
                'body' => "{$trialRequest->name} submitted a free trial request.",
                'data' => ['trial_request_id' => $trialRequest->id, 'telegram_log_id' => $log->id],
            ]);

            $log->update(['status' => 'created']);

            return response()->json(['ok' => true, 'trial_request_id' => $trialRequest->id]);
        } catch (Throwable $exception) {
            $log->update(['status' => 'failed', 'error' => $exception->getMessage()]);

            return response()->json(['ok' => false, 'error' => 'Unable to process webhook.'], 422);
        }
    }

    private function extractTrialRequestData(Request $request): ?array
    {
        $direct = $request->input('trial_request', $request->all());
        $hasDirectFields = collect(['name', 'email', 'whatsapp'])->contains(fn (string $field) => filled($direct[$field] ?? null));

        if ($hasDirectFields) {
            return $this->normalizeTrialRequestData($direct, $request->ip());
        }

        $text = $request->input('message.text') ?? $request->input('channel_post.text');

        if (! $text) {
            return null;
        }

        return $this->normalizeTrialRequestData([
            'name' => $this->lineValue($text, ['Name', '👤 Name']),
            'email' => $this->cleanEmail($this->lineValue($text, ['Email', '📧 Email'])),
            'whatsapp' => $this->lineValue($text, ['WhatsApp', '📱 WhatsApp']),
            'country' => $this->lineValue($text, ['Country', '🌍 Country']),
            'dial_code' => $this->lineValue($text, ['Dial Code', '☎️ Dial Code']),
            'device' => $this->lineValue($text, ['Device', '📱 Device']),
            'plan' => $this->lineValue($text, ['Plan', '📦 Plan']) ?: 'Free Trial',
            'message' => $this->lineValue($text, ['Message', '📝 Message']),
            'ip_address' => $this->lineValue($text, ['IP', '🌐 IP']) ?: $request->ip(),
        ], $request->ip());
    }

    private function normalizeTrialRequestData(array $data, ?string $fallbackIp): ?array
    {
        $normalized = [
            'name' => trim((string) ($data['name'] ?? '')),
            'email' => $this->cleanEmail($data['email'] ?? null),
            'whatsapp' => trim((string) ($data['whatsapp'] ?? $data['phone'] ?? '')),
            'country' => filled($data['country'] ?? null) ? trim((string) $data['country']) : null,
            'dial_code' => filled($data['dial_code'] ?? null) ? trim((string) $data['dial_code']) : null,
            'device' => filled($data['device'] ?? null) ? trim((string) $data['device']) : null,
            'plan' => filled($data['plan'] ?? null) ? trim((string) $data['plan']) : 'Free Trial',
            'message' => filled($data['message'] ?? null) ? trim((string) $data['message']) : null,
            'ip_address' => filled($data['ip_address'] ?? null) ? trim((string) $data['ip_address']) : $fallbackIp,
        ];

        if (! $normalized['name'] || ! $normalized['whatsapp']) {
            return null;
        }

        return $normalized;
    }

    private function lineValue(string $text, array $labels): ?string
    {
        foreach ($labels as $label) {
            $quoted = preg_quote($label, '/');
            if (preg_match('/'.$quoted.'\s*:\s*(.+)/iu', $text, $matches)) {
                return trim($matches[1]);
            }
        }

        return null;
    }

    private function cleanEmail(?string $email): ?string
    {
        if (! $email) {
            return null;
        }

        $email = trim($email);
        $email = preg_replace('/^\[(.+)\]\(mailto:.+\)$/i', '$1', $email) ?: $email;

        return filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : null;
    }
}
