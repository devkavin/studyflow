<?php
namespace App\Http\Controllers;

use App\Http\Requests\StoreTodoRequest;
use App\Models\Subject;
use App\Models\TodoItem;
use Inertia\Inertia;

class TodoController extends Controller
{
    public function index()
    {
        return Inertia::render('Todos/Index', [
            'todos' => TodoItem::where('user_id', auth()->id())
                ->orderBy('created_at', 'desc')
                ->get(),
            'subjects' => Subject::with('topics:id,subject_id,name')
                ->where('user_id', auth()->id())
                ->get(['id', 'name']),
        ]);
    }

    public function store(StoreTodoRequest $request)
    {
        TodoItem::create($request->validated() + ['user_id' => auth()->id()]);
        return back();
    }
}
