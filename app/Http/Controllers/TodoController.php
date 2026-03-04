<?php
namespace App\Http\Controllers;
use App\Http\Requests\StoreTodoRequest;
use App\Models\TodoItem;
use Inertia\Inertia;
class TodoController extends Controller
{
    public function index()
    {
        return Inertia::render('Todos/Index', ['todos' => TodoItem::where('user_id', auth()->id())->orderBy('created_at','desc')->get()]);
    }
    public function store(StoreTodoRequest $request)
    {
        TodoItem::create($request->validated() + ['user_id' => auth()->id()]);
        return back();
    }
}
