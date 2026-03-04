<?php
namespace App\Http\Controllers\Curriculum;
use App\Http\Controllers\Controller;
use App\Http\Requests\QuickImportRequest;
use App\Models\AuditLog;
use App\Models\Subject;
use App\Models\Topic;
use App\Modules\Curriculum\Services\CurriculumImportService;
use Illuminate\Support\Facades\DB;
class QuickImportController extends Controller
{
    public function __invoke(QuickImportRequest $request, CurriculumImportService $service)
    {
        DB::transaction(function () use ($request, $service): void {
            foreach ($service->parse($request->string('input')) as $entry) {
                $subject = Subject::firstOrCreate(['user_id' => auth()->id(), 'name' => $entry['name']], ['color' => '#6366f1', 'priority' => 3]);
                foreach ($entry['topics'] as $topicName) {
                    Topic::firstOrCreate(['user_id' => auth()->id(), 'subject_id' => $subject->id, 'name' => $topicName], ['target_minutes' => 120]);
                }
            }
            AuditLog::create(['user_id' => auth()->id(), 'action' => 'curriculum.import', 'entity_type' => 'subject']);
        });
        return back();
    }
}
