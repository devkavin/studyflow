<?php

namespace App\Http\Controllers;

use App\Models\AgendaItem;
use App\Models\FocusSession;
use App\Models\Task;
use App\Models\TodoItem;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = auth()->id();
        $today = now()->startOfDay();
        $weekStart = now()->startOfWeek();

        $agendaToday = AgendaItem::where('user_id', $userId)->whereDate('date', $today)->get();
        $focusTodaySeconds = (int) FocusSession::where('user_id', $userId)->whereDate('start_time', $today)->sum('duration_seconds');
        $focusWeekSeconds = (int) FocusSession::where('user_id', $userId)->whereBetween('start_time', [$weekStart, now()])->sum('duration_seconds');

        $focusDaily = FocusSession::query()
            ->where('user_id', $userId)
            ->whereBetween('start_time', [now()->subDays(6)->startOfDay(), now()->endOfDay()])
            ->selectRaw('DATE(start_time) as day, SUM(duration_seconds) as duration_seconds')
            ->groupBy('day')
            ->pluck('duration_seconds', 'day');

        $focusTrend = collect(range(0, 6))->map(function (int $daysAgo) use ($focusDaily) {
            $date = now()->subDays(6 - $daysAgo)->toDateString();

            return [
                'date' => $date,
                'minutes' => (int) round(((int) ($focusDaily[$date] ?? 0)) / 60),
            ];
        });

        $upcomingTodos = TodoItem::query()
            ->where('user_id', $userId)
            ->where('status', '!=', 'done')
            ->whereNotNull('due_date')
            ->whereDate('due_date', '>=', $today)
            ->orderBy('due_date')
            ->limit(4)
            ->get(['id', 'title', 'status', 'due_date'])
            ->map(fn (TodoItem $todo) => [
                'id' => $todo->id,
                'title' => $todo->title,
                'status' => $todo->status,
                'due_date' => $todo->due_date,
                'type' => 'Todo',
            ]);

        $upcomingTasks = Task::query()
            ->with('topic:id,name')
            ->where('user_id', $userId)
            ->where('status', '!=', 'done')
            ->whereNotNull('due_date')
            ->whereDate('due_date', '>=', $today)
            ->orderBy('due_date')
            ->limit(4)
            ->get(['id', 'title', 'status', 'due_date', 'topic_id'])
            ->map(fn (Task $task) => [
                'id' => $task->id,
                'title' => $task->title,
                'status' => $task->status,
                'due_date' => $task->due_date,
                'context' => $task->topic?->name,
                'type' => 'Curriculum',
            ]);

        $upcoming = $upcomingTodos
            ->concat($upcomingTasks)
            ->sortBy('due_date')
            ->take(6)
            ->values();

        return Inertia::render('Dashboard', [
            'dashboard' => [
                'today_focus_minutes' => (int) round($focusTodaySeconds / 60),
                'week_focus_minutes' => (int) round($focusWeekSeconds / 60),
                'today_planned_minutes' => (int) $agendaToday->sum('planned_minutes'),
                'today_completed_items' => (int) $agendaToday->where('is_done', true)->count(),
                'today_total_items' => (int) $agendaToday->count(),
                'focus_trend' => $focusTrend,
                'upcoming_items' => $upcoming,
            ],
        ]);
    }
}
