<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class StartFocusSessionRequest extends FormRequest { public function authorize(): bool { return true; } public function rules(): array { return ['mode'=>'required|in:pomodoro,custom','subject_id'=>'nullable|exists:subjects,id','topic_id'=>'nullable|exists:topics,id','task_id'=>'nullable|exists:tasks,id','notes'=>'nullable|string']; }}
