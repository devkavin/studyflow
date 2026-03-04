<?php
namespace App\Http\Controllers\Curriculum;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTopicRequest;
use App\Models\Topic;
class TopicController extends Controller
{
    public function store(StoreTopicRequest $request)
    {
        Topic::create($request->validated() + ['user_id' => auth()->id()]);
        return back();
    }
}
