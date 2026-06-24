<?php

namespace App\Http\Controllers;

use App\Models\TrialRequest;
use Carbon\Carbon;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function __invoke(): View
    {
        $stats = [
            'total' => TrialRequest::count(),
            'pending' => TrialRequest::where('status', TrialRequest::STATUS_PENDING)->count(),
            'approved' => TrialRequest::where('status', TrialRequest::STATUS_APPROVED)->count(),
            'rejected' => TrialRequest::where('status', TrialRequest::STATUS_REJECTED)->count(),
            'today' => TrialRequest::whereDate('created_at', Carbon::today())->count(),
        ];

        return view('dashboard', [
            'stats' => $stats,
            'recentRequests' => TrialRequest::latest()->limit(8)->get(),
            'requestTrend' => TrialRequest::selectRaw('DATE(created_at) as date, COUNT(*) as total')
                ->where('created_at', '>=', now()->subDays(6)->startOfDay())
                ->groupBy('date')
                ->orderBy('date')
                ->get(),
        ]);
    }
}
