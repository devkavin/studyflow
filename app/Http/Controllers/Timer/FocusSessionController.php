<?php
namespace App\Http\Controllers\Timer;
use App\Http\Controllers\Controller;
use App\Http\Requests\StartFocusSessionRequest;
use App\Http\Requests\StopFocusSessionRequest;
use App\Models\FocusSession;
use Carbon\Carbon;
use Inertia\Inertia;
class FocusSessionController extends Controller
{
    public function index()
    {
        return Inertia::render('Timer/Index', ['activeSession' => FocusSession::where('user_id', auth()->id())->where('is_active', true)->latest()->first()]);
    }
    public function start(StartFocusSessionRequest $request)
    {
        FocusSession::where('user_id', auth()->id())->where('is_active', true)->update(['is_active' => false]);
        $session = FocusSession::create($request->validated() + ['user_id' => auth()->id(), 'start_time' => now(), 'is_active' => true]);
        return response()->json($session);
    }
    public function stop(StopFocusSessionRequest $request)
    {
        $session = FocusSession::where('user_id', auth()->id())->whereKey($request->integer('session_id'))->firstOrFail();
        $end = Carbon::now();
        $duration = $end->diffInSeconds(Carbon::parse($session->start_time)) - $session->total_paused_seconds;
        $session->update(['end_time' => $end, 'duration_seconds' => max(0, $duration), 'is_active' => false]);
        return response()->json($session);
    }
}
