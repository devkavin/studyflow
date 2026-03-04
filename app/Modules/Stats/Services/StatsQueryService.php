<?php

namespace App\Modules\Stats\Services;

use App\Models\FocusSession;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class StatsQueryService
{
    public function summary(int $userId): array
    {
        return Cache::remember("stats:$userId:summary", 300, function () use ($userId) {
            $today = Carbon::today();
            $sessions = FocusSession::where('user_id', $userId)->whereNotNull('end_time');

            return [
                'today_minutes' => (int) $sessions->clone()->whereDate('start_time', $today)->sum(DB::raw('duration_seconds / 60')),
                'week_minutes' => (int) $sessions->clone()->where('start_time', '>=', $today->copy()->startOfWeek())->sum(DB::raw('duration_seconds / 60')),
                'month_minutes' => (int) $sessions->clone()->where('start_time', '>=', $today->copy()->startOfMonth())->sum(DB::raw('duration_seconds / 60')),
                'completion_rate' => (float) Task::where('user_id', $userId)->selectRaw('COALESCE(100.0 * SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) / NULLIF(COUNT(*),0),0) rate', ['done'])->value('rate'),
                'minutes_by_day' => FocusSession::where('user_id', $userId)->where('start_time', '>=', $today->copy()->subDays(29))
                    ->selectRaw('DATE(start_time) as day, SUM(duration_seconds)/60 as minutes')->groupBy('day')->orderBy('day')->get(),
            ];
        });
    }
}
