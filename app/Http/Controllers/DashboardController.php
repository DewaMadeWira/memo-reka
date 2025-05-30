<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\MemoLetter;
use App\Models\InvitationLetter;
use App\Models\RequestLetter;
use App\Models\SummaryLetter;

class DashboardController extends Controller
{
    public function index()
    {
        // Get the currently authenticated user
        $user = Auth::user();

        // Get the user's division
        $userDivision = $user->division;
        $userDivisionId = $user->division_id;

        // Count the total of rows in each table filtered by user's division
        $memoCount = MemoLetter::where('from_division', $userDivisionId)
            ->orWhere('to_division', $userDivisionId)
            ->count();

        // Count rejected requests (with stages_id = 14) for user's division
        $rejectedMemoCount = RequestLetter::whereHas('memo', function ($query) use ($userDivisionId) {
            $query->where('from_division', $userDivisionId)
                ->orWhere('to_division', $userDivisionId);
        })
            ->where('stages_id', 14)
            ->where('letter_type_id', 1)
            ->count();




        $invitationCount = InvitationLetter::where('from_division', $userDivisionId)
            ->orWhere('to_division', $userDivisionId)
            ->count();

        // For summaries, we need to get the related invitation letter's division
        $summaryCount = SummaryLetter::whereHas('invite', function ($query) use ($userDivisionId) {
            $query->where('from_division', $userDivisionId)
                ->orWhere('to_division', $userDivisionId);
        })->count();

        // Get data for chart filtered by user's division
        // Get memos grouped by date
        $memosByDate = MemoLetter::where('from_division', $userDivisionId)
            ->orWhere('to_division', $userDivisionId)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->pluck('count', 'date')
            ->toArray();
        // dd($memosByDate);

        // Get invitations grouped by date
        $invitationsByDate = InvitationLetter::where('from_division', $userDivisionId)
            ->orWhere('to_division', $userDivisionId)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->pluck('count', 'date')
            ->toArray();

        // Get summaries grouped by date, filtered by related invitation
        $summariesByDate = SummaryLetter::whereHas('invite', function ($query) use ($userDivisionId) {
            $query->where('from_division', $userDivisionId)
                ->orWhere('to_division', $userDivisionId);
        })
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->pluck('count', 'date')
            ->toArray();

        // Merge dates from all queries
        $allDates = array_unique(array_merge(
            array_keys($memosByDate),
            array_keys($invitationsByDate),
            array_keys($summariesByDate)
        ));
        sort($allDates);


        // Build chart data in the required format
        $chartData = [];
        foreach ($allDates as $date) {
            $chartData[] = [
                'date' => $date,
                'memo' => $memosByDate[$date] ?? 0,
                'invitation' => $invitationsByDate[$date] ?? 0,
                'summary' => $summariesByDate[$date] ?? 0,
            ];
        }

        // dd($rejectedMemoCount);

        return inertia('Dashboard', [
            'userDivision' => $userDivision,
            'memoCount' => $memoCount,
            'rejectedMemoCount' => $rejectedMemoCount,
            'invitationCount' => $invitationCount,
            'summaryCount' => $summaryCount,
            'chartData' => $chartData,
        ]);
    }
}
