<?php

namespace App\Http\Controllers\Curriculum;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskStatusRequest;
use App\Models\Task;

class TaskController extends Controller
{
    public function store(StoreTaskRequest $request)
    {
        Task::create($request->validated() + ['user_id' => auth()->id()]);

        return back();
    }

    public function updateStatus(UpdateTaskStatusRequest $request, Task $task)
    {
        abort_unless($task->user_id === auth()->id(), 403);

        $task->update($request->validated());

        return back();
    }
}
