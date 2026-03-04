<?php

namespace App\Http\Controllers\Curriculum;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSubjectRequest;
use App\Models\Subject;
use Inertia\Inertia;

class SubjectController extends Controller
{
    public function index()
    {
        return Inertia::render('Curriculum/Index', [
            'subjects' => Subject::with('topics.tasks')->where('user_id', auth()->id())->get(),
        ]);
    }

    public function store(StoreSubjectRequest $request)
    {
        Subject::create($request->validated() + ['user_id' => auth()->id()]);
        return back();
    }
}
