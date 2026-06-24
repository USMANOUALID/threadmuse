<?php

namespace App\Http\Controllers;

use App\Jobs\SendWhatsappMessage;
use App\Models\Notification;
use App\Models\Setting;
use App\Models\TrialRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class TrialRequestController extends Controller
{
    public function index(Request $request): View
    {
        $filters = $request->only(['search', 'status', 'country', 'plan']);

        return view('trial_requests.index', [
            'trialRequests' => TrialRequest::query()
                ->search($filters['search'] ?? null)
                ->filter($filters)
                ->latest()
                ->paginate(12)
                ->withQueryString(),
            'filters' => $filters,
            'plans' => TrialRequest::query()->whereNotNull('plan')->distinct()->orderBy('plan')->pluck('plan'),
            'statuses' => TrialRequest::STATUSES,
        ]);
    }

    public function create(): View
    {
        return view('trial_requests.create', [
            'trialRequest' => new TrialRequest(['status' => TrialRequest::STATUS_PENDING, 'plan' => 'Free Trial']),
            'statuses' => TrialRequest::STATUSES,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $trialRequest = TrialRequest::create($this->validatedData($request));

        Notification::create([
            'type' => 'trial_request.created',
            'channel' => 'admin',
            'title' => 'New trial request',
            'body' => "{$trialRequest->name} requested {$trialRequest->plan}.",
            'data' => ['trial_request_id' => $trialRequest->id],
        ]);

        return redirect()->route('trial-requests.show', $trialRequest)->with('success', 'Trial request created.');
    }

    public function show(TrialRequest $trialRequest): View
    {
        return view('trial_requests.show', [
            'trialRequest' => $trialRequest->load('whatsappLogs'),
        ]);
    }

    public function edit(TrialRequest $trialRequest): View
    {
        return view('trial_requests.edit', [
            'trialRequest' => $trialRequest,
            'statuses' => TrialRequest::STATUSES,
        ]);
    }

    public function update(Request $request, TrialRequest $trialRequest): RedirectResponse
    {
        $trialRequest->update($this->validatedData($request));

        return redirect()->route('trial-requests.show', $trialRequest)->with('success', 'Trial request updated.');
    }

    public function destroy(TrialRequest $trialRequest): RedirectResponse
    {
        $trialRequest->delete();

        return redirect()->route('trial-requests.index')->with('success', 'Trial request deleted.');
    }

    public function approve(TrialRequest $trialRequest): RedirectResponse
    {
        $trialRequest->update([
            'status' => TrialRequest::STATUS_APPROVED,
            'approved_at' => now(),
            'rejected_at' => null,
        ]);

        return back()->with('success', 'Trial request approved.');
    }

    public function reject(TrialRequest $trialRequest): RedirectResponse
    {
        $trialRequest->update([
            'status' => TrialRequest::STATUS_REJECTED,
            'rejected_at' => now(),
            'approved_at' => null,
        ]);

        return back()->with('success', 'Trial request rejected.');
    }

    public function markProcessed(TrialRequest $trialRequest): RedirectResponse
    {
        $trialRequest->update([
            'status' => TrialRequest::STATUS_PROCESSED,
            'processed_at' => now(),
        ]);

        return back()->with('success', 'Trial request marked as processed.');
    }

    public function sendWhatsappNotification(TrialRequest $trialRequest): RedirectResponse
    {
        $recipient = Setting::getValue('whatsapp_admin_number', $trialRequest->whatsapp);
        $message = $this->renderWhatsappTemplate($trialRequest);

        if (Setting::getValue('notifications_whatsapp_enabled', '1') !== '1') {
            return back()->withErrors(['whatsapp' => 'WhatsApp notifications are disabled in Integrations settings.']);
        }

        SendWhatsappMessage::dispatch($recipient, $message, $trialRequest->id, true);

        Notification::create([
            'type' => 'whatsapp.notification_queued',
            'channel' => 'whatsapp',
            'title' => 'WhatsApp notification queued',
            'body' => "Notification for {$recipient} was queued for Meta Graph API delivery.",
            'data' => ['trial_request_id' => $trialRequest->id],
        ]);

        return back()->with('success', 'WhatsApp notification queued for Meta Graph API delivery.');
    }

    private function validatedData(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'whatsapp' => ['required', 'string', 'max:40'],
            'country' => ['nullable', 'string', 'max:120'],
            'dial_code' => ['nullable', 'string', 'max:20'],
            'device' => ['nullable', 'string', 'max:120'],
            'plan' => ['required', 'string', 'max:120'],
            'message' => ['nullable', 'string'],
            'ip_address' => ['nullable', 'ip'],
            'status' => ['required', Rule::in(TrialRequest::STATUSES)],
        ]);
    }

    private function renderWhatsappTemplate(TrialRequest $trialRequest): string
    {
        $template = Setting::getValue('whatsapp_notification_template', $this->defaultTemplate());

        return strtr($template, [
            '{type}' => 'free_trial',
            '{name}' => $trialRequest->name,
            '{email}' => $trialRequest->email ?? 'N/A',
            '{whatsapp}' => $trialRequest->whatsapp,
            '{country}' => $trialRequest->country ?? 'N/A',
            '{dial_code}' => $trialRequest->dial_code ?? 'N/A',
            '{device}' => $trialRequest->device ?? 'N/A',
            '{plan}' => $trialRequest->plan,
            '{price}' => '$0',
            '{message}' => $trialRequest->message ?? '',
            '{ip}' => $trialRequest->ip_address ?? 'N/A',
            '{date}' => $trialRequest->created_at?->format('Y-m-d H:i:s') ?? now()->format('Y-m-d H:i:s'),
        ]);
    }

    private function defaultTemplate(): string
    {
        return "🔥 NEW IPTV FREE TRIAL REQUEST\n\n📌 Type: {type}\n👤 Name: {name}\n📧 Email: {email}\n📱 WhatsApp: {whatsapp}\n🌍 Country: {country}\n☎️ Dial Code: {dial_code}\n📦 Plan: {plan}\n💰 Price: {price}\n📝 Message: {message}\n🌐 IP: {ip}\n🕒 Date: {date}";
    }
}
