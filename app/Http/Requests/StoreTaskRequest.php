<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class StoreTaskRequest extends FormRequest { public function authorize(): bool { return true; } public function rules(): array { return ['topic_id'=>'required|exists:topics,id','title'=>'required|string|max:255','notes'=>'nullable|string','estimated_minutes'=>'required|integer|min:5','status'=>'required|in:todo,doing,done','due_date'=>'nullable|date','priority'=>'required|integer|min:1|max:5']; }}
