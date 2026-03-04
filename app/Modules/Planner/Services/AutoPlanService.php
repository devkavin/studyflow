<?php

namespace App\Modules\Planner\Services;

use App\Models\AgendaItem;
use App\Models\Task;
use Carbon\Carbon;

class AutoPlanService
{
    public function generate(int $userId, array $days, int $minutesPerDay): void
    {
        AgendaItem::where('user_id', $userId)->whereBetween('date', [Carbon::today(), Carbon::today()->addDays(6)])->delete();

        $tasks = Task::with('topic.subject')->where('user_id', $userId)->where('status', '!=', 'done')
            ->orderByRaw('COALESCE(due_date, ?) asc', [Carbon::today()->addDays(365)->toDateString()])
            ->orderByDesc('priority')->get();

        $dateCursor = Carbon::today();
        foreach ($tasks as $task) {
            $planned = min($task->estimated_minutes, $minutesPerDay);
            AgendaItem::create([
                'user_id' => $userId,
                'subject_id' => $task->topic?->subject_id,
                'topic_id' => $task->topic_id,
                'task_id' => $task->id,
                'date' => $dateCursor->toDateString(),
                'title' => "Complete {$task->title}",
                'planned_minutes' => $planned,
            ]);
            $dateCursor->addDay();
            if ($dateCursor->gt(Carbon::today()->addDays(6))) $dateCursor = Carbon::today();
        }
    }
}
