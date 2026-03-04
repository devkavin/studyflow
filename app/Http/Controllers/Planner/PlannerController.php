<?php
namespace App\Http\Controllers\Planner;
use App\Http\Controllers\Controller;
use App\Http\Requests\AutoPlanRequest;
use App\Models\AgendaItem;
use App\Modules\Planner\Services\AutoPlanService;
use Inertia\Inertia;
class PlannerController extends Controller
{
    public function index()
    {
        return Inertia::render('Planner/Index', ['items' => AgendaItem::where('user_id', auth()->id())->orderBy('date')->get()]);
    }
    public function autoPlan(AutoPlanRequest $request, AutoPlanService $service)
    {
        $service->generate(auth()->id(), $request->validated('days'), (int) $request->validated('minutes_per_day'));
        return back();
    }
}
