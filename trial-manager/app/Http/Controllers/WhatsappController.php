<?php

namespace App\Http\Controllers;

use App\Models\WhatsappLog;
use Illuminate\View\View;

class WhatsappController extends Controller
{
    public function index(): View
    {
        return view('logs.whatsapp', [
            'logs' => WhatsappLog::with('trialRequest')->latest()->paginate(15),
        ]);
    }
}
