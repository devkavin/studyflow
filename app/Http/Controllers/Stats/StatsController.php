<?php
namespace App\Http\Controllers\Stats;
use App\Http\Controllers\Controller;
use App\Modules\Stats\Services\StatsQueryService;
use Inertia\Inertia;
class StatsController extends Controller
{
    public function index(StatsQueryService $stats)
    {
        return Inertia::render('Stats/Index', ['stats' => $stats->summary(auth()->id())]);
    }
}
