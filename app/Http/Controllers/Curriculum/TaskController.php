<?php
namespace App\Http\Controllers\Curriculum;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Models\Task;
class TaskController extends Controller
{
    public function store(StoreTaskRequest $request)
    {
        Task::create($request->validated() + ['user_id' => auth()->id()]);
        return back();
    }
}
